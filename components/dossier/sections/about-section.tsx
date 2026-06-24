import { type ElementType } from "react"
import { fmtDate, fmtRange, type Resume } from "@/lib/resume"

function FileSection({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-2">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-ink-soft">
          {index}
        </span>
        <h3 className="font-mono text-base font-bold uppercase tracking-[0.18em] text-ink sm:text-lg">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}

export function AboutSection({
  colorVar,
  resume,
}: {
  colorVar: string
  resume: Resume
}) {
  // Top card stays a curated, generic summary (privacy); detail comes from the resume.
  const loc = resume.basics.location
  const locationStr =
    [loc?.city, loc?.region || loc?.countryCode].filter(Boolean).join(", ") ||
    "—"
  const profiles = resume.basics.profiles ?? []
  const github = profiles.find((p) => /github/i.test(p.network))
  const linkedin = profiles.find((p) => /linkedin/i.test(p.network))
  const email = resume.basics.email
  const fields = [
    { k: "Name", v: resume.basics.name, strong: true },
    { k: "Alias", v: "NicPWNs", strong: true },
    { k: "Occupation", v: "Hacker", strong: false },
    { k: "Location", v: locationStr, strong: false },
  ]

  // Group flat work entries by company (a company's roles aren't contiguous).
  type WorkGroup = { name: string; location?: string; roles: typeof resume.work }
  const workGroups: WorkGroup[] = []
  for (const w of resume.work) {
    const g = workGroups.find((x) => x.name === w.name)
    if (g) g.roles.push(w)
    else workGroups.push({ name: w.name, location: w.location, roles: [w] })
  }

  return (
    <article className="text-ink">
      <div className="mb-6 flex items-center gap-2.5">
        <span
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: `var(${colorVar})` }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-soft">
          / Profile
        </p>
      </div>

      {/* Identity block: portrait + fields */}
      <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
        <figure className="mx-auto shrink-0 sm:mx-0">
          <div className="relative h-28 w-24 overflow-hidden border-2 border-ink bg-ink/[0.04] sm:h-full">
            <span className="absolute left-1 top-1 h-3 w-3 border-l-2 border-t-2 border-ink" />
            <span className="absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2 border-ink" />
            <span className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-ink" />
            <span className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-ink" />
            <svg
              viewBox="0 0 120 140"
              preserveAspectRatio="xMidYMax meet"
              className="h-full w-full text-ink/35"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 140 C14 102 36 76 60 76 C84 76 106 102 106 140 Z" />
              <circle cx="60" cy="44" r="27" />
            </svg>
          </div>
        </figure>

        <dl className="grid grid-cols-1 gap-x-10 gap-y-3 self-start sm:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.k}
              className="flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                {f.k}
              </dt>
              <dd
                className={`text-right font-mono text-xs tracking-wide text-ink ${
                  f.strong ? "font-bold" : ""
                }`}
              >
                {f.v}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Status
            </dt>
            <dd className="flex items-center gap-2 font-mono text-xs tracking-wide text-ink">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: `var(${colorVar})` }}
              />
              Active
            </dd>
          </div>

          <div className="flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Email
            </dt>
            <dd className="text-right font-mono text-xs tracking-wide text-ink">
              {email ? (
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              GitHub
            </dt>
            <dd className="text-right font-mono text-xs tracking-wide text-ink">
              {github ? (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @{github.username}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              LinkedIn
            </dt>
            <dd className="text-right font-mono text-xs tracking-wide text-ink">
              {linkedin ? (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  in/{linkedin.username}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Summary */}
      {resume.basics.summary && (
        <div className="mt-8 border-t border-ink/20 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Summary
          </p>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-relaxed text-ink/85">
            {resume.basics.summary}
          </p>
        </div>
      )}

      {/* Work — grouped by company */}
      <FileSection index="01" title="Work">
        <div className="divide-y-2 divide-ink/15">
          {workGroups.map((g) => {
            const starts = g.roles
              .map((r) => r.startDate)
              .filter(Boolean)
              .sort() as string[]
            const ends = g.roles
              .map((r) => r.endDate)
              .filter(Boolean)
              .sort() as string[]
            const current = g.roles.some((r) => !r.endDate)
            const span = fmtRange(
              starts[0],
              current ? null : ends[ends.length - 1],
            )
            return (
              <div key={g.name} className="py-6 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h4 className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-ink">
                    {g.name}
                  </h4>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    {g.location}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] tracking-wide text-ink-soft/80">
                  {span}
                </p>

                <div className="mt-4 space-y-5 border-l border-ink/15 pl-5">
                  {g.roles.map((role, ri) => (
                    <div key={`${role.position}-${ri}`} className="relative">
                      {!role.endDate && (
                        <span
                          aria-hidden="true"
                          title="Current role"
                          className="pointer-events-none absolute right-full -top-2 mr-2 text-stamp"
                        >
                          <svg
                            viewBox="0 0 48 28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-12 sm:h-7 sm:w-14"
                          >
                            <path d="M4 9 C 16 7, 30 13, 42 17" />
                            <path d="M33 9 L 43 17 L 32 21" />
                          </svg>
                        </span>
                      )}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h5 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-ink">
                          {role.position}
                        </h5>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                          {fmtRange(role.startDate, role.endDate)}
                        </span>
                      </div>
                      {role.highlights && role.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {role.highlights.map((h, hi) => (
                            <li
                              key={hi}
                              className="flex gap-2 font-mono text-xs leading-relaxed text-ink/75"
                            >
                              <span className="text-ink-soft/60">—</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </FileSection>

      {/* Education */}
      <FileSection index="02" title="Education">
        <div className="divide-y-2 divide-ink/15">
          {resume.education.map((ed, i) => {
            const courses = ed.courses ?? []
            const synopsis = courses
              .find((c) => c.startsWith("Synopsis:"))
              ?.replace(/^Synopsis:\s*/, "")
            const chips = courses.filter((c) => !c.startsWith("Synopsis:"))
            return (
              <div
                key={`${ed.institution}-${i}`}
                className="relative py-6 first:pt-0"
              >
                {!ed.endDate && (
                  <span
                    aria-hidden="true"
                    title="Current"
                    className="pointer-events-none absolute right-full -top-2 mr-2 text-stamp"
                  >
                    <svg
                      viewBox="0 0 48 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-12 sm:h-7 sm:w-14"
                    >
                      <path d="M4 9 C 16 7, 30 13, 42 17" />
                      <path d="M33 9 L 43 17 L 32 21" />
                    </svg>
                  </span>
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h4 className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-ink">
                    {ed.institution}
                  </h4>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                    {fmtRange(ed.startDate, ed.endDate)}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs tracking-wide text-ink/80">
                  {[ed.studyType, ed.area].filter(Boolean).join(", ")}
                  {ed.score ? (
                    <span className="text-ink-soft"> · GPA {ed.score}</span>
                  ) : null}
                </p>
                {chips.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {chips.map((n) => (
                      <li
                        key={n}
                        className="border border-ink/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
                {synopsis && (
                  <p className="mt-3 max-w-2xl font-mono text-xs leading-relaxed text-ink/60">
                    {synopsis}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </FileSection>

      {/* Certifications — typed roster with dot leaders, like a file index */}
      <FileSection index="03" title="Certifications">
        <ul className="font-mono">
          {resume.certificates.map((c, i) => {
            const Name: ElementType = c.url ? "a" : "span"
            const meta = [c.issuer, c.date ? fmtDate(c.date) : null]
              .filter(Boolean)
              .join(" · ")
            const starred =
              /\bOSCP\b/.test(c.name) ||
              /\bCISSP\b/.test(c.name) ||
              /Solutions Architect Professional/.test(c.name)
            return (
              <li
                key={`${c.name}-${i}`}
                className="relative flex items-baseline gap-2 py-[3px]"
              >
                {starred && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 rotate-[-8deg] font-marker text-xl font-bold leading-none text-stamp"
                  >
                    *
                  </span>
                )}
                <Name
                  {...(c.url
                    ? {
                        href: c.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="text-xs leading-relaxed text-ink hover:underline"
                >
                  {c.name}
                </Name>
                <span
                  aria-hidden="true"
                  className="min-w-[1.5rem] flex-1 border-b border-dotted border-ink/40"
                />
                <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                  {meta}
                </span>
              </li>
            )
          })}
        </ul>
      </FileSection>
    </article>
  )
}
