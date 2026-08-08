"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, NavTag } from "@/components/ScrapComponents";

export default function BeautyOfBugsPage() {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const s = window.innerWidth < 750 ? window.innerWidth / 750 : 1;
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    // Glitch animation for texts
    const glitchElements = gsap.utils.toArray(".glitch-text");
    
    gsap.to(glitchElements, {
      x: () => gsap.utils.random(-3, 3),
      y: () => gsap.utils.random(-3, 3),
      opacity: () => gsap.utils.random(0.5, 1),
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "steps(2)",
    });

    gsap.from(".bug-reveal", {
      rotation: () => gsap.utils.random(-15, 15),
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.5)",
      stagger: 0.1
    });

  }, { scope: container });

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundColor: '#2b2b2b',
      backgroundImage: 'url(/crumpled_paper_texture.jpg)', // assume this is missing or works fine as a fallback color if absent
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* HOME BUTTON */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50 }}>
        <NavTag text="НАЗАД" rotation={-5} href="/" />
      </div>

      {/* SCALED CONTENT CONTAINER */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: '600px',
        height: '750px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        <div className="bug-reveal" style={{
          width: '100%',
          backgroundColor: '#fffae6',
          boxShadow: '0 5px 20px rgba(0,0,0,0.4), inset 0 0 50px rgba(100,50,0,0.1)',
          padding: '50px 40px',
          position: 'relative',
          transform: 'rotate(-1deg)',
          borderRadius: '2px'
        }}>
          <Tape style={{ top: '-15px', right: '100px', transform: 'rotate(12deg)' }} />
          
          <h1 className="glitch-text" style={{ 
            fontFamily: 'var(--font-marker)', 
            fontWeight: 900, 
            fontSize: '4rem', 
            color: '#111', 
            lineHeight: 1,
            marginBottom: '30px',
            textDecoration: 'line-through',
            textDecorationColor: '#e74c3c',
            textDecorationThickness: '5px'
          }}>
            THE BEAUTY<br/>OF BUGS
          </h1>

          <div style={{
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#333',
          }}>
            <p style={{ marginBottom: '20px' }}>
              <span style={{ backgroundColor: '#111', color: '#fffae6', padding: '2px 8px' }}>ERROR: Object reference not set to an instance of an object.</span>
            </p>
            <p style={{ marginBottom: '20px' }}>
              Nobody likes bugs. They interrupt flow, break systems, and ruin weekends. But if you look closely, a bug is simply the system telling you exactly what it thinks reality is. 
            </p>
            <p style={{ marginBottom: '20px' }}>
              Debugging is modern detective work. You trace the logs, you isolate the variables, you build mental models of invisible architectures. When you finally find that one missing semicolon, or that race condition buried in an async function—it's euphoric.
            </p>
            <p style={{ marginBottom: '20px', textDecoration: 'line-through', color: '#888' }}>
              We write code to be perfect.
            </p>
            <p style={{ marginBottom: '20px' }}>
              We write code to fail gracefully. Bugs force us to build more resilient systems. They expose our blind spots. Without them, we would never truly understand the machines we build.
            </p>
            
            <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px' }}>
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>// TODO: Fix reality</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
