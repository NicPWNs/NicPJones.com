import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWriteup, getWriteups } from "@/lib/writeups"
import { TABS } from "@/components/dossier/tabs-config"

const SITE = "https://nicpjones.com"
const AUTHOR = { name: "Nic P. Jones", url: SITE }

// Section links so a reader landing on a post can jump into the dossier.
const NAV = TABS.map((t) => ({
  label: t.label,
  color: t.colorVar,
  href: `/${t.id === "about" ? "profile" : t.id}`,
}))

export const dynamicParams = false

export function generateStaticParams() {
  return getWriteups().map((w) => ({ slug: w.slug }))
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function longDate(d: string): string {
  const [y, m, day] = d.split("-")
  if (!y || !m || !day) return d
  return `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(day, 10)}, ${y}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const w = getWriteup(slug)
  if (!w) return {}
  return {
    title: `${w.title} — NicPJones / NicPWNs`,
    description: w.excerpt,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: { canonical: `/notes/${slug}` },
    openGraph: {
      type: "article",
      title: w.title,
      description: w.excerpt,
      url: `/notes/${slug}`,
      publishedTime: w.date,
      authors: [AUTHOR.name],
    },
  }
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const w = getWriteup(slug)
  if (!w) notFound()

  const url = `${SITE}/notes/${slug}`
  const firstImg = w.html.match(/src="(\/writeups\/[^"]+)"/)?.[1]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: w.title,
    description: w.excerpt,
    datePublished: w.date,
    dateModified: w.date,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    mainEntityOfPage: url,
    url,
    ...(firstImg ? { image: `${SITE}${firstImg}` } : {}),
  }

  return (
    <main className="min-h-screen bg-noir px-4 py-10 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <Link
          href="/"
          className="font-marker text-xl leading-none text-manila transition-opacity hover:opacity-75 sm:text-2xl"
        >
          Nic P. Jones <span className="text-manila/55">aka NicPWNs</span>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="opacity-85 transition-opacity hover:opacity-100"
              style={{ color: `var(${n.color})` }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <article className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-page px-6 py-10 text-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:px-12 sm:py-14">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          Back to other notes
        </Link>

        <header className="mt-6 border-b-2 border-ink/15 pb-6">
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {w.title}
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            By {AUTHOR.name} · {longDate(w.date)}
          </p>
          {w.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {w.tags.map((t) => (
                <Link
                  key={t}
                  href={`/notes?tag=${t}`}
                  className="rounded-full border border-ink/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-ink/45 hover:text-ink"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className="writeup-prose mt-8"
          dangerouslySetInnerHTML={{ __html: w.html }}
        />
      </article>

      <footer className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-4 text-center">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-manila/70 transition-colors hover:text-manila"
        >
          Explore the full dossier →
        </Link>
      </footer>
    </main>
  )
}
