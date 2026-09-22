import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";

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
