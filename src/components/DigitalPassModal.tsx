import React, { useRef } from 'react';
import { QrCode, Download, Printer, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', background: '#0a0f1d' }}>
        
        {/* Top Notification */}
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.85rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Registration Confirmed! Your Pass is Ready.
        </div>

        {/* Printable Ticket Pass Body */}
        <div ref={passRef} style={{ padding: '1.75rem' }}>
          <div style={{ background: 'linear-gradient(145deg, #0f172a 0%, #080c14 100%)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background Watermark Glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Terminal size={18} color="#080c14" />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>GITS EVENT PASS</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>GROUP OF IT STUDENTS</div>
                </div>
              </div>
              <span className="badge badge-green">VERIFIED TICKET</span>
            </div>

            {/* Event Name & Category */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginBottom: '0.35rem' }}>{event.category}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{event.title}</h3>
            </div>

            {/* Student & Event Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ATTENDEE NAME</span>
                <strong style={{ color: '#fff' }}>{registration.studentName}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ROLL NO / STUDENT ID</span>
                <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-code)' }}>{registration.rollNo}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DEPARTMENT & YEAR</span>
                <span style={{ color: 'var(--text-main)' }}>{registration.department} ({registration.year})</span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DATE & VENUE</span>
                <span style={{ color: 'var(--text-main)' }}>{event.date} • {event.venue}</span>
              </div>
            </div>

            {/* QR Code & Ticket Code Box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>UNIQUE TICKET PASS CODE</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-code)', letterSpacing: '0.05em' }}>
                  {registration.ticketCode}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} color="#10b981" /> Present QR at gate entry
                </div>
              </div>

              {/* Simulated QR Code matrix */}
              <div style={{ background: '#fff', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={64} color="#080c14" />
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '1rem 1.75rem 1.75rem 1.75rem', display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
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
