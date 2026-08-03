import React from 'react';
import type { EventRegistration, ClubEvent, StudentProfile } from '../types';
import { Ticket, Calendar, MapPin, QrCode, Edit3, Award, BookOpen, Layers, Hash, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';


interface StudentDashboardProps {
  studentInfo: StudentProfile;
  registrations: EventRegistration[];
  events: ClubEvent[];
  onViewTicket: (reg: EventRegistration) => void;
  onEditProfile?: () => void;
  onCancelRegistration?: (reg: EventRegistration) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentInfo,
  registrations,
  events,
  onViewTicket,
  onEditProfile,
  onCancelRegistration
}) => {
  // Filter student's own registrations
  const studentRegs = registrations.filter(
    r => r.rollNo.toUpperCase() === studentInfo.rollNo.toUpperCase() || r.email.toLowerCase() === studentInfo.email.toLowerCase()
  );

  const getStatusBadge = (status: EventRegistration['status']) => {
    switch (status) {
      case 'Attended':
        return <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={12} /> Attended</span>;
      case 'Absent':
        return <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={12} /> Absent</span>;
      case 'Cancelled':
        return <span className="badge" style={{ background: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-green">CONFIRMED PASS</span>;
    }
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Student Profile Header */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(121, 40, 202, 0.12) 100%)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080c14', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
            {studentInfo.name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span className="badge badge-cyan">STUDENT PORTAL PROFILE</span>
              {studentInfo.year && <span className="badge badge-purple">{studentInfo.year} YEAR</span>}
              {studentInfo.div && <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>DIV {studentInfo.div}</span>}
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>{studentInfo.name}</h1>
            
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginTop: '0.65rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Hash size={14} color="#00f2fe" /> Roll No: <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{studentInfo.rollNo || 'N/A'}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={14} color="#00f2fe" /> GR No: <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{studentInfo.grNo || 'N/A'}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} color="#00f2fe" /> Branch: <strong style={{ color: '#fff' }}>{studentInfo.branch || 'Information Technology'}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} color="#00f2fe" /> Email: <strong style={{ color: '#fff' }}>{studentInfo.email}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
            {onEditProfile && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={onEditProfile}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
            <div className="glass-card" style={{ padding: '0.5rem 1rem', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00f2fe' }}>{studentRegs.length}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Registered Passes</div>
            </div>
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
                const isCancelled = reg.status === 'Cancelled';
                return (
                  <div
                    key={reg.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isCancelled ? 0.65 : 1,
                      border: isCancelled
                        ? '1px solid rgba(100,116,139,0.3)'
                        : reg.status === 'Attended'
                          ? '1px solid rgba(16,185,129,0.4)'
                          : undefined
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {getStatusBadge(reg.status)}
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-code)', color: '#00f2fe' }}>{reg.ticketCode}</span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: isCancelled ? 'var(--text-muted)' : '#fff', marginBottom: '0.5rem' }}>
                        {reg.eventTitle}
                      </h3>
                      
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

                      {reg.status === 'Attended' && reg.attendedAt && (
                        <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={12} /> Attended on {new Date(reg.attendedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {!isCancelled && (
                        <button 
                          className="btn btn-outline-cyan btn-sm"
                          onClick={() => onViewTicket(reg)}
                          style={{ width: '100%', gap: '0.5rem' }}
                        >
                          <QrCode size={16} /> View Digital Pass QR Ticket
                        </button>
                      )}

                      {/* Cancel button — only shown for active registrations */}
                      {(reg.status === 'Confirmed') && onCancelRegistration && (
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            if (window.confirm(`Cancel your registration for "${reg.eventTitle}"? This will free up your slot.`)) {
                              onCancelRegistration(reg);
                            }
                          }}
                          style={{
                            width: '100%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            fontWeight: 600,
                            fontSize: '0.82rem'
                          }}
                        >
                          <XCircle size={14} /> Cancel Registration
                        </button>
                      )}

                      {isCancelled && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem 0' }}>
                          Registration cancelled
                        </div>
                      )}
                    </div>
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
