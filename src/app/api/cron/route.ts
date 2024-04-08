import { db } from "@/drizzle";
import { lte } from "drizzle-orm";
import { posts, comments, messages } from "@/drizzle";
import type { NextRequest } from "next/server";
import { EXPIRATION_TIME } from "@/constants";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    //TODO: use a transaction
    //TODO: delete media from cloudinary for posts and comments
    const [postsResult, postsMediaResult, postsReactionsResult] =
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

    console.log({
      postsResult,
      postsMediaResult,
      postsReactionsResult,
    });
  } catch (error) {
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
