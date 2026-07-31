import React from 'react';
import { Terminal, Globe, Share2, Code2, Mail, MapPin, LogIn } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenLoginModal }) => {
  return (
    <footer style={{ background: '#04070d', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '4rem 0 2rem 0', marginTop: '5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Terminal size={20} color="#080c14" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>GITS Club</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Group of IT Students (GITS) is the premier student tech community empowering future software engineers, AI researchers, cybersecurity enthusiasts, and cloud architects through hands-on hackathons and workshops.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Globe size={18} />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Code2 size={18} />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  → Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  → Upcoming Events & Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('winners')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  → Winners & Achievements
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  → Memories Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('members')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                  → Members & Leadership Crew
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Club Headquarters</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Department of Information Technology, Innovation Block - Lab 4</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="#00f2fe" style={{ flexShrink: 0 }} />
                <span>contact@gits-club.edu</span>
              </div>
            </div>
          </div>

          {/* Col 4: Member & Admin Access */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portal Access</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Log in as a student to access event badges, or authenticate as an admin coordinator.
            </p>
            <button 
              onClick={onOpenLoginModal}
              className="btn btn-outline-cyan btn-sm"
              style={{ width: '100%' }}
            >
              <LogIn size={14} /> GITS Portal Login
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <div>© 2026 GITS (Group of IT Students). All rights reserved.</div>
          <div>Built for IT Student Community.</div>
        </div>
      </div>
    </footer>
  );
};
