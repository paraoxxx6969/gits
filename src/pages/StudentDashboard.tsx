import React from 'react';
import type { EventRegistration, ClubEvent } from '../types';
import { Ticket, Calendar, MapPin, QrCode } from 'lucide-react';


interface StudentDashboardProps {
  studentInfo: { name: string; rollNo: string; email: string };
  registrations: EventRegistration[];
  events: ClubEvent[];
  onViewTicket: (reg: EventRegistration) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentInfo,
  registrations,
  events,
  onViewTicket
}) => {
  // Filter student's own registrations
  const studentRegs = registrations.filter(
    r => r.rollNo.toUpperCase() === studentInfo.rollNo.toUpperCase() || r.email.toLowerCase() === studentInfo.email.toLowerCase()
  );

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Student Profile Header */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(121, 40, 202, 0.12) 100%)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080c14', fontWeight: 800, fontSize: '1.5rem' }}>
            {studentInfo.name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.25rem' }}>STUDENT PORTAL PROFILE</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>{studentInfo.name}</h1>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
              <span>Roll No: <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{studentInfo.rollNo}</strong></span>
              <span>Email: <strong style={{ color: '#fff' }}>{studentInfo.email}</strong></span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00f2fe' }}>{studentRegs.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Passes</div>
          </div>
        </div>

        {/* Registered Events Section */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={22} color="#00f2fe" /> My Event Tickets & Passes
          </h2>

          {studentRegs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {studentRegs.map(reg => {
                const event = events.find(e => e.id === reg.eventId);
                return (
                  <div key={reg.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge badge-green">CONFIRMED PASS</span>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-code)', color: '#00f2fe' }}>{reg.ticketCode}</span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{reg.eventTitle}</h3>
                      
                      {event && (
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '0.85rem 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} color="#00f2fe" /> {event.date} • {event.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} color="#7928ca" /> {event.venue}
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      className="btn btn-outline-cyan btn-sm"
                      onClick={() => onViewTicket(reg)}
                      style={{ marginTop: '1rem', width: '100%', gap: '0.5rem' }}
                    >
                      <QrCode size={16} /> View Digital Pass QR Ticket
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Ticket size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <p>You have not registered for any upcoming events yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
