import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const app = initializeApp();

export const firebasAuth = getAuth(app);

export const firestore = getFirestore(app);

export const storage = getStorage(app);
