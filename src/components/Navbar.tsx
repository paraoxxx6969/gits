import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Bell, UserCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import type { Announcement, UserSession } from '../types';
import gitsLogo from '../assets/gits-logo.jpg';
import '../Navbar.css';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userSession: UserSession;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  announcements: Announcement[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userSession,
  onOpenLoginModal,
  onLogout,
  announcements
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const activeAnnouncements = announcements.filter(a => a.active);
  const currentAnnouncement = activeAnnouncements.length > 0 ? activeAnnouncements[0] : null;

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'winners', label: 'Winners' },
    { id: 'gallery', label: 'Memories' },
    { id: 'members', label: 'Crew' },
  ];

  if (userSession.role === 'student') {
    navLinks.push({ id: 'student-dashboard', label: 'Profile' });
  }
  if (userSession.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Portal' });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>

      {currentAnnouncement && (
        <motion.div
          className="navbar__announcement"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Bell size={13} className="navbar__announcement-icon" />
          <span>{currentAnnouncement.content}</span>
          {currentAnnouncement.linkUrl && (
            <button
              onClick={() => handleNavClick('events')}
              className="navbar__announcement-btn"
            >
              {currentAnnouncement.linkText || 'View Details'}
            </button>
          )}
        </motion.div>
      )}

      <div className="navbar__inner">
        <div className="navbar__bar">

          {/* Logo — left */}
          <motion.div
            onClick={() => handleNavClick('home')}
            className="navbar__logo"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="navbar__logo-icon">
              <img src={gitsLogo} alt="GITS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px' }} />
            </div>
            <div className="navbar__logo-text-wrap">
              <span className="navbar__logo-text">GITS</span>
              <span className="navbar__logo-tag">Tech Club</span>
            </div>
          </motion.div>

          {/* Nav links — center pill */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <div className="navbar__nav-pill">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`navbar__link${activeTab === link.id ? ' navbar__link--active' : ''}`}
                >
                  {(activeTab === link.id || hoveredLink === link.id) && (
                    <motion.span
                      layoutId="navbar-active-bg"
                      className={`navbar__link-bg${activeTab === link.id ? ' navbar__link-bg--active' : ''}`}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="navbar__link-label">{link.label}</span>
                  <span className="navbar__link-glow" aria-hidden="true" />
                </button>
              ))}
            </div>
          </nav>

          {/* Auth + mobile toggle — right */}
          <div className="navbar__actions">
            {userSession.role === 'guest' ? (
              <motion.button
                onClick={onOpenLoginModal}
                className="navbar__cta"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Start a project</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
                <span className="navbar__cta-shine" aria-hidden="true" />
              </motion.button>
            ) : (
              <>
                <span className="navbar__user-badge">
                  {userSession.role === 'admin'
                    ? <ShieldCheck size={14} />
                    : <UserCheck size={14} />}
                  {userSession.role}
                </span>
                <motion.button
                  onClick={onLogout}
                  className="navbar__logout"
                  title="Sign out"
                  aria-label="Sign out"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <LogOut size={15} />
                </motion.button>
              </>
            )}

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`navbar__toggle${mobileMenuOpen ? ' navbar__toggle--open' : ''}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="navbar__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="navbar__mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`navbar__mobile-link${activeTab === link.id ? ' navbar__mobile-link--active' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="navbar__mobile-dot" />
                  {link.label}
                  <ArrowUpRight size={14} className="navbar__mobile-arrow" />
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
