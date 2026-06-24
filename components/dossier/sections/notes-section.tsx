"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { WriteupMeta } from "@/lib/writeups"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
function ym(d: string): string {
  const [y, m] = d.split("-")
  return m ? `${MONTHS[parseInt(m, 10) - 1]} ${y}` : y
}

function FilterChip({
  label,
  active,
  colorVar,
  onClick,
}: {
  label: string
  active: boolean
  colorVar: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer font-hand text-2xl leading-none transition-all ${
        active
          ? "underline decoration-2 underline-offset-4"
          : "opacity-55 hover:opacity-100"
      }`}
      style={{ color: active ? `var(${colorVar})` : "var(--color-ink)" }}
    >
      {label}
    </button>
  )
}

export function NotesSection({
  colorVar,
  writeups,
}: {
  colorVar: string
  writeups: WriteupMeta[]
}) {
  const [active, setActive] = useState<string | null>(null)

  // Honor /notes?tag=<x> on load (the migrated category backlinks point here).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tag")
    if (t) setActive(t)
  }, [])

  const allTags = Array.from(new Set(writeups.flatMap((w) => w.tags))).sort()
  const shown = active ? writeups.filter((w) => w.tags.includes(active)) : writeups

  function choose(tag: string | null) {
    setActive(tag)
    window.history.replaceState(
      window.history.state,
      "",
      tag ? `/notes?tag=${tag}` : "/notes",
    )
  }

  return (
    <article className="text-ink">
      <div className="mb-6 flex items-center gap-2.5">
        <span
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: `var(${colorVar})` }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-soft">
          Notes
        </p>
      </div>

      <p className="mb-5 max-w-xl font-mono text-xs leading-relaxed text-ink/70">
        Write-ups, teardowns, and field notes.
      </p>

      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <FilterChip
            label="All"
            active={active === null}
            colorVar={colorVar}
            onClick={() => choose(null)}
          />
          {allTags.map((t) => (
            <FilterChip
              key={t}
              label={`#${t}`}
              active={active === t}
              colorVar={colorVar}
              onClick={() => choose(t)}
            />
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="font-mono text-xs text-ink/60">No notes here yet.</p>
      ) : (
        <ul className="divide-y divide-ink/12 border-y border-ink/12">
          {shown.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/notes/${w.slug}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
              >
                <span
                  className="w-20 shrink-0 font-mono text-xs tracking-[0.1em]"
                  style={{ color: `var(${colorVar})` }}
                >
                  {ym(w.date)}
                </span>
                <span className="flex-1 font-mono text-sm font-bold uppercase tracking-[0.06em] text-ink transition-opacity group-hover:opacity-60">
                  {w.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
