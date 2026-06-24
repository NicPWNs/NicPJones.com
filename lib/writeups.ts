import fs from "node:fs"
import path from "node:path"
import { marked } from "marked"

const DIR = path.join(process.cwd(), "content", "writeups")

export type WriteupMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  source?: string
  tags: string[]
}

export type Writeup = WriteupMeta & { html: string }

function parseFile(file: string): WriteupMeta & { body: string } {
  const raw = fs
    .readFileSync(path.join(DIR, file), "utf-8")
    .replace(/\r\n/g, "\n")
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const fmBlock = m ? m[1] : ""
  const body = (m ? m[2] : raw).trim()
  const fm: Record<string, string | string[]> = {}
  for (const line of fmBlock.split("\n")) {
    const i = line.indexOf(":")
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    const raw = line.slice(i + 1).trim()
    let val: string | string[] = raw
    if (raw.startsWith('"') || raw.startsWith("[")) {
      try {
        val = JSON.parse(raw)
      } catch {
        /* keep raw */
      }
    }
    fm[key] = val
  }
  const str = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : ""
  return {
    slug: str(fm.slug) || file.replace(/\.md$/, ""),
    title: str(fm.title) || str(fm.slug) || "",
    date: str(fm.date),
    excerpt: str(fm.excerpt),
    source: typeof fm.source === "string" ? fm.source : undefined,
    tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
    body,
  }
}

function files(): string[] {
  if (!fs.existsSync(DIR)) return []
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md"))
}

/** Newest first. */
export function getWriteups(): WriteupMeta[] {
  return files()
    .map((f) => {
      const { body: _body, ...meta } = parseFile(f)
      return meta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getWriteup(slug: string): Writeup | null {
  const file = `${slug}.md`
  if (!fs.existsSync(path.join(DIR, file))) return null
  const { body, ...meta } = parseFile(file)
  // Migrated posts store cleaned HTML; future posts can be plain Markdown.
  const html = body.startsWith("<") ? body : (marked.parse(body) as string)
  return { ...meta, html }
}
