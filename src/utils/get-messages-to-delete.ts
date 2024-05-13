import { EXPIRATION_TIME } from "@/constants";
import { storage } from "@/lib/firebase";
import { Message } from "@/types";
import {
  DatabaseReference,
  get,
  getDatabase,
  ref as dbRef,
} from "firebase/database";
import { StorageReference, ref as storageRef } from "firebase/storage";

export const getMessagesRefToDelete = async () => {
  const database = getDatabase();

  const messagesRefToDelete: DatabaseReference[] = [];
  const messagesMediaRefToDelete: StorageReference[] = [];

  const messagesRef = dbRef(database, "/messages");

  let chats: [string, any][] = [];

  await get(messagesRef).then((snapshot) => {
    if (snapshot.exists()) {
      chats = Object.entries(snapshot.val());
    }
  });

  for (const [chatId, messagesObj] of chats) {
    const messages = Object.entries(messagesObj) as [string, Message][];

    for (const [messageId, message] of messages) {
      if (message.createdAt <= Date.now() - EXPIRATION_TIME) {
        messagesRefToDelete.push(
          dbRef(database, `messages/${chatId}/${messageId}`),
        );

        if (message.media) {
          for (const media of message.media) {
            messagesMediaRefToDelete.push(
              storageRef(storage, `messages/${chatId}/${media.id}`),
            );
          }
        }
      }
    }
  }

  return [messagesRefToDelete, messagesMediaRefToDelete] as const;
};
