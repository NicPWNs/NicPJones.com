// Notify IndexNow (Bing, Yandex, and other participating engines) of write-ups
// changed in the pushed commit range, so new/updated posts get crawled quickly.
// Runs in CI after a successful deploy. Google is covered separately via Search
// Console + the sitemap (it doesn't participate in IndexNow).
import { execSync } from "node:child_process"
import path from "node:path"

const KEY = "71c9d296cbe4a71218e13f01e2dd1435"
const HOST = "nicpjones.com"

const before = process.env.INDEXNOW_BEFORE || ""
const sha = process.env.GITHUB_SHA || "HEAD"

let files = []
try {
  const range = before && !/^0+$/.test(before) ? `${before} ${sha}` : "HEAD~1 HEAD"
  files = execSync(`git diff --name-only ${range} -- content/writeups/`, { encoding: "utf-8" })
    .trim().split("\n").filter(Boolean)
} catch (e) {
  console.log("Could not compute changed files:", e.message)
}

const slugs = files.filter((f) => f.endsWith(".md")).map((f) => path.basename(f, ".md"))
if (!slugs.length) {
  console.log("No write-up changes in this push; skipping IndexNow.")
  process.exit(0)
}

const urlList = slugs.map((s) => `https://${HOST}/notes/${s}`)
const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
})
console.log(`IndexNow -> HTTP ${res.status} (200/202 = accepted) for:\n${urlList.join("\n")}`)
// Don't fail the deploy if IndexNow is briefly unavailable.
if (res.status !== 200 && res.status !== 202) {
  console.log("IndexNow did not accept the submission; non-fatal.")
}
