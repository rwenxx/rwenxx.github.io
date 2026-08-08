"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, NavTag } from "@/components/ScrapComponents";

export default function ZenOfAutomationPage() {
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
    gsap.from(".zen-reveal", {
      y: -30,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.2
    });
  }, { scope: container });

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundColor: '#f8f9fa',
      backgroundImage: `
        linear-gradient(rgba(100, 150, 255, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100, 150, 255, 0.2) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px', // Blueprint grid
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
        width: '700px',
        height: '800px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* WHITE PAPER */}
        <div className="zen-reveal" style={{
          width: '100%',
          backgroundColor: '#fff',
          border: '1px solid #dee2e6',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          padding: '60px',
          position: 'relative'
        }}>
          <Tape style={{ top: '-15px', right: '40px', transform: 'rotate(8deg)', width: '80px', backgroundColor: '#e9ecef' }} />
          <Tape style={{ bottom: '-15px', left: '40px', transform: 'rotate(-5deg)', width: '80px', backgroundColor: '#e9ecef' }} />
          
          <div style={{
            fontFamily: 'monospace',
            color: '#adb5bd',
            fontSize: '0.8rem',
            letterSpacing: '3px',
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            Document ID: 0xF7A9 // Status: Approved
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-inter)', 
            fontWeight: 300, 
            fontSize: '3.5rem', 
            color: '#212529', 
            lineHeight: 1.1,
            marginBottom: '40px',
            letterSpacing: '-1px'
          }}>
            The Zen of <br/>
            <strong>Automation</strong>
          </h1>

          <div style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: '#495057',
            textAlign: 'justify'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Automation is not just about writing scripts to save time. It is a philosophy of respect—respect for your own time, and respect for human creativity. 
            </p>
            <p style={{ marginBottom: '20px' }}>
              Every time an engineer performs a repetitive, manual task—whether it's provisioning a server, running tests, or deploying code—a fraction of their creative energy is wasted. Humans are exceptional at solving complex, ambiguous problems. Machines are exceptional at executing precise, repetitive instructions. The Zen of Automation is recognizing this distinction and letting machines do what they do best.
            </p>
            <p style={{ marginBottom: '20px', padding: '20px', borderLeft: '3px solid #339af0', backgroundColor: '#e7f5ff' }}>
              "When you automate the mundane, you free your mind to architect the extraordinary."
            </p>
            <p>
              In DevOps, a well-crafted CI/CD pipeline is like a digital assembly line. Once it's built, it runs silently in the background, continuously delivering value while you sleep. That is true engineering freedom.
            </p>
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #212529', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-marker)', fontSize: '1.2rem' }}>
              I.D
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
