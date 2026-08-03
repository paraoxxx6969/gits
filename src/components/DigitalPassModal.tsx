import React, { useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle2, ShieldCheck, Terminal, X } from 'lucide-react';
import type { EventRegistration, ClubEvent } from '../types';

interface DigitalPassModalProps {
  registration: EventRegistration | null;
  event: ClubEvent | null;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  registration,
  event,
  onClose
}) => {
  const passRef = useRef<HTMLDivElement>(null);

  if (!registration || !event) return null;

  // Build the QR payload — all student + event info in structured text
  const qrPayload = useMemo(() => {
    const lines = [
      `GITS DMCE EVENT PASS`,
      `─────────────────────`,
      `TICKET: ${registration.ticketCode}`,
      `EVENT:  ${event.title}`,
      `DATE:   ${event.date}  ${event.time}`,
      `VENUE:  ${event.venue}`,
      `─────────────────────`,
      `NAME:   ${registration.studentName}`,
      `ROLL:   ${registration.rollNo}`,
      ...(registration.grNo ? [`GR NO:  ${registration.grNo}`] : []),
      `EMAIL:  ${registration.email}`,
      ...(registration.phone ? [`PHONE:  ${registration.phone}`] : []),
      `DEPT:   ${registration.department}`,
      `YEAR:   ${registration.year}`,
      ...(registration.div ? [`DIV:    ${registration.div}`] : []),
      ...(registration.collegeName ? [`COLLEGE:${registration.collegeName}`] : []),
      `─────────────────────`,
      `STATUS: ${registration.status}`,
      `REGISTERED: ${new Date(registration.registeredAt).toLocaleString('en-IN')}`,
    ];
    return lines.join('\n');
  }, [registration, event]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px', background: '#0a0f1d', padding: 0, overflow: 'hidden' }}
      >
        {/* Top Notification Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '0.85rem 1.25rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          position: 'relative',
        }}>
          <CheckCircle2 size={18} />
          Registration Confirmed! Your Pass is Ready.
          <button
            onClick={onClose}
            style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Ticket Pass Body */}
        <div ref={passRef} style={{ padding: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #080c14 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background glow watermark */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(121, 40, 202, 0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Terminal size={18} color="#080c14" />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>GITS EVENT PASS</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>GROUP OF IT STUDENTS · DMCE</div>
                </div>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>VERIFIED TICKET</span>
            </div>

            {/* Event Info */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginBottom: '0.35rem', display: 'inline-block' }}>{event.category}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, margin: '0.25rem 0 0' }}>{event.title}</h3>
            </div>

            {/* Student + Event Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendee Name</span>
                <strong style={{ color: '#fff' }}>{registration.studentName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roll No</span>
                <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{registration.rollNo}</strong>
              </div>
              {registration.grNo && (
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GR Number</span>
                  <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}>{registration.grNo}</span>
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dept & Year</span>
                <span style={{ color: 'var(--text-main)' }}>{registration.department} · {registration.year}{registration.div ? ` (Div ${registration.div})` : ''}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.78rem', wordBreak: 'break-all' }}>{registration.email}</span>
              </div>
              {registration.phone && (
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</span>
                  <span style={{ color: 'var(--text-main)' }}>{registration.phone}</span>
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Venue</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{event.date} · {event.venue}</span>
              </div>
            </div>

            {/* QR Code + Ticket Code Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 242, 254, 0.05)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              gap: '1rem',
            }}>
              {/* Ticket code + info */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Unique Ticket Code</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-code)', letterSpacing: '0.06em', wordBreak: 'break-all' }}>
                  {registration.ticketCode}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={12} color="#10b981" />
                  Scan QR at gate entry
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
                  QR encodes all your details
                </div>
              </div>

              {/* Real QR Code */}
              <div style={{ flexShrink: 0, background: '#ffffff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)' }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#080c14"
                  level="M"
                  style={{ display: 'block' }}
                />
              </div>
            </div>

            {/* Footer strip */}
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.68rem', color: '#334155' }}>
              Registered on {new Date(registration.registeredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} &nbsp;·&nbsp; GITS-DMCE Official Portal
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '1rem 1.5rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={16} /> Print Ticket
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              <Download size={16} /> Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
