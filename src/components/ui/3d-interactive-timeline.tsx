import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Trophy, Award, Code, Globe, Cpu, Zap, Star, Users, Calendar
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
const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; glowColor: string; bgBadge: string }> = {
  Hackathon:       { icon: <Zap size={18} />,      color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)', bgBadge: 'rgba(245, 158, 11, 0.25)' },
  Workshop:        { icon: <Cpu size={18} />,       color: '#00f2fe', glowColor: 'rgba(0, 242, 254, 0.4)', bgBadge: 'rgba(0, 242, 254, 0.25)' },
  'Coding Contest':{ icon: <Code size={18} />,      color: '#a78bfa', glowColor: 'rgba(167, 139, 250, 0.4)', bgBadge: 'rgba(167, 139, 250, 0.25)' },
  'Tech Talk':     { icon: <Globe size={18} />,     color: '#34d399', glowColor: 'rgba(52, 211, 153, 0.4)', bgBadge: 'rgba(52, 211, 153, 0.25)' },
  'Project Expo':  { icon: <Star size={18} />,      color: '#fb7185', glowColor: 'rgba(251, 113, 133, 0.4)', bgBadge: 'rgba(251, 113, 133, 0.25)' },
  Networking:      { icon: <Users size={18} />,     color: '#60a5fa', glowColor: 'rgba(96, 165, 250, 0.4)', bgBadge: 'rgba(96, 165, 250, 0.25)' },
  default:         { icon: <Award size={18} />,     color: '#7928ca', glowColor: 'rgba(121, 40, 202, 0.4)', bgBadge: 'rgba(121, 40, 202, 0.25)' },
};

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
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const controls = useAnimation();
  const isLeft = index % 2 === 0;
  const meta = CATEGORY_META[event.category || ''] || CATEGORY_META['default'];
  const isActive = activeEvent === event.id;

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div
      ref={ref}
      className="relative mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-2 w-full items-start"
    >
      {/* Center Node Icon Dot (Desktop only - sits on the central spine) */}
      <div className="hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center border-4 cursor-pointer select-none"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: 'easeOut' },
            },
          }}
          style={{
            background: meta.color,
            borderColor: '#080c14',
            boxShadow: isActive ? `0 0 28px ${meta.glowColor}` : `0 0 14px ${meta.glowColor}`,
            color: '#080c14',
            fontWeight: 800,
            willChange: 'transform, opacity',
          }}
          whileHover={{ scale: 1.2 }}
          onClick={() => setActiveEvent(isActive ? null : event.id)}
        >
          {event.icon ?? meta.icon}
        </motion.div>
      </div>

      {/* Content Card Positioned in Column 1 (Left) or Column 2 (Right) on Desktop */}
      <div
        className={`w-full ${
          isLeft
            ? 'md:col-start-1 md:pr-10'
            : 'md:col-start-2 md:pl-10'
        }`}
      >
        <motion.div
          className="w-full rounded-2xl overflow-hidden border border-white/10"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {
              opacity: 0,
              scale: 0.96,
              y: 20
            },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            borderColor: isActive ? meta.color : 'rgba(255, 255, 255, 0.12)',
            boxShadow: isActive
              ? `0 12px 40px -10px ${meta.glowColor}, 0 0 0 1px ${meta.color}`
              : '0 8px 30px rgba(0, 0, 0, 0.35)',
            transformStyle: 'preserve-3d',
            transform: isActive
              ? `perspective(1000px) rotateY(${mousePosition.x * (isLeft ? 3 : -3)}deg) rotateX(${mousePosition.y * -3}deg)`
              : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
            willChange: 'transform, opacity',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease-out',
          }}
          onMouseEnter={() => setActiveEvent(event.id)}
          onMouseLeave={() => setActiveEvent(null)}
        >
          {/* Card Top Image Header */}
          {showImages && event.image && (
            <div className="relative h-44 md:h-48 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              
              {event.category && (
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5"
                    style={{
                      background: 'rgba(8, 12, 20, 0.75)',
                      color: meta.color,
                      border: `1px solid ${meta.color}88`,
                    }}
                  >
                    {meta.icon}
                    {event.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Card Body */}
          <div className="p-5 md:p-6">
            
            {/* Metadata Row: Date & Attendees */}
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: meta.color }}>
                <Calendar size={14} />
                <span>{event.date}</span>
              </div>

              {event.attendeesCount && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Users size={13} color="#34d399" />
                  <span>{event.attendeesCount}+ Attendees</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 leading-tight">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-300 mb-4">
              {event.description}
            </p>

            {/* Winners Podium Box */}
            {event.winners && event.winners.length > 0 && (
              <div
                className="rounded-xl p-3.5 mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(121, 40, 202, 0.12) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 text-amber-400">
                  <Trophy size={14} /> Champions &amp; Winners
                </div>
                <div className="flex flex-col gap-1.5 text-xs md:text-sm">
                  {event.winners.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Award size={14} color={idx === 0 ? '#f59e0b' : '#34d399'} />
                      <span className={idx === 0 ? 'font-bold text-amber-300' : 'text-slate-200'}>
                        {w}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights Badges */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10"
                  >
                    🏅 {h}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Hover Bottom Accent Bar */}
          <motion.div
            className="h-1 w-full"
            style={{ background: meta.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export const Timeline3D: React.FC<Timeline3DProps> = ({
  events,
  showImages = true,
  className = '',
}) => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Animation for vertical beam line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001
  });

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
      className={`w-full relative ${className}`}
      style={{ color: '#f8fafc' }}
    >
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">

        {/* Central Vertical Spine Line (Desktop only - centered) */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full z-0 pointer-events-none opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* Animated Phase Travel Beam Line (Desktop only) */}
        <motion.div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full z-0 pointer-events-none origin-top"
          style={{
            scaleY,
            background: 'linear-gradient(to bottom, #f59e0b 0%, #7928ca 40%, #00f2fe 70%, #10b981 100%)',
            boxShadow: '0 0 16px rgba(0, 242, 254, 0.8)',
            willChange: 'transform',
          }}
        />

        {/* Timeline Event Items */}
        <div className="relative z-10 pt-2 md:pt-4">
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
  );
};

export default Timeline3D;
