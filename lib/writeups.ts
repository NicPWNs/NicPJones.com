import fs from "node:fs"
import path from "node:path"
import { marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

// Syntax highlighting for fenced code blocks. Migrated posts carry no language
// hints, so fall back to auto-detection; new posts can tag the fence (```java).
// Auto-detect is restricted to a likely subset — CSS/SCSS are excluded because
// they false-match short shell commands (e.g. `# nmap -sV`) as selectors.
const AUTODETECT_LANGS = [
  "bash", "shell", "powershell", "python", "javascript", "typescript",
  "java", "c", "cpp", "csharp", "go", "rust", "ruby", "php", "sql",
  "json", "yaml", "xml", "http", "dockerfile", "ini", "diff", "perl",
]
marked.use(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      return lang && hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code, AUTODETECT_LANGS).value
    },
  }),
)

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
