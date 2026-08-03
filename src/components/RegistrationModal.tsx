import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CheckCircle, Ticket, Award, Layers, Hash, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ClubEvent, EventRegistration, StudentProfile } from '../types';
import { StorageService } from '../services/storageService';


interface RegistrationModalProps {
  event: ClubEvent | null;
  studentProfile?: StudentProfile;
  onClose: () => void;
  onSuccess: (registration: EventRegistration) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  studentProfile,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    studentName: studentProfile?.name || '',
    rollNo: studentProfile?.rollNo || '',
    grNo: studentProfile?.grNo || '',
    email: studentProfile?.email || '',
    phone: studentProfile?.phone || '',
    department: studentProfile?.branch || 'Information Technology',
    year: studentProfile?.year || 'TE',
    div: studentProfile?.div || 'A',
    collegeName: event?.eventScope === 'Inter-College' ? '' : 'Datta Meghe College of Engineering (DMCE)',
    specialRequests: '',
    paymentTransactionId: ''
  });

  useEffect(() => {
    if (studentProfile) {
      setFormData(prev => ({
        ...prev,
        studentName: studentProfile.name || prev.studentName,
        rollNo: studentProfile.rollNo || prev.rollNo,
        grNo: studentProfile.grNo || prev.grNo,
        email: studentProfile.email || prev.email,
        phone: studentProfile.phone || prev.phone,
        department: studentProfile.branch || prev.department,
        year: studentProfile.year || prev.year,
        div: studentProfile.div || prev.div,
        collegeName: event?.eventScope === 'Inter-College' ? prev.collegeName : 'Datta Meghe College of Engineering (DMCE)'
      }));
    }
  }, [studentProfile, event]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!event) return null;

  const isInterCollege = event.eventScope === 'Inter-College';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.rollNo.trim() || !formData.email.trim() || !formData.grNo.trim()) {
      setError('Please fill out all required student details (Name, Roll No, GR No, Email).');
      return;
    }

    if (isInterCollege && !formData.collegeName.trim()) {
      setError('Please enter your College / Institution Name for this Inter-College event.');
      return;
    }

    const isPaidEvent = event.isPaid || (event.fee && event.fee !== 'Free');
    if (isPaidEvent && !formData.paymentTransactionId.trim()) {
      setError('Please scan the payment QR code and enter your UTR / Transaction Ref ID.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Re-check latest event data to prevent over-registration
      const latestEvents = StorageService.getEvents();
      const latestEvent = latestEvents.find(e => e.id === event.id);
      if (latestEvent && latestEvent.registeredCount >= latestEvent.capacity) {
        setError('Sorry, this event is now full! Seats were taken while you were filling the form.');
        setSubmitting(false);
        return;
      }

      const reg = StorageService.addRegistration({
        eventId: event.id,
        eventTitle: event.title,
        studentName: formData.studentName.trim(),
        rollNo: formData.rollNo.trim().toUpperCase(),
        grNo: formData.grNo.trim().toUpperCase(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        year: formData.year,
        div: formData.div.trim().toUpperCase(),
        collegeName: isInterCollege ? formData.collegeName.trim() : 'Datta Meghe College of Engineering (DMCE)',
        specialRequests: formData.specialRequests.trim(),
        paymentTransactionId: formData.paymentTransactionId.trim()
      });

      // Fire festive confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitting(false);
      onSuccess(reg);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
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

          {/* Scope Indicator Banner */}
          <div style={{ marginBottom: '1.25rem', padding: '0.65rem 1rem', borderRadius: '8px', background: isInterCollege ? 'rgba(121, 40, 202, 0.12)' : 'rgba(0, 242, 254, 0.1)', border: `1px solid ${isInterCollege ? 'rgba(121, 40, 202, 0.3)' : 'rgba(0, 242, 254, 0.25)'}`, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building size={16} color={isInterCollege ? '#a855f7' : '#00f2fe'} />
            <span style={{ fontSize: '0.8rem', color: isInterCollege ? '#d8b4fe' : '#7dd3fc', fontWeight: 500 }}>
              {isInterCollege ? '🌐 Inter-College Event — Open to students from all colleges & universities' : '🏫 Intra-College Event — Exclusive to Datta Meghe College of Engineering (DMCE)'}
            </span>
          </div>

          {/* College Name Field for Inter-College Events */}
          {isInterCollege && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">College / Institution Name *</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. Datta Meghe College of Engineering / VJTI / Terna"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                />
              </div>
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
              <label className="form-label">Roll No *</label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
            {/* Student GR No */}
            <div className="form-group">
              <label className="form-label">GR No *</label>
              <div style={{ position: 'relative' }}>
                <Award size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. GR10293"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.grNo}
                  onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                />
              </div>
            </div>

            {/* Division */}
            <div className="form-group">
              <label className="form-label">Division (Div) *</label>
              <div style={{ position: 'relative' }}>
                <Layers size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. A"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.div}
                  onChange={(e) => setFormData({ ...formData, div: e.target.value })}
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
              <label className="form-label">WhatsApp / Phone (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="tel"
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
              <label className="form-label">Branch / Department</label>
              <select 
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
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
                <option value="FE">FE (1st Year)</option>
                <option value="SE">SE (2nd Year)</option>
                <option value="TE">TE (3rd Year)</option>
                <option value="BE">BE (4th Year)</option>
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

          {/* Paid Event Payment QR Section */}
          {(event.isPaid || (event.fee && event.fee !== 'Free')) && (
            <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(121, 40, 202, 0.08) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  💳 Paid Event — Registration Fee: <span style={{ color: '#fff', fontSize: '1.05rem' }}>{event.fee}</span>
                </span>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  Verification Required
                </span>
              </div>

              {event.paymentQrImage ? (
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '12px' }}>
                  <img 
                    src={event.paymentQrImage} 
                    alt="Payment QR Code" 
                    style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  />
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Scan QR Code with GPay / PhonePe / Paytm
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                      1. Open GPay / PhonePe / Paytm<br />
                      2. Scan this QR code and pay <strong>{event.fee}</strong><br />
                      {event.upiId && <span>3. UPI ID: <strong>{event.upiId}</strong><br /></span>}
                      4. Copy the UTR / Transaction Ref ID & paste below.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                  ℹ️ Payment Fee: <strong>{event.fee}</strong>. {event.upiId ? `Pay via UPI to: ${event.upiId}` : 'Please complete payment with event coordinator and enter transaction ID below.'}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#fbbf24', fontWeight: 700 }}>
                  Enter UTR / Transaction Ref ID *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 402910482910 or UPI Ref No."
                  className="form-input"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.5)', background: 'rgba(15, 23, 42, 0.8)' }}
                  value={formData.paymentTransactionId}
                  onChange={(e) => setFormData({ ...formData, paymentTransactionId: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  ⏳ Your registration pass will be issued once the coordinator verifies this transaction ID.
                </span>
              </div>
            </div>
          )}

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
