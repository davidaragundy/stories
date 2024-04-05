import { User } from "@/types";
import { Document } from "@upstash/query";

export const getUser = (userDocument: Document<Omit<User, "id">>): User => ({
  ...userDocument.data,
  id: userDocument.id,
});
