import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, CheckCircle, AlertTriangle, XCircle, Volume2, VolumeX, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { EventRegistration, ClubEvent } from '../types';

/* ── BarcodeDetector type (not yet in TypeScript lib) ── */
declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  detect(image: ImageBitmapSource | HTMLVideoElement): Promise<{ rawValue: string; format: string }[]>;
  static getSupportedFormats(): Promise<string[]>;
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: EventRegistration[];
  events: ClubEvent[];
  onMarkAttendance: (registrationId: string) => void;
}

type ScanResult =
  | { type: 'success'; studentName: string; eventTitle: string; rollNo: string; regId: string }
  | { type: 'already'; studentName: string; eventTitle: string }
  | { type: 'notfound'; code: string }
  | null;

/* ── Audio helpers ─────────────────────────────────────── */
function playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch { /* ignore */ }
}

const playChime = (kind: 'success' | 'warn' | 'error') => {
  if (kind === 'success') { playTone(880, 0.15); setTimeout(() => playTone(1320, 0.25), 120); }
  else if (kind === 'warn')  { playTone(660, 0.3, 'triangle'); }
  else                       { playTone(220, 0.4, 'sawtooth'); }
};

/* ── Main component ────────────────────────────────────── */
export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen, onClose, registrations, events, onMarkAttendance,
}) => {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const streamRef     = useRef<MediaStream | null>(null);
  const rafRef        = useRef<number | null>(null);
  const detectorRef   = useRef<BarcodeDetector | null>(null);
  const lastCodeRef   = useRef<string>('');
  const cooldownRef   = useRef<boolean>(false);
  const isAlive       = useRef<boolean>(false); // guards async scan loop

  const [scanResult, setScanResult]     = useState<ScanResult>(null);
  const [cameraError, setCameraError]   = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode]     = useState('');
  const [scanCount, setScanCount]       = useState(0);

  /* ── Fully stop camera stream (synchronous, safe) ─────── */
  const stopStream = useCallback(() => {
    // Kill the scan loop FIRST — prevents async detect() from re-scheduling RAF
    isAlive.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    detectorRef.current = null;
    // Stop every camera track — releases the camera LED on phone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Detach video source
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  /* ── Process a decoded ticket code ──────────────────── */
  const processCode = useCallback((raw: string) => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 2500);

    let code = raw.trim();
    // Strip JSON wrapper if present: {"ticketCode":"GITS-XXXX",...}
    try {
      const parsed = JSON.parse(code);
      if (parsed?.ticketCode) code = parsed.ticketCode;
    } catch { /* plain text code */ }

    const reg = registrations.find(
      r => r.ticketCode === code || r.rollNo === code
    );

    if (!reg) {
      if (soundEnabled) playChime('error');
      setScanResult({ type: 'notfound', code });
      return;
    }

    const event = events.find(e => e.id === reg.eventId);
    const eventTitle = event?.title ?? 'Unknown Event';

    if (reg.status === 'Attended') {
      if (soundEnabled) playChime('warn');
      setScanResult({ type: 'already', studentName: reg.studentName, eventTitle });
      return;
    }

    // Mark as attended
    onMarkAttendance(reg.id);
    setScanCount(c => c + 1);
    if (soundEnabled) playChime('success');
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
    setScanResult({
      type: 'success',
      studentName: reg.studentName,
      eventTitle,
      rollNo: reg.rollNo,
      regId: reg.id,
    });
  }, [registrations, events, onMarkAttendance, soundEnabled]);

  /* ── BarcodeDetector scan loop ───────────────────────── */
  const scanFrame = useCallback(async () => {
    // GUARD: if scanner was stopped, do NOT schedule more frames
    if (!isAlive.current) return;

    const video = videoRef.current;
    const detector = detectorRef.current;
    if (!video || !detector || video.readyState < 2) {
      if (isAlive.current) rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    try {
      const barcodes = await detector.detect(video);
      // Check again AFTER the await — modal may have closed during detection
      if (!isAlive.current) return;
      if (barcodes.length > 0) {
        const value = barcodes[0].rawValue;
        if (value && value !== lastCodeRef.current) {
          lastCodeRef.current = value;
          processCode(value);
          setTimeout(() => { lastCodeRef.current = ''; }, 3000);
        }
      }
    } catch { /* ignore frame errors */ }
    if (isAlive.current) rafRef.current = requestAnimationFrame(scanFrame);
  }, [processCode]);

  /* ── Start camera ────────────────────────────────────── */
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setLoading(true);
    isAlive.current = true; // allow scan loop to run
    try {
      // Build BarcodeDetector
      if ('BarcodeDetector' in window) {
        detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
      } else {
        setCameraError('Your browser does not support the built-in barcode scanner. Please use the manual entry below.');
        setLoading(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      // Check if still alive after the async getUserMedia call
      if (!isAlive.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setLoading(false);
      if (isAlive.current) rafRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please allow camera permission in your browser settings, or use the manual entry below.');
      setLoading(false);
    }
  }, [scanFrame]);

  /* ── Lifecycle ───────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    setScanResult(null);
    setManualCode('');
    lastCodeRef.current = '';
    cooldownRef.current = false;
    const t = setTimeout(startCamera, 300);
    // Cleanup: runs when isOpen becomes false OR component unmounts
    return () => {
      clearTimeout(t);
      stopStream();
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Close handler ───────────────────────────────────── */
  const handleClose = useCallback(() => {
    stopStream();          // stop camera synchronously
    setScanResult(null);  // clear state
    setManualCode('');
    onClose();             // close modal — React re-renders immediately
  }, [stopStream, onClose]);

  /* ── Manual entry ────────────────────────────────────── */
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processCode(manualCode.trim());
      setManualCode('');
    }
  };

  if (!isOpen) return null;

  /* ── Result banner colors ────────────────────────────── */
  const bannerColors = {
    success: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', icon: <CheckCircle size={22} color="#10b981" /> },
    already: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', icon: <AlertTriangle size={22} color="#f59e0b" /> },
    notfound: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', icon: <XCircle size={22} color="#ef4444" /> },
  };
  const banner = scanResult ? bannerColors[scanResult.type] : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8,12,20,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #0f1929 0%, #0d1b2a 100%)',
          border: '1px solid rgba(0,242,254,0.2)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 0 60px rgba(0,242,254,0.12)',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(15,23,42,0.6)',
          borderRadius: '20px 20px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(0,242,254,0.15)', border: '1px solid rgba(0,242,254,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Camera size={20} color="#00f2fe" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>QR Attendance Scanner</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                Scanned today: <strong style={{ color: '#00f2fe' }}>{scanCount}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSoundEnabled(s => !s)}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', color: '#aaa',
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff',
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '1.25rem' }}>

          {/* Viewfinder */}
          <div style={{
            position: 'relative', borderRadius: 14, overflow: 'hidden',
            background: '#000', aspectRatio: '4/3',
            border: '2px solid rgba(0,242,254,0.25)',
            marginBottom: '1rem',
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Corner brackets */}
            {[
              { top: 10, left: 10, borderTop: '3px solid #00f2fe', borderLeft: '3px solid #00f2fe' },
              { top: 10, right: 10, borderTop: '3px solid #00f2fe', borderRight: '3px solid #00f2fe' },
              { bottom: 10, left: 10, borderBottom: '3px solid #00f2fe', borderLeft: '3px solid #00f2fe' },
              { bottom: 10, right: 10, borderBottom: '3px solid #00f2fe', borderRight: '3px solid #00f2fe' },
            ].map((style, i) => (
              <div key={i} style={{ position: 'absolute', width: 24, height: 24, borderRadius: 2, ...style }} />
            ))}

            {/* Scan line animation */}
            {!loading && !cameraError && (
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)',
                animation: 'qrScanLine 2s linear infinite',
              }} />
            )}

            {/* Loading overlay */}
            {loading && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'rgba(0,0,0,0.75)',
              }}>
                <Loader2 size={32} color="#00f2fe" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#00f2fe', fontSize: '0.85rem' }}>Starting camera…</span>
              </div>
            )}

            {/* Error overlay */}
            {cameraError && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8, padding: '1rem',
                background: 'rgba(0,0,0,0.85)', textAlign: 'center',
              }}>
                <XCircle size={36} color="#ef4444" />
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{cameraError}</span>
                <button
                  onClick={startCamera}
                  style={{
                    marginTop: 8, padding: '6px 16px', borderRadius: 8,
                    background: 'rgba(0,242,254,0.15)', border: '1px solid #00f2fe',
                    color: '#00f2fe', fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  Retry Camera
                </button>
              </div>
            )}
          </div>

          {/* Scan result banner */}
          {scanResult && banner && (
            <div style={{
              borderRadius: 12, padding: '0.85rem 1rem',
              background: banner.bg, border: `1px solid ${banner.border}`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
              marginBottom: '1rem', animation: 'fadeInUp 0.3s ease',
            }}>
              {banner.icon}
              <div style={{ flex: 1 }}>
                {scanResult.type === 'success' && (
                  <>
                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>✅ Marked Attended</div>
                    <div style={{ color: '#d1fae5', fontSize: '0.82rem', marginTop: 2 }}>
                      {scanResult.studentName} · {scanResult.rollNo}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{scanResult.eventTitle}</div>
                  </>
                )}
                {scanResult.type === 'already' && (
                  <>
                    <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>⚠️ Already Attended</div>
                    <div style={{ color: '#fde68a', fontSize: '0.82rem', marginTop: 2 }}>{scanResult.studentName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{scanResult.eventTitle}</div>
                  </>
                )}
                {scanResult.type === 'notfound' && (
                  <>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>❌ Not Found</div>
                    <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: 2 }}>
                      No registration matched: <code style={{ fontSize: '0.72rem' }}>{scanResult.code}</code>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setScanResult(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Manual entry */}
          <div style={{
            borderRadius: 12, padding: '0.85rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
              Manual Entry — paste ticket code or roll number
            </div>
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: 8 }}>
              <input
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="e.g. GITS-ABC123"
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '7px 10px',
                  color: '#fff', fontSize: '0.85rem', outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'linear-gradient(135deg,#00f2fe,#4facfe)',
                  border: 'none', color: '#000', fontWeight: 700,
                  fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Check
              </button>
            </form>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(15,23,42,0.6)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '0 0 20px 20px',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '8px 20px', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Done Scanning
          </button>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes qrScanLine {
          0% { top: 15%; }
          50% { top: 80%; }
          100% { top: 15%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QRScannerModal;
