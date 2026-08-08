"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { Tape, Polaroid, NavTag, CutoutText } from "@/components/ScrapComponents";

// Register Draggable
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const PaperClip = ({ style }: { style?: React.CSSProperties }) => (
  <div className="drag-item hover-lift" style={{
    width: '15px', height: '50px',
    border: '3px solid #ccc', borderRadius: '10px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.4)',
    position: 'absolute',
    cursor: 'grab',
    ...style
  }}>
    <div style={{ position: 'absolute', top: '5px', left: '2px', width: '5px', height: '35px', border: '3px solid #ccc', borderRadius: '10px', borderTop: 'none', borderRight: 'none' }}></div>
  </div>
);

export default function AboutPage() {
  const container = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const prevPage = useRef(0);

  // Pages data
  const totalPages = 5; // 0, 1, 2, 3, 4

  useGSAP(() => {
    // Draggable logic for background elements
    Draggable.create(".drag-item", {
      type: "x,y",
      bounds: container.current,
      edgeResistance: 0.65,
    });

    // Animate pages when currentPage changes
    for (let i = 0; i < totalPages; i++) {
      const pageEl = document.getElementById(`page-${i}`);
      if (!pageEl) continue;

      const targetRotation = i < currentPage ? -180 : 0;
      const finalZ = i < currentPage ? i + 1 : totalPages - i;

      // Проверяем, является ли именно эта страница той, которая сейчас переворачивается
      const isFlippingLeft = i === currentPage - 1 && prevPage.current < currentPage;
      const isFlippingRight = i === currentPage && prevPage.current > currentPage;
      const isFlipping = isFlippingLeft || isFlippingRight;

      if (isFlipping) {
        gsap.to(pageEl, { 
          rotationY: targetRotation, 
          duration: 1.2, 
          ease: "power2.inOut",
          onStart: () => {
            // Только перелистываемая страница выходит на первый план
            gsap.set(pageEl, { zIndex: 50 });
          },
          onComplete: () => {
            gsap.set(pageEl, { zIndex: finalZ });
          }
        });
      } else {
        // Остальные страницы просто обновляют свой z-index
        gsap.to(pageEl, { rotationY: targetRotation, duration: 1.2, ease: "power2.inOut", zIndex: finalZ });
      }
    }
    
    prevPage.current = currentPage;
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(c => c + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(c => c - 1);
  };

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

      {/* BACKGROUND MESS */}
      <img src="/coffee_stain.jpg" className="drag-item" style={{
        position: 'absolute', top: '15%', right: '20%', width: '150px',
        mixBlendMode: 'multiply', opacity: 0.8, transform: 'rotate(45deg)'
      }} alt="coffee" draggable={false} />

      <PaperClip style={{ top: '15%', left: '40%', transform: 'rotate(45deg)' }} />
      <PaperClip style={{ bottom: '25%', right: '35%', transform: 'rotate(-20deg)' }} />

      {/* BOOK SPINE CENTERED */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(0, -50%)', // Anchor at left center
        perspective: '2000px', // Увеличенная перспектива для большей глубины 3D
        width: '450px',
        height: '600px',
        zIndex: 10,
      }}>
        
        {/* PAGE 0 (Cover) */}
        <div id="page-0" onClick={currentPage === 0 ? handleNextPage : handlePrevPage} style={{
          position: 'absolute', width: '100%', height: '100%',
          transformOrigin: 'left center', transformStyle: 'preserve-3d', cursor: 'pointer'
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            backgroundColor: '#cfb997', border: '2px solid #5a4f40', borderRadius: '0 10px 10px 0',
            boxShadow: '10px 15px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.1) 100%)'
          }}>
            <Tape style={{ top: '20px', right: '20px', transform: 'rotate(15deg)' }} />
            <CutoutText text="СОВЕРШЕННО СЕКРЕТНО" rotation={-5} bg="#d32f2f" color="#fff" style={{ fontSize: '1.5rem', marginBottom: '40px' }} />
            <h1 style={{ fontFamily: 'var(--font-marker)', fontSize: '3rem', color: '#111', textAlign: 'center' }}>
              ДОСЬЕ:<br/>Ислам Даниярулы
            </h1>
            <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 800, marginTop: '20px' }}>( Кликните, чтобы открыть )</p>
            
            {/* CLASSIFIED STAMP */}
            <div style={{ position: 'absolute', bottom: '40px', right: '30px', border: '4px solid #d32f2f', color: '#d32f2f', padding: '5px 15px', fontSize: '2rem', fontFamily: 'monospace', fontWeight: 900, transform: 'rotate(-15deg)', borderRadius: '5px', opacity: 0.7, pointerEvents: 'none' }}>
              CLASSIFIED
            </div>
            
            {/* BARCODE */}
            <div style={{ position: 'absolute', bottom: '30px', left: '20px', width: '100px', height: '40px', backgroundImage: 'repeating-linear-gradient(90deg, #111, #111 2px, transparent 2px, transparent 4px, #111 4px, #111 8px, transparent 8px, transparent 10px)', opacity: 0.5 }}></div>
          </div>
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            backgroundColor: '#e6d9bd', border: '2px solid #5a4f40', borderRadius: '10px 0 0 10px', padding: '40px',
            boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.1)'
          }}>
             <img src="/foraboutme.jpg" style={{ width: '80%', display: 'block', margin: '0 auto', filter: 'grayscale(100%) contrast(1.2)' }} alt="Portrait"/>
             <Tape style={{ top: '30px', left: '30%', transform: 'rotate(-5deg)' }} />
             <div style={{ marginTop: '30px', fontFamily: 'var(--font-marker)', fontSize: '1.5rem', textAlign: 'center', color: '#111' }}>
                Фото субъекта.<br/>Кодовое имя: Isa D.
             </div>
          </div>
        </div>

        {/* PAGE 1 (About Me) */}
        <div id="page-1" onClick={currentPage === 1 ? handleNextPage : handlePrevPage} style={{
          position: 'absolute', width: '100%', height: '100%',
          transformOrigin: 'left center', transformStyle: 'preserve-3d', cursor: 'pointer'
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '0 10px 10px 0', padding: '40px 30px', boxShadow: '5px 5px 15px rgba(0,0,0,0.2)'
          }}>
             <div style={{ position: 'absolute', left: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
             
             {/* WATERMARK */}
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '5rem', color: 'rgba(211, 47, 47, 0.1)', fontFamily: 'monospace', fontWeight: 900, pointerEvents: 'none', zIndex: 0 }}>
               CONFIDENTIAL
             </div>

             <div style={{ position: 'relative', zIndex: 1 }}>
               <h2 style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#111', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px dashed #111', paddingBottom: '10px' }}>
                 ОТЧЕТ НАБЛЮДЕНИЯ #404
               </h2>
               <p style={{ fontFamily: 'monospace', fontSize: '1.2rem', lineHeight: 1.6, color: '#222', marginTop: '20px', fontWeight: 'bold' }}>
                  Субъект: <span className="redacted" style={{ backgroundColor: '#111', color: '#111', cursor: 'pointer', padding: '0 4px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#111'}>DANGEROUS</span> Ислам Даниярулы.<br/>
                  Кодовое имя: Isa D.<br/>
                  Текущий статус: АКТИВЕН.
               </p>
               <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: 1.6, color: '#333', marginTop: '15px' }}>
                  Полевые данные показывают, что субъект классифицируется как DevOps-инженер. Ранее был замечен при выполнении операций в роли Full-Stack разработчика.
                  <br/><br/>
                  На данный момент оперирует как независимый агент (фрилансер). Способен единолично закрывать проекты полного цикла: от проектирования <span className="redacted" style={{ backgroundColor: '#111', color: '#111', cursor: 'pointer', padding: '0 4px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#111'}>CLASSIFIED</span> инфраструктуры до финального деплоя.
               </p>
             </div>
             {/* Handwritten note over the typed text */}
             <div style={{ position: 'absolute', top: '150px', right: '10px', transform: 'rotate(-5deg)', color: '#d32f2f', fontFamily: 'var(--font-marker)', fontSize: '1.5rem', border: '2px solid #d32f2f', padding: '5px', borderRadius: '5px' }}>
               ПРОВЕРЕНО!
             </div>
             <Tape style={{ bottom: '20px', right: '10px', transform: 'rotate(45deg)' }} />
          </div>
          {/* BACK */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '10px 0 0 10px', padding: '40px 30px', boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.1)'
          }}>
             <div style={{ position: 'absolute', right: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
             <Polaroid src="/messy_desk.jpg" text="WORKPLACE" rotation={-5} width="220px" className="drag-item" style={{ position: 'absolute', top: '50px', left: '50px' }} />
          </div>
        </div>

        {/* PAGE 2 (Skills) */}
        <div id="page-2" onClick={currentPage === 2 ? handleNextPage : handlePrevPage} style={{
          position: 'absolute', width: '100%', height: '100%',
          transformOrigin: 'left center', transformStyle: 'preserve-3d', cursor: 'pointer'
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '0 10px 10px 0', padding: '40px 30px', boxShadow: '5px 5px 15px rgba(0,0,0,0.2)'
          }}>
             <div style={{ position: 'absolute', left: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
             <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: '#111' }}>Технический Арсенал:</h2>
             <ul style={{ fontFamily: 'var(--font-marker)', fontSize: '1.8rem', lineHeight: 1.8, color: '#333', marginLeft: '30px', marginTop: '20px' }}>
                <li>- <strong>DevOps:</strong> AWS, Docker, CI/CD, Linux. Уровень: МАСТЕР.</li>
                <li>- <strong>Frontend:</strong> React, Next.js, GSAP. Уровень: БОГ.</li>
                <li>- <strong>Backend:</strong> Node.js, Python. Уровень: ПРОФИ.</li>
             </ul>
             
             {/* POST-IT NOTE */}
             <div style={{ position: 'absolute', top: '150px', right: '-15px', width: '130px', height: '130px', backgroundColor: '#fdfb79', boxShadow: '2px 2px 10px rgba(0,0,0,0.3)', transform: 'rotate(12deg)', padding: '15px 10px', zIndex: 10 }}>
               <Tape style={{ top: '-10px', left: '25%', transform: 'rotate(-5deg)', width: '50px' }} />
               <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', color: '#111', marginTop: '10px', lineHeight: 1.2 }}>
                 Проверить доступ к серверам!
               </p>
             </div>

             <CutoutText text="ДОПУСК: ВЫСШИЙ" rotation={10} bg="#111" color="#ffeb3b" style={{ position: 'absolute', bottom: '50px', right: '30px' }} />
          </div>
          {/* BACK */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '10px 0 0 10px', padding: '40px 30px', boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.1)'
          }}>
             <div style={{ position: 'absolute', right: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
             <Polaroid src="/tech_bg.jpg" text="SYSTEMS" rotation={8} width="220px" className="drag-item" style={{ position: 'absolute', bottom: '50px', left: '40px' }} />
          </div>
        </div>

        {/* PAGE 3 (Experience / Projects) */}
        <div id="page-3" onClick={currentPage === 3 ? handleNextPage : handlePrevPage} style={{
          position: 'absolute', width: '100%', height: '100%',
          transformOrigin: 'left center', transformStyle: 'preserve-3d', cursor: 'pointer'
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '0 10px 10px 0', padding: '40px 30px', boxShadow: '5px 5px 15px rgba(0,0,0,0.2)'
          }}>
             <div style={{ position: 'absolute', left: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
             <h2 style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#111', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px dashed #111', paddingBottom: '10px' }}>
               ИЗВЕСТНЫЕ ОПЕРАЦИИ
             </h2>
             <p style={{ fontFamily: 'monospace', fontSize: '1.2rem', lineHeight: 1.5, color: '#222', marginTop: '20px' }}>
                <strong>ОПЕРАЦИЯ 01: CRM & AUTOMATION</strong><br/>
                Разработка и автоматизация закрытых CRM-систем для малого и среднего бизнеса. Статус: Успешно внедрено.
                <br/><br/>
                <strong>ОПЕРАЦИЯ 02: NEXUS</strong><br/>
                Создание образовательной онлайн-платформы под ключ. Статус: В активной разработке.
             </p>
             <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.5rem', color: '#0d47a1', marginTop: '20px', transform: 'rotate(-2deg)' }}>
                * Примечание: Субъект лично гарантирует качество выполнения задач.
             </p>
          </div>
          {/* BACK */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            backgroundColor: '#f9f5d7', backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #64b5f6 30px)',
            borderRadius: '10px 0 0 10px', padding: '40px 30px', boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ position: 'absolute', right: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#ef5350' }}></div>
            <img src="/graffiti.jpg" style={{ width: '80%', display: 'block', margin: '40px auto 0', border: '5px solid white', boxShadow: '2px 2px 10px rgba(0,0,0,0.3)', transform: 'rotate(-3deg)' }} alt="Graffiti"/>
            <Tape style={{ top: '30px', right: '40%', transform: 'rotate(12deg)' }} />
          </div>
        </div>

        {/* PAGE 4 (End) */}
        <div id="page-4" onClick={currentPage === 4 ? handleNextPage : handlePrevPage} style={{
          position: 'absolute', width: '100%', height: '100%',
          transformOrigin: 'left center', transformStyle: 'preserve-3d', cursor: 'pointer'
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            backgroundColor: '#e6d9bd', border: '2px solid #5a4f40', borderRadius: '0 10px 10px 0',
            padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
             <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '3rem', color: '#111', textAlign: 'center' }}>
                Конец досье.
             </h2>
             <CutoutText text="ЗАКРЫТЬ ПАПКУ" rotation={2} bg="#111" color="#fff" style={{ marginTop: '30px' }} />
          </div>
          {/* BACK */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            backgroundColor: '#cfb997', border: '2px solid #5a4f40', borderRadius: '10px 0 0 10px',
            boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.1)'
          }}>
          </div>
        </div>

      </div>
    </main>
  );
}
