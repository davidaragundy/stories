import { db, invalidResetPasswordTokens } from "@/drizzle";
import { eq, lte, or } from "drizzle-orm";
import { posts } from "@/drizzle";
import type { NextRequest } from "next/server";
import { EXPIRATION_TIME } from "@/constants";
import { deleteObject, ref } from "firebase/storage";
import { commentsRef, postsRef } from "@/lib";
import { getMessagesRefToDelete, isValidToken } from "@/utils";
import { remove } from "firebase/database";

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

  //TODO: refactor this 💀💀💀
  const [messagesRefToDelete, messagesMediaRefToDelete] =
    await getMessagesRefToDelete();

  try {
    //TODO: delete messages media files
    const [postsMediaToDelete, commentsMediaToDelete] = await Promise.all([
      db.query.postsMedia.findMany({
        columns: {
          id: true,
        },
        where: (fields, { lte }) =>
          lte(fields.postCreatedAt, Date.now() - EXPIRATION_TIME),
      }),
      db.query.commentsMedia.findMany({
        columns: {
          id: true,
        },
        where: (fields, { lte }) =>
          lte(fields.postCreatedAt, Date.now() - EXPIRATION_TIME),
      }),
    ]);

    const mediaToDeleteRefs = postsMediaToDelete
      .map((media) => ref(postsRef, media.id))
      .concat(commentsMediaToDelete.map((media) => ref(commentsRef, media.id)))
      .concat(messagesMediaRefToDelete);

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
      ...messagesRefToDelete.map((mr) => remove(mr)),
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
