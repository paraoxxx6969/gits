import React, { useState } from 'react';
import type { EventMemory } from '../types';
import { Camera, Trophy } from 'lucide-react';
import { Timeline3D } from '../components/ui/3d-interactive-timeline';
import type { TimelineEvent } from '../components/ui/3d-interactive-timeline';

interface WinnersPageProps {
  memories: EventMemory[];
}

export const WinnersPage: React.FC<WinnersPageProps> = ({ memories }) => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const years = ['All', ...Array.from(new Set(memories.map(m => m.year))).sort((a, b) => b.localeCompare(a))];
  const categories = ['All', 'Hackathon', 'Workshop', 'Coding Contest', 'Tech Talk', 'Project Expo'];

  const filteredMemories = memories.filter(mem => {
    const matchesYear = selectedYear === 'All' || mem.year === selectedYear;
    const matchesCategory = selectedCategory === 'All' || mem.category === selectedCategory;
    return matchesYear && matchesCategory;
  });

  // Map EventMemory[] → TimelineEvent[] for the 3D timeline
  const timelineEvents: TimelineEvent[] = filteredMemories.map(mem => ({
    id: mem.id,
    date: `${mem.date} · ${mem.year}`,
    title: mem.title,
    description: mem.description,
    image: mem.image,
    category: mem.category,
    winners: mem.winners,
    highlights: mem.highlights,
    attendeesCount: mem.attendeesCount,
  }));

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">

        {/* Page Title */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>HALL OF FAME</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Previous Winners &amp; Successful Events
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Celebrating the brightest IT minds who conquered hackathons, topped CTF leaderboards,
            and delivered outstanding project demonstrations.
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

        {/* 3D Interactive Timeline */}
        {timelineEvents.length > 0 ? (
          <>
            {/* Hint */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                ✨ Hover or tap an event card to reveal full details, winners &amp; highlights
              </span>
            </div>

            <Timeline3D events={timelineEvents} showImages={true} />
          </>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Camera size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <p>No winner entries matching the selected filters.</p>
          </div>
        )}

        {/* Legend */}
        {timelineEvents.length > 0 && (
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.5rem 1.25rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Trophy size={14} color="#f59e0b" />
              Showing {timelineEvents.length} event{timelineEvents.length !== 1 ? 's' : ''} · Click any card node to expand details
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
