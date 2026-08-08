"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, NavTag } from "@/components/ScrapComponents";

export default function ArtistStatementPage() {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // The paper requires ~700px width.
      const s = window.innerWidth < 750 ? window.innerWidth / 750 : 1;
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    gsap.from(".paper-reveal", {
      y: 50,
      opacity: 0,
      rotation: () => gsap.utils.random(-5, 5),
      duration: 1.2,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundImage: 'url(/wood_desk.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* HOME BUTTON */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50 }}>
        <NavTag text="НАЗАД" rotation={-5} href="/" />
      </div>

      {/* BACKGROUND DECOR */}
      <img src="/coffee_stain.jpg" style={{
        position: 'absolute', top: '10%', right: '15%', width: '200px',
        mixBlendMode: 'multiply', opacity: 0.6, transform: 'rotate(25deg)'
      }} alt="coffee" draggable={false} />

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
        
        {/* THE PAPER */}
        <div className="paper-reveal" style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f4ecd8',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '100% 30px', // Notebook lines
          boxShadow: '8px 12px 25px rgba(0,0,0,0.6)',
          position: 'relative',
          padding: '50px 40px',
          transform: 'rotate(-2deg)'
        }}>
          {/* Vertical red margin line */}
          <div style={{ position: 'absolute', left: '40px', top: 0, bottom: 0, width: '2px', backgroundColor: '#e74c3c', opacity: 0.7 }} />

          <Tape style={{ top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(3deg)', width: '120px' }} />
          
          <h1 style={{ 
            fontFamily: 'var(--font-inter)', 
            fontWeight: 900, 
            fontSize: '3rem', 
            color: '#111', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            marginLeft: '20px', // Push past the red line
            borderBottom: '4px solid #111',
            paddingBottom: '10px',
            marginBottom: '30px'
          }}>
            Artist Statement
          </h1>

          <div style={{
            fontFamily: 'serif',
            fontSize: '1.25rem',
            lineHeight: 1.8,
            color: '#222',
            marginLeft: '20px', // Push past the red line
            textAlign: 'justify'
          }}>
            <p style={{ marginBottom: '20px' }}>
              For a long time, the software industry has tried to draw a strict line between <strong>code</strong> (the art of creation) and <strong>infrastructure</strong> (the mechanics of hosting). As a Full-Stack developer who transitioned deeply into DevOps, I reject this boundary. 
            </p>
            <p style={{ marginBottom: '20px' }}>
              To me, writing elegant code is only half of the canvas. The other half is ensuring that code can survive contact with reality. A beautifully written application that crashes under load is a tragedy. True engineering excellence is found in the synthesis of both disciplines.
            </p>
            <p style={{ marginBottom: '20px' }}>
              My philosophy is rooted in automation and resilience. I view CI/CD pipelines, container orchestration, and server architecture not as chores, but as critical components of the product itself. When a developer pushes code and it seamlessly glides into a highly-available production cluster without a second thought — that is my definition of modern art.
            </p>
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', color: '#0d47a1', marginTop: '40px', transform: 'rotate(-2deg)' }}>
              "The pipeline is just as important as the product."
            </p>
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.5rem', marginTop: '20px', textAlign: 'right' }}>
              — Isa D.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
