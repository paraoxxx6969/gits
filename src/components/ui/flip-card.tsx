import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { CrewMember } from '../../types';

const LinkedInIcon = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export interface CardFlipProps {
  member?: CrewMember;
}

export default function CardFlip({ member }: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!member) return null;

  return (
    <div
      style={{ perspective: '1200px', width: '100%', maxWidth: '260px', height: '340px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Inner flipper */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: '16px',
        }}
      >
        {/* ===== FRONT — pure photo ===== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Photo */}
          <img
            src={member.img}
            alt={member.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          {/* Subtle bottom fade for name readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
              borderRadius: '16px',
            }}
          />
          {/* Name & Role */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>{member.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#00f2fe', fontWeight: 600, marginTop: '3px' }}>{member.role}</div>
          </div>
        </div>

        {/* ===== BACK — info ===== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg, #0d1929 0%, #0a1020 100%)',
            display: 'flex',
            flexDirection: 'column',
            padding: '18px',
            gap: '12px',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '2px' }}>{member.name}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00f2fe' }}>{member.role}</div>
          </div>

          {/* Bio */}
          {member.bio && (
            <p style={{
              fontSize: '0.78rem',
              color: '#94a3b8',
              lineHeight: 1.55,
              margin: 0,
              flex: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}>
              {member.bio}
            </p>
          )}

          {/* Highlights */}
          {member.features && member.features.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {member.features.slice(0, 3).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00f2fe', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(37,99,235,0.2)',
                  border: '1px solid rgba(59,130,246,0.4)',
                  color: '#93c5fd',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <LinkedInIcon />
                LinkedIn
                <ExternalLink size={10} style={{ opacity: 0.6 }} />
              </a>
            ) : (
              <div style={{ flex: 1, padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', fontSize: '0.7rem', textAlign: 'center' }}>No LinkedIn</div>
            )}

            {member.github ? (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(167,139,250,0.4)',
                  color: '#c4b5fd',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <GitHubIcon />
                GitHub
                <ExternalLink size={10} style={{ opacity: 0.6 }} />
              </a>
            ) : (
              <div style={{ flex: 1, padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', fontSize: '0.7rem', textAlign: 'center' }}>No GitHub</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
