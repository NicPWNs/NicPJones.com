export type TabId = "about" | "projects" | "hacks" | "awards" | "notes"

export type Tab = {
  id: TabId
  label: string
  /** CSS variable name for this tab's color */
  colorVar: string
  /** Foreground color to use on top of the tab color */
  onColorVar: string
}

export const TABS: Tab[] = [
  {
    id: "about",
    label: "Profile",
    colorVar: "--color-tab-blue",
    onColorVar: "--color-paper",
  },
  {
    id: "awards",
    label: "Awards",
    colorVar: "--color-tab-amber",
    onColorVar: "--color-paper",
  },
  {
    id: "hacks",
    label: "Hacks",
    colorVar: "--color-tab-red",
    onColorVar: "--color-paper",
  },
  {
    id: "projects",
    label: "Projects",
    colorVar: "--color-tab-green",
    onColorVar: "--color-paper",
  },
  {
    id: "notes",
    label: "Notes",
    colorVar: "--color-tab-plum",
    onColorVar: "--color-paper",
  },
]
