#!/usr/bin/env node
/*
 * Phase 0 acceptance gate + standing rule (CLAUDE.md §5.2, §6).
 *
 * Fails the build if any physical CSS direction property appears in source.
 * RTL correctness must use logical properties only — margin-inline-start, not
 * margin-left; Tailwind ms-/me-/ps-/pe-/start-/end-, never left/right.
 *
 * Scans src/ for .css/.ts/.tsx. Reports every hit with file:line, exits 1 if
 * any are found. This gets exponentially harder to fix later, so it runs now.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["src"];
const EXTS = new Set([".css", ".ts", ".tsx", ".js", ".jsx"]);

// Physical properties that break RTL. Each has a logical replacement.
const PATTERNS = [
  { re: /margin-left\s*:/g, hint: "margin-inline-start" },
  { re: /margin-right\s*:/g, hint: "margin-inline-end" },
  { re: /padding-left\s*:/g, hint: "padding-inline-start" },
  { re: /padding-right\s*:/g, hint: "padding-inline-end" },
  { re: /border-left\s*:/g, hint: "border-inline-start" },
  { re: /border-right\s*:/g, hint: "border-inline-end" },
  { re: /text-align\s*:\s*(left|right)\b/g, hint: "text-align: start | end" },
  // Bare left:/right: as CSS declarations (allow inset-inline-*). Avoid
  // matching words like "right" in prose by requiring a value after the colon.
  { re: /(?<![-\w])left\s*:\s*[^;]/g, hint: "inset-inline-start" },
  { re: /(?<![-\w])right\s*:\s*[^;]/g, hint: "inset-inline-end" },
  // Tailwind physical utilities (as class tokens): ml-/mr-/pl-/pr-/left-/right-
  {
    re: /(?<![-\w:])(ml|mr|pl|pr)-(?=[\d[])/g,
    hint: "ms-/me-/ps-/pe-",
  },
  {
    re: /(?<![-\w:])(left|right)-(?=[\d[])/g,
    hint: "start-/end-",
  },
];

/** Allow an opt-out on lines that legitimately need a physical value. */
const ALLOW = /logical-ok/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const hits = [];
for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d);
  let files;
  try {
    files = walk(abs);
  } catch {
    continue;
  }
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (ALLOW.test(line)) return;
      for (const { re, hint } of PATTERNS) {
        re.lastIndex = 0;
        if (re.test(line)) {
          hits.push({
            file: relative(ROOT, file),
            line: i + 1,
            text: line.trim().slice(0, 100),
            hint,
          });
          break;
        }
      }
    });
  }
}

if (hits.length > 0) {
  console.error(
    `\n✗ Physical CSS direction properties found (${hits.length}). Use logical properties (CLAUDE.md §5.2):\n`,
  );
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  → use ${h.hint}`);
    console.error(`      ${h.text}`);
  }
  console.error(
    "\n  If a hit is a genuine false positive, append a `logical-ok` comment to that line.\n",
  );
  process.exit(1);
}

console.log("✓ logical-properties: no physical direction properties in src/");
