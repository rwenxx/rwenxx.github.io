"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, NavTag } from "@/components/ScrapComponents";

export default function SystemsAsArtPage() {
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
    gsap.from(".plaque-reveal", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundColor: '#eaeaea',
      backgroundImage: 'radial-gradient(#d3d3d3 1px, transparent 1px)',
      backgroundSize: '20px 20px',
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
        width: '750px',
        height: '600px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* MUSEUM PLAQUE */}
        <div className="plaque-reveal" style={{
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)',
          padding: '60px',
          position: 'relative',
          border: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Glass glare effect */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0))',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #111', paddingBottom: '20px', marginBottom: '30px' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-inter)', 
              fontWeight: 900, 
              fontSize: '2.5rem', 
              color: '#111', 
              letterSpacing: '-1px',
              margin: 0
            }}>
              Systems as Art
            </h1>
            <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#666', fontSize: '1.2rem' }}>
              Mixed Media (Code & Cloud), 2026
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#333',
            textAlign: 'justify',
            columns: 2,
            columnGap: '40px'
          }}>
            <p style={{ marginBottom: '20px' }}>
              We often look at architecture in the physical world and marvel at its beauty. The arches of a bridge, the layout of a city grid, the flow of traffic. But what about digital architecture?
            </p>
            <p style={{ marginBottom: '20px' }}>
              Designing a scalable system is no different than urban planning. You route traffic through load balancers, you build robust data pipelines like highways, and you design microservices as individual buildings, each with its own purpose and security. 
            </p>
            <p style={{ marginBottom: '20px' }}>
              When a system is poorly designed, you feel it. It's rigid, fragile, and chaotic. But when it's done right, there is a profound, invisible beauty to it. It scales elegantly under pressure. It heals itself when parts fail.
            </p>
            <p style={{ marginBottom: '20px' }}>
              As a DevOps engineer, I don't just write configurations. I sculpt environments. The terminal is my studio, and the cloud is my canvas. 
            </p>
          </div>

          {/* Plaque screws */}
          {[{top:20,left:20}, {top:20,right:20}, {bottom:20,left:20}, {bottom:20,right:20}].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: '12px', height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3), 1px 1px 1px rgba(255,255,255,1)'
            }} />
          ))}

        </div>
      </div>
    </main>
  );
}
