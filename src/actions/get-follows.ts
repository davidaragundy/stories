"use server";

import { db } from "@/drizzle";

export const getFollowsAction = async (
  username: string,
  target: "followers" | "following",
) => {
  if (!username) return [];

  if (target === "followers") {
    const followers = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (fields, { eq }) => eq(fields.username, username),
      with: {
        followers: {
          columns: {
            createdAt: true,
          },
          with: {
            followings: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!followers) throw new Error("User not found");

    const formattedFollowers = followers?.followers?.map((follower) => ({
      followCreatedAt: follower.createdAt,
      user: follower.followings,
    }));

    return formattedFollowers;
  }

  if (target === "following") {
    const followings = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (fields, { eq }) => eq(fields.username, username),
      with: {
        followings: {
          columns: {
            createdAt: true,
          },
          with: {
            followers: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!followings) throw new Error("User not found");

    const formattedFollowings = followings?.followings?.map((following) => ({
      followCreatedAt: following.createdAt,
      user: following.followers,
    }));

    return formattedFollowings;
  }

  return [];
};
