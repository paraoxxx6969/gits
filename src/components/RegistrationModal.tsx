import React, { useState } from 'react';
import { X, User, Mail, Phone, BookOpen, CheckCircle, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ClubEvent, EventRegistration } from '../types';
import { StorageService } from '../services/storageService';


interface RegistrationModalProps {
  event: ClubEvent | null;
  onClose: () => void;
  onSuccess: (registration: EventRegistration) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    email: '',
    phone: '',
    department: 'Information Technology',
    year: '3rd Year',
    specialRequests: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.rollNo.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill out all required student details.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const reg = StorageService.addRegistration({
        eventId: event.id,
        eventTitle: event.title,
        studentName: formData.studentName.trim(),
        rollNo: formData.rollNo.trim().toUpperCase(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        year: formData.year,
        specialRequests: formData.specialRequests.trim()
      });

      // Fire festive confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitting(false);
      onSuccess(reg);
    } catch {
      setError('Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(121, 40, 202, 0.15) 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Ticket size={18} color="#00f2fe" />
              <span style={{ fontSize: '0.75rem', color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GITS Event Registration</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>{event.title}</h3>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Student Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
              </div>
            </div>

            {/* Student Roll No */}
            <div className="form-group">
              <label className="form-label">Roll No / Student ID *</label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. 23IT1042"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Student Email */}
            <div className="form-group">
              <label className="form-label">Student Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email"
                  required
                  placeholder="alex@student.gits.edu"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="form-group">
              <label className="form-label">WhatsApp / Phone *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department</label>
              <select 
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Engineering">Computer Science & Engg</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Electronics & Communication">Electronics & Comm</option>
                <option value="Other Department">Other Department</option>
              </select>
            </div>

            {/* Year of Study */}
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select 
                className="form-select"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div className="form-group">
            <label className="form-label">Dietary Preference / Notes (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. Vegetarian meal, team name for hackathon..."
              className="form-input"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Generating Pass...' : <><CheckCircle size={16} /> Confirm Registration</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
