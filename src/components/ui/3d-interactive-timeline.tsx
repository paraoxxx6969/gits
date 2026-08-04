import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Trophy, Award, Code, Globe, Cpu, Zap, Star, Users
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  category?: string;
  color?: string;
  winners?: string[];
  highlights?: string[];
  attendeesCount?: number;
}

interface Timeline3DProps {
  events: TimelineEvent[];
  showImages?: boolean;
  className?: string;
}

// Category → icon + color mapping
const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; glowColor: string }> = {
  Hackathon:       { icon: <Zap size={18} />,      color: '#f59e0b', glowColor: 'rgba(245,158,11,0.5)' },
  Workshop:        { icon: <Cpu size={18} />,       color: '#00f2fe', glowColor: 'rgba(0,242,254,0.5)' },
  'Coding Contest':{ icon: <Code size={18} />,      color: '#a78bfa', glowColor: 'rgba(167,139,250,0.5)' },
  'Tech Talk':     { icon: <Globe size={18} />,     color: '#34d399', glowColor: 'rgba(52,211,153,0.5)' },
  'Project Expo':  { icon: <Star size={18} />,      color: '#fb7185', glowColor: 'rgba(251,113,133,0.5)' },
  Networking:      { icon: <Users size={18} />,     color: '#60a5fa', glowColor: 'rgba(96,165,250,0.5)' },
  default:         { icon: <Award size={18} />,     color: '#7928ca', glowColor: 'rgba(121,40,202,0.5)' },
};

