import React, { useState } from 'react';
import type { EventMemory } from '../types';
import { Camera, Calendar, Trophy, Users, Award } from 'lucide-react';

interface WinnersPageProps {
  memories: EventMemory[];
}

export const WinnersPage: React.FC<WinnersPageProps> = ({ memories }) => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const years = ['All', ...Array.from(new Set(memories.map(m => m.year))).sort((a, b) => b.localeCompare(a))];
  const categories = ['All', 'Hackathon', 'Workshop', 'Coding Contest'];

  const filteredMemories = memories.filter(mem => {
    const matchesYear = selectedYear === 'All' || mem.year === selectedYear;
    const matchesCategory = selectedCategory === 'All' || mem.category === selectedCategory;
    return matchesYear && matchesCategory;
  });

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>HALL OF FAME</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Previous Winners & Successful Events
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Celebrating the brightest IT minds who conquered hackathons, topped CTF leaderboards, and delivered outstanding project demonstrations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Year:</span>
            {years.map(y => (
              <button 
                key={y}
                className={`btn btn-sm ${selectedYear === y ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedYear(y)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
              >
                {y}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category:</span>
            {categories.map(c => (
              <button 
                key={c}
                className={`btn btn-sm ${selectedCategory === c ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(c)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* Winners Timeline */}
        {filteredMemories.length > 0 ? (
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            
            {/* Vertical neon timeline line */}
            <div style={{ position: 'absolute', left: '7px', top: '15px', bottom: '15px', width: '3px', background: 'linear-gradient(to bottom, #f59e0b 0%, #7928ca 50%, #10b981 100%)', borderRadius: '3px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {filteredMemories.map((mem) => (
                <div key={mem.id} style={{ position: 'relative' }}>
                  
                  {/* Timeline dot */}
                  <div style={{ position: 'absolute', left: '-2.4rem', top: '24px', width: '16px', height: '16px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)', border: '3px solid #080c14' }} />

                  {/* Card */}
                  <div className="glass-card" style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                    
                    {/* Left: Image */}
                    <div>
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '230px', marginBottom: '0.75rem' }}>
                        <img 
                          src={mem.image} 
                          alt={mem.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                          <span className="badge badge-purple">{mem.category}</span>
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.7) 0%, transparent 50%)' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} color="#f59e0b" /> {mem.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={14} color="#34d399" /> {mem.attendeesCount}+ Participants
                        </span>
                      </div>
                    </div>

                    {/* Right: Details & Winners */}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Trophy size={14} /> GITS ACHIEVEMENT ({mem.year})
                      </div>
                      
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                        {mem.title}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {mem.description}
                      </p>

                      {/* Winners Podium */}
                      {mem.winners && mem.winners.length > 0 && (
                        <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(121, 40, 202, 0.12) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Trophy size={14} /> Champions & Prize Winners
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                            {mem.winners.map((win, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: idx === 0 ? '#fbbf24' : '#fff' }}>
                                <Award size={14} color={idx === 0 ? '#f59e0b' : '#34d399'} />
                                <span style={{ fontWeight: idx === 0 ? 700 : 400 }}>{win}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      {mem.highlights && mem.highlights.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {mem.highlights.map((h, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              🏅 {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Camera size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <p>No winner entries matching the selected filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};
