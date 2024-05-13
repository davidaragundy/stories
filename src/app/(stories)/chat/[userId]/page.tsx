import { db } from "@/drizzle";
import { Avatar } from "@nextui-org/avatar";
import { notFound } from "next/navigation";
import { CreateMessage, Messages } from "@/components";

interface Props {
  params: {
    userId: string;
  };
}

export default async function UserChat({ params: { userId } }: Props) {
  const user = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, userId),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main className="flex h-full w-[70%] flex-1 flex-col rounded-3xl bg-default-100 p-4">
      <div className="mb-4 flex w-full flex-initial items-center gap-4">
        <Avatar src={user.avatarUrl} alt={user.username} />

        <span className="text-xl font-bold">
          {user.firstName} {user.lastName}
        </span>
      </div>

      <Messages userId={user.id} />

      <CreateMessage chatUser={user} />
    </main>
  );
}
