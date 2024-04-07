import { Post, User } from "@/types";
import { Query } from "@upstash/query";
import { Redis } from "@upstash/redis";

const q = new Query({
  redis: Redis.fromEnv({ automaticDeserialization: false }),
});

export const userCollection = q.createCollection<Omit<User, "id">>("user");

export const userByUsername = userCollection.createIndex({
  name: "user_by_username",
  terms: ["username"],
});

export const userByEmail = userCollection.createIndex({
  name: "user_by_email",
  terms: ["email"],
});

export const postCollection = q.createCollection<Omit<Post, "id">>("post");
