import {
  comments,
  commentsMedia,
  commentsReactions,
  follows,
  posts,
  postsMedia,
  postsReactions,
  users,
} from "@/drizzle";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Follows = typeof follows.$inferSelect;

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

export type Reaction = "fire" | "poop" | "cap";
export type Reactions = {
  fire: number;
  poop: number;
  cap: number;
};

export type FullPost = Post & {
  user: Omit<
    User,
    "password" | "postsCount" | "followersCount" | "followingsCount"
  >;
  media: PostMedia[];
  reactions: { userId: string; type: string }[];
  isPending?: boolean;
};

export type FullComment = Comment & {
  user: Omit<
    User,
    "password" | "postsCount" | "followersCount" | "followingsCount"
  >;
  media: CommentMedia[];
  reactions: { userId: string; type: string }[];
  isPending?: boolean;
};

export type ProfileData = Omit<User, "password"> & {
  followers: Follows[];
  followings: Follows[];
};

export type FollowsData = {
  followCreatedAt: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
  };
};
