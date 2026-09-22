"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveCompany(companyName: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { githubId: session.user.githubId },
    data: { userType: "Company", companyName },
  });

  redirect("/");
}

export async function saveJobSeeker(jobSeekerName: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { githubId: session.user.githubId },
    data: { userType: "JobSeeker", jobSeekerName },
  });

  redirect("/");
}
