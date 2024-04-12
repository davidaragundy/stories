export const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
