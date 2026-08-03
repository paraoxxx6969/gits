import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  type Auth,
  type UserCredential
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  type Firestore
} from 'firebase/firestore';
import type { GalleryPhoto, ClubEvent, EventMemory, Announcement, CrewMember } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyDTzVypF6Tv7e3PrDIkbqANKDjlg9gS0EI",
  authDomain: "gits-club-portal.firebaseapp.com",
  projectId: "gits-club-portal",
  storageBucket: "gits-club-portal.firebasestorage.app",
  messagingSenderId: "615413766127",
  appId: "1:615413766127:web:458b7df166957262e7081a",
  measurementId: "G-LHKT9ELZ82"
};

export const isFirebaseConfigured = true;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
export let db: Firestore | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized. Project:', firebaseConfig.projectId, '| DB:', !!db, '| Auth:', !!auth);
} catch (err) {
  console.error('❌ Firebase initialization FAILED:', err);
}

// ──────────────────────────────────────────────────────────
// REAL diagnostic: writes a test doc to Firestore, reads it back,
// then deletes it.  Returns a human-readable status string.
// ──────────────────────────────────────────────────────────
export async function testFirestoreConnection(): Promise<string> {
  const results: string[] = [];
  results.push(`Project ID: ${firebaseConfig.projectId}`);
  results.push(`Firestore DB object: ${db ? 'EXISTS' : 'NULL'}`);
  results.push(`Auth object: ${auth ? 'EXISTS' : 'NULL'}`);

  if (!db) {
    results.push('❌ FAILED: db is null - Firestore never initialized');
    return results.join('\n');
  }

  // Step 1: Anonymous auth
  try {
    if (auth && !auth.currentUser) {
      await signInAnonymously(auth);
    }
    results.push(`✅ Auth: Signed in as ${auth?.currentUser?.uid || 'unknown'}`);
  } catch (authErr: any) {
    results.push(`❌ Auth FAILED: ${authErr?.code || authErr?.message || authErr}`);
    return results.join('\n');
  }

  // Step 2: Write a test document
  const testId = '_firestore_test_' + Date.now();
  try {
    const testRef = doc(db, '_diagnostics', testId);
    await setDoc(testRef, { test: true, timestamp: new Date().toISOString() });
    results.push('✅ WRITE: Successfully wrote test document to Firestore!');
  } catch (writeErr: any) {
    results.push(`❌ WRITE FAILED: ${writeErr?.code || ''} ${writeErr?.message || writeErr}`);
    return results.join('\n');
  }

  // Step 3: Read it back
  try {
    const testRef = doc(db, '_diagnostics', testId);
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      results.push('✅ READ: Successfully read test document back!');
    } else {
      results.push('⚠️ READ: Document was written but could not be read back.');
    }
  } catch (readErr: any) {
    results.push(`❌ READ FAILED: ${readErr?.code || ''} ${readErr?.message || readErr}`);
  }

  // Step 4: Delete the test document
  try {
    const testRef = doc(db, '_diagnostics', testId);
    await deleteDoc(testRef);
    results.push('✅ DELETE: Cleaned up test document.');
  } catch (delErr: any) {
    results.push(`⚠️ DELETE: ${delErr?.message || delErr}`);
  }

  results.push('\n🎉 Firestore is FULLY WORKING if all steps show ✅');
  return results.join('\n');
}

// Export simple diagnostic (non-async)
export function getFirebaseDiagnostics(): string {
  const lines = [
    `Firebase Configured: ${isFirebaseConfigured}`,
    `Project ID: ${firebaseConfig.projectId || '(empty)'}`,
    `Firestore DB: ${db ? 'Connected' : 'NULL - not connected'}`,
    `Auth: ${auth ? 'Ready' : 'NULL'}`,
    `Current User: ${auth?.currentUser?.uid || 'None'}`,
  ];
  return lines.join('\n');
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
  if (!auth) {
    throw new Error("Authentication service is unavailable. Please check your network connection.");
  }

  const result: UserCredential = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (!user.email) {
    throw new Error("Google sign-in did not return a valid email address. Only authorized Gmail accounts are allowed.");
  }

  const derivedRoll = `23IT${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL || undefined,
    rollNo: derivedRoll,
    provider: 'google'
  };
}

/**
 * Sign in with GitHub Popup
 */
export async function signInWithGithub(): Promise<OAuthUserResult> {
  if (!auth) {
    throw new Error("Authentication service is unavailable. Please check your network connection.");
  }

  const result: UserCredential = await signInWithPopup(auth, githubProvider);
  const user = result.user;

  if (!user.email) {
    throw new Error("GitHub sign-in did not return a valid email address. Only authorized accounts are allowed.");
  }

  const derivedRoll = `23IT${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    name: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL || undefined,
    rollNo: derivedRoll,
    provider: 'github'
  };
}

/**
 * Sign in / Register with Email and Password
 */
