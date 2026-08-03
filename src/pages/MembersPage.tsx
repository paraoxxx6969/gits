import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CrewMember } from '../types';
import './MembersPage.css';

gsap.registerPlugin(ScrollTrigger);

// Fallback member data (used only if no crew members are loaded)
const FALLBACK_MEMBERS = [
  { id: 'fb-1', name: 'Dr. Rajesh Sharma', role: 'Faculty Advisor', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-2', name: 'Aarav Mehta', role: 'President · Lead Coordinator', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-3', name: 'Priya Sundaram', role: 'Vice President · Web Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-4', name: 'Siddharth Patel', role: 'CyberSec Wing Head', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-5', name: 'Neha Kapoor', role: 'AI & ML Wing Lead', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-6', name: 'Ravi Joshi', role: 'Cloud & DevOps Coordinator', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-7', name: 'Ananya Deshmukh', role: 'Events & PR Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-8', name: 'Kavya Iyer', role: 'Design & Media Head', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=faces&q=80' },
  { id: 'fb-9', name: 'Rohan Verma', role: 'App Development Lead', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=faces&q=80' },
];

const CARD_ROTS_BASE  = [-9, -5, -2, 3, 0, 4, 7, -4];
const CARD_DEPTHS_BASE = [14, 10, 8, 12, 6, 11, 9, 13];

interface MembersPageProps {
  crewMembers?: CrewMember[];
}

export const MembersPage: React.FC<MembersPageProps> = ({ crewMembers }) => {
  const MEMBERS = (crewMembers && crewMembers.length > 0) ? crewMembers : FALLBACK_MEMBERS;
  const CARD_ROTS = MEMBERS.map((_, i) => CARD_ROTS_BASE[i % CARD_ROTS_BASE.length]);
  const CARD_DEPTHS = MEMBERS.map((_, i) => CARD_DEPTHS_BASE[i % CARD_DEPTHS_BASE.length]);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sublineRef = useRef<HTMLDivElement>(null);
  const teamGridRef = useRef<HTMLDivElement>(null);
  const animCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- INITIAL STATES ----
      gsap.set('.m-small-team .m-word > span', { y: '105%' });
      gsap.set('.m-big-text .m-letter', { y: 80, opacity: 0 });
      gsap.set(sublineRef.current, { opacity: 0, y: 20 });
      gsap.set('.m-t-card', { opacity: 0 });

      // Set cards initial state
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const rot = CARD_ROTS[i];
        gsap.set(card, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
      });

      // ---- INTRO TIMELINE ----
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to('.m-small-team .m-word > span', {
          y: '0%',
          duration: 0.9,
          stagger: 0.08,
        }, 0.2)
        .to('.m-big-text .m-letter', {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: 'back.out(1.6)',
        }, 0.45)
        .to(cardsRef.current.filter(Boolean), {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: (_i: number, el: HTMLElement) => parseFloat(el.dataset.restrot || '0'),
          duration: 1.1,
          stagger: { each: 0.08, from: 'center' },
          ease: 'back.out(1.4)',
        }, 0.7)
        .to(sublineRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.5);

      // ---- CONTINUOUS FLOAT ----
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const rot = CARD_ROTS[i];
        gsap.to(card, {
          y: `+=${8 + (i % 3) * 5}`,
          rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
          duration: 3 + (i % 4) * 0.5,
          delay: 1.8 + i * 0.1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      // ---- MOUSE PARALLAX ----
      let mx = 0, my = 0, tx = 0, ty = 0;
      const hero = heroRef.current;
      const onMove = (e: MouseEvent) => {
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const onLeave = () => { mx = 0; my = 0; };
      hero?.addEventListener('mousemove', onMove);
      hero?.addEventListener('mouseleave', onLeave);

      let rafId: number;
      const parallax = () => {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const d = CARD_DEPTHS[i];
          card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
        });
        rafId = requestAnimationFrame(parallax);
      };
      rafId = requestAnimationFrame(parallax);

      // ---- CARD HOVER 3D ----
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const onCardMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateX: -py * 16,
            rotateY: px * 16,
            scale: 1.12,
            zIndex: 20,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 700,
            overwrite: 'auto',
          });
        };
        const onCardLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.6)',
            overwrite: 'auto',
          });
        };
        const onCardClick = () => {
          gsap.fromTo(card, { scale: 1.15 }, {
            scale: 1.05,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          });
        };
        card.addEventListener('mousemove', onCardMove);
        card.addEventListener('mouseleave', onCardLeave);
        card.addEventListener('click', onCardClick);
      });

      // ---- SCROLL: CARDS FAN OUT + BIG TEXT SCALES ----
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set('.m-big-text', { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
          gsap.set('.m-small-team', { y: -60 * p, opacity: 1 - p * 1.5 });
          const moves = [
            { x: -260, y: -40, rot: -25 },
            { x: -200, y: 20, rot: -18 },
            { x: -120, y: 80, rot: -10 },
            { x: -40, y: 120, rot: -4 },
            { x: 40, y: 120, rot: 4 },
            { x: 120, y: 80, rot: 12 },
            { x: 200, y: 20, rot: 22 },
            { x: 260, y: -40, rot: 28 },
          ];
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const m = moves[i];
            const rest = CARD_ROTS[i];
            gsap.set(card, {
              x: m.x * p,
              y: m.y * p,
              rotation: rest + m.rot * p,
            });
          });
          gsap.set(sublineRef.current, { opacity: 1 - p * 2 });
        },
      });

      // ---- TEAM GRID REVEAL ----
      gsap.from('.m-eyebrow, .m-team-head h2, .m-team-head p', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.m-team-head', start: 'top 80%' },
      });

      gsap.to('.m-t-card', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: teamGridRef.current, start: 'top 80%' },
      });
      gsap.from('.m-t-card', {
        y: 80,
        scale: 0.9,
        rotation: (i: number) => (i % 2 === 0 ? -3 : 3),
        duration: 1,
        stagger: 0.08,
        ease: 'back.out(1.3)',
        scrollTrigger: { trigger: teamGridRef.current, start: 'top 80%' },
      });

      // ---- BIG TEXT HOVER ----
      const bigWrap = bigTextRef.current?.parentElement;
      const onBigEnter = () => {
        gsap.to('.m-big-text .m-letter', {
          y: -8,
          duration: 0.5,
          stagger: 0.03,
          ease: 'back.out(1.6)',
        });
      };
      const onBigLeave = () => {
        gsap.to('.m-big-text .m-letter', {
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'elastic.out(1, 0.6)',
        });
      };
      bigWrap?.addEventListener('mouseenter', onBigEnter);
      bigWrap?.addEventListener('mouseleave', onBigLeave);

      // ---- PILL BUTTON CLICK ----
      const pills = document.querySelectorAll('.m-arrow-pill');
      pills.forEach((btn) => {
        btn.addEventListener('click', () => {
          gsap.fromTo(btn, { scale: 1 }, {
            scale: 0.93,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          });
        });
      });

      // Store cleanup
      animCleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        hero?.removeEventListener('mousemove', onMove);
        hero?.removeEventListener('mouseleave', onLeave);
        bigWrap?.removeEventListener('mouseenter', onBigEnter);
        bigWrap?.removeEventListener('mouseleave', onBigLeave);
      };
    }, pageRef);

    return () => {
      animCleanupRef.current?.();
      ctx.revert();
    };
  }, []);

  const bigText = 'big impact';

  return (
    <div className="members-page" ref={pageRef}>
      <div className="m-grain" />

      {/* ===== HERO ===== */}
      <section className="m-hero" ref={heroRef}>
        <h1 className="m-small-team">
          <span className="m-word"><span>Small</span></span>&nbsp;
          <span className="m-word"><span>team,</span></span>
        </h1>

        <div className="m-big-wrap">
          <div className="m-big-text" ref={bigTextRef}>
            {bigText.split('').map((ch, i) => (
              <span className="m-letter" key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
            ))}
          </div>
        </div>

        {/* Card row of top 8 main portraits */}
        <div className="m-cards-row">
          {MEMBERS.slice(0, 8).map((member, i) => (
            <div
              key={member.name}
              className={`m-card m-card-${i + 1}`}
              data-restrot={CARD_ROTS[i]}
              data-depth={CARD_DEPTHS[i]}
              ref={(el) => { cardsRef.current[i] = el; }}
            >
              <img src={member.img} alt={member.name} />
            </div>
          ))}
        </div>

        <div className="m-subline" ref={sublineRef} />
      </section>

      {/* ===== TEAM GRID ===== */}
      <section className="m-team-section">
        <div className="m-team-head">
          <div>
            <div className="m-eyebrow">The Crew · {MEMBERS.length} members</div>
            <h2>Developers, designers<br />and the <em>quietly brilliant</em>.</h2>
          </div>
          <p>Every person you see here drives every event we run. No middle layer, no handoffs to strangers — just direct work with the people doing it.</p>
        </div>

        <div className="m-team-grid" ref={teamGridRef}>
          {MEMBERS.map((member) => (
            <div className="m-t-card" key={member.id || member.name}>
              <img src={member.img} alt={member.name} />
              <div className="m-t-meta">
                <div className="m-nm">{member.name}</div>
                <div className="m-rl">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
