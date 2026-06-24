import type { Metadata } from "next"
import { FolderLanding } from "@/components/dossier/folder-landing"
import { PersonJsonLd } from "@/components/person-jsonld"
import { getResume } from "@/lib/resume"
import { getWriteups } from "@/lib/writeups"

export const metadata: Metadata = {
  alternates: {
    canonical: "/notes",
    types: { "application/rss+xml": "/notes/feed.xml" },
  },
}

export default async function NotesPage() {
  const resume = await getResume()
  const writeups = getWriteups()
  return (
    <>
      <PersonJsonLd resume={resume} />
      <FolderLanding resume={resume} writeups={writeups} initialTab="notes" />
    </>
  )
}
