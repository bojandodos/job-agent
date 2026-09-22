"use client";

import { useState } from "react";
import { GeneralButton } from "@/components/general/general-button";
import { CompanyForm } from "@/components/onboarding/company-form";
import { JobSeekerForm } from "@/components/onboarding/job-seeker-form";

type Role = "company" | "job seeker";

export function OnboardingForm() {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <>
      <h1>Welcome to Onboarding</h1>
      {!role && (
        <>
          <GeneralButton onClick={() => setRole("company")}>
            Company
          </GeneralButton>
          <GeneralButton onClick={() => setRole("job seeker")}>
            Job seeker
          </GeneralButton>
        </>
      )}
      {role === "company" && <CompanyForm />}
      {role === "job seeker" && <JobSeekerForm />}
    </>
  );
}
