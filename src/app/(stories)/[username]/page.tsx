import { getUser } from "@/shared/actions/get-user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/shared/components/ui/typography";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return {
    title: `Stories | Profile (@${username})`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const { data, error } = await getUser({ username });

  if (error)
    throw new Error(
      "Something went wrong while fetching the user data or the user does not exist"
    );

  return (
    <main className="flex flex-col items-center gap-6">
      <Avatar className="size-42 sm:size-52">
        <AvatarImage src={data?.image ?? undefined} />
        <AvatarFallback className="text-6xl">
          {data?.name
            ?.split(" ")
            .map((name) => name.charAt(0))
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-1">
        <TypographyH1 className="text-center">{data?.name}</TypographyH1>
        <TypographyMuted className="text-center">
          @{data?.username}
        </TypographyMuted>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2 flex flex-col items-center justify-center rounded-xl border px-3 py-2">
          <TypographyP className="text-xl font-bold">
            {data?.followerCount}
          </TypographyP>
          <TypographyMuted>Followers</TypographyMuted>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center rounded-xl border px-3 py-2">
          <TypographyP className="text-xl font-bold">
            {data?.followingCount}
          </TypographyP>
          <TypographyMuted>Following</TypographyMuted>
        </div>
      </div>
    </main>
  );
}
