import React, { useState, useEffect } from 'react';
import type { ClubEvent, EventRegistration, EventMemory, Announcement, EventCategory, EventStatus, GalleryPhoto, CrewMember, EventFeedbackResponse, FeedbackQuestion } from '../types';
import { StorageService } from '../services/storageService';
import { subscribeToGalleryPhotos, subscribeToFeedback } from '../services/firebase';
import { 
  ShieldCheck, Calendar, Camera, Bell, Plus, Edit3, Trash2, 
  Search, Download, X, Globe, Upload, Image as ImageIcon, Users, UserCheck, MessageSquare, Star, Settings, ChevronUp, ChevronDown, Check
} from 'lucide-react';

interface AdminDashboardProps {
  events: ClubEvent[];
  registrations: EventRegistration[];
  memories: EventMemory[];
  announcements: Announcement[];
  crewMembers: CrewMember[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  registrations,
  memories,
  announcements,
  crewMembers,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'memories' | 'announcements' | 'gallery' | 'registrations' | 'crew' | 'feedback'>('events');

  // Gallery Photos & Feedback State
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => StorageService.getGalleryPhotos());
  const [feedbackList, setFeedbackList] = useState<EventFeedbackResponse[]>(() => StorageService.getFeedbackResponses());
  const [feedbackEventFilter, setFeedbackEventFilter] = useState<string>('All');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    caption: '',
    imageUrl: '',
    eventName: '',
    year: '2026'
  });

  // Dedicated Feedback Question Manager Modal state
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [selectedEventForQuestions, setSelectedEventForQuestions] = useState<string>('');
  const [questionsForm, setQuestionsForm] = useState<FeedbackQuestion[]>([]);
  const [questionsSaveSuccess, setQuestionsSaveSuccess] = useState(false);

  // Subscribe to Cloud Firestore photos & feedback in Admin Panel
  useEffect(() => {
    const unsubGallery = subscribeToGalleryPhotos((cloudPhotos) => {
      setGalleryPhotos(cloudPhotos);
    });
    const unsubFeedback = subscribeToFeedback((cloudFeedback) => {
      setFeedbackList(cloudFeedback);
    });
    return () => { unsubGallery(); unsubFeedback(); };
  }, []);

  // Handlers for Feedback Question Manager Modal
  const handleOpenQuestionManager = (targetEventId?: string) => {
    const eventId = targetEventId || (feedbackEventFilter !== 'All' ? feedbackEventFilter : (events[0]?.id || ''));
    setSelectedEventForQuestions(eventId);
    
    const evt = events.find(e => e.id === eventId);
    const existing = (evt && evt.feedbackQuestions && evt.feedbackQuestions.length > 0)
      ? evt.feedbackQuestions
      : [
          { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' as const },
          { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' as const },
          { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' as const }
        ];
    setQuestionsForm(existing.map(q => ({ ...q })));
    setIsQuestionManagerOpen(true);
  };

  const handleSelectEventForQuestions = (eventId: string) => {
    setSelectedEventForQuestions(eventId);
    const evt = events.find(e => e.id === eventId);
    const existing = (evt && evt.feedbackQuestions && evt.feedbackQuestions.length > 0)
      ? evt.feedbackQuestions
      : [
          { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' as const },
          { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' as const },
          { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' as const }
        ];
    setQuestionsForm(existing.map(q => ({ ...q })));
  };

  const handleSaveQuestionsForEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForQuestions) return;

    StorageService.updateEvent(selectedEventForQuestions, {
      feedbackQuestions: questionsForm,
      feedbackEnabled: true
    });

    setQuestionsSaveSuccess(true);
    onRefreshData();
    setTimeout(() => {
      setQuestionsSaveSuccess(false);
      setIsQuestionManagerOpen(false);
    }, 1000);
  };

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Hackathon' as EventCategory,
    status: 'Upcoming' as EventStatus,
    shortDescription: '',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: 'IT Lab 4 / AV Hall',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: 'Hackathon, WebDev',
    prerequisites: 'Basic programming knowledge',
    fee: 'Free',
    isPaid: false,
    paymentQrImage: '',
    upiId: '',
    eventScope: 'Intra-College' as 'Intra-College' | 'Inter-College',
    speakerName: 'GITS Tech Lead',
    speakerRole: 'Software Architect',
    speakerOrg: 'GITS Advisory',
    speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    feedbackQuestions: [
      { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' },
      { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' },
      { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' }
    ] as FeedbackQuestion[]
  });

  // Crew Form state
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);
  const [crewForm, setCrewForm] = useState({
    name: '',
    role: '',
    img: ''
  });

  // Memory Form state
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    year: '2026',
    date: 'August 1, 2026',
    category: 'Workshop' as EventCategory,
    description: '',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 150,
    winners: '1st Place: Team Alpha, 2nd Place: Team Beta',
    highlights: '150 Participants, Hands-on Lab'
  });

  // Announcement Form State
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Registrations Filter
  const [regSearch, setRegSearch] = useState('');
  const [regEventFilter, setRegEventFilter] = useState<string>('All');
  const [regStatusFilter, setRegStatusFilter] = useState<string>('All');

  // ----------------------------------------------------
  // Event Form Handlers
  // ----------------------------------------------------
  const handleOpenNewEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category: 'Workshop',
      status: 'Upcoming',
      shortDescription: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      venue: 'IT Block Lab 4',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      tags: 'Workshop, IT',
      prerequisites: 'Laptop with charger',
      fee: 'Free',
      isPaid: false,
      paymentQrImage: '',
      upiId: '',
      eventScope: 'Intra-College' as 'Intra-College' | 'Inter-College',
      speakerName: 'Dr. Rajesh Sharma',
      speakerRole: 'Faculty Lead',
      speakerOrg: 'IT Dept',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      feedbackQuestions: [
        { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' },
        { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' },
        { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' }
      ]
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (evt: ClubEvent) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      category: evt.category,
      status: evt.status,
      shortDescription: evt.shortDescription,
      description: evt.description,
      date: evt.date,
      time: evt.time,
      venue: evt.venue,
      capacity: evt.capacity,
      image: evt.image,
      tags: evt.tags.join(', '),
      prerequisites: evt.prerequisites.join(', '),
      fee: evt.fee,
      isPaid: evt.isPaid || (evt.fee !== 'Free'),
      paymentQrImage: evt.paymentQrImage || '',
      upiId: evt.upiId || '',
      eventScope: evt.eventScope || 'Intra-College',
      speakerName: evt.speaker?.name || '',
      speakerRole: evt.speaker?.role || '',
      speakerOrg: evt.speaker?.organization || '',
      speakerAvatar: evt.speaker?.avatar || '',
      feedbackQuestions: evt.feedbackQuestions && evt.feedbackQuestions.length > 0 ? evt.feedbackQuestions : [
        { id: 'q1', questionText: 'How would you rate the quality & organization of this event?', type: 'rating' },
        { id: 'q2', questionText: 'What was your key technical takeaway or favorite part?', type: 'text' },
        { id: 'q3', questionText: 'Any suggestions for future GITS workshops or hackathons?', type: 'text' }
      ]
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventPayload = {
      title: eventForm.title,
      slug: eventForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      category: eventForm.category,
      status: eventForm.status,
      shortDescription: eventForm.shortDescription,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      venue: eventForm.venue,
      capacity: Number(eventForm.capacity),
      image: eventForm.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      tags: eventForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      prerequisites: eventForm.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
      fee: eventForm.isPaid ? (eventForm.fee === 'Free' ? '₹50' : eventForm.fee) : 'Free',
      isPaid: eventForm.isPaid,
      paymentQrImage: eventForm.isPaid ? eventForm.paymentQrImage : '',
      upiId: eventForm.isPaid ? eventForm.upiId : '',
      feedbackEnabled: true,
      feedbackQuestions: eventForm.feedbackQuestions,
      eventScope: eventForm.eventScope,
      speaker: {
        name: eventForm.speakerName,
        role: eventForm.speakerRole,
        organization: eventForm.speakerOrg,
        avatar: eventForm.speakerAvatar
      },
      schedule: [
        { time: '10:00 AM', title: 'Registration & Opening Remarks' },
        { time: '11:00 AM', title: 'Hands-on Technical Session' },
        { time: '03:00 PM', title: 'Q&A & Certificate Distribution' }
      ],
      organizer: 'GITS Executive Board'
    };

    if (editingEventId) {
      StorageService.updateEvent(editingEventId, eventPayload);
    } else {
      StorageService.addEvent(eventPayload);
    }

    setIsEventModalOpen(false);
    onRefreshData();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteEvent(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Memory Handlers
  // ----------------------------------------------------
  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addMemory({
      title: memoryForm.title,
      year: memoryForm.year,
      date: memoryForm.date,
      category: memoryForm.category,
      description: memoryForm.description,
      image: memoryForm.image,
      attendeesCount: Number(memoryForm.attendeesCount),
      winners: memoryForm.winners.split(',').map(w => w.trim()).filter(Boolean),
      highlights: memoryForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
    });
    setIsMemoryModalOpen(false);
    onRefreshData();
  };

  const handleDeleteMemory = (id: string) => {
    if (window.confirm('Delete this memory item from the timeline?')) {
      StorageService.deleteMemory(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Registrations Export CSV & Actions
  // ----------------------------------------------------
  const handleExportCSV = () => {
    const targetRegistrations = filteredRegistrations;
    if (targetRegistrations.length === 0) {
      alert('No registrations to export for the selected filter.');
      return;
    }

    const headers = ['Ticket Code', 'Event Title', 'Student Name', 'College / Institution', 'Roll No', 'GR No', 'Email', 'Phone', 'Branch', 'Year', 'Div', 'Status', 'Attendance Status', 'Attended At', 'Registered At'];
    const rows = targetRegistrations.map(r => [
      r.ticketCode,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${(r.collegeName || 'Datta Meghe College of Engineering (DMCE)').replace(/"/g, '""')}"`,
      r.rollNo,
      r.grNo || 'N/A',
      r.email,
      r.phone || 'N/A',
      `"${r.department.replace(/"/g, '""')}"`,
      r.year,
      r.div || 'N/A',
      r.status,
      r.status === 'Attended' ? 'ATTENDED' : r.status === 'Absent' ? 'ABSENT' : r.status === 'Cancelled' ? 'CANCELLED' : 'NOT YET',
      r.attendedAt ? new Date(r.attendedAt).toLocaleString('en-IN') : 'N/A',
      r.registeredAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    
    let fileName = `GITS_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    if (regEventFilter !== 'All') {
      const selectedEvt = events.find(e => e.id === regEventFilter);
      if (selectedEvt) {
        const cleanTitle = selectedEvt.title.replace(/[^a-zA-Z0-9]/g, '_');
        fileName = `GITS_Registrations_${cleanTitle}_${new Date().toISOString().split('T')[0]}.csv`;
      }
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFeedbackCSV = () => {
    const target = feedbackEventFilter === 'All'
      ? feedbackList
      : feedbackList.filter(f => f.eventId === feedbackEventFilter);
    
    if (target.length === 0) {
      alert('No feedback responses to export.');
      return;
    }

    const headers = ['Event Title', 'Student Name', 'Roll No', 'Email', 'Overall Rating', 'Responses / Answers', 'Submitted At'];
    const rows = target.map(f => [
      `"${f.eventTitle.replace(/"/g, '""')}"`,
      `"${f.studentName.replace(/"/g, '""')}"`,
      f.rollNo,
      f.studentEmail,
      `${f.overallRating || 5} Stars`,
      `"${f.answers.map(a => `${a.questionText}: ${a.answer}`).join(' | ').replace(/"/g, '""')}"`,
      f.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GITS_Feedback_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateRegStatus = (id: string, status: EventRegistration['status']) => {
    StorageService.updateRegistrationStatus(id, status);
    onRefreshData();
  };

  const handleDeleteRegistration = (id: string) => {
    if (window.confirm('Delete this student registration entry?')) {
      StorageService.deleteRegistration(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Announcement Handlers
  // ----------------------------------------------------
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    StorageService.addAnnouncement(newAnnouncementText.trim(), 'urgent');
    setNewAnnouncementText('');
    onRefreshData();
  };

  // ----------------------------------------------------
  // Globe Gallery Handlers
  // ----------------------------------------------------
  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.imageUrl.trim()) {
      alert('Please enter a photo title and upload or paste an image URL.');
      return;
    }

    StorageService.addGalleryPhoto({
      title: galleryForm.title.trim(),
      caption: galleryForm.caption.trim() || galleryForm.title.trim(),
      imageUrl: galleryForm.imageUrl.trim(),
      eventName: galleryForm.eventName.trim() || 'GITS Club Event',
      year: galleryForm.year.trim() || '2026'
    });

    setGalleryPhotos(StorageService.getGalleryPhotos());
    setIsGalleryModalOpen(false);
    setGalleryForm({
      title: '',
      caption: '',
      imageUrl: '',
      eventName: '',
      year: '2026'
    });
    onRefreshData();
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    if (window.confirm('Remove this photo from the 3D Memory Globe?')) {
      StorageService.deleteGalleryPhoto(id);
      setGalleryPhotos(StorageService.getGalleryPhotos());
      onRefreshData();
    }
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      // Compress image using HTML5 Canvas to prevent browser localStorage quota overflow
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
          setGalleryForm(prev => ({
            ...prev,
            imageUrl: compressedDataUrl
          }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleEventBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setEventForm(prev => ({
            ...prev,
            image: compressedDataUrl
          }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/png', 0.85);
          setEventForm(prev => ({
            ...prev,
            paymentQrImage: compressedDataUrl
          }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // Crew Management Handlers
  // ----------------------------------------------------
  const handleOpenAddCrewModal = () => {
    setEditingCrewId(null);
    setCrewForm({
      name: '',
      role: '',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });
    setIsCrewModalOpen(true);
  };

  const handleEditCrewMember = (member: CrewMember) => {
    setEditingCrewId(member.id);
    setCrewForm({
      name: member.name,
      role: member.role,
      img: member.img
    });
    setIsCrewModalOpen(true);
  };

  const handleSaveCrewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewForm.name.trim() || !crewForm.role.trim()) {
      alert('Please fill out member name and role.');
      return;
    }

    if (editingCrewId) {
      StorageService.updateCrewMember(editingCrewId, {
        name: crewForm.name.trim(),
        role: crewForm.role.trim(),
        img: crewForm.img.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
    } else {
      StorageService.addCrewMember({
        name: crewForm.name.trim(),
        role: crewForm.role.trim(),
        img: crewForm.img.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
    }

    setIsCrewModalOpen(false);
    onRefreshData();
  };

  const handleDeleteCrewMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete crew member "${name}"?`)) {
      StorageService.deleteCrewMember(id);
      onRefreshData();
    }
  };

  const handleCrewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setCrewForm(prev => ({
            ...prev,
            img: compressedDataUrl
          }));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };


  // Filtered registrations list
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(regSearch.toLowerCase()) || 
                          r.rollNo.toLowerCase().includes(regSearch.toLowerCase()) ||
                          (r.grNo && r.grNo.toLowerCase().includes(regSearch.toLowerCase())) ||
                          r.email.toLowerCase().includes(regSearch.toLowerCase());
    const matchesEvent = regEventFilter === 'All' || r.eventId === regEventFilter;
    const matchesStatus = regStatusFilter === 'All' || r.status === regStatusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Dashboard Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={22} color="#00f2fe" />
              <span className="badge badge-purple">PROTECTED COORDINATOR ZONE</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>GITS Admin Control Center</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>


            <button className="btn btn-primary btn-sm" onClick={handleOpenNewEvent}>
              <Plus size={16} /> Add New Event
            </button>
          </div>
        </div>

        {/* Dashboard Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
              <span>ACTIVE EVENTS</span>
              <Calendar size={18} color="#00f2fe" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{events.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>
              {events.filter(e => e.status === 'Upcoming').length} Upcoming
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={16} /> Manage Events ({events.length})
          </button>
          
          <button 
            className={`btn btn-sm ${activeTab === 'memories' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('memories')}
          >
            <Camera size={16} /> Past Event Memories ({memories.length})
          </button>
          
          <button 
            className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Bell size={16} /> Broadcast Banners
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Globe size={16} /> 3D Globe Gallery ({galleryPhotos.length})
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'registrations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('registrations')}
          >
            <Users size={16} /> Student Registrations ({registrations.length})
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageSquare size={16} /> Student Feedback ({feedbackList.length})
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'crew' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('crew')}
          >
            <UserCheck size={16} /> Manage Crew ({crewMembers.length})
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: EVENTS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Events Directory</h3>
              <button className="btn btn-primary btn-sm" onClick={handleOpenNewEvent}>
                <Plus size={16} /> Create Event
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Event Title</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Date & Venue</th>
                    <th style={{ padding: '1rem' }}>Registered</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={evt.image} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div>{evt.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {evt.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-purple">{evt.category}</span>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                          value={evt.status}
                          onChange={(e) => {
                            StorageService.updateEvent(evt.id, { status: e.target.value as EventStatus });
                            onRefreshData();
                          }}
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Live">Live</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <div>{evt.date}</div>
                        <div style={{ fontSize: '0.75rem' }}>{evt.venue}</div>
                      </td>

                      <td style={{ padding: '1rem', fontWeight: 600, color: '#00f2fe' }}>
                        {evt.registeredCount} / {evt.capacity}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditEvent(evt)}
                            title="Edit Event"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEvent(evt.id, evt.title)}
                            title="Delete Event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: REGISTRATIONS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'registrations' && (
          <div>
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Search by student name or roll no..."
                    style={{ paddingLeft: '2.4rem' }}
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="form-select"
                  style={{ width: 'auto', minWidth: '180px' }}
                  value={regEventFilter}
                  onChange={(e) => setRegEventFilter(e.target.value)}
                >
                  <option value="All">All Registered Events</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>

                <select 
                  className="form-select"
                  style={{ width: 'auto', minWidth: '160px' }}
                  value={regStatusFilter}
                  onChange={(e) => setRegStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">⏳ Pending Approval</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Attended">Attended ✓</option>
                  <option value="Absent">Absent ✗</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
                <Download size={16} /> Export CSV List
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Ticket Code</th>
                    <th style={{ padding: '1rem' }}>Student Name & Email</th>
                    <th style={{ padding: '1rem' }}>Roll & GR No</th>
                    <th style={{ padding: '1rem' }}>Branch, Year & Div</th>
                    <th style={{ padding: '1rem' }}>Event Title</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem', fontFamily: 'var(--font-code)', fontWeight: 700, color: '#00f2fe' }}>
                          {reg.ticketCode}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{reg.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {reg.email} {reg.phone ? `• ${reg.phone}` : ''}
                          </div>
                          {reg.paymentTransactionId && (
                            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem', fontFamily: 'var(--font-code)' }}>
                              💳 Txn Ref: {reg.paymentTransactionId}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '0.825rem', color: '#fff' }}>Roll: <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{reg.rollNo}</strong></div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GR: <strong style={{ color: '#a855f7', fontFamily: 'var(--font-code)' }}>{reg.grNo || 'N/A'}</strong></div>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          <div style={{ color: '#fff', fontWeight: 500 }}>{reg.department}</div>
                          <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>
                            {reg.year} {reg.div ? `• DIV ${reg.div}` : ''}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-main)', maxWidth: '200px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {reg.eventTitle}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <select 
                            className="form-select"
                            style={{
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.75rem',
                              width: 'auto',
                              borderColor: reg.status === 'Pending' ? '#f59e0b' : undefined,
                              color: reg.status === 'Pending' ? '#fbbf24' : undefined
                            }}
                            value={reg.status}
                            onChange={(e) => handleUpdateRegStatus(reg.id, e.target.value as any)}
                          >
                            <option value="Pending">⏳ Pending Approval</option>
                            <option value="Confirmed">Confirmed (Ticket Issued)</option>
                            <option value="Attended">Attended ✓</option>
                            <option value="Absent">Absent ✗</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            {reg.status === 'Pending' && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: '#059669', borderColor: '#10b981' }}
                                onClick={() => handleUpdateRegStatus(reg.id, 'Confirmed')}
                                title="Approve Payment & Issue Digital Pass Ticket"
                              >
                                ✓ Approve Ticket
                              </button>
                            )}
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteRegistration(reg.id)}
                              title="Remove Registration"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No registrations matching the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: PAST MEMORIES MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'memories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Event Memories Timeline Posts</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setIsMemoryModalOpen(true)}>
                <Plus size={16} /> Post Memory Highlight
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Title & Year</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Attendees</th>
                    <th style={{ padding: '1rem' }}>Highlights / Winners</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memories.map((mem) => (
                    <tr key={mem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{mem.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>Year {mem.year} • {mem.date}</div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-purple">{mem.category}</span>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                        {mem.attendeesCount}+ Attendees
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px' }}>
                        {mem.winners && mem.winners.length > 0 ? (
                          <div style={{ color: '#34d399' }}>🏆 {mem.winners[0]}</div>
                        ) : (
                          <div>{mem.highlights.join(', ')}</div>
                        )}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteMemory(mem.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: ANNOUNCEMENTS BANNER MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Create Announcement */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="#00f2fe" /> Publish Banner Announcement
              </h3>

              <form onSubmit={handleAddAnnouncement}>
                <div className="form-group">
                  <label className="form-label">Announcement Banner Text</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="e.g. 🚨 Registrations for Hackathon CodeMatrix 2026 are now OPEN!"
                    className="form-textarea"
                    value={newAnnouncementText}
                    onChange={(e) => setNewAnnouncementText(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Broadcast Announcement
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem' }}>Active Announcements</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {announcements.map((anc) => (
                  <div key={anc.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#fff' }}>{anc.content}</div>
                      <span className={`badge ${anc.active ? 'badge-green' : 'badge'}`} style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                        {anc.active ? 'ACTIVE ON WEBSITE' : 'DISABLED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => { StorageService.toggleAnnouncement(anc.id); onRefreshData(); }}
                      >
                        {anc.active ? 'Disable' : 'Enable'}
                      </button>

                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => { StorageService.deleteAnnouncement(anc.id); onRefreshData(); }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: 3D GLOBE GALLERY MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>3D Memory Globe Gallery</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Upload photo images or paste URLs to render them on the interactive 3D Memory Globe.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setIsGalleryModalOpen(true)}>
                <Plus size={16} /> Add Photo to Memory Globe
              </button>
            </div>

            {galleryPhotos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '170px', position: 'relative', overflow: 'hidden', background: '#0a0e1a' }}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge badge-purple" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem' }}>
                        {photo.year}
                      </span>
                    </div>

                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>{photo.title}</h4>
                        {photo.eventName && (
                          <p style={{ fontSize: '0.78rem', color: '#00f2fe', margin: '0 0 0.5rem 0' }}>{photo.eventName}</p>
                        )}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{photo.caption}</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteGalleryPhoto(photo.id)}
                          style={{ gap: '0.3rem', padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} /> Remove from Globe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No photos added yet. Click "Add Photo to Memory Globe" above to add your first photo!</p>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: MANAGE CREW & LEADERSHIP */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'crew' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>Manage Crew Members & Leadership</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Edit crew member photos, names, and roles. All edits sync in real-time to all devices and visitors.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleOpenAddCrewModal}>
                <Plus size={16} /> Add New Crew Member
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {crewMembers.map((member) => (
                <div key={member.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #00f2fe', marginBottom: '1rem', background: '#0a0f1d' }}>
                    <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 0.35rem 0', fontWeight: 700 }}>{member.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 600, marginBottom: '1rem' }}>{member.role}</div>

                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                      onClick={() => handleEditCrewMember(member)}
                    >
                      <Edit3 size={14} /> Edit Photo & Info
                    </button>

                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCrewMember(member.id, member.name)}
                      title="Delete Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: STUDENT FEEDBACK & REVIEWS (ADMIN ONLY) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'feedback' && (
          <div>
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} color="#00f2fe" /> Student Event Feedback Responses
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  🔒 Confidential Student Reviews & Ratings. Only visible to GITS Coordinators.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select 
                  className="form-select"
                  style={{ width: 'auto', minWidth: '200px' }}
                  value={feedbackEventFilter}
                  onChange={(e) => setFeedbackEventFilter(e.target.value)}
                >
                  <option value="All">All Events Feedback</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ borderColor: 'rgba(0, 242, 254, 0.4)', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => handleOpenQuestionManager()}
                >
                  <Settings size={16} /> Edit Feedback Form Questions
                </button>

                <button className="btn btn-primary btn-sm" onClick={handleExportFeedbackCSV}>
                  <Download size={16} /> Export Feedback CSV
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TOTAL FEEDBACK SUBMISSIONS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  {feedbackEventFilter === 'All' ? feedbackList.length : feedbackList.filter(f => f.eventId === feedbackEventFilter).length}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>AVERAGE OVERALL RATING</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {(() => {
                    const target = feedbackEventFilter === 'All' ? feedbackList : feedbackList.filter(f => f.eventId === feedbackEventFilter);
                    if (target.length === 0) return 'N/A';
                    const avg = target.reduce((sum, f) => sum + (f.overallRating || 5), 0) / target.length;
                    return `${avg.toFixed(1)} ★`;
                  })()}
                </div>
              </div>
            </div>

            {/* Feedback Responses Table */}
            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Event Title</th>
                    <th style={{ padding: '1rem' }}>Student Details</th>
                    <th style={{ padding: '1rem' }}>Overall Rating</th>
                    <th style={{ padding: '1rem' }}>Custom Answers & Comments</th>
                    <th style={{ padding: '1rem' }}>Submitted At</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(feedbackEventFilter === 'All' ? feedbackList : feedbackList.filter(f => f.eventId === feedbackEventFilter)).length > 0 ? (
                    (feedbackEventFilter === 'All' ? feedbackList : feedbackList.filter(f => f.eventId === feedbackEventFilter)).map((fb) => (
                      <tr key={fb.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#00f2fe', maxWidth: '180px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fb.eventTitle}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{fb.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Roll: <strong style={{ color: '#00f2fe' }}>{fb.rollNo}</strong> • {fb.studentEmail}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontWeight: 700 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} fill={s <= (fb.overallRating || 5) ? '#fbbf24' : 'transparent'} color={s <= (fb.overallRating || 5) ? '#fbbf24' : '#475569'} />
                            ))}
                            <span style={{ marginLeft: '0.35rem', fontSize: '0.8rem' }}>({fb.overallRating || 5}/5)</span>
                          </div>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.825rem', maxWidth: '320px' }}>
                          {fb.answers.map((ans, aIdx) => (
                            <div key={aIdx} style={{ marginBottom: '0.35rem' }}>
                              <strong style={{ color: '#e2e8f0' }}>{ans.questionText}:</strong>{' '}
                              <span style={{ color: '#00f2fe' }}>{ans.answer}</span>
                            </div>
                          ))}
                          {fb.comments && (
                            <div style={{ marginTop: '0.4rem', fontStyle: 'italic', color: '#94a3b8', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.35rem' }}>
                              💬 "{fb.comments}"
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {new Date(fb.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm('Delete this feedback entry?')) {
                                StorageService.deleteFeedbackResponse(fb.id);
                                setFeedbackList(StorageService.getFeedbackResponses());
                              }
                            }}
                            title="Delete Feedback Entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No feedback submissions received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* MODAL: EDIT / ADD CREW MEMBER */}
      {isCrewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCrewModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                {editingCrewId ? 'Edit Crew Member Photo & Info' : 'Add New Crew Member'}
              </h3>
              <button onClick={() => setIsCrewModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCrewMember} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Member Full Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Aarav Mehta"
                  value={crewForm.name}
                  onChange={(e) => setCrewForm({ ...crewForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role / Position *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. President · Lead Coordinator"
                  value={crewForm.role}
                  onChange={(e) => setCrewForm({ ...crewForm, role: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Member Photo</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label 
                      className="btn btn-secondary btn-sm" 
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Upload size={16} /> Upload Photo File
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleCrewImageUpload}
                      />
                    </label>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or paste photo URL:</span>
                  </div>

                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={crewForm.img}
                    onChange={(e) => setCrewForm({ ...crewForm, img: e.target.value })}
                  />

                  {crewForm.img && (
                    <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #00f2fe', flexShrink: 0 }}>
                        <img src={crewForm.img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 600 }}>
                        Photo Preview
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCrewModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingCrewId ? 'Save Member Changes' : 'Add Crew Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL: CREATE / EDIT EVENT */}
      {isEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEventModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                {editingEventId ? 'Edit Club Event Details' : 'Create New GITS Club Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. AI & ML Deep Learning Masterclass"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Pricing / Fee Type *</label>
                  <select 
                    className="form-select"
                    value={eventForm.isPaid ? 'Paid' : 'Free'}
                    onChange={(e) => {
                      const isPaid = e.target.value === 'Paid';
                      setEventForm({
                        ...eventForm,
                        isPaid,
                        fee: isPaid ? (eventForm.fee === 'Free' ? '₹50' : eventForm.fee) : 'Free'
                      });
                    }}
                  >
                    <option value="Free">🆓 Free Event</option>
                    <option value="Paid">💳 Paid Event (Requires Admin Payment Verification)</option>
                  </select>
                </div>

                {eventForm.isPaid ? (
                  <div className="form-group">
                    <label className="form-label">Registration Fee Amount *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      placeholder="e.g. ₹50 or ₹100"
                      value={eventForm.fee}
                      onChange={(e) => setEventForm({ ...eventForm, fee: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Event Scope *</label>
                    <select 
                      className="form-select"
                      value={eventForm.eventScope}
                      onChange={(e) => setEventForm({ ...eventForm, eventScope: e.target.value as any })}
                    >
                      <option value="Intra-College">🏫 Intra-College (DMCE Only)</option>
                      <option value="Inter-College">🌐 Inter-College (Open to All)</option>
                    </select>
                  </div>
                )}
              </div>

              {eventForm.isPaid && (
                <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                  <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    💳 Paid Event Payment Options (Google Pay / PhonePe / Paytm QR Code)
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">UPI ID for Direct Transfers (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. gits@upi or 9876543210@paytm"
                      value={eventForm.upiId}
                      onChange={(e) => setEventForm({ ...eventForm, upiId: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Upload Payment QR Code Image (PNG / JPG / GPay / PhonePe QR) *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label 
                          className="btn btn-secondary btn-sm" 
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                        >
                          <Upload size={16} /> Upload Payment QR Image (PNG/JPG)
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={handlePaymentQrUpload}
                          />
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or paste Image URL:</span>
                      </div>

                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="https://.../gpay-qr-code.png"
                        value={eventForm.paymentQrImage}
                        onChange={(e) => setEventForm({ ...eventForm, paymentQrImage: e.target.value })}
                      />

                      {eventForm.paymentQrImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#fff', borderRadius: '10px', width: 'fit-content', border: '2px solid #fbbf24' }}>
                          <img src={eventForm.paymentQrImage} alt="Payment QR Code Preview" style={{ width: '110px', height: '110px', objectFit: 'contain' }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 800 }}>UPI / GPay QR Preview</div>
                            <div style={{ fontSize: '0.75rem', color: '#475569' }}>Students will scan this QR to pay {eventForm.fee}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Per-Event Custom Feedback Form Builder */}
              <div className="glass-card" style={{ padding: '1.15rem', marginBottom: '1.25rem', border: '1px solid rgba(0, 242, 254, 0.3)', background: 'rgba(0, 242, 254, 0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ fontWeight: 700, color: '#00f2fe', fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={16} /> Per-Event Custom Feedback Questions Builder
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                    onClick={() => {
                      setEventForm({
                        ...eventForm,
                        feedbackQuestions: [
                          ...(eventForm.feedbackQuestions || []),
                          { id: 'q-' + Date.now(), questionText: 'Custom Event Question', type: 'text' }
                        ]
                      });
                    }}
                  >
                    + Add Question
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  Customize the feedback questions students will answer for this specific event. Student responses will only be visible to Admins.
                </p>

                {(eventForm.feedbackQuestions || []).map((q, qIdx) => (
                  <div key={q.id || qIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 700, width: '24px' }}>Q{qIdx + 1}.</span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1, padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                      placeholder="Enter question text..."
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...(eventForm.feedbackQuestions || [])];
                        updated[qIdx] = { ...updated[qIdx], questionText: e.target.value };
                        setEventForm({ ...eventForm, feedbackQuestions: updated });
                      }}
                    />
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                      value={q.type}
                      onChange={(e) => {
                        const updated = [...(eventForm.feedbackQuestions || [])];
                        updated[qIdx] = { ...updated[qIdx], type: e.target.value as any };
                        setEventForm({ ...eventForm, feedbackQuestions: updated });
                      }}
                    >
                      <option value="rating">1-5 Rating ★</option>
                      <option value="text">Text Response</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.35rem 0.5rem' }}
                      onClick={() => {
                        const updated = (eventForm.feedbackQuestions || []).filter((_, i) => i !== qIdx);
                        setEventForm({ ...eventForm, feedbackQuestions: updated });
                      }}
                      title="Remove Question"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Tech Talk">Tech Talk</option>
                    <option value="Coding Contest">Coding Contest</option>
                    <option value="Project Expo">Project Expo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as EventStatus })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Seat Capacity</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date (YYYY-MM-DD)</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="10:00 AM - 04:00 PM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue / Room Location</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="IT Block Lab 4 & Auditorium"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  value={eventForm.shortDescription}
                  onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Event Description</label>
                <textarea 
                  rows={3} 
                  required 
                  className="form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Banner Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label 
                      className="btn btn-secondary btn-sm" 
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Upload size={16} /> Upload Image File
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleEventBannerUpload}
                      />
                    </label>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or paste image URL:</span>
                  </div>

                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={eventForm.image}
                    onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  />

                  {eventForm.image && (
                    <div style={{ marginTop: '0.25rem', borderRadius: '8px', overflow: 'hidden', height: '140px', border: '1px solid rgba(255,255,255,0.12)', position: 'relative' }}>
                      <img src={eventForm.image} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#00f2fe', fontWeight: 600 }}>
                        📷 Banner Preview
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEventModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST PAST MEMORY */}
      {isMemoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMemoryModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Add Past Event Memory Highlight</h3>
              <button onClick={() => setIsMemoryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Memory Title *</label>
                <input 
                  type="text" required className="form-input" placeholder="e.g. GITS Hackathon 2025"
                  value={memoryForm.title} onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input 
                    type="text" required className="form-input" placeholder="2025"
                    value={memoryForm.year} onChange={(e) => setMemoryForm({ ...memoryForm, year: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attendees Count</label>
                  <input 
                    type="number" required className="form-input"
                    value={memoryForm.attendeesCount} onChange={(e) => setMemoryForm({ ...memoryForm, attendeesCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Memory Description *</label>
                <textarea 
                  rows={3} required className="form-textarea"
                  value={memoryForm.description} onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Photo Image URL</label>
                <input 
                  type="text" className="form-input"
                  value={memoryForm.image} onChange={(e) => setMemoryForm({ ...memoryForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Winners Podium (comma separated)</label>
                <input 
                  type="text" className="form-input" placeholder="1st Place: Team NeuralX, 2nd Place: Team Cypher"
                  value={memoryForm.winners} onChange={(e) => setMemoryForm({ ...memoryForm, winners: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsMemoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Memory Highlight</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PHOTO TO MEMORY GLOBE */}
      {isGalleryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGalleryModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} color="#00f2fe" /> Add Photo to Memory Globe
              </h3>
              <button onClick={() => setIsGalleryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGalleryPhoto} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input 
                  type="text" required className="form-input" placeholder="e.g. CodeMatrix 2026 Hackathon Night"
                  value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Name</label>
                  <input 
                    type="text" className="form-input" placeholder="CodeMatrix 2026"
                    value={galleryForm.eventName} onChange={(e) => setGalleryForm({ ...galleryForm, eventName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input 
                    type="text" required className="form-input" placeholder="2026"
                    value={galleryForm.year} onChange={(e) => setGalleryForm({ ...galleryForm, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Caption / Details</label>
                <input 
                  type="text" className="form-input" placeholder="Brief memory highlight description..."
                  value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                />
              </div>

              {/* Upload or URL options */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Upload size={14} color="#00f2fe" /> Select Image File from Device
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="form-input" 
                  onChange={handleGalleryFileUpload} 
                  style={{ padding: '0.4rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ImageIcon size={14} color="#00f2fe" /> OR Image Web URL
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/..."
                  value={galleryForm.imageUrl} 
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                />
              </div>

              {galleryForm.imageUrl && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: '#00f2fe' }}>Image Preview:</label>
                  <div style={{ width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                    <img src={galleryForm.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsGalleryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Photo to Globe</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FEEDBACK FORM QUESTIONS */}
      {isQuestionManagerOpen && (
        <div className="modal-overlay" onClick={() => setIsQuestionManagerOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(121, 40, 202, 0.15) 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00f2fe', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  <Settings size={14} /> Admin Feedback Form Editor
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>Configure Feedback Questions</h3>
              </div>
              <button onClick={() => setIsQuestionManagerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionsForEvent} style={{ padding: '1.5rem' }}>
              
              {/* Target Event Selection */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#fff' }}>Select Event to Edit Feedback Questions *</label>
                <select
                  className="form-select"
                  style={{ background: 'rgba(0, 242, 254, 0.05)', borderColor: 'rgba(0, 242, 254, 0.3)', color: '#fff', fontWeight: 600 }}
                  value={selectedEventForQuestions}
                  onChange={(e) => handleSelectEventForQuestions(e.target.value)}
                >
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title} ({e.category} - {e.date})</option>
                  ))}
                </select>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Students registering or viewing this event will answer these exact customized feedback questions.
                </div>
              </div>

              {/* Questions List Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontWeight: 700, color: '#00f2fe', fontSize: '0.9rem' }}>
                  Questions List ({questionsForm.length} total)
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                  onClick={() => {
                    setQuestionsForm([
                      ...questionsForm,
                      { id: 'q-' + Date.now(), questionText: 'New Custom Feedback Question', type: 'text' }
                    ]);
                  }}
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>

              {/* Questions List Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {questionsForm.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    No questions added yet. Click "+ Add Question" above to create your first question.
                  </div>
                ) : (
                  questionsForm.map((q, idx) => (
                    <div 
                      key={q.id || idx}
                      style={{
                        padding: '0.85rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 800 }}>Question {idx + 1}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {/* Move Up */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.4rem', opacity: idx === 0 ? 0.3 : 1 }}
                            onClick={() => {
                              const updated = [...questionsForm];
                              const temp = updated[idx - 1];
                              updated[idx - 1] = updated[idx];
                              updated[idx] = temp;
                              setQuestionsForm(updated);
                            }}
                            title="Move Question Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          {/* Move Down */}
                          <button
                            type="button"
                            disabled={idx === questionsForm.length - 1}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.4rem', opacity: idx === questionsForm.length - 1 ? 0.3 : 1 }}
                            onClick={() => {
                              const updated = [...questionsForm];
                              const temp = updated[idx + 1];
                              updated[idx + 1] = updated[idx];
                              updated[idx] = temp;
                              setQuestionsForm(updated);
                            }}
                            title="Move Question Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.2rem 0.4rem' }}
                            onClick={() => {
                              setQuestionsForm(questionsForm.filter((_, i) => i !== idx));
                            }}
                            title="Delete Question"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          required
                          className="form-input"
                          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                          placeholder="e.g. How would you rate the keynote speaker?"
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...questionsForm];
                            updated[idx] = { ...updated[idx], questionText: e.target.value };
                            setQuestionsForm(updated);
                          }}
                        />
                        <select
                          className="form-select"
                          style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.8rem', minWidth: '130px' }}
                          value={q.type}
                          onChange={(e) => {
                            const updated = [...questionsForm];
                            updated[idx] = { ...updated[idx], type: e.target.value as any };
                            setQuestionsForm(updated);
                          }}
                        >
                          <option value="rating">1-5 Rating ★</option>
                          <option value="text">Text Input 📝</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {questionsSaveSuccess && (
                <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={16} /> Feedback Form Questions saved and updated live!
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsQuestionManagerOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={16} /> Save Questions to Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
