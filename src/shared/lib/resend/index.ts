import { loadEnvConfig } from "@next/env";
import { Resend } from "resend";

loadEnvConfig(process.cwd());

export const resend = new Resend(process.env.RESEND_API_KEY as string);
