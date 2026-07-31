import React from 'react';
import { X, Calendar, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ClubEvent } from '../types';


interface EventDetailsModalProps {
  event: ClubEvent | null;
  onClose: () => void;
  onRegister: (event: ClubEvent) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onRegister
}) => {
  if (!event) return null;

  const isFull = event.registeredCount >= event.capacity;
  const isCompleted = event.status === 'Completed';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        
        {/* Banner */}
        <div style={{ position: 'relative', height: '240px' }}>
          <img 
            src={event.image} 
            alt={event.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 10%, transparent 80%)' }} />
          
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>{event.category}</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{event.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          
          {/* Quick Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Time</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="#00f2fe" /> {event.date}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.time}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Venue / Location</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#4facfe" /> {event.venue}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seats / Capacity</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} color="#10b981" /> {event.registeredCount} / {event.capacity} Registered
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration Fee</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                {event.fee === 'Free' ? 'FREE ENTRY' : event.fee}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>About This Event</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{event.description}</p>
          </div>

          {/* Key Prerequisites */}
          {event.prerequisites && event.prerequisites.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem' }}>Prerequisites / Requirements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {event.prerequisites.map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={16} color="#00f2fe" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaker / Host Info */}
          {event.speaker && (
            <div style={{ background: 'rgba(121, 40, 202, 0.12)', border: '1px solid rgba(121, 40, 202, 0.3)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img 
                src={event.speaker.avatar} 
                alt={event.speaker.name} 
                style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7928ca' }}
              />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#d8b4fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Keynote Speaker</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{event.speaker.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{event.speaker.role} • {event.speaker.organization}</div>
              </div>
            </div>
          )}

          {/* Agenda / Schedule */}
          {event.schedule && event.schedule.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>Event Itinerary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {event.schedule.map((item, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #00f2fe', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f2fe', whiteSpace: 'nowrap' }}>{item.time}</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{item.title}</div>
                      {item.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {event.tags.map((t, idx) => (
              <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                #{t}
              </span>
            ))}
          </div>

          {/* Footer Action */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Organized by <strong style={{ color: '#fff' }}>{event.organizer}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button 
                className="btn btn-primary"
                disabled={isFull || isCompleted}
                onClick={() => { onClose(); onRegister(event); }}
                style={{ opacity: (isFull || isCompleted) ? 0.6 : 1 }}
              >
                {isCompleted ? 'Event Completed' : isFull ? 'Registration Full' : <>Reserve Slot <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
