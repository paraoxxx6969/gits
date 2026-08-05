import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CheckCircle2, AlertTriangle, RefreshCw, Search, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { EventRegistration, ClubEvent } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: EventRegistration[];
  events: ClubEvent[];
  onMarkAttendance: (registrationId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  registrations,
  events,
  onMarkAttendance
}) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedResult, setLastScannedResult] = useState<{
    status: 'success' | 'already' | 'error';
    message: string;
    studentName?: string;
    rollNo?: string;
    eventTitle?: string;
    ticketCode?: string;
  } | null>(null);

  const [manualTicketInput, setManualTicketInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-viewport';

  // Play audio chime feedback
  const playChime = (type: 'success' | 'warning' | 'error') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio context fallbacks ignored safely
    }
  };

  // Helper to extract ticketCode from QR payload text/url
  const extractTicketCode = (rawText: string): string => {
    const trimmed = rawText.trim();
    if (trimmed.includes('ticket=')) {
      try {
        const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        const code = url.searchParams.get('ticket');
        if (code) return code.trim();
      } catch {
        const match = trimmed.match(/ticket=([A-Za-z0-9-]+)/);
        if (match && match[1]) return match[1].trim();
      }
    }
    return trimmed;
  };

  // Process a scanned or typed ticket code
  const processTicketCode = (rawText: string) => {
    const ticketCode = extractTicketCode(rawText);
    if (!ticketCode) return;

    // Find registration by ticketCode or ID
    const reg = registrations.find(r => 
      r.ticketCode.toUpperCase() === ticketCode.toUpperCase() ||
      r.id === ticketCode ||
      r.rollNo.toUpperCase() === ticketCode.toUpperCase()
    );

    if (!reg) {
      setLastScannedResult({
        status: 'error',
        message: `No registration found for ticket code: "${ticketCode}"`,
      });
      playChime('error');
      return;
    }

    const event = events.find(e => e.id === reg.eventId);
    const eventTitle = event ? event.title : 'GITS Event';

    if (reg.status === 'Attended') {
      setLastScannedResult({
        status: 'already',
        message: 'Student has already been marked ATTENDED for this event.',
        studentName: reg.studentName,
        rollNo: reg.rollNo,
        eventTitle,
        ticketCode: reg.ticketCode,
      });
      playChime('warning');
      return;
    }

    // Mark as Attended
    onMarkAttendance(reg.id);

    setLastScannedResult({
      status: 'success',
      message: 'Attendance successfully marked & verified!',
      studentName: reg.studentName,
      rollNo: reg.rollNo,
      eventTitle,
      ticketCode: reg.ticketCode,
    });

    playChime('success');

    // Confetti celebration burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Start Camera QR Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop().catch(() => {});
      }

      const html5Qrcode = new Html5Qrcode(scannerContainerId);
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' }, // Prefer rear camera on mobile phones
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          processTicketCode(decodedText);
        },
        () => {
          // Ignore frame decode misses
        }
      );

      setScannerActive(true);
    } catch (err) {
      console.error('Camera initialization error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or enter ticket code manually.');
      setScannerActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (html5QrcodeRef.current) {
      html5QrcodeRef.current.stop().then(() => {
        html5QrcodeRef.current?.clear();
        setScannerActive(false);
      }).catch(() => {
        setScannerActive(false);
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow DOM container element to mount
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
      setLastScannedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8, 12, 20, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 242, 254, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={20} color="#00f2fe" style={{ margin: 'auto' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Live QR Attendance Scanner</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Scan student digital pass to mark attendance</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
              style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#00f2fe' : 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={onClose}
              style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Camera Viewfinder Box */}
          <div style={{ position: 'relative', width: '100%', minHeight: '260px', background: '#000', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0, 242, 254, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div id={scannerContainerId} style={{ width: '100%', height: '100%' }} />

            {!scannerActive && !cameraError && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: '#00f2fe' }} />
                <p style={{ fontSize: '0.85rem' }}>Starting Camera Viewfinder...</p>
              </div>
            )}

            {cameraError && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#f87171', fontSize: '0.85rem', maxWidth: '360px' }}>
                <AlertTriangle size={32} style={{ margin: '0 auto 0.75rem auto', color: '#ef4444' }} />
                <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>{cameraError}</p>
                <button className="btn btn-secondary btn-sm" onClick={startCamera}>
                  Retry Camera Permission
                </button>
              </div>
            )}
          </div>

          {/* Scan Feedback Banner */}
          {lastScannedResult && (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: lastScannedResult.status === 'success'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : lastScannedResult.status === 'already'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${
                  lastScannedResult.status === 'success'
                    ? 'rgba(16, 185, 129, 0.4)'
                    : lastScannedResult.status === 'already'
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(239, 68, 68, 0.4)'
                }`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              {lastScannedResult.status === 'success' && <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />}
              {lastScannedResult.status === 'already' && <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />}
              {lastScannedResult.status === 'error' && <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: lastScannedResult.status === 'success' ? '#10b981' : lastScannedResult.status === 'already' ? '#f59e0b' : '#ef4444' }}>
                  {lastScannedResult.status === 'success' ? '✓ ATTENDANCE MARKED' : lastScannedResult.status === 'already' ? '⚠️ ALREADY ATTENDED' : '❌ INVALID TICKET'}
                </h4>

                {lastScannedResult.studentName && (
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f1fb', margin: '0 0 0.2rem 0' }}>
                    {lastScannedResult.studentName} ({lastScannedResult.rollNo})
                  </p>
                )}

                {lastScannedResult.eventTitle && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Event: <strong>{lastScannedResult.eventTitle}</strong> · Ticket: <code style={{ color: '#00f2fe' }}>{lastScannedResult.ticketCode}</code>
                  </p>
                )}

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
                  {lastScannedResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Manual Input Search Fallback */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Manual Ticket Code / Roll Number Entry:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processTicketCode(manualTicketInput);
                setManualTicketInput('');
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Paste Ticket Code (e.g. GITS-PASS-1234 or Roll No)"
                  value={manualTicketInput}
                  onChange={(e) => setManualTicketInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" disabled={!manualTicketInput.trim()}>
                Verify &amp; Mark
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Done Scanning
          </button>
        </div>
      </div>
    </div>
  );
};
