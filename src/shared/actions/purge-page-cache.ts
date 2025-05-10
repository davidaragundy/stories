"use server";

import { revalidatePath } from "next/cache";

export const purgePageCache = async (path: string) => revalidatePath(path);
