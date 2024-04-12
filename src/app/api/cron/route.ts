import { db, invalidResetPasswordTokens } from "@/drizzle";
import { eq, lte, or } from "drizzle-orm";
import { posts, comments, messages } from "@/drizzle";
import type { NextRequest } from "next/server";
import { EXPIRATION_TIME } from "@/constants";
import { deleteObject, ref } from "firebase/storage";
import { postsRef } from "@/lib";
import { isValidToken } from "@/utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let usedResetPasswordTokens: { token: string }[];

  try {
    usedResetPasswordTokens =
      await db.query.invalidResetPasswordTokens.findMany();
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "Could not fetch invalid tokens",
    });
  }

  const tokensToDelete = [];

  for (const { token } of usedResetPasswordTokens) {
    const isValid = await isValidToken(token);

    if (!isValid) {
      tokensToDelete.push(eq(invalidResetPasswordTokens.token, token));
    }
  }

  try {
    await db.delete(invalidResetPasswordTokens).where(or(...tokensToDelete));
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "Could not delete invalid tokens",
    });
  }

  try {
    const [postsMediaToDelete, commentsMediaToDelete] = await Promise.all([
      db.query.posts.findMany({
        columns: {
          id: false,
          userId: false,
          content: false,
          fireCount: false,
          poopCount: false,
          capCount: false,
          createdAt: false,
        },
        where: (fields, { lte }) =>
          lte(fields.createdAt, Date.now() - EXPIRATION_TIME),
        with: {
          media: {
            columns: {
              id: true,
            },
          },
        },
      }),
      db.query.comments.findMany({
        columns: {
          id: false,
          userId: false,
          postId: false,
          parentId: false,
          content: false,
          fireCount: false,
          poopCount: false,
          capCount: false,
          createdAt: false,
        },
        where: (fields, { lte }) =>
          lte(fields.createdAt, Date.now() - EXPIRATION_TIME),
        with: {
          media: {
            columns: {
              id: true,
            },
          },
        },
      }),
      ,
    ]);

    const mediaToDeleteRefs = postsMediaToDelete
      .flatMap((m) => m.media)
      .map((media) => ref(postsRef, media.id))
      .concat(
        commentsMediaToDelete
          .flatMap((m) => m.media)
          .map((media) => ref(postsRef, media.id)),
      );

    await Promise.all(mediaToDeleteRefs.map((mr) => deleteObject(mr)));
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "Could not delete media files",
    });
  }

  try {
    await Promise.all([
      db
        .delete(posts)
        .where(lte(posts.createdAt, Date.now() - EXPIRATION_TIME)),
      db
        .delete(comments)
        .where(lte(comments.createdAt, Date.now() - EXPIRATION_TIME)),
      db
        .delete(messages)
        .where(lte(messages.createdAt, Date.now() - EXPIRATION_TIME)),
    ]);
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "Could not delete expired data",
    });
  }

  return Response.json({
    ok: true,
    message: "Expired data deleted successfully",
  });
}
