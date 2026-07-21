import type { Metadata, Viewport } from 'next'
import {
  Caveat,
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Permanent_Marker,
} from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import { ConsoleEgg } from '@/components/console-egg'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre',
  subsets: ['latin'],
  weight: ['400', '700'],
})
const permanentMarker = Permanent_Marker({
  variable: '--font-permanent-marker',
  subsets: ['latin'],
  weight: '400',
})
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nicpjones.com'),
  alternates: {
    types: { 'application/rss+xml': '/notes/feed.xml' },
  },
  title: 'NicPJones / NicPWNs',
  description:
    'Nic P. Jones (NicPWNs) — cybersecurity professional, hacker, and builder. Work, projects, CVEs, and awards.',
  openGraph: {
    type: 'website',
    url: 'https://nicpjones.com',
    siteName: 'NicPJones',
    title: 'NicPJones / NicPWNs',
    description:
      'Nic P. Jones (NicPWNs) — cybersecurity professional, hacker, and builder. Work, projects, CVEs, and awards.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NicPJones / NicPWNs',
    description:
      'Nic P. Jones (NicPWNs) — cybersecurity professional, hacker, and builder.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} ${permanentMarker.variable} ${caveat.variable} bg-noir`}
    >
      <body className="font-sans antialiased caret-transparent">
        <ConsoleEgg />
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "28cad44fb813469db03865215a6489f6"}'
        />
      </body>
    </html>
  )
}
