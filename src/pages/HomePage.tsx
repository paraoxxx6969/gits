import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { EventCard } from '../components/EventCard';
import type { ClubEvent } from '../types';
import { Cpu, Code, Shield, Cloud, Terminal, ArrowRight, Camera } from 'lucide-react';

interface HomePageProps {
  events: ClubEvent[];
  onSelectEvent: (event: ClubEvent) => void;
  onRegisterEvent: (event: ClubEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
  setActiveTab
}) => {
  const upcomingEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Live').slice(0, 3);

  const domainWings = [
    {
      title: 'AI & Machine Learning',
      icon: <Cpu size={24} color="#00f2fe" />,
      desc: 'Neural networks, PyTorch, Generative AI models, and computer vision workshops.'
    },
    {
      title: 'Fullstack Web & Mobile',
      icon: <Code size={24} color="#4facfe" />,
      desc: 'React, Next.js, Node.js REST APIs, TypeScript, and modern web application development.'
    },
    {
      title: 'Cybersecurity & CTFs',
      icon: <Shield size={24} color="#7928ca" />,
      desc: 'Ethical hacking, binary exploitation, web pentesting, and Capture The Flag contests.'
    },
    {
      title: 'Cloud Native & DevOps',
      icon: <Cloud size={24} color="#10b981" />,
      desc: 'Docker containers, Kubernetes, CI/CD automation pipelines, and AWS cloud hosting.'
    },
    {
      title: 'Competitive Coding',
      icon: <Terminal size={24} color="#f59e0b" />,
      desc: 'Data structures, algorithm optimization, LeetCode sprints, and ICPC practice sessions.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection 
        onExploreEvents={() => setActiveTab('events')} 
        onExploreMemories={() => setActiveTab('memories')} 
      />

      {/* Featured Upcoming Events Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>HOT & UPCOMING</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured GITS Events</h2>
            </div>
            
            <button 
              onClick={() => setActiveTab('events')} 
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              View All Events ({events.length}) <ArrowRight size={14} />
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {upcomingEvents.map(event => (
                <EventCard 
                  key={event.id}
                  event={event}
                  onSelectEvent={onSelectEvent}
                  onRegisterEvent={onRegisterEvent}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No upcoming events scheduled right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Domain Wings Showcase */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>SPECIALIZED WINGS</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Explore GITS Domain Tracks</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Whether you are interested in building AI agents or hacking servers, GITS has dedicated domain teams to mentor you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {domainWings.map((wing, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {wing.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{wing.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{wing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memories Banner Call to Action */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.15) 0%, rgba(0, 242, 254, 0.12) 100%)', border: '1px solid rgba(121, 40, 202, 0.3)', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Relive Past GITS Moments & Victories</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.75rem auto', fontSize: '1rem' }}>
              Check out our past hackathon winners, workshop photo galleries, CTF scoreboards, and student tech milestones in our official club timeline.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('memories')}>
              <Camera size={18} /> View Past Events Timeline & Gallery
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
