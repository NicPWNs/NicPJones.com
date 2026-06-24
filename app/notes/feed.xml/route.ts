import { getWriteup, getWriteups } from "@/lib/writeups"

const SITE = "https://nicpjones.com"

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// Make migrated image/link paths absolute for feed readers, and keep the
// content CDATA-safe.
function absolutize(html: string): string {
  return html
    .replaceAll('src="/writeups/', `src="${SITE}/writeups/`)
    .replaceAll('href="/notes/', `href="${SITE}/notes/`)
    .replaceAll("]]>", "]]&gt;")
}

function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString()
}

export const dynamic = "force-static"

export async function GET() {
  const posts = getWriteups()

  const items = posts
    .map((p) => {
      const url = `${SITE}/notes/${p.slug}`
      const full = getWriteup(p.slug)
      const categories = p.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
${categories}
      <description>${esc(p.excerpt)}</description>
      <content:encoded><![CDATA[${full ? absolutize(full.html) : ""}]]></content:encoded>
    </item>`
    })
    .join("\n")

  const lastBuild = posts[0] ? rfc822(posts[0].date) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Nic P. Jones — Notes</title>
    <link>${SITE}/notes</link>
    <atom:link href="${SITE}/notes/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Write-ups, teardowns, and field notes by Nic P. Jones (NicPWNs).</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
