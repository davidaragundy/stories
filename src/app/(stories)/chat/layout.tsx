import { getUsersToChatAction } from "@/actions/get-users-to-chat";
import { validateRequest } from "@/lib";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stories | Chat",
};

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const users = await getUsersToChatAction(user.id);

  return (
    <div className="flex h-full w-[80%] flex-1 items-start gap-4">
      <div className="flex w-[30%] flex-col gap-2 rounded-3xl bg-default-100 p-2">
        {users.length === 0 && (
          <p className="text-center text-2xl font-bold text-gray-400">
            No users to chat with, yet. You need mutual friends to chat with
            someone. 😢
          </p>
        )}

        {users.map((user) => (
          <Link
            href={`/chat/${user.id}`}
            key={user.id}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 hover:bg-default-200"
          >
            <Avatar src={user.avatarUrl} alt={user.username} />

            <div className="flex flex-col gap-0">
              <span className="">
                {user.firstName} {user.lastName}
              </span>

              <span className="text-sm text-gray-400">{user.username}</span>
            </div>
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
