import type { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import type { LearningState } from "../types";
import { normalizeLearningState } from "../store/learningStore";
import { firebaseAuth, firestore } from "./firebase";

const DEVICE_ID_KEY = "nihongo-studio-device-id";
const USER_STATES_COLLECTION = "userStates";
const CLOUD_SCHEMA_VERSION = 1;

export interface CloudLearningStateDocument {
  schemaVersion: 1;
  userId: string;
  updatedAt: string;
  deviceId: string;
  learningState: LearningState;
}

export function getDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;

    const next =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    return "device-unavailable";
  }
}

function requireFirebase() {
  if (!firebaseAuth || !firestore) {
    throw new Error("Firebase 尚未配置。请先填写 Vite 环境变量。");
  }

  return { auth: firebaseAuth, db: firestore };
}

function userStateRef(userId: string) {
  const { db } = requireFirebase();
  return doc(db, USER_STATES_COLLECTION, userId);
}

function normalizeCloudDocument(
  value: unknown,
): CloudLearningStateDocument | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const learningState = normalizeLearningState(record.learningState);

  if (
    record.schemaVersion !== CLOUD_SCHEMA_VERSION ||
    typeof record.userId !== "string" ||
    typeof record.updatedAt !== "string" ||
    typeof record.deviceId !== "string" ||
    !learningState
  ) {
    return null;
  }

  return {
    schemaVersion: CLOUD_SCHEMA_VERSION,
    userId: record.userId,
    updatedAt: record.updatedAt,
    deviceId: record.deviceId,
    learningState,
  };
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  const { auth } = requireFirebase();
  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail(email: string, password: string) {
  const { auth } = requireFirebase();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string) {
  const { auth } = requireFirebase();
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const { auth } = requireFirebase();
  await signOut(auth);
}

export async function fetchCloudLearningState(userId: string) {
  const snapshot = await getDoc(userStateRef(userId));
  if (!snapshot.exists()) return null;
  return normalizeCloudDocument(snapshot.data());
}

export async function uploadCloudLearningState(
  userId: string,
  learningState: LearningState,
  deviceId: string,
) {
  const updatedAt = new Date().toISOString();
  const payload: CloudLearningStateDocument = {
    schemaVersion: CLOUD_SCHEMA_VERSION,
    userId,
    updatedAt,
    deviceId,
    learningState,
  };

  await setDoc(userStateRef(userId), payload);
  return payload;
}

export async function deleteCloudLearningState(userId: string) {
  await deleteDoc(userStateRef(userId));
}

export function getFriendlyFirebaseError(error: unknown) {
  const code = (error as FirebaseError | undefined)?.code;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "邮箱或密码不正确，请检查后再试。";
    case "auth/email-already-in-use":
      return "这个邮箱已经注册，可以直接登录。";
    case "auth/weak-password":
      return "密码强度太弱，请至少使用 6 位字符。";
    case "auth/invalid-email":
      return "邮箱格式看起来不正确。";
    case "permission-denied":
    case "firestore/permission-denied":
      return "Firestore 权限被拒绝。请检查 Firebase Security Rules 是否已正确部署。";
    case "unavailable":
    case "firestore/unavailable":
      return "当前无法连接 Firestore，本地学习记录没有改变。";
    default:
      return error instanceof Error
        ? error.message
        : "云同步操作失败，本地学习记录没有改变。";
  }
}
