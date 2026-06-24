import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NicPJones / NicPWNs",
    short_name: "NicPJones",
    description:
      "Nic P. Jones (NicPWNs) — cybersecurity professional, hacker, and builder.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a09",
    theme_color: "#0b0a09",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
