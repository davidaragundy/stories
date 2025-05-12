import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/shared/lib/better-auth/server";

export const { POST, GET } = toNextJsHandler(auth);
