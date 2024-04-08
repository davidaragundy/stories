import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const posts = sqliteTable("posts", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull().default(""),
  fireCount: integer("fire_count").notNull().default(0),
  poopCount: integer("poop_count").notNull().default(0),
  capCount: integer("cap_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const postsMedia = sqliteTable("posts_media", {
  id: text("id").notNull().primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  //TODO: some kind of enum or check constraint (image and video only)
  type: text("type").notNull(),
});

export const postsReactions = sqliteTable(
  "posts_reactions",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    //TODO: some kind of enum or check constraint (fire, poop and cap only)
    type: text("type").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.postId, table.userId, table.type],
    }),
  }),
);

export const comments = sqliteTable("comments", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  //TODO: can not reference itself?
  parentId: text("parent_id"),
  content: text("content").notNull().default(""),
  fireCount: integer("fire_count").notNull().default(0),
  poopCount: integer("poop_count").notNull().default(0),
  capCount: integer("cap_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const commentsMedia = sqliteTable("comments_media", {
  id: text("id").notNull().primaryKey(),
  commentId: text("comment_id")
    .notNull()
    .references(() => comments.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  //TODO: some kind of enum or check constraint (image and video only)
  type: text("type").notNull(),
});

export const commentsReactions = sqliteTable(
  "comments_reactions",
  {
    commentId: text("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    //TODO: some kind of enum or check constraint (fire, poop and cap only)
    type: text("type").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.commentId, table.userId, table.type],
    }),
  }),
);

//TODO: complete the rest of the messaging schema
export const messages = sqliteTable("messages", {
  id: text("id").notNull().primaryKey(),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  posts: many(posts),
  postsReactions: many(postsReactions),
  comments: many(comments),
  commentsReactions: many(commentsReactions),
  messages: many(messages),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  media: many(postsMedia),
  reactions: many(postsReactions),
  comments: many(comments),
}));

export const postsMediaRelations = relations(postsMedia, ({ one }) => ({
  post: one(posts, {
    fields: [postsMedia.postId],
    references: [posts.id],
  }),
}));

export const postsReactionsRelations = relations(postsReactions, ({ one }) => ({
  post: one(posts, {
    fields: [postsReactions.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postsReactions.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  media: many(commentsMedia),
  reactions: many(commentsReactions),
}));

export const commentsMediaRelations = relations(commentsMedia, ({ one }) => ({
  comment: one(comments, {
    fields: [commentsMedia.commentId],
    references: [comments.id],
  }),
}));

export const commentsReactionsRelations = relations(
  commentsReactions,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentsReactions.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentsReactions.userId],
      references: [users.id],
    }),
  }),
);
