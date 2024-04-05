import { z } from "zod";

export const isEmail = (email: string) => {
  return z.string().email().safeParse(email).success;
};
