import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//TODO: create access rules for storage
// https://cloud.google.com/identity-platform/docs/multi-tenancy-quickstart?authuser=0&hl=es

const storage = getStorage(app);

export const postsRef = ref(storage, "posts");
export const commentsRef = ref(storage, "comments");