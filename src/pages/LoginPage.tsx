import React, { useState } from 'react';
import { User, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import type { UserSession } from '../types';
import gitsLogo from '../assets/gits-logo.jpg';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginMode, setLoginMode] = useState<'select' | 'student' | 'admin'>('select');
  const [studentName, setStudentName] = useState('Alex Morgan');
  const [studentRollNo, setStudentRollNo] = useState('23IT1042');
  const [studentEmail, setStudentEmail] = useState('alex@student.gits.edu');
  const [adminEmail, setAdminEmail] = useState('admin@gits.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRollNo.trim() || !studentEmail.trim()) {
      setError('Please fill in your student details.');
      return;
    }

    setError('');
    onLoginSuccess({
      role: 'student',
      studentInfo: {
        name: studentName.trim(),
        rollNo: studentRollNo.trim().toUpperCase(),
        email: studentEmail.trim()
      }
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123' || adminPassword === 'admin') {
      setError('');
      onLoginSuccess({
        role: 'admin',
        adminEmail: adminEmail.trim()
      });
    } else {
      setError('Invalid admin credentials. Demo password: admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at top, rgba(0,242,254,0.12), transparent 35%), linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 100%)' }}>
      <div style={{ width: '100%', maxWidth: '520px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', background: 'rgba(10, 14, 25, 0.88)', backdropFilter: 'blur(24px)' }}>
        <div style={{ padding: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(121, 40, 202, 0.15) 100%)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={gitsLogo} alt="GITS Logo" style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)', border: '1px solid rgba(0, 242, 254, 0.2)', flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>GITS Club Portal Login</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Login first to unlock the full portal experience.</p>
          </div>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {loginMode === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                onClick={() => { setLoginMode('student'); setError(''); }}
                className="glass-card"
                style={{ padding: '1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(0, 242, 254, 0.3)' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={24} color="#00f2fe" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Login as Student</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>See registrations, tickets, and your digital pass.</p>
                </div>
                <ArrowRight size={18} color="#00f2fe" />
              </div>

              <div
                onClick={() => { setLoginMode('admin'); setError(''); }}
                className="glass-card"
                style={{ padding: '1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(121, 40, 202, 0.4)' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(121, 40, 202, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={24} color="#d8b4fe" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Login as Admin</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Manage events, attendees, and announcements.</p>
                </div>
                <ArrowRight size={18} color="#d8b4fe" />
              </div>
            </div>
          )}

          {loginMode === 'student' && (
            <form onSubmit={handleStudentSubmit}>
              <div style={{ fontSize: '0.95rem', color: '#00f2fe', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={16} /> Student Portal Access
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.6rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" required className="form-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Roll No / Student ID *</label>
                <input type="text" required className="form-input" placeholder="e.g. 23IT1042" value={studentRollNo} onChange={(e) => setStudentRollNo(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Student Email *</label>
                <input type="email" required className="form-input" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLoginMode('select')}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Access Student Profile</button>
              </div>
            </form>
          )}

          {loginMode === 'admin' && (
            <form onSubmit={handleAdminSubmit}>
              <div style={{ fontSize: '0.95rem', color: '#d8b4fe', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} /> Coordinator Protected Admin Login
              </div>

              <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', color: '#00f2fe', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <Info size={16} />
                <span>Demo Admin: <code>admin@gits.edu</code> | Pass: <code>admin123</code></span>
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.6rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

              <div className="form-group">
                <label className="form-label">Admin Email *</label>
                <input type="email" required className="form-input" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Password *</label>
                <input type="password" required className="form-input" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLoginMode('select')}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Unlock Admin Dashboard</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
