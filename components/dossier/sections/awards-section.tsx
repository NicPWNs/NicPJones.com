import { fmtDate, type Resume } from "@/lib/resume"

export function AwardsSection({
  colorVar,
  resume,
}: {
  colorVar: string
  resume: Resume
}) {
  return (
    <article className="text-ink">
      <div className="mb-6 flex items-center gap-2.5">
        <span
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: `var(${colorVar})` }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-soft">
          / Awards
        </p>
      </div>

      <p className="mb-6 max-w-xl font-mono text-xs leading-relaxed text-ink/70">
        Capture-the-flag wins and a few other honors.
      </p>

      <ul className="divide-y divide-ink/15 border-y border-ink/15">
        {resume.awards.map((a, i) => (
          <li
            key={`${a.title}-${i}`}
            className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
          >
            {/tournament of champions|core netwars.*sansfire/i.test(a.title) && (
              <span
                aria-hidden="true"
                className="absolute right-full top-3.5 mr-4 rotate-[-10deg] font-marker text-3xl font-bold leading-none text-stamp sm:text-4xl"
              >
                *
              </span>
            )}
            <span
              className="w-16 shrink-0 font-mono text-xs tracking-[0.1em]"
              style={{ color: `var(${colorVar})` }}
            >
              {fmtDate(a.date)}
            </span>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.06em] text-ink">
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
                  >
                    {a.title}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 shrink-0 text-ink-soft"
                    >
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </a>
                ) : (
                  a.title
                )}
              </h3>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                {a.summary}
                {a.awarder ? ` · ${a.awarder}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
