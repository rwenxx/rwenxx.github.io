"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tape, CutoutText, NavTag, Polaroid } from "./ScrapComponents";
import { TransitionLink } from "./TransitionLink";

export default function MainPortfolio() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hover animations
    const liftElements = gsap.utils.toArray(".hover-lift");
    liftElements.forEach((el: any) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { scale: 1.05, zIndex: 50, duration: 0.3, ease: "back.out(1.7)" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { scale: 1, zIndex: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, { scope: container });

  return (
    <div ref={container} style={{
      width: '100%', minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      backgroundImage: 'url(/paper.jpg)',
      backgroundBlendMode: 'multiply',
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        
        {/* HEADER */}
        <div className="mobile-header-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ transform: 'rotate(-2deg)' }}>
            <h1 className="mobile-title" style={{ fontFamily: 'var(--font-marker)', fontSize: '3.5rem', color: '#f7ecd5', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              MY CREATIVE UNIVERSE
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <CutoutText text="ISA D. PORTFOLIO" rotation={1} bg="#f7ecd5" style={{ fontSize: '2.5rem' }} />
            <CutoutText text="DEVOPS & FULLSTACK" rotation={-2} bg="#f7ecd5" style={{ fontSize: '1rem', marginTop: '-5px', marginRight: '20px' }} />
          </div>
        </div>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <NavTag text="ГЛАВНОЕ" rotation={-3} href="/" />
          <NavTag text="ОБО МНЕ" rotation={2} href="/about" />
          <NavTag text="ПРОЕКТЫ" rotation={1} href="/projects" />
          <NavTag text="КОНТАКТЫ" rotation={-1} href="/contact" />
          <NavTag text="МУЗЫКА" rotation={3} href="/music" />
        </div>

        {/* PROJECTS SECTION REMOVED FOR NOW */}

        {/* BOTTOM SECTION */}
        <div style={{ borderTop: '4px dashed #f7ecd5', paddingTop: '40px', position: 'relative' }}>
          <CutoutText text="LATEST MUSINGS" rotation={-2} bg="#f7ecd5" className="mobile-title mobile-less-rotate" style={{ fontSize: '3.5rem', marginBottom: '30px' }} />
          
          <div className="mobile-stack" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Newspaper */}
            <div className="hover-lift mobile-card mobile-small-rotate-left" style={{ width: '280px', backgroundColor: '#f0f0f0', padding: '15px', transform: 'rotate(2deg)', boxShadow: '4px 4px 15px rgba(0,0,0,0.5)', position: 'relative' }}>
              <Tape style={{ top: '-10px', left: '10px', transform: 'rotate(-10deg)' }} />
              <h3 style={{ fontFamily: 'var(--font-inter)', borderBottom: '2px solid #111', paddingBottom: '5px', textTransform: 'uppercase', fontWeight: 900 }}>Daily Musings</h3>
              <h4 style={{ fontFamily: 'var(--font-inter)', fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.1, margin: '10px 0' }}>BRIDGING THE GAP: FROM CODE TO CLOUD</h4>
              <p style={{ fontFamily: 'serif', fontSize: '0.8rem', columnCount: 2, columnGap: '10px', textAlign: 'justify' }}>
                In modern software development, writing code is only half the battle. True engineering excellence comes from understanding the entire lifecycle—from the first line of code to automated deployments, scalable infrastructure, and zero-downtime releases. As a Full-Stack developer turned DevOps engineer, my philosophy is simple: automate the mundane, architect for resilience, and always build with the end-user in mind. The pipeline is just as important as the product.
              </p>
              
              <div style={{ borderTop: '1.5px solid #111', borderBottom: '1.5px solid #111', marginTop: '15px', padding: '8px 0', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tech Quote of the week</span>
                <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '0.85rem', margin: '5px 0 0 0' }}>"There is no cloud, it's just someone else's computer."</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: '#555', fontWeight: 'bold' }}>
                <span>ISSUE #404</span>
                <span>PAGE 1</span>
              </div>
            </div>

            {/* Notepad */}
            <div className="hover-lift mobile-card mobile-small-rotate-right" style={{ 
              width: '240px', height: '420px', 
              backgroundColor: '#f9f5d7', 
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
              padding: '40px 20px 20px 20px', 
              transform: 'rotate(-3deg)', 
              boxShadow: '4px 4px 15px rgba(0,0,0,0.5)',
              position: 'relative',
              display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center'
            }}>
              <Tape style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(5deg)' }} />
              <TransitionLink href="/musings/artist-statement" style={{ display: 'block', width: '100%' }}>
                <div className="hover-lift" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <CutoutText text="ARTIST STATEMENT" rotation={1} style={{ fontSize: '1.1rem' }} />
                </div>
              </TransitionLink>
              <TransitionLink href="/musings/raw-energy" style={{ display: 'block', width: '100%' }}>
                <div className="hover-lift" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <CutoutText text="EXPLORING RAW ENERGY" rotation={-2} style={{ fontSize: '1rem' }} />
                </div>
              </TransitionLink>
              <TransitionLink href="/musings/zen-of-automation" style={{ display: 'block', width: '100%' }}>
                <div className="hover-lift" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <CutoutText text="ZEN OF AUTOMATION" rotation={3} style={{ fontSize: '1rem' }} />
                </div>
              </TransitionLink>
              <TransitionLink href="/musings/beauty-of-bugs" style={{ display: 'block', width: '100%' }}>
                <div className="hover-lift" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <CutoutText text="THE BEAUTY OF BUGS" rotation={-1} style={{ fontSize: '1.1rem' }} />
                </div>
              </TransitionLink>
              <TransitionLink href="/musings/systems-as-art" style={{ display: 'block', width: '100%' }}>
                <div className="hover-lift" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <CutoutText text="SYSTEMS AS ART" rotation={2} style={{ fontSize: '1.05rem' }} />
                </div>
              </TransitionLink>
            </div>

            {/* About Me & Studio Life */}
            <div className="mobile-stack" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Polaroid src="/artist_portrait.jpg" text="" rotation={3} width="140px" className="mobile-less-rotate" />
                <div className="mobile-card mobile-less-rotate" style={{ backgroundColor: '#fff', padding: '15px', width: '200px', transform: 'rotate(-2deg)', boxShadow: '3px 3px 10px rgba(0,0,0,0.4)', position: 'relative' }}>
                  <Tape style={{ top: '-10px', right: '10px', transform: 'rotate(12deg)' }} />
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>ABOUT ME</h3>
                  <p style={{ fontFamily: 'var(--font-marker)', fontSize: '0.95rem', lineHeight: 1.2 }}>
                    Меня зовут Ислам Даниярулы. Я DevOps инженер, а в прошлом — Full-Stack разработчик. В данный момент я работаю как фрилансер и занимаюсь проектами абсолютно под ключ. На счет качества можете не переживать!
                    <br/><br/>— Isa D.
                  </p>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 900, fontSize: '2.5rem', color: '#ff4757', transform: 'rotate(-4deg)', textShadow: '2px 2px 0 #111' }}>STUDIO LIFE !!!</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                   <Polaroid src="/messy_desk.jpg" text="" rotation={-5} width="120px" />
                   <Polaroid src="/messy_desk.jpg" text="MESSY DESK" rotation={2} width="140px" />
                   
                   <TransitionLink href="/doom" style={{ textDecoration: 'none', display: 'inline-block' }}>
                     <div className="hover-lift" style={{ 
                       backgroundColor: '#111',
                       padding: '10px 10px 40px 10px',
                       width: '130px',
                       transform: `rotate(8deg)`,
                       boxShadow: '4px 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(255,0,0,0.5)',
                       position: 'relative',
                       cursor: 'pointer',
                       border: '2px solid #330000',
                       transition: 'box-shadow 0.3s'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.boxShadow = '0 0 20px #ff0000, 0 0 40px rgba(255,0,0,0.6)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.boxShadow = '4px 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(255,0,0,0.5)';
                     }}>
                       <Tape style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(-3deg)', backgroundColor: 'rgba(255,0,0,0.4)' }} />
                       <div style={{ width: '100%', height: '100px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #440000', fontSize: '3rem' }}>
                         💀
                       </div>
                       <p style={{ fontFamily: 'var(--font-marker)', textAlign: 'center', marginTop: '10px', fontSize: '1rem', color: '#ff3333', position: 'absolute', bottom: '5px', left: 0, width: '100%', pointerEvents: 'none', textShadow: '1px 1px 0 #000' }}>
                         DOOM?&amp;&gt;?
                       </p>
                     </div>
                   </TransitionLink>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="hover-lift mobile-card mobile-less-rotate" style={{
              width: '260px', 
              backgroundColor: '#c4a47c', // Cardboard color
              padding: '20px', 
              transform: 'rotate(4deg)', 
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 4px 4px 15px rgba(0,0,0,0.5)',
              position: 'relative',
              border: '2px dashed #8b5a2b'
            }}>
              <Tape style={{ top: '-10px', right: '10px', transform: 'rotate(15deg)' }} />
              <Tape style={{ bottom: '-10px', left: '20px', transform: 'rotate(-5deg)' }} />
              
              <h3 style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px', color: '#3e2723', transform: 'rotate(-2deg)' }}>
                TECH STACK
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {[
                  { name: 'React', color: '#61dafb' },
                  { name: 'Next.js', color: '#ffffff' },
                  { name: 'TypeScript', color: '#3178c6' },
                  { name: 'Node.js', color: '#339933' },
                  { name: 'Docker', color: '#2496ed' },
                  { name: 'Kubernetes', color: '#326ce5' },
                  { name: 'AWS', color: '#ff9900' },
                  { name: 'GSAP', color: '#88ce02' }
                ].map((tech, i) => (
                  <span key={tech.name} style={{
                    backgroundColor: '#111', 
                    color: tech.color, 
                    padding: '6px 12px', 
                    borderRadius: '2px',
                    fontFamily: 'var(--font-inter)', 
                    fontWeight: 900, 
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transform: `rotate(${i % 2 === 0 ? 3 : -3}deg) scale(${i === 4 ? 1.1 : 1})`,
                    boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
                    border: `1px solid ${tech.color}40`
                  }}>
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
