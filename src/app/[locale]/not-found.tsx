/**
 * Not-found boundary. This also catches an invalid locale, where the layout
 * throws before mounting the i18n provider — so it must NOT depend on
 * translations. Kept static and bilingual for that reason.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[var(--container-content)] flex-col items-start justify-center gap-3 px-6 py-24">
      <h1 className="text-[length:var(--text-h1)]">הדף לא נמצא</h1>
      <p className="text-[color:var(--color-text-muted)]" dir="ltr">
        Page not found.
      </p>
    </main>
  );
}
