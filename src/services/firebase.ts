import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export function cleanViteEnv(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  const quote = trimmed[0];

  if (
    trimmed.length >= 2 &&
    (quote === "\"" || quote === "'") &&
    trimmed[trimmed.length - 1] === quote
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

const firebaseConfig = {
  apiKey: cleanViteEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanViteEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanViteEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  appId: cleanViteEnv(import.meta.env.VITE_FIREBASE_APP_ID),
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.length > 0,
);

const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
