# Setup guide: Next.js + NextAuth (GitHub) + Prisma + Neon

These are the steps used to build this project, in order, so they can be repeated from scratch.
Versions used: Next.js 16.3.5, next-auth 4.24.15, Prisma 7.10.0, Node 24.

No secrets are written in this file. Real values live in `.env` and `.env.local`, which git ignores.

---

## 1. Create the Next.js app

Run inside the `websites` folder:

```
npx create-next-app@latest my-app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --yes
cd my-app
npm run dev
```

The site runs at http://localhost:3000.

## 2. Homepage

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <p>Hello world</p>;
}
```

## 3. Install NextAuth

```
npm install next-auth
```

## 4. Create a GitHub OAuth app

1. Go to https://github.com/settings/developers and choose **New OAuth App**.
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**.

## 5. Environment variables for NextAuth

Create `.env.local` in `my-app`:

```
GITHUB_ID=your-client-id
GITHUB_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a-long-random-string
```

One way to generate the random string: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## 6. NextAuth route

`src/app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

The options themselves live in `src/lib/auth.ts` (final version in step 13).

## 7. Sign in / sign out buttons

`src/app/signup/auth-buttons.tsx`:

```tsx
"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return <button onClick={() => signIn("github")}>Sign in with GitHub</button>;
}

export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
```

## 8. Sign up page

`src/app/signup/page.tsx`:

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton, SignOutButton } from "./auth-buttons";

export default async function SignUp() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <SignInButton />;
  }

  return (
    <>
      <p>Signed in as {session.user?.name}</p>
      <SignOutButton />
    </>
  );
}
```

The page checks the session on the server. Signed out: it shows the sign-in button. Signed in: it shows the name and the sign-out button.

## 9. Create the Neon database

1. Sign up at https://neon.tech and create a project.
2. Click **Connect** and copy the connection string (`postgresql://...neon.tech/neondb?sslmode=require`).
3. The string contains the password. Never commit it or paste it into chats.

## 10. Install Prisma

```
npm install prisma@7.10.0 --save-dev
npm install @prisma/client@7.10.0 @prisma/adapter-neon@7.10.0 dotenv
npx prisma init
```

- The versions are pinned because plain `npm install prisma` installed an 8.0 release candidate that did not match the stable 7.10.0 client.
- `prisma init` creates `prisma/schema.prisma`, `prisma7.config.ts` and `.env`. Do not rename `prisma7.config.ts`; it is the name Prisma 7.10 looks for.

## 11. Database connection string

Open `.env` (not `.env.local`) and replace the placeholder line:

```
DATABASE_URL="your-neon-connection-string"
```

- The Prisma command line reads only `.env`. Next.js reads both `.env` and `.env.local`.
- Keep a single `DATABASE_URL` line, and save the file.
- If a Prisma command mentions `localhost`, the placeholder is still there.

## 12. User table

Add to the bottom of `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  githubId  String   @unique
  name      String?
  email     String?
  image     String?
  createdAt DateTime @default(now())
}
```

Then create the table and the typed client:

```
npx prisma migrate dev --name init
npx prisma generate
```

- `migrate dev` creates `prisma/migrations/` and the `User` table in Neon.
- `generate` writes the client into `src/generated/prisma` (ignored by git).
- Prisma Studio also shows a `_prisma_migrations` table. It is Prisma's own record of applied migrations. Leave it alone.

## 13. Save the user on sign-in

`src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

`src/lib/auth.ts`:

```ts
import type { NextAuthOptions } from "next-auth";
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
  },
};
```

- `signIn` runs on every login.
- `upsert` creates the row on the first login and updates the same row afterwards, so there are no duplicates.
- `email` can be empty when the GitHub email is private.

## 14. Test

1. Restart `npm run dev` so it picks up `DATABASE_URL`.
2. Open http://localhost:3000/signup and sign in with GitHub.
3. Run `npx prisma studio` and check the `User` table for your row.

---

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site locally |
| `npm run build` | Production build, also checks TypeScript |
| `npx prisma studio` | Browse the database in the browser |
| `npx prisma migrate dev --name <name>` | Apply schema changes to the database |
| `npx prisma generate` | Regenerate the typed client after schema changes |
| `npx prisma migrate status` | Check whether the database matches the migrations |
| `npx prisma validate` | Check the schema file for mistakes |

## When you change the schema later

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name describe-the-change`.
3. Run `npx prisma generate`.
4. Restart `npm run dev`.

## Before deploying

- Add all five variables (`GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL`) in the host's settings.
- Set `NEXTAUTH_URL` to the real site address.
- Add the real callback URL to the GitHub OAuth app: `https://your-domain/api/auth/callback/github`.
- Run `npx prisma migrate deploy` against the production database, and `npx prisma generate` as part of the build.
