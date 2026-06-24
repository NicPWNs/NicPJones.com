import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-noir p-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-manila px-8 py-12 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* red stamp, like the folder face */}
        <span className="pointer-events-none absolute right-4 top-6 -rotate-[9deg] select-none rounded-md border-[3px] border-stamp px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-stamp opacity-80">
          Missing
        </span>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">
          Error / 404
        </p>
        <h1 className="mt-5 font-marker text-4xl leading-none tracking-tight text-ink">
          File not found
        </h1>
        <p className="mx-auto mt-5 max-w-xs font-mono text-xs leading-relaxed text-ink/70">
          No such page is on file. It may have been moved, redacted, or never
          existed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <span aria-hidden="true">←</span>
          Return home
        </Link>
      </div>
    </main>
  )
}
