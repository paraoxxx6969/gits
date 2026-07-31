import React from 'react';
import { Sparkles, ArrowRight, Camera } from 'lucide-react';

interface HeroSectionProps {
  onExploreEvents: () => void;
  onExploreMemories: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreEvents,
  onExploreMemories
}) => {
  return (
    <section style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '4rem', overflow: 'hidden' }}>
      
      {/* Background Neon Glowing Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(121, 40, 202, 0.2) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div className="container">
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Top Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '0.4rem 1rem', borderRadius: '30px', marginBottom: '1.5rem' }}>
            <Sparkles size={14} color="#00f2fe" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#00f2fe' }}>
              Official Student Tech Club of IT Department
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Welcome to <span className="gradient-text">GITS</span>
            <br />
            Group of IT Students
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 2.25rem auto', lineHeight: 1.6 }}>
            The ultimate hub for IT students to learn code, build open-source projects, compete in flagship hackathons, and connect with industry mentors.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button className="btn btn-primary" onClick={onExploreEvents} style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
              Explore Events & Workshops <ArrowRight size={18} />
            </button>

            <button className="btn btn-secondary" onClick={onExploreMemories} style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}>
              <Camera size={18} /> Past Event Memories
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-heading)' }}>500+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Members</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4facfe', fontFamily: 'var(--font-heading)' }}>35+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech Events Held</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7928ca', fontFamily: 'var(--font-heading)' }}>$10,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hackathon Prizes</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>5 Domain Wings</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI, Web, Cyber & Cloud</div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
