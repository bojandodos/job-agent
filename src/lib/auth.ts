import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "github") return false;

      const data = { name: user.name, email: user.email, image: user.image };

      await prisma.user.upsert({
        where: { githubId: account.providerAccountId },
        update: data,
        create: { githubId: account.providerAccountId, ...data },
      });

      return true;
    },
    async jwt({ token, account }) {
      if (account) token.githubId = account.providerAccountId;
      return token;
    },
    async session({ session, token }) {
      session.user.githubId = token.githubId;
      return session;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { githubId: session.user.githubId },
    include: { company: true, jobSeeker: true },
  });
}
