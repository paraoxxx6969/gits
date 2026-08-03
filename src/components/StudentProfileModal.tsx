import React, { useState, useEffect } from 'react';
import { User, BookOpen, CheckCircle, Sparkles, Hash, Layers, Award } from 'lucide-react';
import type { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  isForced?: boolean;
  initialProfile?: Partial<StudentProfile>;
  onSaveProfile: (profile: StudentProfile) => void;
  onClose?: () => void;
}

const BRANCH_OPTIONS = [
  'Information Technology',
  'Computer Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

const YEAR_OPTIONS = ['FE', 'SE', 'TE', 'BE'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  isForced = false,
  initialProfile,
  onSaveProfile,
  onClose
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    name: initialProfile?.name || '',
    rollNo: initialProfile?.rollNo || '',
    grNo: initialProfile?.grNo || '',
    branch: initialProfile?.branch || 'Information Technology',
    year: initialProfile?.year || 'TE',
    div: initialProfile?.div || 'A',
    email: initialProfile?.email || '',
    phone: initialProfile?.phone || '',
    isProfileComplete: true
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProfile) {
      setFormData(prev => ({
        ...prev,
        name: initialProfile.name || prev.name,
        rollNo: initialProfile.rollNo || prev.rollNo,
        grNo: initialProfile.grNo || prev.grNo,
        branch: initialProfile.branch || prev.branch || 'Information Technology',
        year: initialProfile.year || prev.year || 'TE',
        div: initialProfile.div || prev.div || 'A',
        email: initialProfile.email || prev.email,
        phone: initialProfile.phone || prev.phone
      }));
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.rollNo.trim() ||
      !formData.grNo.trim() ||
      !formData.branch.trim() ||
      !formData.year.trim() ||
      !formData.div.trim()
    ) {
      setError('Please fill in all mandatory fields (Name, Roll No, GR No, Branch, Year, Division).');
      return;
    }

    setError('');
    const updatedProfile: StudentProfile = {
      ...formData,
      name: formData.name.trim(),
      rollNo: formData.rollNo.trim().toUpperCase(),
      grNo: formData.grNo.trim().toUpperCase(),
      branch: formData.branch.trim(),
      year: formData.year.trim().toUpperCase(),
      div: formData.div.trim().toUpperCase(),
      email: formData.email.trim(),
      isProfileComplete: true
    };

    onSaveProfile(updatedProfile);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '90%', borderRadius: '20px', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(121, 40, 202, 0.2) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(0,242,254,0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                {isForced ? 'ACTION REQUIRED' : 'STUDENT PROFILE'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {isForced ? 'Complete Your Student Profile' : 'Update Student Details'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              {isForced 
                ? 'Please provide your academic credentials before entering the GITS Portal.'
                : 'Keep your academic details updated for smooth event registrations.'
              }
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Row 1: Student Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} color="#00f2fe" /> Student Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                readOnly
                style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.03)' }}
              />
            </div>
          </div>

          {/* Row 2: Roll No & GR No */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Hash size={14} color="#00f2fe" /> Roll Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 23IT1042"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={14} color="#00f2fe" /> GR Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GR10293"
                value={formData.grNo}
                onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 3: Branch */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={14} color="#00f2fe" /> Branch / Department <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              className="form-input"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              style={{ background: '#0a0e19', color: '#fff' }}
              required
            >
              {BRANCH_OPTIONS.map(b => (
                <option key={b} value={b} style={{ background: '#0a0e19', color: '#fff' }}>{b}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Year (FE, SE, TE, BE) & Division */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="#00f2fe" /> Academic Year <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {YEAR_OPTIONS.map(yr => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setFormData({ ...formData, year: yr })}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.25rem',
                      borderRadius: '8px',
                      border: formData.year === yr ? '2px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                      background: formData.year === yr ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.05)',
                      color: formData.year === yr ? '#00f2fe' : '#94a3b8',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Division (Div) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. A or B"
                value={formData.div}
                onChange={(e) => setFormData({ ...formData, div: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            {!isForced && onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem' }}
            >
              <CheckCircle size={18} /> {isForced ? 'Complete Setup & Continue' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
