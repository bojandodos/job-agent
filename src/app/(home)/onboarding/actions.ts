"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveCompany(name: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  if (user.userType) throw new Error("Onboarding already completed");

  await prisma.user.update({
    where: { id: user.id },
    data: { userType: "Company", company: { create: { name } } },
  });

  redirect("/");
}

export async function saveJobSeeker(name: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  if (user.userType) throw new Error("Onboarding already completed");

  await prisma.user.update({
    where: { id: user.id },
    data: { userType: "JobSeeker", jobSeeker: { create: { name } } },
  });

  redirect("/");
}
