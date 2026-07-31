import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import type { ClubEvent, EventRegistration, EventMemory, Announcement, UserSession } from './types';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { WinnersPage } from './pages/WinnersPage';
import { MemoriesGallery } from './pages/MemoriesGallery';
import { MembersPage } from './pages/MembersPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userSession, setUserSession] = useState<UserSession>({ role: 'guest' });

  // App Data State
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [memories, setMemories] = useState<EventMemory[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Active Modals state
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<ClubEvent | null>(null);
  const [generatedPass, setGeneratedPass] = useState<{ registration: EventRegistration; event: ClubEvent } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const refreshData = () => {
    setEvents(StorageService.getEvents());
    setRegistrations(StorageService.getRegistrations());
    setMemories(StorageService.getMemories());
    setAnnouncements(StorageService.getAnnouncements());
  };

  useEffect(() => {
    refreshData();
    const session = StorageService.getUserSession();
    setUserSession(session);
    setIsAuthenticated(Boolean(session.role && session.role !== 'guest'));
  }, []);

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setIsAuthenticated(true);
    StorageService.saveUserSession(session);
    if (session.role === 'admin') {
      setActiveTab('admin');
    } else if (session.role === 'student') {
      setActiveTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    setUserSession({ role: 'guest' });
    setIsAuthenticated(false);
    StorageService.clearUserSession();
    setActiveTab('home');
  };

  const handleRegistrationSuccess = (reg: EventRegistration) => {
    const targetEvent = events.find(e => e.id === reg.eventId) || registeringEvent;
    setRegisteringEvent(null);
    refreshData();
    if (targetEvent) {
      setGeneratedPass({ registration: reg, event: targetEvent });
    }
  };

  const handleViewTicketFromStudentDashboard = (reg: EventRegistration) => {
    const targetEvent = events.find(e => e.id === reg.eventId);
    if (targetEvent) {
      setGeneratedPass({ registration: reg, event: targetEvent });
    }
  };

  if (!isAuthenticated && userSession.role === 'guest') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Top Header with Embedded Apple MacBook Animated Logo Dock */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSession={userSession}
        onOpenLoginModal={() => setIsAuthenticated(false)}
        onLogout={handleLogout}
        announcements={announcements}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomePage 
            events={events}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onRegisterEvent={(evt) => setRegisteringEvent(evt)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'events' && (
          <EventsPage 
            events={events}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onRegisterEvent={(evt) => setRegisteringEvent(evt)}
          />
        )}

        {activeTab === 'winners' && (
          <WinnersPage 
            memories={memories}
          />
        )}

        {activeTab === 'gallery' && (
          <MemoriesGallery 
            userRole={userSession.role}
          />
        )}

        {activeTab === 'members' && (
          <MembersPage />
        )}

        {activeTab === 'student-dashboard' && userSession.role === 'student' && userSession.studentInfo && (
          <StudentDashboard 
            studentInfo={userSession.studentInfo}
            registrations={registrations}
            events={events}
            onViewTicket={handleViewTicketFromStudentDashboard}
          />
        )}

        {activeTab === 'admin' && userSession.role === 'admin' && (
          <AdminDashboard 
            events={events}
            registrations={registrations}
            memories={memories}
            announcements={announcements}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Footer (hidden on Memory Gallery page) */}
      {activeTab !== 'gallery' && (
        <Footer 
          setActiveTab={setActiveTab}
          onOpenLoginModal={() => setIsAuthenticated(false)}
        />
      )}

      {/* Modals */}
      <EventDetailsModal 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={(evt) => { setSelectedEvent(null); setRegisteringEvent(evt); }}
      />

      <RegistrationModal 
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={handleRegistrationSuccess}
      />

      <DigitalPassModal 
        registration={generatedPass ? generatedPass.registration : null}
        event={generatedPass ? generatedPass.event : null}
        onClose={() => setGeneratedPass(null)}
      />

    </div>
  );
};

export default App;
