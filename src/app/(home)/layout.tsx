import { getCurrentUser } from "@/lib/auth";
import { Nav } from "@/components/nav";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Nav isLoggedIn={!!user} userType={user?.userType ?? null} />
      {children}
    </>
  );
}
