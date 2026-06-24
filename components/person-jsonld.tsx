import type { Resume } from "@/lib/resume"

// schema.org Person structured data — helps search engines recognize Nic as
// an entity (rich results / knowledge panel). Sourced from resume.json.
export function PersonJsonLd({ resume }: { resume: Resume }) {
  const b = resume.basics
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://nicpjones.com/#person",
    name: b.name,
    alternateName: "NicPWNs",
    url: b.url || "https://nicpjones.com",
    sameAs: (b.profiles ?? []).map((p) => p.url),
    alumniOf: resume.education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
    })),
    knowsAbout: (resume.skills ?? []).flatMap((s) => [
      s.name,
      ...(s.keywords ?? []),
    ]),
  }
  if (b.email) data.email = `mailto:${b.email}`
  if (resume.work[0]) {
    data.jobTitle = resume.work[0].position
    data.worksFor = { "@type": "Organization", name: resume.work[0].name }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
