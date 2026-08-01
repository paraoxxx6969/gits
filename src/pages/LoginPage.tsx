import React, { useState } from 'react';
import { User, ShieldCheck, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import type { UserSession } from '../types';
import gitsLogo from '../assets/gits-logo.jpg';
import { signInWithGoogle, signInWithGithub, signInWithEmailPassword, isFirebaseConfigured } from '../services/firebase';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginMode, setLoginMode] = useState<'select' | 'student' | 'admin'>('select');
  
  // Student Email & Password State
  const [studentEmail, setStudentEmail] = useState('alex@student.gits.edu');
  const [studentPassword, setStudentPassword] = useState('student123');
  
  // Admin Credentials State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | 'email' | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);
      setError('');
      
      const result = provider === 'google' 
        ? await signInWithGoogle() 
        : await signInWithGithub();

      onLoginSuccess({
        role: 'student',
        studentInfo: {
          name: result.name,
          rollNo: result.rollNo,
          email: result.email
        }
      });
    } catch (err: any) {
      console.error(`Firebase ${provider} sign-in error:`, err);
      setError(err?.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim() || !studentPassword.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoadingProvider('email');
      setError('');
      const result = await signInWithEmailPassword(studentEmail.trim(), studentPassword.trim());

      onLoginSuccess({
        role: 'student',
        studentInfo: {
          name: result.name,
          rollNo: result.rollNo,
          email: result.email
        }
      });
    } catch (err: any) {
      console.error('Firebase Email/Password error:', err);
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim().toLowerCase() === 'rawataryan5953@gmail.com' && adminPassword === 'aryan@8291') {
      setError('');
      onLoginSuccess({
        role: 'admin',
        adminEmail: adminEmail.trim()
      });
    } else {
      setError('Invalid admin email or password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at top, rgba(0,242,254,0.12), transparent 35%), linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 100%)' }}>
      <div style={{ width: '100%', maxWidth: '520px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', background: 'rgba(10, 14, 25, 0.88)', backdropFilter: 'blur(24px)' }}>
        
        {/* Header Header */}
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
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Google, GitHub, or Email & Password authentication.</p>
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
            <div>
              <div style={{ fontSize: '0.95rem', color: '#00f2fe', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={16} /> Student Portal Access
                </span>
                <span style={{ fontSize: '0.7rem', background: isFirebaseConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isFirebaseConfigured ? '#34d399' : '#fbbf24', border: isFirebaseConfigured ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
                  {isFirebaseConfigured ? '⚡ Firebase Live' : '⚡ Firebase Demo'}
                </span>
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}

              {/* OAuth Social Buttons (Google & GitHub) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                
                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loadingProvider !== null}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'}
                >
                  {loadingProvider === 'google' ? (
                    <Loader2 size={18} className="animate-spin" color="#00f2fe" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* GitHub Login Button */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loadingProvider !== null}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.95)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)'}
                >
                  {loadingProvider === 'github' ? (
                    <Loader2 size={18} className="animate-spin" color="#d8b4fe" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  )}
                  <span>Continue with GitHub</span>
                </button>

              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or email and password</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Email & Password Authentication Form */}
              <form onSubmit={handleEmailPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} color="#00f2fe" /> Student Email *
                  </label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="student@gits.edu" 
                    value={studentEmail} 
                    onChange={(e) => setStudentEmail(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Lock size={14} color="#00f2fe" /> Password *
                  </label>
                  <input 
                    type="password" 
                    required 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={studentPassword} 
                    onChange={(e) => setStudentPassword(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setLoginMode('select')}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loadingProvider !== null}>
                    {loadingProvider === 'email' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Signing In...
                      </>
                    ) : (
                      'Sign In with Email'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loginMode === 'admin' && (
            <form onSubmit={handleAdminSubmit}>
              <div style={{ fontSize: '0.95rem', color: '#d8b4fe', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={16} /> Coordinator Protected Admin Login
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}

              <div className="form-group">
                <label className="form-label">Admin Email *</label>
                <input 
                  type="email" 
                  required 
                  className="form-input" 
                  placeholder="admin@gits.edu"
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Password *</label>
                <input 
                  type="password" 
                  required 
                  className="form-input" 
                  placeholder="••••••••"
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                />
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
