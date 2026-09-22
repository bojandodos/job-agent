import { getCurrentUser } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/components/auth/auth-buttons";

export default async function SignUp() {
  const user = await getCurrentUser();

  if (!user) {
    return <SignInButton />;
  }

  return (
    <>
      <p>Signed in as {user.name}</p>
      <SignOutButton />
    </>
  );
}
