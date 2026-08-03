import type { ClubEvent, EventRegistration, EventMemory, Announcement, UserSession, GalleryPhoto } from '../types';
import { 
  savePhotoToFirestore, 
  deletePhotoFromFirestore,
  saveEventToFirestore,
  deleteEventFromFirestore,
  saveMemoryToFirestore,
  deleteMemoryFromFirestore,
  saveRegistrationToFirestore
} from './firebase';

const STORAGE_KEYS = {
  EVENTS: 'gits_club_events_v2',
  REGISTRATIONS: 'gits_club_registrations_v2',
  MEMORIES: 'gits_club_memories_v2',
  ANNOUNCEMENTS: 'gits_club_announcements_v2',
  GALLERY: 'gits_club_gallery_v2',
  USER_SESSION: 'gits_club_user_session_v2',
};

const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-001',
    title: 'CodeMatrix 2025 Award Ceremony',
    caption: 'Team NeuralX receiving the grand prize from Dr. Rajesh Sharma on stage.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50f2ab34?auto=format&fit=crop&w=900&q=80',
    eventName: 'CodeMatrix 2025 Hackathon',
    year: '2025',
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString()
  },
  {
    id: 'gal-002',
    title: 'Hackathon Live Coding Floor',
    caption: '280+ developers coding through the night during the 48-hour sprint.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    eventName: 'CodeMatrix 2025 Hackathon',
    year: '2025',
    createdAt: new Date(Date.now() - 86400000 * 199).toISOString()
  },
  {
    id: 'gal-003',
    title: 'AI Workshop Hands-on Session',
    caption: 'Students training neural networks on Google Colab during the ML bootcamp.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    eventName: 'AI & ML Workshop 2025',
    year: '2025',
    createdAt: new Date(Date.now() - 86400000 * 150).toISOString()
  },
  {
    id: 'gal-004',
    title: 'CyberSec CTF Leaderboard Reveal',
    caption: 'Siddharth Patel tops the leaderboard with 1,850 points in GITS CyberShield CTF.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    eventName: 'CyberShield CTF 2025',
    year: '2025',
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString()
  },
  {
    id: 'gal-005',
    title: 'React Bootcamp Graduation Day',
    caption: '180 students receiving certificates after the 3-day Fullstack React bootcamp.',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80',
    eventName: 'Fullstack React Bootcamp 2024',
    year: '2024',
    createdAt: new Date(Date.now() - 86400000 * 450).toISOString()
  },
  {
    id: 'gal-006',
    title: 'GITS Club Orientation & Freshers Meet',
    caption: 'New IT batch students exploring GITS domain wings at the annual orientation.',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80',
    eventName: 'GITS Orientation 2024',
    year: '2024',
    createdAt: new Date(Date.now() - 86400000 * 500).toISOString()
  }
];

