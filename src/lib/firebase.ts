import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//TODO!: create access rules for storage
// https://cloud.google.com/identity-platform/docs/multi-tenancy-quickstart?authuser=0&hl=es

export const storage = getStorage(app);

export const postsRef = ref(storage, "posts");
export const commentsRef = ref(storage, "comments");

export const getMessagesRef = ({
  authUserId,
  userId,
}: {
  authUserId: string;
  userId: string;
}) => ref(storage, "messages/" + [authUserId, userId].sort().join("-"));
