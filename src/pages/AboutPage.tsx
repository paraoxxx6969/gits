import React from 'react';
import { Target, Award } from 'lucide-react';


export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Faculty Advisor & Head of IT Dept',
      wing: 'Department Advisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Directing technological growth and student research initiatives in Information Technology.'
    },
    {
      name: 'Aarav Mehta',
      role: 'President / Lead Coordinator',
      wing: 'GITS Executive Board',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: '4th Year IT Student. Full-stack developer & open-source contributor.'
    },
    {
      name: 'Priya Sundaram',
      role: 'Vice President & Web Lead',
      wing: 'GITS Executive Board',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Leading web application workshops & organizing CodeMatrix hackathons.'
    },
    {
      name: 'Neha Kapoor',
      role: 'Cybersecurity Wing Head',
      wing: 'RedTeam Wing',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'CTF challenge designer & ethical hacking instructor.'
    }
  ];

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        
        {/* Banner */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>ABOUT OUR COMMUNITY</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Empowering Future IT Engineers
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            GITS (Group of IT Students) is the premier student-led technical organization dedicated to bridging academic curriculum with modern industry tech stacks.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0,242,254,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Target size={24} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To provide IT students with hands-on technical bootcamps, collaborative open-source projects, and competitive hackathon platforms that sharpen real-world engineering skills.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(121, 40, 202, 0.15)', border: '1px solid rgba(121,40,202,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={24} color="#d8b4fe" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              To establish GITS as a top student innovation incubator producing industry-ready software engineers, AI developers, and security analysts recognized across national competitions.
            </p>
          </div>
        </div>

        {/* Core Executive Committee */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>LEADERSHIP BOARD</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Meet the GITS Coordinators</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {teamMembers.map((member, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem auto', border: '3px solid #00f2fe', boxShadow: '0 0 20px rgba(0,242,254,0.3)' }} 
                />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{member.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{member.role}</div>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginBottom: '0.75rem' }}>{member.wing}</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
