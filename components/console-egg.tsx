"use client"

import { useEffect } from "react"

let printed = false

export function ConsoleEgg() {
  useEffect(() => {
    if (printed) return
    printed = true
    // eslint-disable-next-line no-console
    console.log(
      "%c Nic P. Jones %c NicPWNs ",
      "background:#2b2823;color:#e8dcc0;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;",
      "background:#b4453a;color:#f4ecda;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;",
    )
    // eslint-disable-next-line no-console
    console.log(
      "%cNice — you opened the file. Poking around the console? You'll fit right in.\nSay hi: nic@nicpjones.com · github.com/NicPWNs",
      "color:#6b6356;font-size:12px;line-height:1.6;",
    )
  }, [])
  return null
}
