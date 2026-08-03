# Phase 0.5 — token extraction & diff against CLAUDE.md §3

**Status: RESOLVED — Ur adopted the warm system (30.7.26).** The token layer (`globals.css`), constitution (`CLAUDE.md` §3.1) and `DECISIONS.md` §3 are updated. Content fixes in §D still apply during screen rebuilds.

Source of mockup values: `design-reference/samples-source/app/globals.css` + rendered review of all four screens (style guide, home, artwork, corporate) at 1280px.

## Summary

The mockup's **core commerce palette, typography, shadow, radii and content width are aligned with §3** — most colour tokens are the *identical* hex. There is exactly **one material divergence**: the mockup introduces a **warm-neutral surface layer** (warm-grey page background + sand panels + a warm near-black) where §3 specifies a single cool `#FAFAFA` gallery background. That is the "Material Warmth" half of the stated direction, and it needs Ur's call because §3 is locked and wins unless explicitly overridden (CLAUDE.md §3.5 rule 2, §6).

---

## A. The one decision — warm neutrals vs. cool #FAFAFA ⬅️ needs Ur

| Surface | §3 (locked) | Mockup actual | 
|---|---|---|
| Page background | `#FAFAFA` (cool near-white) | **`#eceae6`** (warm light grey) |
| Panels / image beds | `#FFFFFF` surface | **`#efe6dc`** (`--sand`, warm cream) |
| Warm mid neutral | — | **`#d7d2cb`** (`--stone`) — borders, pills |
| Warm near-black surface | — (text is `#111827`) | **`#2a211e`** (`--deep`) — corporate hero, top bar |

The mockup *defines* `--gallery: #fafafa` but never uses it — `body` is `#eceae6`. So the warmth is a deliberate choice, not an accident.

This is the design's signature: the home hero, the artwork image bed, and especially the corporate hero (full-bleed `--deep` with white serif type) all depend on it. Flattening to `#FAFAFA` would remove the "Material Warmth" and leave only the "White Cube".

**Options put to Ur** — see the question accompanying this doc.

---

## B. Aligned — no action needed

| Token | §3 | Mockup | Match |
|---|---|---|---|
| text / ink | `#111827` | `#111827` | ✅ |
| text-muted | `#4B5563` | `#4b5563` | ✅ |
| border / line | `#E5E7EB` | `#e5e7eb` | ✅ |
| accent (clay) | `#C17F59` | `#c17f59` | ✅ |
| accent-strong (action) | `#8A5335` | `#8a5335` | ✅ |
| surface | `#FFFFFF` | `#ffffff` | ✅ |
| shadow | soft two-layer | identical | ✅ |
| content width | 1280px | 1280px | ✅ |
| body font | Assistant | Assistant (next/font/google) | ✅ |
| display font | Frank Ruhl Libre | Frank Ruhl Libre | ✅ |
| radii scale | 0–4 / 8 / 10–12 / full | 0,2,3,4,5,8,10,12,999 | ✅ aligned |

## C. Minor divergences — my recommendation, no decision needed

1. **Hero display size runs larger than §3's cap.** §3 sets display max 56px; the mockup's hero climbs to ~58–63px. → I'd add a `display-hero` step (~clamp to 60px) rather than change the base `display` token. Keeps §3 intact.
2. **`--color-accent-hover`, `--color-success`, `--color-error` aren't in the mockup.** They're in §3 and needed for states. → Keep §3's values.
3. **`--color-btn-primary` (`#111827`).** Mockup uses ink/deep for primary buttons — consistent with "near-black primary". → No change.

## D. Content fixes to apply during rebuild (not palette)

1. **Free-shipping note says `₪400`** ("משלוח חינם בקנייה מעל 400₪"). DECISIONS §4 locks it to **₪500**. → Rebuild uses ₪500, as a config value.
2. Price shekel placement (`340₪` vs `₪340`) → standardise on `Intl.NumberFormat('he-IL', …)` in Phase 1; not a token issue.

## E. Structural notes (these are *not* imported — mockup is reference only)

- The mockup is one `"use client"` page behind a demo view-switcher (the black top bar). None of that scaffold is real; ignore it.
- Placeholder grey/clay rectangles stand in for artwork images — expected.
- Hand-written CSS in `globals.css`, hardcoded Hebrew strings, no i18n. The rebuild uses our token layer + next-intl messages.
