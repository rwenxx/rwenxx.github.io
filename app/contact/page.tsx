"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NavTag, Tape, Polaroid } from '@/components/ScrapComponents';

gsap.registerPlugin(useGSAP);

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);

  const contacts = [
    { label: "INSTA", url: "https://www.instagram.com/rwenxx_/?hl=ru" },
    { label: "TELEGRAM", url: "https://t.me/paradiseformee" },
    null, // Оторванный листочек (пустое место)
    { label: "GITHUB", url: "https://github.com/rwenxx" },
    { label: "EMAIL", url: "#" },
    null, // Оторванный листочек
    { label: "WHATSAPP", url: "#" },
  ];

  const handleTearOff = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
    if (url === "#") {
      alert("Временно недоступно (пустышка)");
      return;
    }
    const el = e.currentTarget;
    
    // Play tear sound effect (optional if we had one)
    // Отрыв листочка с помощью физической анимации GSAP
    gsap.to(el, {
      y: window.innerHeight,
      rotation: Math.random() * 60 - 30, // Случайное вращение при падении
      opacity: 0,
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        // После анимации открываем ссылку
        window.open(url, '_blank');
      }
    });
  };

  const handleHoverEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotation: Math.random() * 4 - 2, duration: 0.2, ease: "power1.inOut" });
  };

  const handleHoverLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotation: 0, duration: 0.2, ease: "power1.inOut" });
  };

  return (
    <main ref={container} style={{
      width: '100vw', height: '100vh', 
      backgroundImage: 'url(/brick_wall.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* HOME BUTTON - Стилизованная под граффити или табличку */}
      <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 50, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}>
        <NavTag text="НАЗАД" rotation={-3} href="/" />
      </div>

      {/* RANDOM STREET DECALS */}
      <img src="/graffiti.jpg" style={{ position: 'absolute', top: '10%', right: '15%', width: '350px', opacity: 0.9, mixBlendMode: 'multiply', transform: 'rotate(8deg)' }} alt="Graffiti" />
      <div style={{ position: 'absolute', top: '25%', left: '10%', color: '#d32f2f', fontFamily: 'var(--font-marker)', fontSize: '5rem', transform: 'rotate(-15deg)', opacity: 0.6, mixBlendMode: 'color-burn', pointerEvents: 'none' }}>
        DO NOT CROSS
      </div>
      
      <Polaroid src="/indie_band.jpg" text="Underground" rotation={-10} width="220px" style={{ position: 'absolute', bottom: '15%', left: '20%', zIndex: 15 }} />
      <Tape style={{ position: 'absolute', bottom: '38%', left: '25%', transform: 'rotate(-25deg)', width: '60px', zIndex: 16 }} />

      {/* THE FLYER (ОБЪЯВЛЕНИЕ) */}
      <div style={{
        position: 'relative',
        width: '500px',
        backgroundColor: '#e8e4c9', // Старая выцветшая бумага
        boxShadow: '2px 5px 25px rgba(0,0,0,0.8)',
        transform: 'rotate(-1deg)',
        borderRadius: '2px 5px 3px 4px', // Немного неровные края
        zIndex: 10,
        // Имитация мятой бумаги с помощью фильтра
        filter: 'url(#crumpled-paper)'
      }}>
        {/* Клейкие ленты, держащие объявление */}
        <Tape style={{ top: '-15px', left: '20%', transform: 'rotate(-5deg)', width: '80px' }} />
        <Tape style={{ top: '-10px', right: '10%', transform: 'rotate(12deg)', width: '60px' }} />

        {/* ОСНОВНОЙ БЛОК ОБЪЯВЛЕНИЯ */}
        <div style={{ padding: '30px 40px 10px 40px', borderBottom: '1px solid #ccc' }}>
          <h1 style={{ fontFamily: 'var(--font-marker)', fontSize: '3.5rem', color: '#111', lineHeight: 1.1, textAlign: 'center', marginBottom: '20px' }}>
            ИЩЕШЬ<br/>РАЗРАБОТЧИКА?
          </h1>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem', color: '#333', lineHeight: 1.5 }}>
            Нужен опытный DevOps инженер или Full-Stack? Выполняю работу под ключ от архитектуры до деплоя. 
          </p>
          <ul style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#222', marginTop: '15px', fontWeight: 'bold' }}>
            <li>- AWS, Docker, CI/CD</li>
            <li>- React, Next.js, Node.js</li>
            <li>- Качество гарантирую лично.</li>
          </ul>
          
          <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '2rem', color: '#d32f2f', textAlign: 'center', marginTop: '30px', transform: 'rotate(3deg)' }}>
            ОТОРВИ КОНТАКТ!
          </h2>
        </div>

        {/* ОТРЫВНЫЕ ЛИСТОЧКИ (TEAR-OFF STRIPS) */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          height: '200px', // Увеличили высоту для реалистичности
        }}>
          {contacts.map((contact, i) => {
            // Если контакт null, рендерим "корешок" от уже оторванного листка
            if (!contact) {
              return (
                <div key={i} style={{
                  flex: 1,
                  borderLeft: i === 0 ? 'none' : '1px dashed #999',
                  borderTop: '2px dashed #666',
                  height: '20px', // Только оставшийся клочок бумаги
                  backgroundColor: '#e8e4c9',
                  clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 80%)',
                }}></div>
              );
            }

            // Иначе рендерим нормальный листочек
            return (
              <div 
                key={i} 
                className="tear-strip"
                onClick={(e) => handleTearOff(e, contact.url)}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
                style={{
                  flex: 1,
                  borderLeft: i === 0 ? 'none' : '1px dashed #999',
                  borderTop: '2px dashed #666',
                  backgroundColor: '#e8e4c9', // Тот же цвет что у объявления
                  cursor: 'pointer',
                  transformOrigin: 'top center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 15px 10px -15px rgba(0,0,0,0.4)',
                  // Немного разная длина листочков для реализма
                  height: i % 2 === 0 ? '190px' : '200px',
                  marginTop: '2px',
                }}
              >
                {/* Надрез сверху для реалистичности */}
                <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '15px', height: '10px', backgroundColor: '#e8e4c9', borderRadius: '50%', clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                
                {/* Вертикальный текст */}
                <div style={{ 
                  writingMode: 'vertical-rl', 
                  transform: 'rotate(180deg)', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  <span style={{ fontSize: '1.5rem', color: '#d32f2f', fontFamily: 'var(--font-marker)' }}>{contact.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* SVG ФИЛЬТР ДЛЯ МЯТОЙ БУМАГИ */}
      <svg style={{ display: 'none' }}>
        <filter id="crumpled-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise" />
          <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
        </filter>
      </svg>

    </main>
  );
}
