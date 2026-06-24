"use client"

import { useEffect, useState } from "react"
import { FolderStage } from "./folder-stage"
import type { TabId } from "./tabs-config"
import type { Resume } from "@/lib/resume"
import type { WriteupMeta } from "@/lib/writeups"

const STORAGE_KEY = "nicpwns-dossier-opened"

export function FolderLanding({
  resume,
  writeups,
  initialTab,
}: {
  resume: Resume
  writeups: WriteupMeta[]
  initialTab?: TabId
}) {
  // null = still deciding (client-only, avoids SSR/localStorage mismatch).
  // A direct section link (initialTab) opens straight to that tab.
  const [initiallyOpen, setInitiallyOpen] = useState<boolean | null>(
    initialTab ? true : null,
  )

  useEffect(() => {
    if (initialTab) return // direct link — already open to the right tab
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const hasVisited = (() => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) === "1"
      } catch {
        return false
      }
    })()

    setInitiallyOpen(hasVisited || prefersReducedMotion)
  }, [initialTab])

  function handleOpen() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore storage failures
    }
  }

  function handleClose() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage failures
    }
  }

  if (initiallyOpen === null) {
    // Neutral black flash-guard while we read localStorage
    return <div className="min-h-screen bg-noir" aria-hidden="true" />
  }

  return (
    <FolderStage
      resume={resume}
      writeups={writeups}
      initiallyOpen={initiallyOpen}
      initialTab={initialTab}
      onOpen={handleOpen}
      onClose={handleClose}
    />
  )
}
