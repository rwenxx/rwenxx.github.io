"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, NavTag } from "@/components/ScrapComponents";

export default function RawEnergyPage() {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // The content requires ~700px width.
      const s = window.innerWidth < 750 ? window.innerWidth / 750 : 1;
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    gsap.from(".raw-reveal", {
      scale: 0.8,
      opacity: 0,
      rotation: () => gsap.utils.random(-8, 8),
      duration: 1,
      ease: "power4.out",
      stagger: 0.15
    });
  }, { scope: container });

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* HOME BUTTON (Special red variant for dark theme) */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50 }}>
        <div className="hover-lift" style={{ display: 'inline-block' }}>
          <NavTag text="НАЗАД" rotation={-5} href="/" />
        </div>
      </div>

      {/* BACKGROUND SCRIBBLINGS */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1, zIndex: 0, overflow: 'hidden' }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontFamily: 'var(--font-marker)',
            color: '#fff',
            fontSize: `${Math.random() * 3 + 2}rem`,
            transform: `rotate(${Math.random() * 360}deg)`,
            whiteSpace: 'nowrap'
          }}>
            {['RAW', 'ENERGY', 'CHAOS', 'SYSTEM', 'CRASH', '404', 'RUNTIME'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* SCALED CONTENT CONTAINER */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: '650px',
        height: '800px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* TORN CARDBOARD / POSTER */}
        <div className="raw-reveal" style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#111',
          border: '3px solid #ff3333',
          boxShadow: '0 0 30px rgba(255,51,51,0.2), 10px 15px 30px rgba(0,0,0,0.8)',
          position: 'relative',
          padding: '60px 50px',
          transform: 'rotate(2deg)'
        }}>
          {/* Tapes */}
          <Tape style={{ top: '-15px', left: '20%', transform: 'rotate(-5deg)', width: '100px', backgroundColor: '#800' }} />
          <Tape style={{ bottom: '-15px', right: '20%', transform: 'rotate(-8deg)', width: '100px', backgroundColor: '#800' }} />
          
          <h1 style={{ 
            fontFamily: 'var(--font-marker)', 
            fontWeight: 900, 
            fontSize: '4.5rem', 
            color: '#ff3333', 
            textTransform: 'uppercase', 
            lineHeight: 1,
            marginBottom: '30px',
            textShadow: '3px 3px 0 #000'
          }}>
            EXPLORING<br/>
            <span style={{ color: '#fff' }}>RAW ENERGY</span>
          </h1>

          <div style={{
            fontFamily: 'monospace',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#ddd',
            textAlign: 'justify'
          }}>
            <p style={{ marginBottom: '25px', borderLeft: '4px solid #ff3333', paddingLeft: '15px' }}>
              There is a specific kind of adrenaline that only exists at 3:00 AM, deep inside a terminal session, staring down a production bug. It's raw, unfiltered energy.
            </p>
            <p style={{ marginBottom: '25px' }}>
              Most people think of engineering as a sterile, calculated discipline. But under the hood, servers are breathing beasts. Traffic spikes, race conditions, memory leaks—these are the chaotic forces of nature in our digital world. 
            </p>
            <p style={{ marginBottom: '25px' }}>
              My drive comes from harnessing that chaos. It's the thrill of deploying a patch that drops latency by 200ms. It's the satisfaction of tearing down bloated monolithic structures and replacing them with lean, ruthless microservices. It's about stripping away the corporate fluff and getting down to the bare metal.
            </p>
            <div className="raw-reveal" style={{
              backgroundColor: '#ff3333',
              color: '#111',
              padding: '15px',
              fontFamily: 'var(--font-inter)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transform: 'rotate(-2deg)',
              marginTop: '40px',
              display: 'inline-block',
              boxShadow: '4px 4px 0 #fff'
            }}>
              WARNING: SYSTEM OPERATING AT MAXIMUM CAPACITY
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
