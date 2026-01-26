import {
  JsonResume,
  JsonResumeCertificate,
  JsonResumeEducation,
  JsonResumeWork,
  JsonResumeAward,
  JsonResumePublication,
  JsonResumeProject,
  Certification,
  Education,
  WorkExperience,
  Award,
  Exploit,
  Project,
} from "./types";

const RESUME_GIST_ID = "5489290125ff3707caf8d51cb6cdc8a0";

export async function fetchResumeData(): Promise<JsonResume> {
  const response = await fetch(
    `https://api.github.com/gists/${RESUME_GIST_ID}`,
    {
      next: { revalidate: 3600 }, // ISR: refresh hourly
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch resume: ${response.status}`);
  }

  const gist = await response.json();
  return JSON.parse(gist.files["resume.json"].content);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function formatYear(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.getUTCFullYear().toString();
}

function formatPeriod(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Present";
  return `${start} - ${end}`;
}

export function transformCertifications(
  certificates: JsonResumeCertificate[]
): Certification[] {
  return certificates.map((cert) => {
    // Parse expiration from cert name if present (e.g., "Name (expires 2025)")
    let expirationDate: string | null = null;
    const expiresMatch = cert.name.match(/\(expires?\s*(\d{4})\)/i);
    if (expiresMatch) {
      expirationDate = expiresMatch[1];
    }

    // Clean name (remove expiration info if present)
    const cleanName = cert.name.replace(/\s*\(expires?\s*\d{4}\)/i, "").trim();

    return {
      name: cleanName,
      issueDate: formatYear(cert.date),
      expirationDate,
      verificationLink: cert.url,
      issuer: cert.issuer,
    };
  });
}

export function transformEducation(
  education: JsonResumeEducation[]
): Education[] {
  return education.map((edu) => ({
    institution: edu.institution,
    degree: `${edu.studyType} in ${edu.area}`,
    period: formatPeriod(edu.startDate, edu.endDate),
    gpa: edu.score || null,
    notes: edu.courses || [],
  }));
}

export function transformWorkExperience(
  work: JsonResumeWork[]
): WorkExperience[] {
  // Group work entries by company name
  const grouped = new Map<string, JsonResumeWork[]>();

  for (const entry of work) {
    const existing = grouped.get(entry.name) || [];
    existing.push(entry);
    grouped.set(entry.name, existing);
  }

  return Array.from(grouped.entries()).map(([company, entries]) => {
    // Sort entries by start date (most recent first)
    const sorted = entries.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    // Calculate overall period for the company
    const startDates = entries.map((e) => new Date(e.startDate).getTime());
    const endDates = entries.map((e) =>
      e.endDate ? new Date(e.endDate).getTime() : Date.now()
    );
    const earliestStart = new Date(Math.min(...startDates));
    const latestEnd = Math.max(...endDates);
    const hasCurrentRole = entries.some((e) => !e.endDate);

    const companyPeriod = `${formatDate(earliestStart.toISOString())} - ${
      hasCurrentRole ? "Present" : formatDate(new Date(latestEnd).toISOString())
    }`;

    // Get location from first entry that has one, or use a fallback
    const location = sorted.find((e) => e.location)?.location || "Remote";

    return {
      company,
      location,
      period: companyPeriod,
      positions: sorted.map((entry) => ({
        title: entry.position,
        period: formatPeriod(entry.startDate, entry.endDate),
        responsibilities: entry.highlights || (entry.summary ? [entry.summary] : []),
      })),
    };
  });
}

export function transformAwards(awards: JsonResumeAward[]): Award[] {
  return awards.map((award) => ({
    name: award.title,
    date: formatDate(award.date),
    description: award.summary,
  }));
}

// Map CVE IDs to their GitHub advisory report links
const CVE_REPORT_LINKS: Record<string, string> = {
  "CVE-2024-43404": "https://github.com/NicPWNs/MEGABOT/security/advisories/GHSA-vhxp-4hwq-w3p2",
};

export function transformCVEs(
  publications: JsonResumePublication[]
): Exploit[] {
  const cves: Exploit[] = [];

  // Add CVEs from publications
  for (const pub of publications) {
    if (
      pub.name.includes("CVE") ||
      pub.summary?.toLowerCase().includes("cve")
    ) {
      const cveMatch = pub.name.match(/CVE-\d{4}-\d+/);
      const cveId = cveMatch ? cveMatch[0] : null;

      cves.push({
        cve: cveId || pub.name,
        description: pub.summary || "",
        date: formatDate(pub.releaseDate),
        reportLink: cveId && CVE_REPORT_LINKS[cveId] ? CVE_REPORT_LINKS[cveId] : pub.url,
        cveLink: cveId ? `https://nvd.nist.gov/vuln/detail/${cveId}` : undefined,
      });
    }
  }

  return cves;
}

export function transformProjects(projects: JsonResumeProject[]): Project[] {
  return projects.map((project) => ({
    name: project.name,
    period: formatPeriod(project.startDate, project.endDate),
    description: project.description,
    skills: project.highlights || [],
    link: project.url,
  }));
}

export async function getAllResumeData() {
  const resume = await fetchResumeData();

  return {
    certifications: transformCertifications(resume.certificates),
    education: transformEducation(resume.education),
    workExperience: transformWorkExperience(resume.work),
    awards: transformAwards(resume.awards),
    cves: transformCVEs(resume.publications),
    projects: transformProjects(resume.projects),
  };
}
