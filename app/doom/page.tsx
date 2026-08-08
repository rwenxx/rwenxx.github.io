"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { DOOM } from 'wasm-doom';

// Native Doom resolution — the WASM always outputs 640×400
const DOOM_NATIVE_W = 640;
const DOOM_NATIVE_H = 400;

function DoomScreen() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'running' | 'error'>('loading');
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, last: performance.now() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ImageData must match the WASM native buffer exactly: 640×400
    const imageData = ctx.createImageData(DOOM_NATIVE_W, DOOM_NATIVE_H);

    const doom = new DOOM({
      // screenWidth/Height equal to native = no internal downscaling by the lib
      screenWidth:  DOOM_NATIVE_W,
      screenHeight: DOOM_NATIVE_H,
      wasmURL: '/doom.wasm',
      keyboardTarget: document.documentElement,

      onFrameRender: ({ screen }: { screen: Uint8ClampedArray }) => {
        // screen is the raw WASM RGBA buffer at 640×400
        imageData.data.set(screen.subarray(0, DOOM_NATIVE_W * DOOM_NATIVE_H * 4));
        ctx.putImageData(imageData, 0, 0);

        // FPS counter
        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.last >= 1000) {
          setFps(fpsRef.current.frames);
          fpsRef.current.frames = 0;
          fpsRef.current.last   = now;
        }
      },
    });

    doom.start()
      .then(() => setStatus('running'))
      .catch((err: unknown) => {
        console.error('DOOM failed:', err);
        setStatus('error');
      });
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#000', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* CRT scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
      }} />
      {/* Phosphor vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4,
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* The actual Doom canvas — stretched to fill monitor */}
      <canvas
        ref={canvasRef}
        width={DOOM_NATIVE_W}
        height={DOOM_NATIVE_H}
        style={{
          width: '100%', height: '100%',
          imageRendering: 'pixelated',
          zIndex: 2,
        }}
      />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0, background: '#000', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', color: '#c00', gap: 16,
        }}>
          <div style={{ fontSize: '4rem', lineHeight: 1 }}>💀</div>
          <div style={{ fontSize: '1.2rem', letterSpacing: 4 }}>DOOM LOADING...</div>
          <div style={{ fontSize: '0.75rem', color: '#666', letterSpacing: 2 }}>Initializing Phobos...</div>
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0, background: '#000', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', color: '#c00', gap: 12,
        }}>
          <div style={{ fontSize: '2rem' }}>☠️</div>
          <div>WASM LOAD FAILED</div>
          <div style={{ fontSize: '0.7rem', color: '#444' }}>Check /public/doom.wasm</div>
        </div>
      )}

      {/* HUD: FPS counter — hidden until running */}
      {status === 'running' && (
        <div style={{
          position: 'absolute', top: 8, right: 12, zIndex: 6,
          fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,200,0,0.7)',
          letterSpacing: 2, pointerEvents: 'none',
        }}>
          {fps} FPS
        </div>
      )}

      {/* Controls hint — bottom */}
      {status === 'running' && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0, zIndex: 6,
          textAlign: 'center', pointerEvents: 'none',
          fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
          letterSpacing: 2,
        }}>
          ARROWS: MOVE | CTRL: SHOOT | SPACE: USE | ALT+ARROWS: STRAFE
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESK SCENE (CSS retro desk with zoom animation)
// ─────────────────────────────────────────────────────────────
function DeskScene({ onZoomComplete }: { onZoomComplete: () => void }) {
  const sceneRef   = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sceneRef.current || !monitorRef.current) return;

      const monRect   = monitorRef.current.getBoundingClientRect();
      const sceneRect = sceneRef.current.getBoundingClientRect();

      const scaleX = sceneRect.width  / monRect.width;
      const scaleY = sceneRect.height / monRect.height;
      const scale  = Math.max(scaleX, scaleY) * 1.3;

      const cx    = sceneRect.width  / 2;
      const cy    = sceneRect.height / 2;
      const monCX = monRect.left - sceneRect.left + monRect.width  / 2;
      const monCY = monRect.top  - sceneRect.top  + monRect.height / 2;

      gsap.to(sceneRef.current, {
        scale, x: (cx - monCX) * scale, y: (cy - monCY) * scale,
        duration: 2.4, ease: 'power3.inOut',
        onComplete: onZoomComplete,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [onZoomComplete]);

  return (
    <div ref={sceneRef} style={{
      position: 'absolute', inset: 0, transformOrigin: 'center center',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #4a3520 0%, #2d1f0f 100%)',
    }}>
      {/* Wood grain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(87deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)' }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>

        {/* MONITOR */}
        <div ref={monitorRef} style={{ position: 'relative' }}>
          <div style={{
            width: 560, height: 430,
            background: 'linear-gradient(145deg,#d0cbb8,#b8b3a0)',
            borderRadius:'10px 10px 8px 8px',
            boxShadow:'0 30px 80px rgba(0,0,0,0.9),inset 0 1px 0 rgba(255,255,255,0.5)',
            padding:'18px 18px 50px 18px', display:'flex', flexDirection:'column', position:'relative',
          }}>
            {/* Screen */}
            <div style={{
              flex:1, background:'#000',
              borderRadius:'4px 4px 2px 2px',
              boxShadow:'inset 0 0 40px rgba(0,0,0,0.9)',
              overflow:'hidden', position:'relative',
            }}>
              {/* DOOM title card on standby */}
              <div style={{
                width:'100%',height:'100%',
                background:'radial-gradient(ellipse,#8b0000 0%,#3d0000 60%,#000 100%)',
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8
              }}>
                <div style={{fontFamily:'monospace',fontSize:'3rem',fontWeight:900,color:'#c00',letterSpacing:8,textShadow:'0 0 20px #ff0000'}}>
                  DOOM
                </div>
                <div style={{fontFamily:'monospace',fontSize:'0.7rem',color:'#600',letterSpacing:4}}>
                  SHAREWARE v1.9
                </div>
                <div style={{fontFamily:'monospace',fontSize:'0.55rem',color:'rgba(150,0,0,0.5)',letterSpacing:2,marginTop:8,animation:'crt-flicker 2s infinite'}}>
                  LOADING...
                </div>
              </div>
              {/* Glass glare */}
              <div style={{position:'absolute',inset:0,pointerEvents:'none',
                background:'linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 40%)'}} />
            </div>

            {/* Monitor brand */}
            <div style={{position:'absolute',bottom:12,left:0,right:0,display:'flex',alignItems:'center',justifyContent:'center',gap:14}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#c00',boxShadow:'0 0 8px #c00'}} />
              <span style={{fontFamily:'sans-serif',fontWeight:900,fontSize:'0.65rem',color:'#888',letterSpacing:3}}>DOOM CORP</span>
              <div style={{width:36,height:8,borderRadius:2,background:'linear-gradient(to right,#a09890,#c0b8a8)',boxShadow:'inset 0 1px 2px rgba(0,0,0,0.4)'}} />
            </div>
          </div>
          {/* Neck + base */}
          <div style={{width:80,height:18,margin:'0 auto',background:'linear-gradient(to bottom,#b8b3a0,#9a9588)',borderRadius:'0 0 4px 4px'}} />
          <div style={{width:200,height:14,margin:'0 auto',background:'linear-gradient(to bottom,#a8a398,#8a8378)',borderRadius:4,boxShadow:'0 8px 20px rgba(0,0,0,0.6)'}} />
        </div>

        {/* KEYBOARD */}
        <div style={{
          width:480,height:54,
          background:'linear-gradient(145deg,#c8c3b0,#b0ab98)',
          borderRadius:'4px 4px 8px 8px',
          boxShadow:'0 8px 20px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.4)',
          padding:'5px 10px',display:'flex',flexDirection:'column',gap:3,position:'relative',
        }}>
          {[14,13,12,10].map((count,ri)=>(
            <div key={ri} style={{display:'flex',gap:3}}>
              {Array.from({length:count}).map((_,ki)=>(
                <div key={ki} style={{
                  flex: ki===0&&ri===3 ? 2 : 1, height:8,
                  background:'linear-gradient(145deg,#d8d3c0,#b8b3a0)',
                  borderRadius:2, boxShadow:'0 2px 0 rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.5)',
                }}/>
              ))}
            </div>
          ))}
          <div style={{display:'flex',gap:3}}>
            {[1,4,1,1,1,1].map((flex,i)=>(
              <div key={i} style={{flex,height:8,background:'linear-gradient(145deg,#d8d3c0,#b8b3a0)',borderRadius:2,boxShadow:'0 2px 0 rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.5)'}}/>
            ))}
          </div>
        </div>

        {/* Mouse */}
        <div style={{position:'absolute',right:-70,bottom:20,width:40,height:58,
          background:'linear-gradient(145deg,#d0cbb8,#a8a398)',
          borderRadius:'40% 40% 45% 45% / 30% 30% 50% 50%',
          boxShadow:'4px 6px 12px rgba(0,0,0,0.6)'}}>
          <div style={{position:'absolute',top:12,left:'50%',transform:'translateX(-50%)',width:1,height:18,background:'rgba(0,0,0,0.3)'}}/>
        </div>

        {/* Doom box / game box on desk */}
        <div style={{position:'absolute',left:-110,top:20,
          width:60,height:80,
          background:'linear-gradient(145deg,#c00,#800)',
          borderRadius:2,boxShadow:'6px 6px 15px rgba(0,0,0,0.7)',
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          border:'1px solid rgba(255,100,100,0.3)',
        }}>
          <div style={{fontFamily:'monospace',fontWeight:900,color:'#fff',fontSize:'1.1rem',letterSpacing:2,textShadow:'0 0 10px #f00'}}>DOOM</div>
          <div style={{fontFamily:'monospace',color:'rgba(255,200,200,0.7)',fontSize:'0.45rem',letterSpacing:1,marginTop:4}}>id SOFTWARE</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [phase, setPhase]   = useState<'desk'|'win98'>('desk');
  const overlayRef          = useRef<HTMLDivElement>(null);

  const handleZoomComplete = useCallback(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0, display: 'block' },
        { opacity: 1, duration: 0.25, ease: 'none',
          onComplete: () => {
            setPhase('win98');
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.6, delay: 0.05 });
          }
        }
      );
    } else {
      setPhase('win98');
    }
  }, []);

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', position:'relative', background:'#000' }}>

      {/* Back button */}
      <Link href="/" style={{
        position:'fixed', top:18, left:18, zIndex:9999,
        fontFamily:'var(--font-marker)', fontSize:'1.1rem', color:'#fff',
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)',
        padding:'5px 14px', borderRadius:4, textDecoration:'none',
        border:'1px solid rgba(255,255,255,0.2)',
      }}>
        ← НАЗАД
      </Link>

      {/* Flash overlay */}
      <div ref={overlayRef} style={{
        position:'fixed', inset:0, background:'#000',
        zIndex:9998, pointerEvents:'none', display:'none', opacity:0,
      }}/>

      {/* DESK SCENE */}
      {phase === 'desk' && <DeskScene onZoomComplete={handleZoomComplete} />}

      {/* DOOM */}
      {phase === 'win98' && <DoomScreen />}
    </div>
  );
}
