import { postsRef } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";

export const removeFiles = async (fileIds: string[]) => {
  const deletePromises = fileIds.map((id) => {
    const mediaRef = ref(postsRef, id);

    return deleteObject(mediaRef);
  });

  await Promise.all(deletePromises);
};