export async function signInWithEmailPassword(email: string, pass: string): Promise<OAuthUserResult> {
  if (!auth) {
    throw new Error("Authentication service is unavailable. Please check your network connection.");
  }

  let userCredential: UserCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, pass);
  } catch (err: any) {
    if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
      userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      throw err;
    }
  }

  const user = userCredential.user;
  const userEmail = user.email || email;
  const nameFromEmail = userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    name: user.displayName || nameFromEmail || 'Student User',
    email: userEmail,
    rollNo: `23IT${Math.floor(1000 + Math.random() * 9000)}`,
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
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const photoRef = doc(db, 'gallery_photos', photo.id);
    await setDoc(photoRef, photo);
    console.log("Synced photo to Cloud Firestore:", photo.id);
  } catch (err: any) {
    console.error('Failed to sync photo to Cloud Firestore:', err);
    alert(`Firestore Error: Could not upload photo to Cloud. ${err?.message || err}`);
  }
}

export async function deletePhotoFromFirestore(photoId: string): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const photoRef = doc(db, 'gallery_photos', photoId);
    await deleteDoc(photoRef);
  } catch (err) {
    console.error('Failed to delete photo from Firestore:', err);
  }
}

export function subscribeToGalleryPhotos(onUpdate: (photos: GalleryPhoto[]) => void): () => void {
  if (!db) {
    console.warn("Firestore database is null. Check VITE_FIREBASE_PROJECT_ID in environment variables.");
    return () => { };
  }

  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const galleryCol = collection(db, 'gallery_photos');
      unsubscribeSnapshot = onSnapshot(galleryCol, (snapshot) => {
        const photos: GalleryPhoto[] = [];
        snapshot.forEach((docSnap) => {
          photos.push(docSnap.data() as GalleryPhoto);
        });
        // Sort by newest first
        photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (photos.length > 0) {
          try {
            localStorage.setItem('gits_club_gallery_v2', JSON.stringify(photos));
          } catch (e) { }
          onUpdate(photos);
        }
      }, (error) => {
        // This fires (silently, with no UI feedback) when Firestore security
        // rules reject the read - most commonly because the device/browser
        // has never authenticated yet. Signing in anonymously below prevents
        // that on first load, but this log is kept as a diagnostic signal.
        console.warn('Firestore subscription error:', error);
      });
    } catch (err) {
      console.error('Error establishing Firestore listener:', err);
    }
  };

  // A brand-new device/browser has no Firebase auth session yet. If Firestore
  // security rules require request.auth != null to read, subscribing before
  // authenticating fails silently (see the onSnapshot error handler above)
  // and the gallery just never loads - this is what made photos visible only
  // on the device/browser that uploaded them. Signing in anonymously first
  // (mirroring what savePhotoToFirestore already does for writes) fixes that.
  if (auth && !auth.currentUser) {
    signInAnonymously(auth)
      .catch((e) => console.warn('Anonymous sign-in before gallery subscription failed:', e))
      .finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}

/**
 * Cloud Firestore Real-time Sync for Club Events
 */
export async function saveEventToFirestore(event: ClubEvent): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'club_events', event.id);
    const cleanData = JSON.parse(JSON.stringify(event));
    await setDoc(ref, cleanData);
    console.log("Synced event to Cloud Firestore:", event.id);
  } catch (err: any) {
    console.error('Failed to sync event to Cloud Firestore:', err);
  }
}

export async function deleteEventFromFirestore(eventId: string): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'club_events', eventId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Failed to delete event from Firestore:', err);
  }
}

export function subscribeToEvents(onUpdate: (events: ClubEvent[]) => void): () => void {
  if (!db) return () => { };
  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const col = collection(db, 'club_events');
      unsubscribeSnapshot = onSnapshot(col, (snapshot) => {
        const events: ClubEvent[] = [];
        snapshot.forEach((docSnap) => {
          events.push(docSnap.data() as ClubEvent);
        });
        if (events.length > 0) {
          try { localStorage.setItem('gits_club_events_v2', JSON.stringify(events)); } catch (e) { }
          onUpdate(events);
        }
      }, (err) => console.warn('Events Firestore listener error:', err));
    } catch (err) {
      console.error('Error establishing events listener:', err);
    }
  };

  if (auth && !auth.currentUser) {
    signInAnonymously(auth).catch(() => {}).finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}

/**
 * Cloud Firestore Real-time Sync for Event Memories
 */
export async function saveMemoryToFirestore(memory: EventMemory): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'event_memories', memory.id);
    const cleanData = JSON.parse(JSON.stringify(memory));
    await setDoc(ref, cleanData);
    console.log("Synced memory to Cloud Firestore:", memory.id);
  } catch (err: any) {
    console.error('Failed to sync memory to Cloud Firestore:', err);
  }
}

export async function deleteMemoryFromFirestore(memoryId: string): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'event_memories', memoryId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Failed to delete memory from Firestore:', err);
  }
}

export function subscribeToMemories(onUpdate: (memories: EventMemory[]) => void): () => void {
  if (!db) return () => { };
  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const col = collection(db, 'event_memories');
      unsubscribeSnapshot = onSnapshot(col, (snapshot) => {
        const memories: EventMemory[] = [];
        snapshot.forEach((docSnap) => {
          memories.push(docSnap.data() as EventMemory);
        });
        memories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (memories.length > 0) {
          try { localStorage.setItem('gits_club_memories_v2', JSON.stringify(memories)); } catch (e) { }
          onUpdate(memories);
        }
      }, (err) => console.warn('Memories Firestore listener error:', err));
    } catch (err) {
      console.error('Error establishing memories listener:', err);
    }
  };

  if (auth && !auth.currentUser) {
    signInAnonymously(auth).catch(() => {}).finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}

