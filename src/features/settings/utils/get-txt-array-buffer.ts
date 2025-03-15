export const getTxtArrayBuffer = (arr: string[]): ArrayBuffer => {
  const txt = arr.join("\n");
  const buf = new ArrayBuffer(txt.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < txt.length; i++) {
    bufView[i] = txt.charCodeAt(i);
  }
  return buf;
};
