import { StorageReference, deleteObject, ref } from "firebase/storage";

export const removeFiles = async (
  targetRef: StorageReference,
  fileIds: string[],
) => {
  const deletePromises = fileIds.map((id) => {
    const mediaRef = ref(targetRef, id);

    return deleteObject(mediaRef);
  });

  await Promise.all(deletePromises);
};
