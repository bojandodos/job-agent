import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function Onboarding() {
  const user = await getCurrentUser();

  if (!user) redirect("/signup");
  if (user.userType) redirect("/");

  return <OnboardingForm />;
}
