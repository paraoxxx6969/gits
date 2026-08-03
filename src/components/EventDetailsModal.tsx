import React from 'react';
import { X, Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const isLive = event.status === 'Live';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        
        {/* Banner Header */}
        <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
          <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 60%)' }} />
          
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>{event.category}</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{event.title}</h2>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          
          {/* Quick Info Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={18} color="#00f2fe" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DATE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{event.date}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Clock size={18} color="#4facfe" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TIME</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{event.time}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={18} color="#7928ca" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LOCATION</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{event.venue}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Users size={18} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CAPACITY</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{event.registeredCount} / {event.capacity} Seats</div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>About Event</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>{event.description}</p>
          </div>

          {/* Prerequisites */}
          {event.prerequisites && event.prerequisites.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Prerequisites</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {event.prerequisites.map((req, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <CheckCircle2 size={14} color="#00f2fe" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Speaker Highlight */}
          {event.speaker && (
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img src={event.speaker.avatar} alt={event.speaker.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#00f2fe', fontWeight: 700 }}>KEYNOTE SPEAKER</div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{event.speaker.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.speaker.role} • {event.speaker.organization}</div>
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {event.tags.map((t, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Organized by <strong style={{ color: '#fff' }}>{event.organizer}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              
              {isLive && !isFull ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => { onClose(); onRegister(event); }}
                >
                  ⚡ Register Now <ArrowRight size={16} />
                </button>
              ) : isLive && isFull ? (
                <button 
                  disabled
                  className="btn btn-secondary"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  House Full
                </button>
              ) : (
                <button 
                  disabled
                  className="btn btn-secondary"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  🔔 Stay Tuned
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
