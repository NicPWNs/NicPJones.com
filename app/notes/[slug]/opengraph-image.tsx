import { ImageResponse } from "next/og"
import { getWriteup, getWriteups } from "@/lib/writeups"

export const alt = "Nic P. Jones — Notes"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const dynamicParams = false

export function generateStaticParams() {
  return getWriteups().map((w) => ({ slug: w.slug }))
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
function fmt(d: string): string {
  const [y, m] = d.split("-")
  return m ? `${MONTHS[parseInt(m, 10) - 1]} ${y}` : y
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const w = getWriteup(slug)
  const title = w?.title ?? "Notes"
  const date = w ? fmt(w.date) : ""
  const tags = w?.tags ?? []
  const titleSize = title.length > 46 ? 62 : title.length > 30 ? 78 : 94

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a09",
          fontFamily: "sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: 1088,
            height: 518,
            background: "#e8dcc0",
            borderRadius: 28,
            padding: "64px 76px",
            boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              fontSize: 23,
              letterSpacing: 9,
              color: "#6b6356",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Field Note · nicpjones.com
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "#2b2823",
              marginTop: 26,
              letterSpacing: -1,
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginTop: "auto",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: "#2b2823", display: "flex" }}>
              Nic P. Jones
            </div>
            <div style={{ fontSize: 26, color: "#6b6356", display: "flex" }}>
              aka NicPWNs{date ? ` · ${date}` : ""}
            </div>
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
              {tags.map((t) => (
                <div key={t} style={{ fontSize: 24, color: "#b4453a", display: "flex" }}>
                  #{t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
