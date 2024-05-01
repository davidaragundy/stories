export const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export const BASE_URL =
  process.env.VERCEL_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : "http://localhost:3000";
