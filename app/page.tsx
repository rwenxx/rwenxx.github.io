"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MainPortfolio from "@/components/MainPortfolio";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    // Initial reveal animation
    const elements = gsap.utils.toArray(".gsap-reveal");
    
    gsap.from(elements, {
      y: 100,
      opacity: 0,
      rotation: () => gsap.utils.random(-15, 15),
      duration: 1.5,
      stagger: 0.1,
      ease: "elastic.out(1, 0.5)",
      delay: 0.2
    });

    // Parallax on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (isOpen) return; // Stop parallax after opening
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".gsap-parallax-1", { x: xPos * 2, y: yPos * 2, duration: 1, ease: "power2.out" });
      gsap.to(".gsap-parallax-2", { x: xPos * -3, y: yPos * -3, duration: 1, ease: "power2.out" });
      gsap.to(".gsap-parallax-3", { x: xPos * 1, y: yPos * -1.5, duration: 1, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: container });

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    const tl = gsap.timeline();
    
    // 1. Photos fly away and text fades
    tl.to(".photo-1", { x: "-120vw", y: -100, rotation: -45, duration: 1, ease: "power3.in" }, 0)
      .to(".photo-2", { x: "120vw", y: 100, rotation: 45, duration: 1, ease: "power3.in" }, 0)
      .to(".intro-text", { scale: 0.8, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);

    // 2. Paper tearing effect
    tl.to(".paper-left", { x: "-100%", duration: 1.2, ease: "power4.inOut" }, 0.8)
      .to(".paper-right", { x: "100%", duration: 1.2, ease: "power4.inOut" }, 0.8)
      .to(coverRef.current, { display: "none" }, 2);
  };

  return (
    <main className="scrap-container" ref={container} style={{ overflow: 'hidden', backgroundColor: '#eaddcf' }}>
      
      {/* SVG Filter for realistic torn paper edge */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="torn-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* --- THE MAIN CONTENT (Revealed after tear) --- */}
      <div className="main-content" style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflowY: 'auto'
      }}>
        <MainPortfolio />
      </div>

      {/* --- THE COVER (Tears apart) --- */}
      <div ref={coverRef} onClick={handleOpen} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer' }}>
        
        {/* Left Paper Half */}
        <div className="paper-left" style={{ 
          position: 'absolute', top: 0, left: 0, width: '51%', height: '100%', 
          backgroundImage: 'url(/paper.jpg)', backgroundSize: '200vw 100vh', backgroundPosition: 'left center',
          filter: 'url(#torn-edge) drop-shadow(5px 0 15px rgba(0,0,0,0.4))',
          zIndex: 11
        }}>
           {/* Inner shadow for thickness */}
           <div style={{ position: 'absolute', right: 0, width: '10px', height: '100%', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))' }}></div>
        </div>

        {/* Right Paper Half */}
        <div className="paper-right" style={{ 
          position: 'absolute', top: 0, right: 0, width: '51%', height: '100%', 
          backgroundImage: 'url(/paper.jpg)', backgroundSize: '200vw 100vh', backgroundPosition: 'right center',
          filter: 'url(#torn-edge) drop-shadow(-5px 0 15px rgba(0,0,0,0.2))',
          zIndex: 11
        }}>
           <div style={{ position: 'absolute', left: 0, width: '10px', height: '100%', background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.1))' }}></div>
        </div>

        {/* Cover Content (on top of paper) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Background decorations */}
          <div className="gsap-reveal gsap-parallax-2" style={{ position: 'absolute', top: '10%', left: '15%', opacity: 0.8, mixBlendMode: 'multiply' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '3rem', color: '#555', transform: 'rotate(-10deg)', display: 'block' }}>creative process...</span>
          </div>
          <div className="gsap-reveal gsap-parallax-3" style={{ position: 'absolute', bottom: '15%', right: '10%', opacity: 0.8, mixBlendMode: 'multiply' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '4rem', color: '#666', transform: 'rotate(15deg)', display: 'block' }}>*ideas here</span>
          </div>

          <div style={{ position: 'relative', width: '800px', height: '600px' }}>
            {/* Photo 1 */}
            <div className="scrap-photo photo-1 gsap-reveal gsap-parallax-1" style={{ position: 'absolute', top: '10%', left: '10%', transform: 'rotate(-6deg)', zIndex: 2, padding: '15px 15px 45px 15px', backgroundColor: '#fff', boxShadow: '2px 4px 15px rgba(0,0,0,0.3)', borderRadius: '1px' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: '100px', height: '35px', backgroundColor: 'rgba(230,230,220,0.7)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', backdropFilter: 'blur(1px)', zIndex: 3 }}></div>
              <img src="/artist_portrait.jpg" alt="Placeholder 1" style={{ width: '250px', height: '320px', objectFit: 'cover' }} />
              <p style={{ fontFamily: 'var(--font-marker)', textAlign: 'center', marginTop: '15px', fontSize: '1.5rem', color: '#222' }}>me working</p>
            </div>

            {/* Photo 2 */}
            <div className="scrap-photo photo-2 gsap-reveal gsap-parallax-2" style={{ position: 'absolute', top: '25%', right: '5%', transform: 'rotate(8deg)', zIndex: 1, padding: '10px', backgroundColor: '#fff', boxShadow: '2px 4px 15px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '10%', transform: 'rotate(45deg)', width: '80px', height: '30px', backgroundColor: 'rgba(230,230,220,0.7)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', zIndex: 3 }}></div>
              <img src="/messy_desk.jpg" alt="Placeholder 2" style={{ width: '280px', height: '280px', objectFit: 'cover' }} />
            </div>

            {/* Text Block */}
            <div className="intro-text gsap-reveal gsap-parallax-1" style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', zIndex: 3, maxWidth: '400px' }}>
              <h1 style={{ fontFamily: 'var(--font-inter)', fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-3px', textTransform: 'uppercase', color: '#111', mixBlendMode: 'color-burn' }}>
                Hi, I&apos;m<br/>
                <span className="marker-text" style={{ fontFamily: 'var(--font-marker)', fontSize: '5rem', color: '#111', textTransform: 'none', letterSpacing: '0' }}>Isa D.</span>
              </h1>
              <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <p style={{ fontFamily: 'var(--font-marker)', fontSize: '2.2rem', color: '#ff4757', transform: 'rotate(-2deg)', mixBlendMode: 'multiply' }}>DevOps Engineer &</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#fcfcfc', color: 'black', padding: '6px 12px', display: 'inline-block', transform: 'rotate(1deg)', boxShadow: '4px 4px 0px rgba(0,0,0,0.8)', border: '2px solid black', width: 'fit-content' }}>Full-Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
