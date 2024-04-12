import { decodeHex } from "oslo/encoding";
import { validateJWT } from "oslo/jwt";

export const isValidToken = async (token: string): Promise<boolean> => {
  const secret = decodeHex(process.env.FORGOT_PASSWORD_SECRET!);

  try {
    await validateJWT("HS256", secret, token);

    return true;
  } catch (error) {
    return false;
  }
};
