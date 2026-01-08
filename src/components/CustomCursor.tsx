import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  // Movement Refs (Outer Containers)
  const cursorRef = useRef<HTMLDivElement>(null); 
  const followerRef = useRef<HTMLDivElement>(null); 
  
  // Scaling Refs (Inner Visuals) - Fix for the Jumping bug
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const followerInnerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true); 

  // Store coordinates
  const mouse = useRef({ x: -100, y: -100 }); 
  const followerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Outer div handles POSITION
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => {
      // Inner div handles SCALE
      if (dotInnerRef.current) dotInnerRef.current.classList.add('scale-click');
      if (followerInnerRef.current) followerInnerRef.current.classList.add('scale-click-follower');
    };

    const handleMouseUp = () => {
      if (dotInnerRef.current) dotInnerRef.current.classList.remove('scale-click');
      if (followerInnerRef.current) followerInnerRef.current.classList.remove('scale-click-follower');
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.closest('.cursor-pointer') || 
        target.closest('a') || 
        target.closest('button');

      if (followerInnerRef.current) {
        if (isInteractive) {
          followerInnerRef.current.classList.add('hover-active');
        } else {
          followerInnerRef.current.classList.remove('hover-active');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const animate = () => {
      const ease = 0.12; 
      followerPos.current.x += (mouse.current.x - followerPos.current.x) * ease;
      followerPos.current.y += (mouse.current.y - followerPos.current.y) * ease;

      if (followerRef.current) {
        // Outer ring handles POSITION
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
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
        .cursor-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9999;
            will-change: transform;
        }
        
        /* Inner elements handle the visual appearance and scaling */
        .cursor-dot-inner {
            width: 10px;
            height: 10px;
            background-color: #f59e0b; /* Amber 500 */
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);
            transform: translate(-50%, -50%); /* Keeps it centered */
            transition: transform 0.2s ease, background-color 0.2s;
        }

        .cursor-follower-inner {
            width: 32px;
            height: 32px;
            border: 1px solid rgba(168, 85, 247, 0.4);
            border-radius: 50%;
            background-color: transparent;
            transform: translate(-50%, -50%); /* Keeps it centered */
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        height 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        background-color 0.3s, 
                        border-color 0.3s,
                        transform 0.3s ease;
        }
        
        /* Scaling logic separated from movement */
        .scale-click { 
            transform: translate(-50%, -50%) scale(0.75) !important; 
        }
        .scale-click-follower { 
            transform: translate(-50%, -50%) scale(0.9) !important; 
        }

        .hover-active {
            width: 64px !important;
            height: 64px !important;
            background-color: rgba(147, 51, 234, 0.08) !important;
            border-color: rgba(168, 85, 247, 0.8) !important;
        }
      `}</style>

      {/* 1. Main Dot */}
      <div ref={cursorRef} className="cursor-wrapper">
        <div ref={dotInnerRef} className="cursor-dot-inner" />
      </div>
      
      {/* 2. Follower Ring */}
      <div ref={followerRef} className="cursor-wrapper" style={{ zIndex: 9998 }}>
        <div ref={followerInnerRef} className="cursor-follower-inner" />
      </div>
    </>
  );
};

export default CustomCursor;