import { removeFiles } from "@/utils";
import { StorageReference } from "firebase/storage";

export const removeUnpostedFiles = async (targetRef: StorageReference) => {
  const uploadedFileIds = JSON.parse(
    sessionStorage.getItem("uploadedFiles") || "[]",
  ) as string[];

  if (uploadedFileIds.length) {
    await removeFiles(targetRef, uploadedFileIds);

    sessionStorage.removeItem("uploadedFiles");
  }
};
