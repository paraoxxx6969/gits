import React, { useState } from 'react';
import type { ClubEvent, EventRegistration, EventMemory, Announcement, EventCategory, EventStatus } from '../types';
import { StorageService } from '../services/storageService';
import { 
  ShieldCheck, Calendar, Users, Camera, Bell, Plus, Edit3, Trash2, 
  Search, Download, RefreshCw, X 
} from 'lucide-react';

interface AdminDashboardProps {
  events: ClubEvent[];
  registrations: EventRegistration[];
  memories: EventMemory[];
  announcements: Announcement[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  registrations,
  memories,
  announcements,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'memories' | 'announcements'>('events');

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Hackathon' as EventCategory,
    status: 'Upcoming' as EventStatus,
    shortDescription: '',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: 'IT Lab 4 / AV Hall',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: 'Hackathon, WebDev',
    prerequisites: 'Basic programming knowledge',
    fee: 'Free',
    speakerName: 'GITS Tech Lead',
    speakerRole: 'Software Architect',
    speakerOrg: 'GITS Advisory',
    speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  });

  // Memory Form state
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    year: '2026',
    date: 'August 1, 2026',
    category: 'Workshop' as EventCategory,
    description: '',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 150,
    winners: '1st Place: Team Alpha, 2nd Place: Team Beta',
    highlights: '150 Participants, Hands-on Lab'
  });

  // Announcement Form State
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Registrations Filter
  const [regSearch, setRegSearch] = useState('');
  const [regEventFilter, setRegEventFilter] = useState<string>('All');

  // ----------------------------------------------------
  // Event Form Handlers
  // ----------------------------------------------------
  const handleOpenNewEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category: 'Workshop',
      status: 'Upcoming',
      shortDescription: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      venue: 'IT Block Lab 4',
      capacity: 100,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      tags: 'Workshop, IT',
      prerequisites: 'Laptop with charger',
      fee: 'Free',
      speakerName: 'Dr. Rajesh Sharma',
      speakerRole: 'Faculty Lead',
      speakerOrg: 'IT Dept',
      speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (evt: ClubEvent) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      category: evt.category,
      status: evt.status,
      shortDescription: evt.shortDescription,
      description: evt.description,
      date: evt.date,
      time: evt.time,
      venue: evt.venue,
      capacity: evt.capacity,
      image: evt.image,
      tags: evt.tags.join(', '),
      prerequisites: evt.prerequisites.join(', '),
      fee: evt.fee,
      speakerName: evt.speaker?.name || '',
      speakerRole: evt.speaker?.role || '',
      speakerOrg: evt.speaker?.organization || '',
      speakerAvatar: evt.speaker?.avatar || ''
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventPayload = {
      title: eventForm.title,
      slug: eventForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      category: eventForm.category,
      status: eventForm.status,
      shortDescription: eventForm.shortDescription,
      description: eventForm.description,
      date: eventForm.date,
      time: eventForm.time,
      venue: eventForm.venue,
      capacity: Number(eventForm.capacity),
      image: eventForm.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      tags: eventForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      prerequisites: eventForm.prerequisites.split(',').map(p => p.trim()).filter(Boolean),
      fee: eventForm.fee as any,
      speaker: {
        name: eventForm.speakerName,
        role: eventForm.speakerRole,
        organization: eventForm.speakerOrg,
        avatar: eventForm.speakerAvatar
      },
      schedule: [
        { time: '10:00 AM', title: 'Registration & Opening Remarks' },
        { time: '11:00 AM', title: 'Hands-on Technical Session' },
        { time: '03:00 PM', title: 'Q&A & Certificate Distribution' }
      ],
      organizer: 'GITS Executive Board'
    };

    if (editingEventId) {
      StorageService.updateEvent(editingEventId, eventPayload);
    } else {
      StorageService.addEvent(eventPayload);
    }

    setIsEventModalOpen(false);
    onRefreshData();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteEvent(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Memory Handlers
  // ----------------------------------------------------
  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.addMemory({
      title: memoryForm.title,
      year: memoryForm.year,
      date: memoryForm.date,
      category: memoryForm.category,
      description: memoryForm.description,
      image: memoryForm.image,
      attendeesCount: Number(memoryForm.attendeesCount),
      winners: memoryForm.winners.split(',').map(w => w.trim()).filter(Boolean),
      highlights: memoryForm.highlights.split(',').map(h => h.trim()).filter(Boolean)
    });
    setIsMemoryModalOpen(false);
    onRefreshData();
  };

  const handleDeleteMemory = (id: string) => {
    if (window.confirm('Delete this memory item from the timeline?')) {
      StorageService.deleteMemory(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Registrations Export CSV & Actions
  // ----------------------------------------------------
  const handleExportCSV = () => {
    const headers = ['Ticket Code', 'Event Title', 'Student Name', 'Roll No', 'Email', 'Phone', 'Dept', 'Year', 'Status', 'Registered At'];
    const rows = registrations.map(r => [
      r.ticketCode,
      `"${r.eventTitle}"`,
      `"${r.studentName}"`,
      r.rollNo,
      r.email,
      r.phone,
      `"${r.department}"`,
      r.year,
      r.status,
      r.registeredAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GITS_Event_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateRegStatus = (id: string, status: EventRegistration['status']) => {
    StorageService.updateRegistrationStatus(id, status);
    onRefreshData();
  };

  const handleDeleteRegistration = (id: string) => {
    if (window.confirm('Delete this student registration entry?')) {
      StorageService.deleteRegistration(id);
      onRefreshData();
    }
  };

  // ----------------------------------------------------
  // Announcement Handlers
  // ----------------------------------------------------
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    StorageService.addAnnouncement(newAnnouncementText.trim(), 'urgent');
    setNewAnnouncementText('');
    onRefreshData();
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all events, registrations, and memories to demo defaults?')) {
      StorageService.resetAllData();
      onRefreshData();
    }
  };

  // Filtered registrations list
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(regSearch.toLowerCase()) || 
                          r.rollNo.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.email.toLowerCase().includes(regSearch.toLowerCase());
    const matchesEvent = regEventFilter === 'All' || r.eventId === regEventFilter;
    return matchesSearch && matchesEvent;
  });

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Dashboard Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={22} color="#00f2fe" />
              <span className="badge badge-purple">PROTECTED COORDINATOR ZONE</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>GITS Admin Control Center</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleResetDemoData} title="Reset to default sample data">
              <RefreshCw size={14} /> Reset Demo Data
            </button>
            
            <button className="btn btn-primary btn-sm" onClick={handleOpenNewEvent}>
              <Plus size={16} /> Add New Event
            </button>
          </div>
        </div>

        {/* Dashboard Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
              <span>ACTIVE EVENTS</span>
              <Calendar size={18} color="#00f2fe" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{events.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>
              {events.filter(e => e.status === 'Upcoming').length} Upcoming
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
              <span>STUDENT REGISTRATIONS</span>
              <Users size={18} color="#4facfe" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{registrations.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Student tickets generated</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
              <span>PAST MEMORIES POSTED</span>
              <Camera size={18} color="#7928ca" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{memories.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>Timeline gallery entries</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
              <span>BROADCAST ALERTS</span>
              <Bell size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {announcements.filter(a => a.active).length} Active
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top site announcements</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={16} /> Manage Events ({events.length})
          </button>
          
          <button 
            className={`btn btn-sm ${activeTab === 'registrations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('registrations')}
          >
            <Users size={16} /> Student Registrations ({registrations.length})
          </button>
          
          <button 
            className={`btn btn-sm ${activeTab === 'memories' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('memories')}
          >
            <Camera size={16} /> Past Event Memories ({memories.length})
          </button>
          
          <button 
            className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Bell size={16} /> Broadcast Banners
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: EVENTS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Events Directory</h3>
              <button className="btn btn-primary btn-sm" onClick={handleOpenNewEvent}>
                <Plus size={16} /> Create Event
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Event Title</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Date & Venue</th>
                    <th style={{ padding: '1rem' }}>Registered</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={evt.image} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div>
                            <div>{evt.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {evt.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-purple">{evt.category}</span>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                          value={evt.status}
                          onChange={(e) => {
                            StorageService.updateEvent(evt.id, { status: e.target.value as EventStatus });
                            onRefreshData();
                          }}
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Live">Live</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <div>{evt.date}</div>
                        <div style={{ fontSize: '0.75rem' }}>{evt.venue}</div>
                      </td>

                      <td style={{ padding: '1rem', fontWeight: 600, color: '#00f2fe' }}>
                        {evt.registeredCount} / {evt.capacity}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEditEvent(evt)}
                            title="Edit Event"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEvent(evt.id, evt.title)}
                            title="Delete Event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: REGISTRATIONS MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'registrations' && (
          <div>
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Search by student name or roll no..."
                    style={{ paddingLeft: '2.4rem' }}
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="form-select"
                  style={{ width: 'auto', minWidth: '180px' }}
                  value={regEventFilter}
                  onChange={(e) => setRegEventFilter(e.target.value)}
                >
                  <option value="All">All Registered Events</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
                <Download size={16} /> Export CSV List
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Ticket Code</th>
                    <th style={{ padding: '1rem' }}>Student Details</th>
                    <th style={{ padding: '1rem' }}>Event Title</th>
                    <th style={{ padding: '1rem' }}>Dept & Year</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem', fontFamily: 'var(--font-code)', fontWeight: 700, color: '#00f2fe' }}>
                          {reg.ticketCode}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{reg.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Roll: <span style={{ color: '#fff' }}>{reg.rollNo}</span> • {reg.email}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-main)', maxWidth: '240px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {reg.eventTitle}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {reg.department} ({reg.year})
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <select 
                            className="form-select"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                            value={reg.status}
                            onChange={(e) => handleUpdateRegStatus(reg.id, e.target.value as any)}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Attended">Attended</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteRegistration(reg.id)}
                            title="Remove Registration"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No registrations matching the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: PAST MEMORIES MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'memories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Event Memories Timeline Posts</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setIsMemoryModalOpen(true)}>
                <Plus size={16} /> Post Memory Highlight
              </button>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Title & Year</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Attendees</th>
                    <th style={{ padding: '1rem' }}>Highlights / Winners</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memories.map((mem) => (
                    <tr key={mem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{mem.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#00f2fe' }}>Year {mem.year} • {mem.date}</div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-purple">{mem.category}</span>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                        {mem.attendeesCount}+ Attendees
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px' }}>
                        {mem.winners && mem.winners.length > 0 ? (
                          <div style={{ color: '#34d399' }}>🏆 {mem.winners[0]}</div>
                        ) : (
                          <div>{mem.highlights.join(', ')}</div>
                        )}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteMemory(mem.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: ANNOUNCEMENTS BANNER MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Create Announcement */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="#00f2fe" /> Publish Banner Announcement
              </h3>

              <form onSubmit={handleAddAnnouncement}>
                <div className="form-group">
                  <label className="form-label">Announcement Banner Text</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="e.g. 🚨 Registrations for Hackathon CodeMatrix 2026 are now OPEN!"
                    className="form-textarea"
                    value={newAnnouncementText}
                    onChange={(e) => setNewAnnouncementText(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Broadcast Announcement
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem' }}>Active Announcements</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {announcements.map((anc) => (
                  <div key={anc.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#fff' }}>{anc.content}</div>
                      <span className={`badge ${anc.active ? 'badge-green' : 'badge'}`} style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                        {anc.active ? 'ACTIVE ON WEBSITE' : 'DISABLED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => { StorageService.toggleAnnouncement(anc.id); onRefreshData(); }}
                      >
                        {anc.active ? 'Disable' : 'Enable'}
                      </button>

                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => { StorageService.deleteAnnouncement(anc.id); onRefreshData(); }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: CREATE / EDIT EVENT */}
      {isEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEventModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                {editingEventId ? 'Edit Club Event Details' : 'Create New GITS Club Event'}
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. AI & ML Deep Learning Masterclass"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Tech Talk">Tech Talk</option>
                    <option value="Coding Contest">Coding Contest</option>
                    <option value="Project Expo">Project Expo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as EventStatus })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Seat Capacity</label>
                  <input 
                    type="number" 
                    required 
                    className="form-input"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date (YYYY-MM-DD)</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="10:00 AM - 04:00 PM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue / Room Location</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="IT Block Lab 4 & Auditorium"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  value={eventForm.shortDescription}
                  onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Event Description</label>
                <textarea 
                  rows={3} 
                  required 
                  className="form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEventModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST PAST MEMORY */}
      {isMemoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMemoryModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Add Past Event Memory Highlight</h3>
              <button onClick={() => setIsMemoryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Memory Title *</label>
                <input 
                  type="text" required className="form-input" placeholder="e.g. GITS Hackathon 2025"
                  value={memoryForm.title} onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input 
                    type="text" required className="form-input" placeholder="2025"
                    value={memoryForm.year} onChange={(e) => setMemoryForm({ ...memoryForm, year: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attendees Count</label>
                  <input 
                    type="number" required className="form-input"
                    value={memoryForm.attendeesCount} onChange={(e) => setMemoryForm({ ...memoryForm, attendeesCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Memory Description *</label>
                <textarea 
                  rows={3} required className="form-textarea"
                  value={memoryForm.description} onChange={(e) => setMemoryForm({ ...memoryForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Photo Image URL</label>
                <input 
                  type="text" className="form-input"
                  value={memoryForm.image} onChange={(e) => setMemoryForm({ ...memoryForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Winners Podium (comma separated)</label>
                <input 
                  type="text" className="form-input" placeholder="1st Place: Team NeuralX, 2nd Place: Team Cypher"
                  value={memoryForm.winners} onChange={(e) => setMemoryForm({ ...memoryForm, winners: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsMemoryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Memory Highlight</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
