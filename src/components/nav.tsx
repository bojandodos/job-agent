"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/auth-buttons";
import { GeneralButton } from "@/components/general/general-button";

export function Nav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex w-full max-w-[800px] items-center justify-between">
      <div>
        {pathname === "/" && (
          <Image src="/next.svg" alt="Next.js logo" width={100} height={20} />
        )}
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span>Post job</span>
          <SignOutButton />
        </div>
      ) : (
        <GeneralButton render={<Link href="/signup" />} nativeButton={false}>
          Sign in
        </GeneralButton>
      )}
    </nav>
  );
}