/**
 * Cloud Firestore Real-time Sync for Event Registrations
 */
export async function saveRegistrationToFirestore(reg: any): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'event_registrations', reg.id);
    const cleanData = JSON.parse(JSON.stringify(reg));
    await setDoc(ref, cleanData);
    console.log("Synced registration to Cloud Firestore:", reg.id);
  } catch (err: any) {
    console.error('Failed to sync registration to Cloud Firestore:', err);
  }
}

export function subscribeToRegistrations(onUpdate: (regs: any[]) => void): () => void {
  if (!db) return () => { };
  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const col = collection(db, 'event_registrations');
      unsubscribeSnapshot = onSnapshot(col, (snapshot) => {
        const regs: any[] = [];
        snapshot.forEach((docSnap) => {
          regs.push(docSnap.data());
        });
        regs.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        if (regs.length > 0) {
          try { localStorage.setItem('gits_club_registrations_v2', JSON.stringify(regs)); } catch (e) { }
          onUpdate(regs);
        }
      }, (err) => console.warn('Registrations Firestore listener error:', err));
    } catch (err) {
      console.error('Error establishing registrations listener:', err);
    }
  };

  if (auth && !auth.currentUser) {
    signInAnonymously(auth).catch(() => {}).finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}

/**
 * Cloud Firestore Real-time Sync for Announcements / Broadcast Banners
 */
export async function saveAnnouncementToFirestore(announcement: Announcement): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'announcements', announcement.id);
    const cleanData = JSON.parse(JSON.stringify(announcement));
    await setDoc(ref, cleanData);
    console.log("Synced announcement to Cloud Firestore:", announcement.id);
  } catch (err: any) {
    console.error('Failed to sync announcement to Cloud Firestore:', err);
  }
}

export async function deleteAnnouncementFromFirestore(announcementId: string): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'announcements', announcementId);
    await deleteDoc(ref);
    console.log("Deleted announcement from Cloud Firestore:", announcementId);
  } catch (err) {
    console.error('Failed to delete announcement from Firestore:', err);
  }
}

export function subscribeToAnnouncements(onUpdate: (announcements: Announcement[]) => void): () => void {
  if (!db) return () => { };
  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const col = collection(db, 'announcements');
      unsubscribeSnapshot = onSnapshot(col, (snapshot) => {
        const announcements: Announcement[] = [];
        snapshot.forEach((docSnap) => {
          announcements.push(docSnap.data() as Announcement);
        });
        announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        try { localStorage.setItem('gits_club_announcements_v2', JSON.stringify(announcements)); } catch (e) { }
        onUpdate(announcements);
      }, (err) => console.warn('Announcements Firestore listener error:', err));
    } catch (err) {
      console.error('Error establishing announcements listener:', err);
    }
  };

  if (auth && !auth.currentUser) {
    signInAnonymously(auth).catch(() => {}).finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}

/**
 * Cloud Firestore Real-time Sync for Crew / Team Members
 */
export async function saveCrewMemberToFirestore(member: CrewMember): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'crew_members', member.id);
    const cleanData = JSON.parse(JSON.stringify(member));
    await setDoc(ref, cleanData);
    console.log("Synced crew member to Cloud Firestore:", member.id);
  } catch (err: any) {
    console.error('Failed to sync crew member to Cloud Firestore:', err);
  }
}

export async function deleteCrewMemberFromFirestore(memberId: string): Promise<void> {
  if (!db) return;
  try {
    if (auth && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (e) { }
    }
    const ref = doc(db, 'crew_members', memberId);
    await deleteDoc(ref);
    console.log("Deleted crew member from Cloud Firestore:", memberId);
  } catch (err) {
    console.error('Failed to delete crew member from Firestore:', err);
  }
}

export function subscribeToCrew(onUpdate: (members: CrewMember[]) => void): () => void {
  if (!db) return () => { };
  let cancelled = false;
  let unsubscribeSnapshot: (() => void) | null = null;

  const startListening = () => {
    if (cancelled || !db) return;
    try {
      const col = collection(db, 'crew_members');
      unsubscribeSnapshot = onSnapshot(col, (snapshot) => {
        const members: CrewMember[] = [];
        snapshot.forEach((docSnap) => {
          members.push(docSnap.data() as CrewMember);
        });
        if (members.length > 0) {
          try { localStorage.setItem('gits_club_crew_members_v1', JSON.stringify(members)); } catch (e) { }
          onUpdate(members);
        }
      }, (err) => console.warn('Crew Firestore listener error:', err));
    } catch (err) {
      console.error('Error establishing crew listener:', err);
    }
  };

  if (auth && !auth.currentUser) {
    signInAnonymously(auth).catch(() => {}).finally(startListening);
  } else {
    startListening();
  }

  return () => {
    cancelled = true;
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
}