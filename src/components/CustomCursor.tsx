"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUISounds } from "@/hooks/useUISounds";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { playStamp } = useUISounds();

  useGSAP(() => {
    if (!cursorRef.current || !dotRef.current || !trailRef.current) return;

    // Viewfinder (brackets) - follows with a slight delay for weight
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3.out" });
    
    // Main dot - instant (zero lag)
    const dotXTo = gsap.quickTo(dotRef.current, "x", { duration: 0 });
    const dotYTo = gsap.quickTo(dotRef.current, "y", { duration: 0 });

    // Trail dot - follows with a lot of lag for a ghosting effect
    const trailXTo = gsap.quickTo(trailRef.current, "x", { duration: 0.35, ease: "power2.out" });
    const trailYTo = gsap.quickTo(trailRef.current, "y", { duration: 0.35, ease: "power2.out" });

    let isMoving = false;
    let timeout: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent) => {
      // Offset by half width/height so it's perfectly centered
      xTo(e.clientX - 20);
      yTo(e.clientY - 20);
      
      dotXTo(e.clientX - 3); // 6px width -> center is 3
      dotYTo(e.clientY - 3);

      trailXTo(e.clientX - 3);
      trailYTo(e.clientY - 3);

      // Inertia rotation effect when moving fast
      if (!isMoving) {
        isMoving = true;
        gsap.to(cursorRef.current, { rotation: e.movementX > 0 ? 15 : -15, duration: 0.2 });
      }
      
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isMoving = false;
        // If we are clicking, don't reset rotation yet
        if (!isClicking) {
          gsap.to(cursorRef.current, { rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        }
      }, 50);
    };

    const onMouseDown = () => {
      setIsClicking(true);
      playStamp(); // Global UI click sound
      // Mechanical snap effect on click
      gsap.to(cursorRef.current, { rotation: 90, scale: 0.8, duration: 0.3, ease: "back.out(2)" });
      gsap.to(dotRef.current, { scale: 0.5, duration: 0.2 });
    };

    const onMouseUp = () => {
      setIsClicking(false);
      gsap.to(cursorRef.current, { rotation: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
      gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: "back.out(1.5)" });
    };

    // Detect hover on interactive elements to trigger viewfinder "focus"
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const compStyle = window.getComputedStyle(target);
      const isInteractive = 
        compStyle.cursor === "pointer" ||
        compStyle.cursor === "grab" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cassette") ||
        target.classList.contains("transport-btn");

      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      clearTimeout(timeout);
    };
  }, [isClicking]); // Re-bind if click state changes so timeouts don't override the click rotation

  return (
    <>
      {/* Ghost Trail Dot */}
      <div 
        ref={trailRef}
        className="custom-cursor-element"
        style={{
          position: "fixed", top: 0, left: 0, width: "6px", height: "6px",
          backgroundColor: "#fff", borderRadius: "50%",
          pointerEvents: "none", zIndex: 999997,
          opacity: 0.3, mixBlendMode: "difference"
        }}
      />

      {/* Center Laser Dot */}
      <div 
        ref={dotRef}
        className="custom-cursor-element"
        style={{
          position: "fixed", top: 0, left: 0, width: "6px", height: "6px",
          backgroundColor: "#fff", borderRadius: "50%",
          pointerEvents: "none", zIndex: 999999,
          mixBlendMode: "difference",
          // Dot grows when hovering over interactive elements
          transform: isHovering ? "scale(2.5)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      />

      {/* The Viewfinder Brackets */}
      <div 
        ref={cursorRef}
        className="custom-cursor-element"
        style={{
          position: "fixed", top: 0, left: 0, width: "40px", height: "40px",
          pointerEvents: "none", zIndex: 999998,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          // Hover state: shrink the brackets to "lock on"
          padding: isHovering ? "4px" : "0px",
          transition: "padding 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          mixBlendMode: "difference"
        }}
      >
        {/* Left bracket */}
        <div style={{
          width: "12px", height: "100%", 
          borderLeft: "2px solid #fff", borderTop: "2px solid #fff", borderBottom: "2px solid #fff",
          opacity: isHovering ? 1 : 0.6, 
          transition: "opacity 0.2s"
        }} />
        
        {/* Right bracket */}
        <div style={{
          width: "12px", height: "100%", 
          borderRight: "2px solid #fff", borderTop: "2px solid #fff", borderBottom: "2px solid #fff",
          opacity: isHovering ? 1 : 0.6, 
          transition: "opacity 0.2s"
        }} />
      </div>
    </>
  );
}
