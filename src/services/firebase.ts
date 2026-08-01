import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type Auth,
  type UserCredential
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  type Firestore
} from 'firebase/firestore';
import type { GalleryPhoto } from '../types';

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
export let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export interface OAuthUserResult {
  name: string;
  email: string;
  photoURL?: string;
  rollNo: string;
  provider: 'google' | 'github' | 'email';
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<OAuthUserResult> {
  if (!isFirebaseConfigured || !auth) {
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

/**
 * Sign in / Register with Email and Password
 */
export async function signInWithEmailPassword(email: string, pass: string): Promise<OAuthUserResult> {
  if (!isFirebaseConfigured || !auth) {
    await new Promise(res => setTimeout(res, 600));
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      name: nameFromEmail || "Student User",
      email: email,
      rollNo: `23IT${Math.floor(1000 + Math.random() * 9000)}`,
      provider: 'email'
    };
  }

  let userCredential: UserCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, pass);
  } catch (err: any) {
    if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
      // Create user if not registered yet
      userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      throw err;
    }
  }

  const user = userCredential.user;
  const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const derivedRoll = `23IT${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name: user.displayName || nameFromEmail || 'Student User',
    email: user.email || email,
    rollNo: derivedRoll,
    provider: 'email'
  };
}

/**
 * Cloud Firestore Real-time Sync for Gallery Photos
 */
export async function savePhotoToFirestore(photo: GalleryPhoto): Promise<void> {
  if (!db) {
    console.warn("Firestore Database is not initialized. Verify VITE_FIREBASE_PROJECT_ID.");
    return;
  }
  try {
    const photoRef = doc(db, 'gallery_photos', photo.id);
    await setDoc(photoRef, photo);
    console.log("Synced photo to Cloud Firestore:", photo.id);
  } catch (err: any) {
    console.error('Failed to sync photo to Cloud Firestore:', err);
    alert(`Firestore Warning: Could not upload photo to Cloud. Error: ${err?.message || err}`);
  }
}

export async function deletePhotoFromFirestore(photoId: string): Promise<void> {
  if (!db) return;
  try {
    const photoRef = doc(db, 'gallery_photos', photoId);
    await deleteDoc(photoRef);
  } catch (err) {
    console.error('Failed to delete photo from Firestore:', err);
  }
}

export function subscribeToGalleryPhotos(onUpdate: (photos: GalleryPhoto[]) => void): () => void {
  if (!db) {
    console.warn("Firestore database is null. Check VITE_FIREBASE_PROJECT_ID in environment variables.");
    return () => {};
  }
  try {
    const galleryCol = collection(db, 'gallery_photos');
    return onSnapshot(galleryCol, (snapshot) => {
      const photos: GalleryPhoto[] = [];
      snapshot.forEach((docSnap) => {
        photos.push(docSnap.data() as GalleryPhoto);
      });
      // Sort by newest first
      photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (photos.length > 0) {
        try {
          localStorage.setItem('gits_club_gallery_v2', JSON.stringify(photos));
        } catch (e) {}
        onUpdate(photos);
      }
    }, (error) => {
      console.warn('Firestore subscription error:', error);
    });
  } catch (err) {
    console.error('Error establishing Firestore listener:', err);
    return () => {};
  }
}
