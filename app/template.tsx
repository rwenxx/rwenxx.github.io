"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    if (!wrapperRef.current) return;

    // We don't want to animate the music page if it's acting as an iframe or background, 
    // but right now everything is a full page, so we animate everything.
    
    // Entry animation: Page falls from top
    gsap.fromTo(wrapperRef.current, 
      {
        y: -window.innerHeight,
        rotation: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 15),
        opacity: 0
      },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.9,
        ease: "back.out(1.2)"
      }
    );
  }, [pathname]);

  return (
    <div ref={wrapperRef} className="page-transition-wrapper">
      {children}
    </div>
  );
}
