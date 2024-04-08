import {
  comments,
  commentsMedia,
  commentsReactions,
  posts,
  postsMedia,
  postsReactions,
  users,
} from "@/drizzle";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type PostMedia = typeof postsMedia.$inferSelect;
export type NewPostMedia = typeof postsMedia.$inferInsert;

export type PostReactions = typeof postsReactions.$inferSelect;
export type NewPostReactions = typeof postsReactions.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type CommentMedia = typeof commentsMedia.$inferSelect;
export type NewCommentMedia = typeof commentsMedia.$inferInsert;

export type CommentReactions = typeof commentsReactions.$inferSelect;
export type NewCommentReactions = typeof commentsReactions.$inferInsert;
