import { ImageResponse } from "next/og"

export const alt = "Nic P. Jones / NicPWNs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
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
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: 1000,
            background: "#e8dcc0",
            borderRadius: 28,
            padding: "76px 84px",
            boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 10,
              color: "#6b6356",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Subject File / 07CE
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              color: "#2b2823",
              marginTop: 26,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Nic P. Jones
          </div>
          <div
            style={{ fontSize: 40, color: "#6b6356", marginTop: 6, display: "flex" }}
          >
            aka NicPWNs
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#2b2823",
              opacity: 0.85,
              marginTop: 46,
              display: "flex",
            }}
          >
            Cybersecurity Professional · Hacker · Builder
          </div>

          <div
            style={{
              position: "absolute",
              top: 68,
              right: 80,
              display: "flex",
              transform: "rotate(-8deg)",
              border: "5px solid #b4453a",
              color: "#b4453a",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              padding: "10px 22px",
              borderRadius: 8,
              opacity: 0.85,
            }}
          >
            Confidential
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
