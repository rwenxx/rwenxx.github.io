"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { NavTag } from '@/components/ScrapComponents';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
interface CassetteData {
  id: string; name: string; audioSrc: string; color: string;
  offset: { x: number; y: number; r: number }; // offset from screen center
}

const CASSETTES: CassetteData[] = [
  { id: 'cas-1', name: 'На Заре — Баста', audioSrc: '/audio/track1.mp3', color: '#c0392b', offset: { x: -340, y: 160,  r: -14 } },
  { id: 'cas-2', name: 'Звезда по Имени Солнце — Кино',   audioSrc: '/audio/track2.mp3', color: '#1565c0', offset: { x:  330, y:  80,  r:  22 } },
  { id: 'cas-3', name: 'Aşk Eski Bir Yalan — Kamuran Akkor',   audioSrc: '/audio/track3.mp3', color: '#2e7d32', offset: { x: -310, y: -220, r:  -6 } },
];

const CW = 282; // cassette width
const CH = 177; // cassette height

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function MusicPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slotRef      = useRef<HTMLDivElement>(null);
  const audioRef     = useRef<HTMLAudioElement>(null);

  const [activeCassette, _setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null); // mirror for closures
  const setActive = (id: string | null) => { activeRef.current = id; _setActive(id); };

  const [isPlaying,   setIsPlaying]   = useState(false);
  const [tapeCounter, setTapeCounter] = useState('000');

  // Each cassette's current absolute position (px from container top-left)
  const pos = useRef<Record<string, { x: number; y: number }>>({});

  // Drag state — all in refs, zero state updates during drag
  const drag = useRef<{
    id: string; startMX: number; startMY: number; startEX: number; startEY: number;
  } | null>(null);

  // ── Init positions on mount ──────────────────
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const cx = c.offsetWidth  / 2 - CW / 2;
    const cy = c.offsetHeight / 2 - CH / 2;

    CASSETTES.forEach(({ id, offset }) => {
      const x = cx + offset.x;
      const y = cy + offset.y;
      pos.current[id] = { x, y };
      const el = document.getElementById(id);
      if (el) gsap.set(el, { x, y, rotation: offset.r });
    });
  }, []);

  // ── Global mouse events for drag ─────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      const el = document.getElementById(d.id);
      if (!el) return;
      const x = d.startEX + (e.clientX - d.startMX);
      const y = d.startEY + (e.clientY - d.startMY);
      pos.current[d.id] = { x, y };
      // direct DOM for zero-lag
      el.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
    };

    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      const el = document.getElementById(d.id);
      if (!el) return;

      // Hit-test vs deck slot
      const slot = slotRef.current;
      if (slot) {
        const sr = slot.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const ox = Math.max(0, Math.min(er.right, sr.right)   - Math.max(er.left, sr.left));
        const oy = Math.max(0, Math.min(er.bottom, sr.bottom) - Math.max(er.top,  sr.top));
        if ((ox * oy) / (CW * CH) > 0.3) {
          snapIn(d.id, el);
          return;
        }
      }
      gsap.set(el, { zIndex: 30 });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []); // runs once — no deps, uses refs only ✓

  // ── Snap cassette INTO player ────────────────
  const snapIn = (id: string, el: HTMLElement) => {
    const current = activeRef.current;
    if (current && current !== id) snapOut(current);

    const slot = slotRef.current!;
    const cont = containerRef.current!;
    const sr = slot.getBoundingClientRect();
    const cr = cont.getBoundingClientRect();

    const tx = sr.left - cr.left + sr.width  / 2 - CW / 2;
    const ty = sr.top  - cr.top  + sr.height / 2 - CH / 2;

    gsap.killTweensOf(el);
    gsap.to(el, {
      x: tx, y: ty, rotation: 0, scale: 1,
      duration: 0.35, ease: 'back.out(1.6)',
      onComplete: () => {
        pos.current[id] = { x: tx, y: ty };
        setActive(id);
        startAudio(id);
      },
    });
  };

  // ── Eject cassette OUT of player ─────────────
  const snapOut = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const cont = containerRef.current!;
    const cW2  = cont.offsetWidth;
    const cH2  = cont.offsetHeight;
    const side = Math.random() < 0.5 ? -1 : 1;
    const tx   = cW2 / 2 - CW / 2 + side * (270 + Math.random() * 100);
    const ty   = cH2 / 2 - CH / 2 + 100 + Math.random() * 110;
    const rot  = (Math.random() - 0.5) * 46;

    gsap.set(el, { zIndex: 100 });
    gsap.to(el, {
      x: tx, y: ty, rotation: rot, duration: 0.5, ease: 'power3.out',
      onComplete: () => {
        gsap.set(el, { zIndex: 30 });
        pos.current[id] = { x: tx, y: ty };
      },
    });

    setActive(null);
    stopAudio();
  }, []);

  // ── Audio ────────────────────────────────────
  const startAudio = (id: string) => {
    const data = CASSETTES.find(c => c.id === id);
    if (!audioRef.current || !data) return;
    audioRef.current.src = data.audioSrc;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !activeCassette) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else           { audioRef.current.play();  setIsPlaying(true);  }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setTapeCounter(Math.floor(audioRef.current.currentTime).toString().padStart(3, '0'));
  };

  const activeMeta = CASSETTES.find(c => c.id === activeCassette);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <main
      ref={containerRef}
      style={{
        width: '100vw', height: '100vh',
        backgroundImage: 'radial-gradient(ellipse at 40% 50%, rgba(55,35,15,0.3) 0%, rgba(0,0,0,0.9) 100%), url(/wood_desk.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* NAV */}
      <div style={{ position: 'absolute', top: 26, left: 26, zIndex: 99 }}>
        <NavTag text="НАЗАД" rotation={-3} href="/" />
      </div>

      <audio
        ref={audioRef}
        onEnded={() => { setIsPlaying(false); setTapeCounter('000'); }}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* ── SVG CABLE ── */}
      <svg viewBox="0 0 1000 700" preserveAspectRatio="none"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:11 }}>
        <defs>
          <filter id="cs"><feDropShadow dx="5" dy="10" stdDeviation="8" floodOpacity="0.8"/></filter>
        </defs>
        <path d="M 555 550 C 720 650 890 480 825 305 C 762 135 925 -30 1090 55"
          fill="none" stroke="#0c0c0c" strokeWidth="16" strokeLinecap="round" filter="url(#cs)"/>
        <path d="M 555 550 C 720 650 890 480 825 305 C 762 135 925 -30 1090 55"
          fill="none" stroke="#161616" strokeWidth="12" strokeLinecap="round"/>
        <path d="M 552 546 C 717 646 887 476 822 301 C 759 131 922 -34 1087 51"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round"/>
      </svg>

      {/* ── PLAYER ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-2deg)',
        width: 420, height: 660,
        backgroundImage: [
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E\")",
          'linear-gradient(158deg, #3c3c3c 0%, #1c1c1c 55%, #111 100%)',
        ].join(','),
        borderRadius: 18,
        border: '1px solid #0a0a0a',
        boxShadow: '0 40px 80px rgba(0,0,0,0.95), 0 10px 30px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.16), inset 0 -4px 10px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 20,
      }}>

        {/* Volume wheel */}
        <div style={{
          position:'absolute', top:88, right:-20, width:24, height:72,
          background:'linear-gradient(to right, #181818, #888 30%, #ddd 50%, #555 76%, #111)',
          borderRadius:4, boxShadow:'6px 10px 18px rgba(0,0,0,0.8)',
          display:'flex', flexDirection:'column', justifyContent:'space-evenly',
        }}>
          {[...Array(9)].map((_,i)=><div key={i} style={{height:2, background:'rgba(0,0,0,0.55)'}}/>)}
        </div>

        {/* Jack stub */}
        <div style={{
          position:'absolute', bottom:18, right:-26, width:26, height:58,
          background:'linear-gradient(to right, #333, #aaa 40%, #444)', borderRadius:5,
          boxShadow:'8px 14px 22px rgba(0,0,0,0.85)', borderLeft:'1px solid #222',
        }}>
          <div style={{
            position:'absolute', top:9, right:-14, width:14, height:38,
            background:'#0d0d0d', borderRadius:6, boxShadow:'inset 0 0 6px rgba(255,255,255,0.15)',
          }}/>
        </div>

        {/* Corner screws */}
        {([{top:14,left:14},{top:14,right:14},{bottom:14,left:14},{bottom:14,right:14}] as React.CSSProperties[]).map((s,i)=>(
          <div key={i} style={{
            position:'absolute', ...s, width:10, height:10, borderRadius:'50%',
            background:'radial-gradient(circle at 35% 35%, #555, #111)',
            boxShadow:'inset 1px 1px 2px rgba(255,255,255,0.25)',
          }}>
            <div style={{position:'absolute',top:'50%',left:1,right:1,height:1,background:'rgba(0,0,0,0.5)',transform:'translateY(-50%)'}}/>
            <div style={{position:'absolute',left:'50%',top:1,bottom:1,width:1,background:'rgba(0,0,0,0.5)',transform:'translateX(-50%)'}}/>
          </div>
        ))}

        {/* Top bar */}
        <div style={{ width:'100%', padding:'22px 24px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:'sans-serif', fontWeight:900, fontSize:'1rem', letterSpacing:3, color:'#888', textShadow:'1px 1px 0 #000' }}>
            ISA<span style={{color:'#c0392b'}}>WALK</span>
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {/* Counter */}
            <div style={{
              display:'flex', gap:2, background:'#070707', padding:'3px 6px', borderRadius:6,
              border:'1px solid #2a2a2a', borderBottom:'1px solid #3a3a3a',
              boxShadow:'inset 0 4px 10px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.07)',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(255,255,255,0.11) 0%, transparent 50%)',pointerEvents:'none'}}/>
              {tapeCounter.split('').map((d,i)=>(
                <div key={i} style={{
                  background:'#ddd', color:'#111', fontFamily:'monospace', fontSize:'1.05rem', fontWeight:700,
                  padding:'1px 5px', borderRadius:2, borderTop:'2px solid #aaa', borderBottom:'2px solid #888',
                  boxShadow:'inset 0 3px 5px rgba(0,0,0,0.25), inset 0 -3px 5px rgba(0,0,0,0.25)',
                }}>{d}</div>
              ))}
            </div>
            {/* LED */}
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{fontSize:'0.55rem',color:'#666',fontFamily:'sans-serif',fontWeight:700,letterSpacing:1}}>BATT</span>
              <div style={{
                width:10, height:10, borderRadius:'50%', border:'1px solid #0a0a0a',
                background: activeCassette ? '#ff3b30' : '#1e1e1e',
                boxShadow: activeCassette
                  ? '0 0 8px #ff3b30, 0 0 18px rgba(255,59,48,0.55), inset 1px 1px 2px rgba(255,255,255,0.35)'
                  : 'inset 1px 1px 3px rgba(0,0,0,0.9)',
                transition:'background 0.12s, box-shadow 0.12s',
              }}/>
            </div>
          </div>
        </div>

        {/* Deck window / slot */}
        <div ref={slotRef} style={{
          width:354, height:222,
          background:'#040404', borderRadius:10,
          border:'4px solid #141414', borderBottom:'4px solid #2c2c2c',
          boxShadow:'inset 0 18px 45px rgba(0,0,0,1), inset 0 -4px 12px rgba(0,0,0,0.7), 0 2px 1px rgba(255,255,255,0.05)',
          position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {/* glass */}
          <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:20,background:'linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 45%,transparent 55%,rgba(255,255,255,0.025) 100%)'}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'rgba(255,255,255,0.16)',zIndex:20,pointerEvents:'none'}}/>

          {!activeCassette && (
            <span style={{color:'#1c1c1c',fontFamily:'monospace',fontWeight:700,fontSize:'1.05rem',letterSpacing:3}}>INSERT TAPE ▼</span>
          )}

          {/* Internal cassette image */}
          {activeMeta && (
            <div style={{
              position:'absolute', width:290, height:182, borderRadius:12,
              background:'#1a1a1a', backgroundImage:'url(/cassette.jpg)',
              backgroundSize:'cover', backgroundPosition:'center',
              display:'flex', alignItems:'center', justifyContent:'center',
              zIndex:2,
            }}>
              <div style={{
                position:'absolute', left:'8%', right:'8%', top:'28%', height:44,
                background:'#f2efe6', borderTop:`9px solid ${activeMeta.color}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 6px rgba(0,0,0,0.6)',
              }}>
                <span style={{fontFamily:'var(--font-marker)',fontSize:'1.45rem',color:'#111'}}>{activeMeta.name}</span>
              </div>
            </div>
          )}

          {/* Spindles */}
          {activeMeta && [{ left:'27%', tr:'translate(-50%,-50%)' }, { right:'27%', tr:'translate(50%,-50%)' }].map((s,i)=>(
            <div key={i} className={`spindle${isPlaying?' spin':''}`} style={{
              position:'absolute', top:'50%',
              left: i===0 ? '27%' : undefined, right: i===1 ? '27%' : undefined,
              transform: i===0 ? 'translate(-50%,-50%)' : 'translate(50%,-50%)',
              width:40, height:40, borderRadius:'50%',
              background:'radial-gradient(circle,#111 28%,transparent 28%),conic-gradient(#c5c5c5 0deg 30deg,transparent 30deg 180deg,#c5c5c5 180deg 210deg,transparent 210deg)',
              border:'4px solid #0d0d0d', zIndex:6, pointerEvents:'none',
              boxShadow:'0 2px 6px rgba(0,0,0,0.8)',
            }}/>
          ))}
        </div>

        {/* VFD Equalizer */}
        <div style={{
          width:354, height:52, background:'#030303', marginTop:22,
          border:'3px solid #141414', borderBottom:'3px solid #282828', borderRadius:6,
          boxShadow:'inset 0 5px 18px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.04)',
          display:'flex', alignItems:'flex-end', padding:'5px 6px', gap:3, overflow:'hidden',
        }}>
          {[...Array(26)].map((_,i)=>{
            const col = i>20?'#ff3b30':i>14?'#ffd60a':'#30d158';
            return (
              <div key={i} className={isPlaying?`vfd v${i%5}`:'vfd'} style={{
                flex:1, minHeight:3, height: isPlaying ? undefined : 3,
                background: isPlaying ? col : '#1a1a1a', borderRadius:1,
                boxShadow: isPlaying ? `0 0 5px ${col}` : 'none',
              }}/>
            );
          })}
        </div>

        {/* Transport buttons */}
        <div style={{
          marginTop:28, width:354, height:88, background:'#151515',
          border:'1px solid #0a0a0a', borderRadius:10,
          boxShadow:'inset 0 8px 24px rgba(0,0,0,0.95), 0 1px 1px rgba(255,255,255,0.07)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:14, padding:'0 14px',
        }}>
          <MechBtn label={isPlaying?'⏸ PAUSE':'▶ PLAY'} accent="#c0392b" shadow="#7b0000" onClick={handlePlayPause} w={132}/>
          <MechBtn label="⏏ EJECT" accent="#3a3a3a" shadow="#0a0a0a" onClick={()=>{ if(activeCassette) snapOut(activeCassette); }} w={112}/>
        </div>

        {/* Speaker grille */}
        <div style={{
          marginTop:'auto', marginBottom:18, width:'88%', height:42,
          background:'radial-gradient(circle,#0d0d0d 28%,transparent 32%)', backgroundSize:'9px 9px',
          backgroundColor:'#161616', borderRadius:8, border:'2px solid #0a0a0a',
          boxShadow:'inset 0 4px 12px rgba(0,0,0,0.9)',
        }}/>
      </div>

      {/* ── CASSETTES ── */}
      {CASSETTES.map(c => (
        <div
          key={c.id} id={c.id}
          onMouseDown={e => {
            if (activeRef.current === c.id) return; // locked in deck
            e.preventDefault();
            const p = pos.current[c.id] || { x:0, y:0 };
            drag.current = { id:c.id, startMX:e.clientX, startMY:e.clientY, startEX:p.x, startEY:p.y };
            gsap.set(`#${c.id}`, { zIndex:200, rotation:0 });
          }}
          style={{
            position:'absolute', top:0, left:0,
            width:CW, height:CH,
            borderRadius:13,
            backgroundImage:'url(/cassette.jpg)', backgroundSize:'cover', backgroundPosition:'center',
            border:'1px solid #0d0d0d',
            boxShadow:'10px 16px 32px rgba(0,0,0,0.85)',
            cursor: activeCassette===c.id ? 'default' : 'grab',
            zIndex:30,
            opacity: activeCassette===c.id ? 0 : 1,
            pointerEvents: activeCassette===c.id ? 'none' : 'auto',
            transition:'opacity 0.18s',
          }}
        >
          {/* Label */}
          <div style={{
            position:'absolute', left:'7%', right:'7%', top:'28%', height:44,
            background:'#f2efe6', borderTop:`9px solid ${c.color}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            transform:'rotate(-0.8deg)', boxShadow:'0 2px 5px rgba(0,0,0,0.5)',
          }}>
            <span style={{fontFamily:'var(--font-marker)',fontSize:'1.5rem',color:'#111'}}>{c.name}</span>
          </div>
        </div>
      ))}

      {/* CSS */}
      <style>{`
        @keyframes spin0 { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes spin1 { to { transform: translate(50%,-50%)  rotate(360deg); } }
        .spindle.spin:nth-child(1) { animation: spin0 2.1s linear infinite; }
        .spindle.spin:nth-child(2) { animation: spin1 2.1s linear infinite; }

        @keyframes v0 { 0%{height:8%}  50%{height:82%} 100%{height:14%} }
        @keyframes v1 { 0%{height:32%} 50%{height:62%} 100%{height:22%} }
        @keyframes v2 { 0%{height:55%} 50%{height:12%} 100%{height:68%} }
        @keyframes v3 { 0%{height:18%} 50%{height:90%} 100%{height:38%} }
        @keyframes v4 { 0%{height:70%} 50%{height:28%} 100%{height:52%} }
        .vfd.v0 { animation: v0 0.38s ease-in-out infinite alternate; }
        .vfd.v1 { animation: v1 0.52s ease-in-out infinite alternate; }
        .vfd.v2 { animation: v2 0.44s ease-in-out infinite alternate; }
        .vfd.v3 { animation: v3 0.59s ease-in-out infinite alternate; }
        .vfd.v4 { animation: v4 0.47s ease-in-out infinite alternate; }
      `}</style>
    </main>
  );
}

// ── Mechanical button ──────────────────────────
function MechBtn({ label, accent, shadow, onClick, w=110 }:
  { label:string; accent:string; shadow:string; onClick:()=>void; w?:number }) {
  const [p, setP] = useState(false);
  return (
    <button
      onMouseDown={()=>setP(true)}
      onMouseUp={()=>{ setP(false); onClick(); }}
      onMouseLeave={()=>setP(false)}
      style={{
        width:w, height:56,
        background:`linear-gradient(to bottom, ${accent}, ${shadow})`,
        color:'#fff', border:'1px solid rgba(0,0,0,0.55)', borderRadius:7,
        fontFamily:'sans-serif', fontWeight:900, fontSize:'1rem', letterSpacing:1,
        cursor:'pointer', outline:'none', position:'relative',
        top: p ? 6 : 0,
        boxShadow: p
          ? `0 0 0 ${shadow},0 2px 6px rgba(0,0,0,0.7),inset 0 2px 3px rgba(0,0,0,0.4)`
          : `0 7px 0 ${shadow},0 10px 18px rgba(0,0,0,0.8),inset 0 2px 3px rgba(255,255,255,0.14)`,
        transition:'top 0.07s,box-shadow 0.07s',
        userSelect:'none',
      }}
    >{label}</button>
  );
}
