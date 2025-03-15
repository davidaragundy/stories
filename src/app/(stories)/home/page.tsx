import type { Metadata } from "next";
import { Button, H1 } from "@/shared/components";
import { auth } from "@/shared/lib/auth/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default function HomePage() {
  return (
    <>
      <H1>Home</H1>
      <form
        action={async () => {
          "use server";

          const { success } = await auth.api.signOut({
            headers: await headers(),
          });

          (await cookies()).delete("better-auth.session_token");

          console.log({ success });

          redirect("/sign-in");
        }}
      >
        <Button>Sign out</Button>
      </form>
    </>
  );
}
