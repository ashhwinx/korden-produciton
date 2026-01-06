import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null); // The Dot
  const followerRef = useRef<HTMLDivElement>(null); // The Ring
  
  const [isMobile, setIsMobile] = useState(true); 

  // Store coordinates (No State = No Re-renders)
  const mouse = useRef({ x: -100, y: -100 }); 
  const followerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // 1. Mobile Detection Logic
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      // Slightly larger breakpoint to be safe
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Initial Position off-screen to prevent flash
    mouse.current = { x: -100, y: -100 };
    followerPos.current = { x: -100, y: -100 };

    // --- OPTIMIZED EVENT HANDLERS (No React State) ---

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Move Dot Instantly (Hardware Accelerated)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) cursorRef.current.classList.add('scale-75');
      if (followerRef.current) followerRef.current.classList.add('scale-90');
    };

    const handleMouseUp = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('scale-75');
      if (followerRef.current) followerRef.current.classList.remove('scale-90');
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Performance: Check tags first (fastest), then check closest (slower)
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('.cursor-pointer') || // Use a class utility if needed
        target.closest('a') || 
        target.closest('button');

      if (followerRef.current) {
        if (isInteractive) {
            followerRef.current.classList.add('hover-active');
        } else {
            followerRef.current.classList.remove('hover-active');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // --- ANIMATION LOOP (The Heart of Smoothness) ---
    let animationFrameId: number;

    const animate = () => {
      // Smooth LERP (Linear Interpolation)
      const ease = 0.12; // Adjusted for snappier feel
      
      followerPos.current.x += (mouse.current.x - followerPos.current.x) * ease;
      followerPos.current.y += (mouse.current.y - followerPos.current.y) * ease;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        /* CSS Optimization for GPU transitions */
        .cursor-dot {
            width: 10px;
            height: 10px;
            transition: width 0.2s, height 0.2s, background-color 0.2s;
        }
        .cursor-follower {
            width: 32px;
            height: 32px;
            background-color: transparent;
            border-color: rgba(168, 85, 247, 0.4);
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        height 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        background-color 0.3s, 
                        border-color 0.3s;
        }
        
        /* Interactive States handled via Classes */
        .hover-active {
            width: 64px !important;
            height: 64px !important;
            background-color: rgba(147, 51, 234, 0.08) !important;
            border-color: rgba(168, 85, 247, 0.8) !important;
        }
      `}</style>

      {/* 1. Main Dot (Amber) */}
      <div 
        ref={cursorRef}
        className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-screen bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] will-change-transform"
      />
      
      {/* 2. Follower Ring (Purple) */}
      <div 
        ref={followerRef}
        className="cursor-follower fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-purple-500/60 will-change-transform"
      />
    </>
  );
};

export default CustomCursor;