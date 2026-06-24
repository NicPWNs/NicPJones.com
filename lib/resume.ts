// Resume data is sourced from a JSON Resume gist so the site stays in sync
// with a single source of truth. https://jsonresume.org/schema/

import fallbackResume from "./resume-fallback.json"

const RESUME_URL =
  "https://gist.githubusercontent.com/NicPWNs/5489290125ff3707caf8d51cb6cdc8a0/raw"

export type ResumeProfile = {
  network: string
  url: string
  username: string
}

export type ResumeBasics = {
  name: string
  label?: string
  image?: string
  email?: string
  phone?: string
  url?: string
  summary?: string
  location?: {
    address?: string
    city?: string
    region?: string
    countryCode?: string
    postalCode?: string
  }
  profiles?: ResumeProfile[]
}

export type ResumeWork = {
  name: string
  position: string
  url?: string
  location?: string
  startDate?: string
  endDate?: string | null
  summary?: string
  highlights?: string[]
}

export type ResumeEducation = {
  institution: string
  url?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string | null
  score?: string
  courses?: string[]
}

export type ResumeAward = {
  title: string
  date?: string
  awarder?: string
  summary?: string
  url?: string
}

export type ResumeCertificate = {
  name: string
  date?: string
  issuer?: string
  url?: string
  expirationDate?: string
}

export type ResumePublication = {
  name: string
  publisher?: string
  releaseDate?: string
  url?: string
  summary?: string
}

export type ResumeProject = {
  name: string
  description?: string
  highlights?: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export type Resume = {
  basics: ResumeBasics
  work: ResumeWork[]
  education: ResumeEducation[]
  awards: ResumeAward[]
  certificates: ResumeCertificate[]
  publications: ResumePublication[]
  projects: ResumeProject[]
  skills?: { name: string; keywords?: string[] }[]
}

/**
 * Fetches the resume. Revalidates hourly so gist edits propagate without a
 * redeploy. Parses strict JSON first; falls back to tolerating trailing
 * commas so a stale/edited gist never hard-fails the page.
 */
export async function getResume(): Promise<Resume> {
  try {
    const res = await fetch(RESUME_URL, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const text = await res.text()
    try {
      return JSON.parse(text) as Resume
    } catch {
      // Tolerate trailing commas if the gist is edited by hand again.
      return JSON.parse(text.replace(/,(\s*[}\]])/g, "$1")) as Resume
    }
  } catch {
    // Gist unreachable/invalid — fall back to the bundled snapshot so the
    // site always renders (degrades to last-known content, never 500s).
    return fallbackResume as Resume
  }
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** "2024-01-01" -> "Jan 2024"; "2030" -> "2030"; empty/null -> "Present". */
export function fmtDate(d?: string | null): string {
  if (!d) return "Present"
  const [y, m] = d.split("-")
  if (!m) return y
  const mi = parseInt(m, 10) - 1
  return MONTHS[mi] ? `${MONTHS[mi]} ${y}` : y
}

/** "Jan 2024 — Present" */
export function fmtRange(start?: string, end?: string | null): string {
  return `${fmtDate(start)} — ${fmtDate(end)}`
}
