import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nic Jones",
  description:
    "Cybersecurity professional with experience in security engineering, cloud architecture, and penetration testing. Information Security Manager at T-Rex Solutions.",
  keywords: [
    "cybersecurity",
    "information security",
    "security engineer",
    "penetration testing",
    "cloud security",
    "AWS",
    "OSCP",
    "CISSP",
  ],
  authors: [{ name: "Nicholas Jones", url: "https://nicpjones.com" }],
  creator: "Nicholas Jones",
  metadataBase: new URL("https://nicpjones.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nicpjones.com",
    title: "Nic Jones",
    description:
      "Cybersecurity professional with experience in security engineering, cloud architecture, and penetration testing.",
    siteName: "NicPJones.com",
  },
  twitter: {
    card: "summary",
    title: "Nic Jones",
    description:
      "Cybersecurity professional with experience in security engineering, cloud architecture, and penetration testing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
