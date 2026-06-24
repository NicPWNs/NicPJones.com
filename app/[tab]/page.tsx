import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FolderLanding } from "@/components/dossier/folder-landing"
import { PersonJsonLd } from "@/components/person-jsonld"
import { type TabId } from "@/components/dossier/tabs-config"
import { getResume } from "@/lib/resume"
import { getWriteups } from "@/lib/writeups"

// Shareable deep-links. Slug -> internal tab id (Profile lives under "about").
// `about` is an alias for `profile`. /notes (+ /blog) is handled by app/notes.
const ROUTES: Record<string, TabId> = {
  profile: "about",
  about: "about",
  awards: "awards",
  hacks: "hacks",
  projects: "projects",
}

// Canonical route per tab, so the /about alias doesn't read as a duplicate.
const CANONICAL: Partial<Record<TabId, string>> = {
  about: "/profile",
  awards: "/awards",
  hacks: "/hacks",
  projects: "/projects",
}

// Pre-render the known section routes at build time — same speed as "/",
// same bundle. Unknown paths 404 rather than render dynamically.
export function generateStaticParams() {
  return Object.keys(ROUTES).map((tab) => ({ tab }))
}

export const dynamicParams = false

// Canonical only — the page title stays static (inherited from the layout).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tab: string }>
}): Promise<Metadata> {
  const { tab } = await params
  const tabId = ROUTES[tab]
  if (!tabId) return {}
  return { alternates: { canonical: CANONICAL[tabId] } }
}

export default async function TabPage({
  params,
}: {
  params: Promise<{ tab: string }>
}) {
  const { tab } = await params
  const tabId = ROUTES[tab]
  if (!tabId) notFound()
  const resume = await getResume()
  const writeups = getWriteups()
  return (
    <>
      <PersonJsonLd resume={resume} />
      <FolderLanding resume={resume} writeups={writeups} initialTab={tabId} />
    </>
  )
}
