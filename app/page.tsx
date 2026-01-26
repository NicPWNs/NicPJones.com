import { getAllResumeData } from "@/lib/resume-data";
import HomeClient from "./home-client";

export default async function Page() {
  const {
    certifications,
    education,
    workExperience,
    awards,
    cves,
    projects,
  } = await getAllResumeData();

  return (
    <HomeClient
      certifications={certifications}
      education={education}
      workExperience={workExperience}
      awards={awards}
      cves={cves}
      projects={projects}
    />
  );
}
