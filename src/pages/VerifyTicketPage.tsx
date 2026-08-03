import React from 'react';

interface VerifyTicketPageProps {
  ticketData: {
    ticket: string;
    name: string;
    roll: string;
    gr: string;
    event: string;
    dept: string;
    year: string;
    div: string;
    email: string;
    phone: string;
    college: string;
  };
}

export const VerifyTicketPage: React.FC<VerifyTicketPageProps> = ({ ticketData }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#ffffff',
      color: '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 1rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Green Verification Top Bar */}
        <div style={{
          background: '#10b981',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          VERIFIED STUDENT PASS
        </div>

        <div style={{ padding: '1.75rem 1.5rem' }}>
          {/* Institution Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px dashed #e2e8f0',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                GITS DMCE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                Group of IT Students · Tech Club
              </div>
            </div>

            <div style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#334155',
              fontFamily: 'monospace'
            }}>
              {ticketData.ticket || 'VERIFIED'}
            </div>
          </div>

          {/* Event Title Banner */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              Registered Event
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              {ticketData.event || 'GITS Event'}
            </div>
          </div>

          {/* Student Info Table */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Student Name
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {ticketData.name || 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Roll Number
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', fontFamily: 'monospace', marginTop: '2px' }}>
                {ticketData.roll || 'N/A'}
              </div>
            </div>

            {ticketData.gr && (
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  GR Number
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
                  {ticketData.gr}
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Branch & Year
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                {ticketData.dept || 'Information Technology'} ({ticketData.year}{ticketData.div ? `-${ticketData.div}` : ''})
              </div>
            </div>

            {ticketData.email && (
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9', gridColumn: ticketData.gr ? 'auto' : '1 / -1' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email Address
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '2px', wordBreak: 'break-all' }}>
                  {ticketData.email}
                </div>
              </div>
            )}

            {ticketData.college && (
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  College / Institution
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                  {ticketData.college}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Code Box */}
          <div style={{
            border: '2px solid #10b981',
            background: '#ecfdf5',
            padding: '1rem',
            borderRadius: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gate Verification Code
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065f46', fontFamily: 'monospace', letterSpacing: '0.08em', marginTop: '4px' }}>
              {ticketData.ticket}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#047857', marginTop: '4px', fontWeight: 500 }}>
              ✓ Authenticated Entry Pass for GITS Event Gate
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f1f5f9',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748b',
        }}>
          Datta Meghe College of Engineering · Department of IT
        </div>
      </div>
    </div>
  );
};
