export type EventCategory = 
  | 'Hackathon' 
  | 'Workshop' 
  | 'Tech Talk' 
  | 'Coding Contest' 
  | 'Project Expo'
  | 'Networking';

export type EventStatus = 'Upcoming' | 'Live' | 'Completed' | 'Draft';

export interface Speaker {
  name: string;
  role: string;
  organization: string;
  avatar: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  status: EventStatus;
  shortDescription: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  image: string;
  tags: string[];
  prerequisites: string[];
  fee: 'Free' | string;
  isPaid?: boolean;
  paymentQrImage?: string;
  upiId?: string;
  feedbackEnabled?: boolean;
  feedbackQuestions?: FeedbackQuestion[];
  speaker: Speaker;
  schedule: ScheduleItem[];
  organizer: string;
  eventScope?: 'Intra-College' | 'Inter-College';
  eventType?: 'Solo' | 'Team';
  minTeamSize?: number;
  maxTeamSize?: number;
  createdAt: string;
}

export interface TeamMember {
  name: string;
  rollNo?: string;
  email?: string;
}

export interface FeedbackQuestion {
  id: string;
  questionText: string;
  type: 'rating' | 'text';
}

export interface EventFeedbackResponse {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  overallRating: number; // 1-5 stars
  answers: { questionId: string; questionText: string; answer: string | number }[];
  comments?: string;
  submittedAt: string;
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  grNo: string;
  branch: string;
  year: 'FE' | 'SE' | 'TE' | 'BE' | string;
  div: string;
  email: string;
  phone?: string;
  isProfileComplete?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  rollNo: string;
  grNo?: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  div?: string;
  collegeName?: string;
  status: 'Confirmed' | 'Attended' | 'Cancelled' | 'Absent' | 'Pending';
  ticketCode: string;
  registeredAt: string;
  attendedAt?: string;
  paymentTransactionId?: string;
  paymentProofUrl?: string;
  specialRequests?: string;
  teamName?: string;
  teamMembers?: TeamMember[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  img: string;
  createdAt?: string;
}

export interface EventMemory {
  id: string;
  title: string;
  year: string;
  date: string;
  category: EventCategory;
  description: string;
  image: string;
  attendeesCount: number;
  winners?: string[];
  highlights: string[];
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  eventName?: string;
  year: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  content: string;
  type: 'info' | 'urgent' | 'highlight';
  active: boolean;
  linkText?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface UserSession {
  role: 'guest' | 'student' | 'admin';
  studentInfo?: StudentProfile;
  adminEmail?: string;
}