const DEFAULT_EVENTS: ClubEvent[] = [
  {
    id: 'evt-101',
    title: 'GITS CodeMatrix 2026: 48-Hour Hackathon',
    slug: 'codematrix-2026-hackathon',
    category: 'Hackathon',
    status: 'Upcoming',
    shortDescription: 'Build innovative AI, Web3, and Open Source solutions. Over $5,000 in cash prizes and recruiter referrals.',
    description: 'CodeMatrix 2026 is GITS flagship annual hackathon bringing together over 300 developer minds across departments. Work in teams of 2-4 to build real-world software prototypes in AI/ML, Cloud Infrastructure, and Cyber Security. Mentors from top tech firms will be on-site.',
    date: '2026-08-15',
    time: '09:00 AM - 48 Hours',
    venue: 'IT Block Auditorium & Innovation Lab (Lab 4)',
    capacity: 250,
    registeredCount: 184,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hackathon', 'AI/ML', 'Fullstack', 'Cash Prizes'],
    prerequisites: ['Basic programming knowledge in Python/JS/C++', 'Bring your laptop & charger'],
    fee: 'Free',
    speaker: {
      name: 'Dr. Rajesh Sharma & Tech Leads',
      role: 'Head of IT Dept & Senior Architects',
      organization: 'GITS Advisory Board',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    schedule: [
      { time: 'Day 1 - 09:00 AM', title: 'Opening Keynote & Problem Statements Release', description: 'Briefing by mentors and theme announcements.' },
      { time: 'Day 1 - 11:00 AM', title: 'Hacking Begins & Mentor Checkpoint 1', description: 'Idea validation and architecture review.' },
      { time: 'Day 2 - 02:00 PM', title: 'Mid-Way Pitch & Code Freeze', description: 'Draft prototype review.' },
      { time: 'Day 3 - 10:00 AM', title: 'Final Demos & Award Ceremony', description: 'Top 10 teams pitch live to jury panel.' }
    ],
    organizer: 'GITS Executive Board & Technical Wing',
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-102',
    title: 'AI & LLM Fine-Tuning Hands-on Workshop',
    slug: 'ai-llm-fine-tuning-workshop',
    category: 'Workshop',
    status: 'Upcoming',
    shortDescription: 'Learn how to fine-tune open-weight models (Llama 3 / Mistral) using PyTorch, LoRA, and HuggingFace.',
    description: 'Master practical generative AI techniques! In this intensive 4-hour workshop, GITS AI Wing will guide you step-by-step through dataset curation, Parameter-Efficient Fine-Tuning (PEFT/LoRA), and deploying your custom model API using FastAPI.',
    date: '2026-08-08',
    time: '02:00 PM - 06:00 PM',
    venue: 'Computer Center Lab 2',
    capacity: 90,
    registeredCount: 76,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'PyTorch', 'LLMs', 'HuggingFace'],
    prerequisites: ['Python basics', 'Google Colab account'],
    fee: 'Free',
    speaker: {
      name: 'Aarav Mehta',
      role: 'AI Lead @ GITS',
      organization: 'GITS Research Wing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    schedule: [
      { time: '02:00 PM', title: 'Introduction to LLM Architecture & Quantization' },
      { time: '03:15 PM', title: 'Dataset Preparation & LoRA Fine-Tuning Setup' },
      { time: '04:45 PM', title: 'Model Evaluation & Local API Deployment' }
    ],
    organizer: 'GITS AI/ML Domain',
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-103',
    title: 'CyberSec CTF 2026: Break The Vault',
    slug: 'cybersec-ctf-2026',
    category: 'Coding Contest',
    status: 'Live',
    shortDescription: 'Jeopardy-style Capture The Flag challenge testing Web Security, Cryptography, Reverse Engineering, and Forensics.',
    description: 'Are you ready to test your penetration testing skills? Compete individually or in pairs to find hidden flags across vulnerable web apps, binary reverse engineering challenges, and encrypted network packets.',
    date: '2026-08-02',
    time: '10:00 AM - 08:00 PM',
    venue: 'Online & IT Seminar Hall',
    capacity: 150,
    registeredCount: 142,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['CyberSecurity', 'CTF', 'Ethical Hacking', 'Web Exploitation'],
    prerequisites: ['Understanding of HTTP protocol', 'Linux command line basics'],
    fee: 'Free',
    speaker: {
      name: 'Neha Kapoor',
      role: 'Cybersecurity Analyst',
      organization: 'GITS RedTeam',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    schedule: [
      { time: '10:00 AM', title: 'CTF Platform Briefing & Account Credentials Distribution' },
      { time: '10:30 AM', title: 'Challenges Live & Leaderboard Unveiled' },
      { time: '07:30 PM', title: 'Flag Submission Deadline & Walkthrough Discussions' }
    ],
    organizer: 'GITS CyberSec Division',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'reg-901',
    eventId: 'evt-101',
    eventTitle: 'GITS CodeMatrix 2026: 48-Hour Hackathon',
    studentName: 'Alex Morgan',
    rollNo: '23IT1042',
    email: 'alex@student.gits.edu',
    phone: '+91 98765 43210',
    department: 'Information Technology',
    year: '3rd Year',
    status: 'Confirmed',
    ticketCode: 'GITS-HACK-8492',
    registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    specialRequests: 'Vegetarian'
  }
];

const DEFAULT_MEMORIES: EventMemory[] = [
  {
    id: 'mem-2025-1',
    title: 'CodeMatrix 2025: National Inter-College Hackathon',
    year: '2025',
    date: 'October 14-16, 2025',
    category: 'Hackathon',
    description: 'Over 280 hackers from 35 engineering colleges competed non-stop for 48 hours. Team NeuralX won 1st prize ($2,500) for their autonomous healthcare triage AI.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 284,
    winners: ['1st Place: Team NeuralX (AI Triage App)', '2nd Place: Team CypherLab (Zero Knowledge Auth)', '3rd Place: Team QuantumByte (Smart Grid IoT)'],
    highlights: ['284 Registered Hackers', '48 Hours Non-stop Coding', '12 Industry Mentors', '$5,000 Cash Prize Pool Distribution'],
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString()
  },
  {
    id: 'mem-2025-2',
    title: 'GITS CyberShield CTF 2025',
    year: '2025',
    date: 'June 20, 2025',
    category: 'Coding Contest',
    description: 'A intense 12-hour Jeopardy style hacking contest. Participants cracked web vulnerability flags, binary buffer overflows, and hidden RSA keys.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 160,
    winners: ['Winner: Siddharth Patel (22IT0031)', 'Runner Up: Ananya Rao (24CS0812)'],
    highlights: ['35 CTF Flags Created', 'Top 5 participants awarded OSCP voucher discount vouchers'],
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString()
  },
  {
    id: 'mem-2024-1',
    title: 'Full-Stack React & Node.js Bootcamp 2024',
    year: '2024',
    date: 'November 12, 2024',
    category: 'Workshop',
    description: 'Hands-on 3-day bootcamp where 180 IT students built real-time collaborative whiteboards and deployed them live to Vercel and Render.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 180,
    highlights: ['100% Student Project Completion', 'Live API Deployment to Cloud', 'Certificates Issued to 180 Students'],
    createdAt: new Date(Date.now() - 86400000 * 450).toISOString()
  }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-01',
    content: '🚀 Registrations are LIVE for GITS CodeMatrix 48-Hour Hackathon! Reserve your team slot today.',
    type: 'urgent',
    active: true,
    linkText: 'Register Now',
    linkUrl: '#events',
    createdAt: new Date().toISOString()
  }
];

