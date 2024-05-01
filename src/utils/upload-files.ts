import { postsRef } from "@/lib/firebase";
import { UploadedFilesResponse } from "@/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { generateId } from "lucia";

export const uploadFiles = async (
  files: FileList,
): Promise<UploadedFilesResponse[]> => {
  try {
    const uploadPromises = Array.from(files).map((file) => {
      const mediaId = `${generateId(15)}.${file.type.split("/")[1]}`;

      const mediaRef = ref(postsRef, mediaId);

      return uploadBytes(mediaRef, file);
    });

    const uploadsResult = await Promise.all(uploadPromises);

    const uploadedFiles: UploadedFilesResponse[] = [];

    for (let index = 0; index < uploadsResult.length; index++) {
      uploadedFiles.push({
        id: uploadsResult[index].metadata.name,
        type: (files[index].type.includes("image") ? "image" : "video") as
          | "image"
          | "video",
        url: await getDownloadURL(uploadsResult[index].ref),
      });
    }

    return uploadedFiles;
  } catch (error) {
    //TODO: Add a toast notification
    console.error(error);

    return [];
  }
};
