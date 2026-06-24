import { type ElementType } from "react"
import { fmtRange, type Resume } from "@/lib/resume"

export function ProjectsSection({
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
          / Projects
        </p>
      </div>

      <p className="mb-6 max-w-xl font-mono text-xs leading-relaxed text-ink/70">
        Things I've built — apps, tools, and other ventures.
      </p>

      <div className="divide-y-2 divide-ink/15 border-y-2 border-ink/15">
        {resume.projects.map((p, i) => {
          const Name: ElementType = p.url ? "a" : "span"
          return (
            <div key={`${p.name}-${i}`} className="py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <Name
                  {...(p.url
                    ? {
                        href: p.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-ink hover:underline"
                >
                  {p.name}
                </Name>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                  {fmtRange(p.startDate, p.endDate)}
                </span>
              </div>
              {p.description && (
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-ink/75">
                  {p.description}
                </p>
              )}
              {p.highlights && p.highlights.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {p.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex gap-2 font-mono text-xs leading-relaxed text-ink/65"
                    >
                      <span className="text-ink-soft/60">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
