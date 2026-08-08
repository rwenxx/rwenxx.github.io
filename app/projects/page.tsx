"use client";

import React, { useState } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import { NavTag, Tape, CutoutText } from '@/components/ScrapComponents';
import { useUISounds } from '@/hooks/useUISounds';

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: 'Microservices CI/CD Pipeline',
    tags: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS'],
    desc: 'Fully automated CI/CD pipeline for a microservices architecture. Reduced deployment time by 40% and eliminated manual downtime.',
    color: '#3498db',
    rotation: -2,
    tape: { top: '-12px', left: '20%', rotation: -8 },
  },
  {
    id: 2,
    title: 'React E-Commerce Platform',
    tags: ['React', 'Next.js', 'Redux', 'Stripe'],
    desc: 'High-performance e-commerce storefront handling 10k+ concurrent users. Integrated Stripe payments and headless CMS.',
    color: '#e74c3c',
    rotation: 3,
    tape: { top: '-12px', right: '15%', rotation: 10 },
  },
  {
    id: 3,
    title: 'Internal Monitoring Dashboard',
    tags: ['Prometheus', 'Grafana', 'Node.js', 'Bash'],
    desc: 'Custom monitoring dashboard aggregating metrics across 50+ instances. Reduced MTTD by 60% with proactive alerting.',
    color: '#2ecc71',
    rotation: -1,
    tape: { top: '-12px', left: '30%', rotation: 5 },
  },
];

// ─────────────────────────────────────────────────────────────
// DOOM EASTER EGG
// ─────────────────────────────────────────────────────────────
function DoomEasterEgg() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { playDoom } = useUISounds();

  return (
    <TransitionLink href="/doom" style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => {
          setHovered(true);
          playDoom();
        }}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setClicked(true)}
        onMouseUp={() => setClicked(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transform: `rotate(-8deg) scale(${clicked ? 0.88 : hovered ? 1.2 : 1})`,
          transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Skull */}
        <div style={{
          width: 80, height: 80,
          backgroundColor: '#1a0000',
          borderRadius: '50% 50% 40% 40%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.6rem',
          border: '2px solid #550000',
          boxShadow: hovered
            ? '0 0 30px #ff0000, 0 0 60px rgba(255,0,0,0.5), inset 0 0 20px rgba(255,0,0,0.2)'
            : '0 0 12px rgba(180,0,0,0.5), 0 4px 8px rgba(0,0,0,0.8)',
          transition: 'box-shadow 0.3s',
        }}>
          💀
        </div>

        {/* DOOM label */}
        <div style={{
          fontFamily: 'var(--font-inter)',
          fontWeight: 900,
          fontSize: '1rem',
          color: hovered ? '#ff3b30' : '#cc0000',
          letterSpacing: 4,
          textShadow: hovered
            ? '0 0 12px #ff0000, 0 0 4px #ff0000'
            : '0 0 6px rgba(200,0,0,0.6)',
          transition: 'color 0.2s, text-shadow 0.2s',
        }}>
          DOOM?&amp;&gt;?
        </div>

        {/* "secret" label — always slightly visible */}
        <div style={{
          fontSize: '0.55rem',
          color: hovered ? 'rgba(255,60,60,0.8)' : 'rgba(255,255,255,0.15)',
          fontFamily: 'monospace',
          letterSpacing: 2,
          transition: 'color 0.3s',
        }}>
          [ SECRET ]
        </div>
      </div>
    </TransitionLink>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { playPaper } = useUISounds();

  return (
    <main style={{
      width: '100%', minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      backgroundImage: 'url(/paper.jpg)',
      backgroundBlendMode: 'multiply',
      padding: '40px 20px',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>

        {/* NAV */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <NavTag text="← ГЛАВНОЕ" rotation={-2} href="/" />
          <NavTag text="ОБО МНЕ" rotation={1} href="/about" />
          <NavTag text="КОНТАКТЫ" rotation={-1} href="/contact" />
          <NavTag text="МУЗЫКА" rotation={2} href="/music" />
        </div>

        {/* HEADER */}
        <div style={{ marginBottom: 50, transform: 'rotate(-1deg)' }}>
          <CutoutText text="МОИ ПРОЕКТЫ" rotation={0} bg="#f7ecd5" style={{ fontSize: '3.5rem' }} />
          <p style={{
            fontFamily: 'var(--font-marker)', fontSize: '1.4rem', color: '#f7ecd5',
            marginTop: 12, transform: 'rotate(1deg)',
            opacity: 0.7,
          }}>
            DevOps / Full-Stack / Infrastructure
          </p>
        </div>

        {/* PROJECTS GRID */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'flex-start' }}>
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              style={{
                width: 320,
                backgroundColor: '#f5f0e8',
                padding: '24px 20px 20px 20px',
                transform: `rotate(${p.rotation}deg)`,
                boxShadow: '6px 8px 20px rgba(0,0,0,0.6)',
                position: 'relative',
                borderRadius: 2,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = `rotate(0deg) scale(1.03)`;
                (e.currentTarget as HTMLElement).style.boxShadow = '10px 14px 30px rgba(0,0,0,0.8)';
                (e.currentTarget as HTMLElement).style.zIndex = '50';
                playPaper();
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = `rotate(${p.rotation}deg)`;
                (e.currentTarget as HTMLElement).style.boxShadow = '6px 8px 20px rgba(0,0,0,0.6)';
                (e.currentTarget as HTMLElement).style.zIndex = '1';
              }}
            >
              {/* Tape */}
              <Tape style={{ top: p.tape.top, left: p.tape.left, transform: `rotate(${p.tape.rotation}deg)` }} />

              {/* Color stripe */}
              <div style={{ height: 6, backgroundColor: p.color, marginBottom: 16, borderRadius: 2 }} />

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-inter)', fontWeight: 900, fontSize: '1.1rem',
                textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 12, color: '#111',
              }}>
                {p.title}
              </h3>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 1,
                    backgroundColor: p.color, color: '#fff',
                    padding: '2px 8px', borderRadius: 2,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-marker)', fontSize: '1rem',
                color: '#333', lineHeight: 1.4, margin: 0,
              }}>
                {p.desc}
              </p>

              {/* Project number stamp */}
              <div style={{
                position: 'absolute', bottom: 12, right: 16,
                fontFamily: 'var(--font-inter)', fontWeight: 900,
                fontSize: '2.5rem', color: 'rgba(0,0,0,0.06)',
                lineHeight: 1, userSelect: 'none',
              }}>
                {String(p.id).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* ── DOOM EASTER EGG ── */}
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 32,
          zIndex: 50,
        }}>
          <DoomEasterEgg />
        </div>

      </div>
    </main>
  );
}
