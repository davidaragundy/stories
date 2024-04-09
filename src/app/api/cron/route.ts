import { db } from "@/drizzle";
import { lte } from "drizzle-orm";
import { posts, comments, messages } from "@/drizzle";
import type { NextRequest } from "next/server";
import { EXPIRATION_TIME } from "@/constants";
import { deleteObject, ref } from "firebase/storage";
import { postsRef } from "@/lib";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
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
