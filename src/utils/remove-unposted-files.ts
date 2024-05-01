import { removeFiles } from "@/utils";

export const removeUnpostedFiles = async () => {
  const uploadedFileIds = JSON.parse(
    sessionStorage.getItem("uploadedFiles") || "[]",
  ) as string[];

  if (uploadedFileIds.length) {
    await removeFiles(uploadedFileIds);

    sessionStorage.removeItem("uploadedFiles");
  }
};
