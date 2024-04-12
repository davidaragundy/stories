import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

export const getHash = async (text: string) => {
  const data = new TextEncoder().encode(text);
  const hash = await sha256(data);
  const hexHash = encodeHex(hash);

  return hexHash;
};
