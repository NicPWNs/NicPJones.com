import { type ElementType } from "react"
import { fmtDate, type Resume } from "@/lib/resume"

export function HacksSection({
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
          / Hacks
        </p>
      </div>

      <p className="mb-6 max-w-xl font-mono text-xs leading-relaxed text-ink/70">
        Responsibly disclosed vulnerabilities and security research.
      </p>

      <ul className="divide-y-2 divide-ink/15 border-y-2 border-ink/15">
        {resume.publications.map((pub, i) => {
          const Tag: ElementType = pub.url ? "a" : "div"
          return (
            <li key={`${pub.name}-${i}`}>
              <Tag
                {...(pub.url
                  ? { href: pub.url, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group block py-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span
                    className="font-mono text-sm font-bold tracking-[0.06em]"
                    style={{ color: `var(${colorVar})` }}
                  >
                    {pub.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    {pub.publisher}
                    {pub.releaseDate ? ` · ${fmtDate(pub.releaseDate)}` : ""}
                  </span>
                </div>
                {pub.summary && (
                  <p className="mt-2 font-mono text-xs leading-relaxed text-ink/75 transition-opacity group-hover:opacity-70">
                    {pub.summary}
                  </p>
                )}
              </Tag>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