export const StorageService = {
  // Events CRUD
  getEvents(): ClubEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_EVENTS; }
  },

  saveEvents(events: ClubEvent[]) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  addEvent(eventData: Omit<ClubEvent, 'id' | 'createdAt' | 'registeredCount'>): ClubEvent {
    const events = this.getEvents();
    const newEvent: ClubEvent = {
      ...eventData,
      id: 'evt-' + Date.now().toString().slice(-6),
      registeredCount: 0,
      createdAt: new Date().toISOString()
    };
    events.unshift(newEvent);
    this.saveEvents(events);
    saveEventToFirestore(newEvent);
    return newEvent;
  },

  updateEvent(id: string, updatedFields: Partial<ClubEvent>): ClubEvent | null {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updatedFields };
    this.saveEvents(events);
    saveEventToFirestore(events[index]);
    return events[index];
  },

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    this.saveEvents(filtered);
    deleteEventFromFirestore(id);
    return true;
  },

  // Registrations CRUD
  getRegistrations(): EventRegistration[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(DEFAULT_REGISTRATIONS));
      return DEFAULT_REGISTRATIONS;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_REGISTRATIONS; }
  },

  addRegistration(data: Omit<EventRegistration, 'id' | 'ticketCode' | 'registeredAt' | 'status'>): EventRegistration {
    const registrations = this.getRegistrations();
    const events = this.getEvents();
    
    const targetEvent = events.find(e => e.id === data.eventId);
    if (targetEvent) {
      if ((targetEvent.registeredCount || 0) >= targetEvent.capacity) {
        throw new Error('Event is already full. Registration not allowed.');
      }
      targetEvent.registeredCount = (targetEvent.registeredCount || 0) + 1;
      this.saveEvents(events);
      saveEventToFirestore(targetEvent);
    }

    const ticketCode = `GITS-${data.eventTitle.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg: EventRegistration = {
      ...data,
      id: 'reg-' + Date.now().toString().slice(-6),
      ticketCode,
      status: 'Confirmed',
      registeredAt: new Date().toISOString()
    };

    registrations.unshift(newReg);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    saveRegistrationToFirestore(newReg);
    return newReg;
  },

  updateRegistrationStatus(id: string, status: EventRegistration['status']): boolean {
    const regs = this.getRegistrations();
    const index = regs.findIndex(r => r.id === id);
    if (index === -1) return false;
    regs[index].status = status;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));
    return true;
  },

  deleteRegistration(id: string): boolean {
    const regs = this.getRegistrations();
    const filtered = regs.filter(r => r.id !== id);
    if (filtered.length === regs.length) return false;
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered));
    return true;
  },

  // Memories CRUD
  getMemories(): EventMemory[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(DEFAULT_MEMORIES));
      return DEFAULT_MEMORIES;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_MEMORIES; }
  },

  addMemory(data: Omit<EventMemory, 'id' | 'createdAt'>): EventMemory {
    const memories = this.getMemories();
    const newMemory: EventMemory = {
      ...data,
      id: 'mem-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString()
    };
    memories.unshift(newMemory);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    saveMemoryToFirestore(newMemory);
    return newMemory;
  },

  deleteMemory(id: string): boolean {
    const memories = this.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    if (filtered.length === memories.length) return false;
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(filtered));
    deleteMemoryFromFirestore(id);
    return true;
  },

  // Announcements CRUD
  getAnnouncements(): Announcement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_ANNOUNCEMENTS; }
  },

  addAnnouncement(content: string, type: Announcement['type'] = 'info', linkText?: string, linkUrl?: string): Announcement {
    const announcements = this.getAnnouncements();
    const newAnc: Announcement = {
      id: 'anc-' + Date.now().toString().slice(-6),
      content,
      type,
      active: true,
      linkText,
      linkUrl,
      createdAt: new Date().toISOString()
    };
    announcements.unshift(newAnc);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    return newAnc;
  },

  toggleAnnouncement(id: string): boolean {
    const announcements = this.getAnnouncements();
    const anc = announcements.find(a => a.id === id);
    if (!anc) return false;
    anc.active = !anc.active;
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    return true;
  },

  deleteAnnouncement(id: string): boolean {
    const announcements = this.getAnnouncements();
    const filtered = announcements.filter(a => a.id !== id);
    if (filtered.length === announcements.length) return false;
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
    return true;
  },

  // Gallery CRUD
  getGalleryPhotos(): GalleryPhoto[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY_PHOTOS));
      return DEFAULT_GALLERY_PHOTOS;
    }
    try { return JSON.parse(raw); } catch { return DEFAULT_GALLERY_PHOTOS; }
  },

  addGalleryPhoto(data: Omit<GalleryPhoto, 'id' | 'createdAt'>): GalleryPhoto {
    const photos = this.getGalleryPhotos();
    const newPhoto: GalleryPhoto = {
      ...data,
      id: 'gal-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString()
    };
    photos.unshift(newPhoto);
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(photos));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Storage quota exceeded when saving photo:', e);
      alert('Failed to save image to local storage quota limit. Try using a web image URL or smaller image file.');
    }

    // Sync to Cloud Firestore in real-time across all devices worldwide
    savePhotoToFirestore(newPhoto);

    return newPhoto;
  },

  deleteGalleryPhoto(id: string): boolean {
    const photos = this.getGalleryPhotos();
    const filtered = photos.filter(p => p.id !== id);
    if (filtered.length === photos.length) return false;
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to update gallery storage:', e);
    }

    // Delete from Cloud Firestore across all devices
    deletePhotoFromFirestore(id);

    return true;
  },

  // User Session & Profile Management
  getUserSession(): UserSession {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!raw) return { role: 'guest' };
    try { return JSON.parse(raw); } catch { return { role: 'guest' }; }
  },

  saveUserSession(session: UserSession) {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    if (session.role === 'student' && session.studentInfo && session.studentInfo.isProfileComplete) {
      this.saveStudentProfileByEmail(session.studentInfo);
    }
  },

  clearUserSession() {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify({ role: 'guest' }));
  },

  getStudentProfileByEmail(email: string) {
    if (!email) return null;
    try {
      const raw = localStorage.getItem('gits_club_student_profiles_map_v1');
      if (!raw) return null;
      const map = JSON.parse(raw);
      return map[email.toLowerCase().trim()] || null;
    } catch {
      return null;
    }
  },

  saveStudentProfileByEmail(profile: any) {
    if (!profile || !profile.email) return;
    try {
      const raw = localStorage.getItem('gits_club_student_profiles_map_v1');
      const map = raw ? JSON.parse(raw) : {};
      map[profile.email.toLowerCase().trim()] = profile;
      localStorage.setItem('gits_club_student_profiles_map_v1', JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save student profile to map:', e);
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(DEFAULT_REGISTRATIONS));
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(DEFAULT_MEMORIES));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY_PHOTOS));
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify({ role: 'guest' }));
  }
};
