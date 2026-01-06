import React, { useEffect, useRef } from 'react';

const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    // Config
    const SPACING = 40; // Space between dots
    const RIPPLE_SPEED = 8; // How fast waves expand
    const RIPPLE_DECAY = 0.03; // How fast waves fade
    const MAX_RIPPLES = 10; // Limit concurrent ripples for performance

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      strength: number; // 0 to 1
    }

    // State
    const ripples: Ripple[] = [];
    let lastMouseX = 0;
    let lastMouseY = 0;
    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // 1. Update Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += RIPPLE_SPEED;
        r.strength -= RIPPLE_DECAY;
        if (r.strength <= 0) {
          ripples.splice(i, 1);
        }
      }

      // 2. Draw Grid Dots
      // We loop through a fixed grid
      const cols = Math.ceil(width / SPACING);
      const rows = Math.ceil(height / SPACING);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;

          // Calculate influence from all ripples
          let totalInfluence = 0;
          
          // Optimization: Only check ripples if they are reasonably close? 
          // For now, checking all (max 10) is fine.
          for (const r of ripples) {
            const dx = x - r.x;
            const dy = y - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // The ripple is a ring. Influence is high if dist is close to radius.
            const distFromWave = Math.abs(dist - r.radius);
            
            // Wave width is roughly 50px
            if (distFromWave < 50) {
              // 0 at 50px away, 1 at 0px away
              const intensity = (1 - distFromWave / 50) * r.strength;
              totalInfluence += intensity;
            }
          }

          // Cap influence
          if (totalInfluence > 1) totalInfluence = 1;

          // Draw the dot
          // Base size 1.5, Max size 4
          const size = 1.5 + totalInfluence * 3;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);

          if (totalInfluence > 0.1) {
             // Active Color: Gold -> Purple gradient based on intensity
             // High intensity = Gold (#F59E0B), Low = Purple (#9333EA)
             // Simple mix: 
             // We use rgba. Gold is 245, 158, 11. Purple is 147, 51, 234.
             
             // Let's just swap opacity and color for impact
             if (totalInfluence > 0.5) {
                ctx.fillStyle = `rgba(245, 158, 11, ${totalInfluence})`; // Gold
             } else {
                ctx.fillStyle = `rgba(147, 51, 234, ${totalInfluence + 0.2})`; // Purple
             }
          } else {
             // Dormant Color: Very faint purple
             ctx.fillStyle = 'rgba(147, 51, 234, 0.15)'; 
          }
          
          ctx.fill();
        }
      }

      // Auto-generate subtle ripples occasionally for "aliveness"
      if (frameCount % 60 === 0 && Math.random() > 0.5) {
         ripples.push({
             x: Math.random() * width,
             y: Math.random() * height,
             radius: 0,
             strength: 0.4 // weaker than mouse
         });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only create a ripple if mouse moved enough distance to avoid spamming
      if (dist > 30) {
        if (ripples.length < MAX_RIPPLES) {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                strength: 1
            });
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
       {/* Gradient Masks to blend edges */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#1a0b2e] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent z-10" />
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default HeroBackground;