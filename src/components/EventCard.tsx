import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, CheckCircle2, Hourglass } from 'lucide-react';
import type { ClubEvent, EventRegistration } from '../types';


interface EventCardProps {
  event: ClubEvent;
  onSelectEvent: (event: ClubEvent) => void;
  onRegisterEvent: (event: ClubEvent) => void;
  isRegistered?: boolean;
  userRegStatus?: EventRegistration['status'];
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onRegisterEvent,
  isRegistered = false,
  userRegStatus
}) => {
  const isFull = event.registeredCount >= event.capacity;
  const isLive = event.status === 'Live';
  const isPending = isRegistered && userRegStatus === 'Pending';
  const isConfirmed = isRegistered && userRegStatus !== 'Pending';

  // Category badge styling
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Hackathon': return 'badge-purple';
      case 'Workshop': return 'badge-cyan';
      case 'Coding Contest': return 'badge-green';
      default: return 'badge-amber';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Live') return <span className="badge badge-green" style={{ background: 'rgba(16,185,129,0.2)' }}><span className="pulse-dot"></span> LIVE NOW</span>;
    if (status === 'Upcoming') return <span className="badge badge-cyan">UPCOMING</span>;
    return <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>COMPLETED</span>;
  };

  const seatPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...(isPending && {
          border: '1px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.15), 0 8px 32px rgba(245, 158, 11, 0.08)'
        }),
        ...(isConfirmed && {
          border: '1px solid rgba(16, 185, 129, 0.5)',
          boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.15), 0 8px 32px rgba(16, 185, 129, 0.08)'
        })
      }}
    >
      {/* Top Banner Ribbon for Registered Users */}
      {isPending && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)',
          color: '#fff', padding: '0.45rem 1rem', fontSize: '0.78rem',
          fontWeight: 700, letterSpacing: '0.03em', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        }}>
          <Hourglass size={14} />
          ⏳ Registration Pending Payment Verification
        </div>
      )}

      {isConfirmed && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
          color: '#fff', padding: '0.45rem 1rem', fontSize: '0.78rem',
          fontWeight: 700, letterSpacing: '0.03em', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        }}>
          <CheckCircle2 size={14} />
          🎉 You're registered — Seat Confirmed!
        </div>
      )}

      {/* Event Header Banner Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', marginTop: isRegistered ? '32px' : 0 }}>
        <img 
          src={event.image} 
          alt={event.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 60%)' }} />
        
        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span className={`badge ${getCategoryBadgeClass(event.category)}`}>
              <Tag size={10} /> {event.category}
            </span>
            {(event.isPaid || (event.fee && event.fee !== 'Free')) && (
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 700 }}>
                💳 {event.fee}
              </span>
            )}
          </div>
          {getStatusBadge(event.status)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <h3 
          onClick={() => onSelectEvent(event)} 
          style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.65rem', cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {event.title}
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
          {event.shortDescription}
        </p>

        {/* Date & Location Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="#00f2fe" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} color="#4facfe" />
            <span>{event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="#7928ca" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
          </div>
        </div>

        {/* Seat Fill Progress Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Users size={12} /> Seats Booked</span>
            <span style={{ fontWeight: 600, color: isFull ? '#ef4444' : '#00f2fe' }}>
              {event.registeredCount} / {event.capacity} ({seatPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${seatPercent}%`, 
              height: '100%', 
              background: isFull ? '#ef4444' : isPending ? 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)' : isConfirmed ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)' : 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onSelectEvent(event)} 
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            See Details
          </button>
          
          {isPending ? (
            <button
              disabled
              className="btn btn-sm"
              style={{
                flex: 1.2,
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                color: '#fbbf24',
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                fontSize: '0.78rem'
              }}
            >
              <Hourglass size={13} /> Pending Verification
            </button>
          ) : isConfirmed ? (
            <button
              disabled
              className="btn btn-sm"
              style={{
                flex: 1.2,
                background: 'rgba(5, 150, 105, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#34d399',
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              <CheckCircle2 size={14} /> Seat Confirmed
            </button>
          ) : isLive && !isFull ? (
            <button 
              onClick={() => onRegisterEvent(event)} 
              className="btn btn-sm btn-primary"
              style={{ flex: 1.2 }}
            >
              ⚡ Register Now
            </button>
          ) : isLive && isFull ? (
            <button 
              disabled
              className="btn btn-sm btn-secondary"
              style={{ flex: 1.2, opacity: 0.6, cursor: 'not-allowed' }}
            >
              House Full
            </button>
          ) : (
            <button 
              disabled
              className="btn btn-sm btn-secondary"
              style={{ flex: 1.2, opacity: 0.6, cursor: 'not-allowed' }}
            >
              🔔 Stay Tuned
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
