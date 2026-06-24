"use client"

import { useEffect, useRef, useState } from "react"
import { TABS, type TabId } from "./tabs-config"
import type { Resume } from "@/lib/resume"
import type { WriteupMeta } from "@/lib/writeups"
import { AboutSection } from "./sections/about-section"
import { ProjectsSection } from "./sections/projects-section"
import { HacksSection } from "./sections/hacks-section"
import { AwardsSection } from "./sections/awards-section"
import { NotesSection } from "./sections/notes-section"

type SectionProps = {
  colorVar: string
  resume: Resume
  writeups: WriteupMeta[]
}

const SECTIONS: Record<TabId, React.ComponentType<SectionProps>> = {
  about: AboutSection,
  projects: ProjectsSection,
  hacks: HacksSection,
  awards: AwardsSection,
  notes: NotesSection,
}

export function FolderStage({
  resume,
  writeups,
  initiallyOpen,
  initialTab,
  onOpen,
  onClose,
}: {
  resume: Resume
  writeups: WriteupMeta[]
  initiallyOpen: boolean
  initialTab?: TabId
  onOpen?: () => void
  onClose?: () => void
}) {
  const [open, setOpen] = useState(initiallyOpen)
  // True only once the open fold has finished, so the close affordance
  // doesn't appear mid-animation.
  const [openComplete, setOpenComplete] = useState(initiallyOpen)
  const [active, setActive] = useState<TabId>(initialTab ?? "about")
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep this in sync with the front panel's fold duration below.
  const OPEN_DURATION_MS = 1400

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current)
    }
  }, [])

  // Reflect the open tab in the URL (shareable / refresh-safe) without a
  // navigation — Next's router stays in sync with manual history updates.
  useEffect(() => {
    const slug = active === "about" ? "profile" : active
    window.history.replaceState(
      window.history.state,
      "",
      open ? `/${slug}` : "/",
    )
  }, [open, active])

  const activeIndex = TABS.findIndex((t) => t.id === active)
  const activeTab = TABS[activeIndex]
  const ActiveSection = SECTIONS[active]

  function handleOpen() {
    if (open) return
    setOpen(true)
    onOpen?.()
    if (openTimer.current) clearTimeout(openTimer.current)
    openTimer.current = setTimeout(() => setOpenComplete(true), OPEN_DURATION_MS)
  }

  function handleClose() {
    if (!open) return
    setOpen(false)
    setOpenComplete(false)
    setActive("about")
    onClose?.()
    if (openTimer.current) clearTimeout(openTimer.current)
  }

  function focusTab(index: number) {
    const next = (index + TABS.length) % TABS.length
    setActive(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault()
        focusTab(index + 1)
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        focusTab(index - 1)
        break
      case "Home":
        e.preventDefault()
        focusTab(0)
        break
      case "End":
        e.preventDefault()
        focusTab(TABS.length - 1)
        break
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-noir p-4 sm:p-8 lg:p-10">
      <div
        className="relative w-full max-w-[1180px]"
        style={{ perspective: "2600px" }}
      >
        <div
          className={`relative h-[86vh] min-h-[560px] w-full select-none ${
            open ? "" : "cursor-pointer"
          }`}
          onClick={open ? undefined : handleOpen}
        >
          {/* Folder body — the manila frame. Its top edge sits below the
              label tab, so the top-right is "cut away" (noir shows through)
              like a real manila folder. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 top-16 rounded-2xl rounded-tl-none bg-manila-deep shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
          />

          {/* Label tab — the notch on the top-left that carries the header,
              riding up above the folder body. */}
          <div
            className={`absolute left-0 top-0 z-[5] flex h-[4.25rem] w-fit max-w-full items-center rounded-t-2xl bg-manila-deep px-5 sm:px-7 ${
              open ? "cursor-pointer" : ""
            }`}
            role={open ? "button" : undefined}
            aria-label={open ? "Close file" : undefined}
            tabIndex={open ? 0 : -1}
            onClick={
              open
                ? (e) => {
                    e.stopPropagation()
                    handleClose()
                  }
                : undefined
            }
            onKeyDown={
              open
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleClose()
                    }
                  }
                : undefined
            }
          >
            <h1
              className={`font-marker text-2xl leading-none tracking-tight text-ink sm:text-3xl lg:text-4xl ${
                initiallyOpen ? "" : "animate-marker-write"
              }`}
            >
              Nic P. Jones
            </h1>
          </div>

          {/* Inner pages + tabs — seated in the folder body below the tab */}
          <div className="absolute inset-x-3 bottom-3 top-[4.75rem] flex flex-col sm:inset-x-4 sm:bottom-4">
            {/* Colored index tabs — connected to the white page */}
            <div
              role="tablist"
              aria-label="Sections"
              aria-orientation="horizontal"
              className="relative ml-2 flex shrink-0 items-end gap-0.5 sm:ml-6 sm:gap-1"
            >
              {TABS.map((tab, i) => {
                const selected = tab.id === active
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    aria-disabled={!open}
                    tabIndex={open && selected ? 0 : -1}
                    onClick={() => {
                      // When the folder is closed, any tab click opens it —
                      // straight to the section that was clicked.
                      if (!open) handleOpen()
                      setActive(tab.id)
                    }}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`relative z-[1] inline-flex h-12 items-center rounded-t-lg px-3 pb-1.5 font-hand text-lg font-semibold leading-none transition-transform duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-paper/70 aria-selected:z-[3] sm:px-4 sm:text-xl lg:px-5 lg:text-2xl ${
                      selected
                        ? "folder-tab"
                        : "hover:-translate-y-1 focus-visible:-translate-y-1"
                    }`}
                    style={
                      {
                        backgroundColor: `var(${tab.colorVar})`,
                        color: `var(${tab.onColorVar})`,
                        "--tab-color": `var(${tab.colorVar})`,
                      } as React.CSSProperties
                    }
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* The white page — sharp corners like a real sheet of paper.
                It overlaps the tab row: when open it sits above the inactive
                tabs (so they tuck behind the sheet) but below the active tab
                (so the selected tab stays connected to its page). */}
            <div className="relative z-[2] -mt-2 min-h-0 flex-1 overflow-hidden bg-page shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45),inset_0_8px_11px_-8px_rgba(0,0,0,0.22)] ring-1 ring-ink/10">
              <div className="h-full select-text overflow-y-auto px-6 py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-12 sm:py-14 lg:px-20 lg:py-20">
                <div className="mx-auto w-full max-w-3xl">
                  <div
                    key={active}
                    role="tabpanel"
                    id={`panel-${active}`}
                    aria-labelledby={`tab-${active}`}
                    tabIndex={0}
                    className="animate-settle focus:outline-none"
                  >
                    <ActiveSection
                      colorVar={activeTab.colorVar}
                      resume={resume}
                      writeups={writeups}
                    />
                  </div>
                </div>
              </div>
              {/* Top fade so scrolling content doesn't bleed over the tabs */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-[linear-gradient(to_bottom,var(--color-page),var(--color-page)_50%,transparent)]"
              />
              {/* Bottom fade — hints more content below now that the
                  scrollbar is hidden */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-[linear-gradient(to_top,var(--color-page),var(--color-page)_50%,transparent)]"
              />
            </div>
          </div>

          {/* The front panel — shorter than the back, hinged at the bottom,
              folds downward to reveal the pages. The slot at its top edge lets
              the tabs and a strip of white page peek out above it. */}
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open the file on Nic P. Jones"
            aria-expanded={open}
            tabIndex={open ? -1 : 0}
            className="group absolute inset-x-0 bottom-0 top-[15%] z-[4] origin-bottom cursor-pointer rounded-2xl text-left transition-[transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.66,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-paper/70 motion-reduce:transition-none"
            style={{
              transformStyle: "preserve-3d",
              transform: open
                ? "rotateX(-164deg) translateZ(24px)"
                : "rotateX(0deg) translateZ(24px)",
              opacity: open ? 0 : 1,
              pointerEvents: open ? "none" : "auto",
            }}
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/15 bg-manila px-8 py-9 shadow-[0_-14px_28px_-10px_rgba(0,0,0,0.4),0_36px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-ink/10 sm:px-16 sm:py-12">
              {/* thumb-cut notch in the top edge of the front panel */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-7 w-28 -translate-x-1/2 rounded-b-[2rem] bg-manila-deep shadow-[inset_0_-3px_6px_-3px_rgba(0,0,0,0.35)]"
              />
              {/* top edge highlight to seat the panel in front of the pages */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-paper/60"
              />

              <div className="flex items-start justify-between gap-6">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink-soft">
                  File No. 07CE
                </p>
              </div>

              {/* CONFIDENTIAL stamp — slapped at an angle in the corner */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-16 rotate-[9deg] select-none rounded-md border-[3px] border-stamp px-4 py-1.5 font-mono text-lg font-bold uppercase tracking-[0.22em] text-stamp opacity-80 sm:right-12 sm:top-[4.5rem] sm:px-6 sm:py-2 sm:text-2xl lg:text-3xl"
              >
                Confidential
              </span>

              {/* Embossed logo pressed into the folder face. The emboss filter
                  lives on the wrapper and the mask on the child — on one
                  element the mask would clip the relief shadows away. */}
              <div className="flex flex-1 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="aspect-[1080/260] w-64 sm:w-96 lg:w-[32rem]"
                  style={{
                    filter:
                      "drop-shadow(0 1.5px 0.5px rgba(255,255,255,0.75)) drop-shadow(0 -1.5px 0.5px rgba(0,0,0,0.4))",
                  }}
                >
                  <div
                    className="h-full w-full bg-manila-edge"
                    style={{
                      maskImage: "url(/pwns-logo.svg)",
                      WebkitMaskImage: "url(/pwns-logo.svg)",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                  />
                </div>
              </div>

              {/* footer rule — thicker, embossed into the folder like the logo */}
              <div
                aria-hidden="true"
                className="mt-4 h-[3px] w-full rounded-full bg-manila-edge"
                style={{
                  filter:
                    "drop-shadow(0 1.5px 0.5px rgba(255,255,255,0.75)) drop-shadow(0 -1.5px 0.5px rgba(0,0,0,0.4))",
                }}
              />
            </div>
          </button>

          {/* Close affordance — a manila pull-tab at the bottom edge of the
              folder; clicking it folds the file shut. No label, stays in the
              folder language. */}
          {open && openComplete && (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close file"
              title="Close file"
              className="group absolute bottom-0 left-1/2 z-30 flex h-7 w-24 -translate-x-1/2 animate-fade items-center justify-center rounded-t-[1.5rem] bg-manila-deep shadow-[0_-9px_18px_-10px_rgba(0,0,0,0.55)] ring-1 ring-ink/10 transition-[filter] duration-200 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 sm:w-28"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 -translate-y-px text-ink-soft transition-colors group-hover:text-ink"
              >
                <path d="M6 14l6-6 6 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