// Individual timeline card — must be its own component so hooks are called at top level
interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
  activeEvent: string | null;
  setActiveEvent: (id: string | null) => void;
  mousePosition: { x: number; y: number };
  showImages: boolean;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  event,
  index,
  activeEvent,
  setActiveEvent,
  mousePosition,
  showImages,
}) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  const controls = useAnimation();
  const isEven = index % 2 === 0;
  const meta = CATEGORY_META[event.category || ''] || CATEGORY_META['default'];
  const isActive = activeEvent === event.id;

  useEffect(() => {
    if (inView) controls.start('visible');
    else controls.start('hidden');
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={`relative mb-12 md:mb-20 flex ${
        isEven
          ? 'md:flex-row-reverse md:pl-[50%]'
          : 'md:flex-row md:pr-[50%]'
      }`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden:  { opacity: 0, x: isEven ? 60 : -60, y: 20 },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
      }}
    >
      {/* Central node dot */}
      <div
        className={`absolute top-6 z-20 ${
          isEven
            ? 'left-0 md:left-[calc(50%-20px)]'
            : 'left-0 md:left-[calc(50%-20px)]'
        } hidden md:block`}
      >
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center border-4 cursor-pointer select-none"
          style={{
            background: meta.color,
            borderColor: '#080c14',
            boxShadow: isActive ? `0 0 22px ${meta.glowColor}` : 'none',
            color: '#fff',
          }}
          whileHover={{ scale: 1.25 }}
          onClick={() => setActiveEvent(isActive ? null : event.id)}
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
        >
          {event.icon ?? meta.icon}
        </motion.div>
      </div>

      {/* Mobile dot */}
      <div className="absolute left-[-1.6rem] top-6 w-4 h-4 rounded-full border-2 border-[#080c14] md:hidden"
        style={{ background: meta.color, boxShadow: `0 0 12px ${meta.glowColor}` }} />

      {/* Card */}
      <motion.div
        className={`relative z-10 w-full md:w-[calc(100%-3.5rem)] ${
          isEven ? 'md:mr-4' : 'md:ml-4'
        } rounded-2xl overflow-hidden border border-white/10`}
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(18px)',
          boxShadow: isActive
            ? `0 0 0 1px ${meta.color}55, 0 12px 40px rgba(0,0,0,0.45)`
            : '0 8px 32px rgba(0,0,0,0.4)',
          transformStyle: 'preserve-3d',
          transform: `perspective(900px) rotateY(${mousePosition.x * (isEven ? -2.5 : 2.5)}deg) rotateX(${mousePosition.y * -2.5}deg)`,
          transition: 'box-shadow 0.3s ease',
        }}
        whileHover={{ y: -6, transition: { duration: 0.3 } }}
        onMouseEnter={() => setActiveEvent(event.id)}
        onMouseLeave={() => setActiveEvent(null)}
      >
        {/* Image */}
        {showImages && event.image && (
          <div className="relative h-44 overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              animate={{ scale: isActive ? 1.06 : 1, y: isActive ? -8 : 0 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            {event.category && (
              <div className="absolute top-3 right-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: meta.color + '33', color: meta.color, border: `1px solid ${meta.color}66` }}
                >
                  {event.category}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-5 md:p-6">
          {/* Date + pulse dot */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest" style={{ color: meta.color }}>
              {event.date}
            </span>
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: meta.color }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{event.title}</h3>

          {/* Attendees count */}
          {event.attendeesCount && (
            <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              <Users size={12} />
              <span>{event.attendeesCount}+ Participants</span>
            </div>
          )}

          {/* Expandable description */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              {event.description}
            </p>

            {/* Winners */}
            {event.winners && event.winners.length > 0 && (
              <div
                className="rounded-xl p-3 mb-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(121,40,202,0.12) 100%)',
                  border: '1px solid rgba(245,158,11,0.25)',
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#fbbf24' }}>
                  <Trophy size={13} /> Champions &amp; Winners
                </div>
                <div className="flex flex-col gap-1">
                  {event.winners.map((w, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm">
                      <Award size={13} color={i === 0 ? '#f59e0b' : '#34d399'} />
                      <span style={{ color: i === 0 ? '#fbbf24' : '#fff', fontWeight: i === 0 ? 700 : 400 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {event.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                  >
                    🏅 {h}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.glowColor})` }}
          initial={{ width: '0%' }}
          animate={{ width: isActive ? '100%' : '0%' }}
          transition={{ duration: 0.45 }}
        />
      </motion.div>
    </motion.div>
  );
};

// ── Main exported component ──────────────────────────────────────────────────
export const Timeline3D: React.FC<Timeline3DProps> = ({
  events,
  showImages = true,
  className = '',
}) => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${className}`}
      style={{ color: '#f8fafc' }}
    >
      <div className="relative max-w-5xl mx-auto">

        {/* Floating ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${80 + i * 30}px`,
                height: `${80 + i * 30}px`,
                background: i % 2 === 0 ? '#7928ca' : '#00f2fe',
                filter: 'blur(30px)',
              }}
              animate={{
                x: [`${10 + i * 12}%`, `${25 + i * 8}%`, `${10 + i * 12}%`],
                y: [`${5  + i * 15}%`, `${20 + i * 10}%`, `${5  + i * 15}%`],
              }}
              transition={{ duration: 18 + i * 3, ease: 'easeInOut', repeat: Infinity }}
            />
          ))}
        </div>

        {/* Central spine line */}
        <div className="relative pl-6 md:pl-0">
          {/* Mobile vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] md:hidden rounded-full"
            style={{ background: 'linear-gradient(to bottom, #f59e0b 0%, #7928ca 50%, #00f2fe 100%)' }}
          />

          {/* Desktop center line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] hidden md:block rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #f59e0b 0%, #7928ca 50%, #00f2fe 100%)',
              boxShadow: '0 0 14px rgba(121,40,202,0.4)',
            }}
          />

          {/* Cards */}
          <div className="relative z-10">
            {events.map((event, index) => (
              <TimelineCard
                key={event.id}
                event={event}
                index={index}
                activeEvent={activeEvent}
                setActiveEvent={setActiveEvent}
                mousePosition={mousePosition}
                showImages={showImages}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline3D;
