import React, { useState } from 'react';
import type { ClubEvent, EventCategory, EventRegistration } from '../types';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Calendar } from 'lucide-react';


interface EventsPageProps {
  events: ClubEvent[];
  onSelectEvent: (event: ClubEvent) => void;
  onRegisterEvent: (event: ClubEvent) => void;
  registrations?: EventRegistration[];
  userEmail?: string;
  userRollNo?: string;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
  registrations = [],
  userEmail,
  userRollNo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories: (string | EventCategory)[] = ['All', 'Hackathon', 'Workshop', 'Tech Talk', 'Coding Contest'];
  const statuses = ['All', 'Upcoming', 'Live', 'Completed'];

  const filteredEvents = events.filter(evt => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || evt.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Page Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>GITS EVENT CALENDAR</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>Club Events & Hackathons</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Explore workshops, hackathons, guest lectures, and coding contests hosted by GITS IT Club.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search Row */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-input"
              placeholder="Search by event title, tech stack (e.g. PyTorch, React, Hackathon)..."
              style={{ paddingLeft: '2.6rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills & Status Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Status:</span>
              <select 
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filteredEvents.map(evt => {
              const isRegistered = registrations.some(r =>
                r.eventId === evt.id && (
                  (userEmail && r.email.toLowerCase() === userEmail.toLowerCase()) ||
                  (userRollNo && r.rollNo.toUpperCase() === userRollNo.toUpperCase())
                )
              );
              return (
                <EventCard 
                  key={evt.id}
                  event={evt}
                  onSelectEvent={onSelectEvent}
                  onRegisterEvent={onRegisterEvent}
                  isRegistered={isRegistered}
                />
              );
            })}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No matching events found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Try clearing your search query or switching category filters.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
