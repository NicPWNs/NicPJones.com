// Scaffold a new HackTheBox write-up with the standard structure (profile badge
// at the top, standard sections, respect CTA + badge at the end) so publishing a
// new box is a one-liner.
//
//   npm run new:writeup -- "Machine Name" [easy|medium|hard|insane]
import fs from "node:fs"
import path from "node:path"

const args = process.argv.slice(2)
if (!args.length) {
  console.error('Usage: npm run new:writeup -- "Machine Name" [easy|medium|hard|insane]')
  process.exit(1)
}
const DIFFS = ["easy", "medium", "hard", "insane"]
const difficulty = DIFFS.includes(args[args.length - 1]?.toLowerCase()) ? args.pop().toLowerCase() : ""
const name = args.join(" ").trim()
const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const slug = `hackthebox-${nameSlug}-write-up`

const root = process.cwd()
const file = path.join(root, "content", "writeups", `${slug}.md`)
if (fs.existsSync(file)) { console.error(`Already exists: ${file}`); process.exit(1) }

const d = new Date()
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const BADGE =
  "[![HackTheBox profile badge](https://www.hackthebox.com/badge/image/72382)](https://app.hackthebox.com/users/72382)"
const diffPhrase = difficulty ? ` This machine is categorized as *${difficulty}* difficulty.` : ""
const diffParen = difficulty ? ` (${difficulty})` : ""
const excerpt = `A full walkthrough of the ${name} machine${diffParen} on HackTheBox: enumeration, exploitation, and privilege escalation to root, explained step by step.`

const content = `---
title: "HackTheBox ${name} Write-Up"
date: ${date}
slug: ${slug}
excerpt: ${JSON.stringify(excerpt)}
tags: ["hackthebox"]
---

${BADGE}

This is my write-up for the ${name} machine on HackTheBox.${diffPhrase} Here I detail the penetration testing steps taken to scan, exploit, and privilege escalate on this target machine.

## ${name} Summary

![HackTheBox ${name} machine avatar](/writeups/${slug}/img-1.png)

### Target Information

[**Machine Page**](https://app.hackthebox.com/machines/${nameSlug})
**IP Address:** 10.10.11.x
**Hostname:** ${nameSlug}.htb

### Synopsis

_TODO: one-paragraph summary of the full attack path._

## Scanning

### Nmap

\`\`\`bash
# nmap -sV -sC -p- 10.10.11.x
\`\`\`

## Exploit

_TODO_

## Root

_TODO_

## Loot

Other than the points on HackTheBox, the lessons learned are the real treasures for this box.

1.  _TODO_

${BADGE}

Found this helpful? Drop some [respect](https://app.hackthebox.com/users/72382) on my HackTheBox profile!

Thank you for reading my write-up for the ${name} machine on HackTheBox. Be sure to check out my other write-ups for [HackTheBox](/notes?tag=hackthebox)!
`

fs.mkdirSync(path.join(root, "public", "writeups", slug), { recursive: true })
fs.writeFileSync(file, content, "utf-8")
console.log(`Created content/writeups/${slug}.md`)
console.log(`Add screenshots to public/writeups/${slug}/ (img-1.png = machine avatar).`)
