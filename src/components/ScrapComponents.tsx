"use client";

import React from "react";
import { useUISounds } from "@/hooks/useUISounds";
import { TransitionLink } from "./TransitionLink";

export const Tape = ({ style }: { style?: React.CSSProperties }) => (
  <div style={{
    position: 'absolute',
    width: '60px',
    height: '20px',
    backgroundColor: 'rgba(220, 215, 190, 0.8)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(2px)',
    zIndex: 10,
    ...style
  }} />
);

export const CutoutText = ({ text, rotation, bg = '#fff', color = '#111', style, className = "" }: { text: string, rotation: number, bg?: string, color?: string, style?: React.CSSProperties, className?: string }) => {
  const { playMarker } = useUISounds();
  
  return (
  <div className={`hover-lift ${className}`} 
    onMouseEnter={() => playMarker()}
    style={{
      backgroundColor: bg,
      color: color,
      padding: '8px 15px',
      display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    fontFamily: 'var(--font-inter)',
    fontWeight: 900,
    textTransform: 'uppercase',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
    border: `2px solid ${color}`,
    cursor: 'pointer',
    ...style
  }}>
    {text}
  </div>
  );
};

export const NavTag = ({ text, rotation, href = "/" }: { text: string, rotation: number, href?: string }) => {
  const { playMarker } = useUISounds();

  return (
  <TransitionLink href={href} target={href.startsWith('http') ? '_blank' : undefined} 
    className="hover-lift" 
    onMouseEnter={() => playMarker()}
    style={{
      position: 'relative',
    backgroundColor: '#f7ecd5',
    color: '#111',
    padding: '10px 20px 10px 40px',
    display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    fontFamily: 'var(--font-inter)',
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: '1.2rem',
    boxShadow: '3px 3px 10px rgba(0,0,0,0.5)',
    border: '1px solid #d4c8b0',
    cursor: 'pointer',
    textDecoration: 'none'
  }}>
    <div style={{
      position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
      width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a1a1a',
      boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8)'
    }} />
    <Tape style={{ top: '-10px', left: '20%', transform: 'rotate(-5deg)' }} />
    {text}
  </TransitionLink>
  );
};

export const Polaroid = ({ src, text, rotation, width = '200px', className = "", style }: { src: string, text: string, rotation: number, width?: string, className?: string, style?: React.CSSProperties }) => {
  const { playPaper } = useUISounds();

  return (
  <div className={`hover-lift ${className}`} 
    onMouseEnter={() => playPaper()}
    style={{
      ...style,
      backgroundColor: '#fff',
    padding: '10px 10px 40px 10px',
    width: width,
    transform: `rotate(${rotation}deg)`,
    boxShadow: '4px 4px 15px rgba(0,0,0,0.5)',
    position: 'relative',
    cursor: 'grab'
  }}>
    <Tape style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(3deg)' }} />
    <img src={src} alt="Polaroid" style={{ width: '100%', height: 'auto', border: '1px solid #eee' }} draggable={false} />
    <p style={{ fontFamily: 'var(--font-marker)', textAlign: 'center', marginTop: '10px', fontSize: '1.5rem', color: '#111', position: 'absolute', bottom: '5px', left: 0, width: '100%', pointerEvents: 'none' }}>
      {text}
    </p>
  </div>
  );
};
