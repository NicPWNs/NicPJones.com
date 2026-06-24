import type { MetadataRoute } from "next"
import { getWriteups } from "@/lib/writeups"

const BASE = "https://nicpjones.com"

// Canonical routes (aliases /about and /blog are intentionally omitted).
const PATHS = ["", "profile", "awards", "hacks", "projects", "notes"]

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = PATHS.map((path) => ({
    url: path ? `${BASE}/${path}` : BASE,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }))

  const posts: MetadataRoute.Sitemap = getWriteups().map((w) => ({
    url: `${BASE}/notes/${w.slug}`,
    lastModified: w.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }))

  return [...pages, ...posts]
}
