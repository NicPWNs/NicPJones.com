// Content quality gate for write-ups. Run in CI before deploy so a broken post
// never ships. Checks frontmatter completeness, image alt text, and balanced
// (variable-length) code fences. Warnings don't fail the build; errors do.
import fs from "node:fs"
import path from "node:path"

const DIR = path.join(process.cwd(), "content", "writeups")
const FM = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
let errors = 0
let warnings = 0

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf-8").replace(/\r\n/g, "\n")
  const err = (msg) => { console.error(`  ✗ ${file}: ${msg}`); errors++ }
  const warn = (msg) => { console.warn(`  ! ${file}: ${msg}`); warnings++ }

  const m = raw.match(FM)
  if (!m) { err("missing or malformed frontmatter"); continue }

  const fm = {}
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":")
    if (i === -1) continue
    let v = line.slice(i + 1).trim()
    if (v.startsWith('"') || v.startsWith("[")) { try { v = JSON.parse(v) } catch {} }
    fm[line.slice(0, i).trim()] = v
  }
  for (const req of ["title", "date", "slug", "excerpt", "tags"]) {
    if (fm[req] === undefined || (Array.isArray(fm[req]) && !fm[req].length) || fm[req] === "") {
      err(`missing frontmatter field: ${req}`)
    }
  }
  if (typeof fm.excerpt === "string") {
    if (fm.excerpt.length > 200) warn(`excerpt is ${fm.excerpt.length} chars (aim for <=160)`)
    if (/…$|\.\.\.$/.test(fm.excerpt.trim())) warn("excerpt ends with an ellipsis")
  }

  const body = m[2]
  const emptyAlt = (body.match(/!\[\]\(/g) || []).length
  if (emptyAlt) err(`${emptyAlt} image(s) with empty alt text`)

  // Balanced code fences, honoring variable fence length (```, ````, ...).
  let openLen = null
  for (const line of body.split("\n")) {
    if (openLen !== null) {
      if (new RegExp("^`{" + openLen + ",}\\s*$").test(line)) openLen = null
    } else {
      const o = line.match(/^(`{3,})([^`]*)$/)
      if (o) openLen = o[1].length
    }
  }
  if (openLen !== null) err("unbalanced code fence")
}

console.log(`check-writeups: ${errors} error(s), ${warnings} warning(s)`)
process.exit(errors ? 1 : 0)
