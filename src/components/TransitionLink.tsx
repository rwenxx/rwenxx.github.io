"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  target?: string;
}

export const TransitionLink = ({ 
  children, href, className, style, onMouseEnter, onMouseLeave, ...props 
}: TransitionLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const targetUrl = href.toString();
    
    // If it's an external link or the same page, just navigate normally
    if (targetUrl.startsWith('http') || pathname === targetUrl) {
      if (targetUrl.startsWith('http')) {
        window.open(targetUrl, '_blank');
      }
      return;
    }

    const wrapper = document.querySelector('.page-transition-wrapper');
    
    if (wrapper) {
      // Exit animation: Page falls down and rotates
      gsap.to(wrapper, {
        y: window.innerHeight,
        rotation: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 15),
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          router.push(targetUrl);
        }
      });
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <Link 
      {...props} 
      href={href} 
      onClick={handleTransition} 
      className={className} 
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
};
