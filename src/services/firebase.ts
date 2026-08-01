import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup,
  type Auth,
  type UserCredential
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export interface OAuthUserResult {
  name: string;
  email: string;
  photoURL?: string;
  rollNo: string;
  provider: 'google' | 'github';
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<OAuthUserResult> {
  if (!isFirebaseConfigured || !auth) {
    // Demo fallback mode when Firebase environment variables are not yet set up
    await new Promise(res => setTimeout(res, 800));
    return {
      name: "Alex Morgan (Google)",
      email: "alex.morgan@gmail.com",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rollNo: "23IT1042",
      provider: 'google'
    };
  }

  const result: UserCredential = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Extract roll number or generate formatted ID
  const derivedRoll = `23IT${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name: user.displayName || 'Google Student User',
    email: user.email || 'student@gits.edu',
    photoURL: user.photoURL || undefined,
    rollNo: derivedRoll,
    provider: 'google'
  };
}

/**
 * Sign in with GitHub Popup
 */
export async function signInWithGithub(): Promise<OAuthUserResult> {
  if (!isFirebaseConfigured || !auth) {
    // Demo fallback mode when Firebase environment variables are not yet set up
    await new Promise(res => setTimeout(res, 800));
    return {
      name: "Alex Morgan (GitHub)",
      email: "alex.morgan@github.com",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rollNo: "23IT1088",
      provider: 'github'
    };
  }

  const result: UserCredential = await signInWithPopup(auth, githubProvider);
  const user = result.user;

  const derivedRoll = `23IT${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name: user.displayName || user.email?.split('@')[0] || 'GitHub Student User',
    email: user.email || 'student@github.com',
    photoURL: user.photoURL || undefined,
    rollNo: derivedRoll,
    provider: 'github'
  };
}
