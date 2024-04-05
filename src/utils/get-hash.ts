export const getHash = async (text: string) => {
  const textUint8 = new TextEncoder().encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", textUint8);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};
