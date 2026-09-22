"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { GeneralButton } from "@/components/general/general-button";

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <GeneralButton
      loading={loading}
      onClick={() => {
        setLoading(true);
        signIn("github", { callbackUrl: "/onboarding" });
      }}
    >
      Sign in with GitHub
    </GeneralButton>
  );
}

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <GeneralButton
      variant="outline"
      loading={loading}
      onClick={() => {
        setLoading(true);
        signOut();
      }}
    >
      Sign out
    </GeneralButton>
  );
}
