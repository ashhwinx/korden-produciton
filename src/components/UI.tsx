import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// Using global window type for GSAP
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: boolean;
}

// Helper for the Rolling Text Animation
export const RollingText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  // Only animate if children is a string (to avoid breaking complex nodes)
  if (typeof children !== 'string') return <>{children}</>;

  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-center h-[1.2em] px-2 ${className}`}>
      {/* Original Text - Slides Up - Default Font Space Grotesk */}
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-[120%] font-['Space_Grotesk'] whitespace-nowrap">
        {children}
      </span>
      {/* Duplicate Text - Slides Up from Bottom - New Font Style Syne Italic */}
      <span className="absolute top-0 block translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-y-0 text-white font-['Syne'] font-bold italic tracking-wide whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon = false, 
  className = '', 
  ...props 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Magnetic & Spotlight Effect
  useEffect(() => {
    const el = btnRef.current;
    if (!el || !window.gsap) return;

    // QuickTo for performant mouse following
    const xTo = window.gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = window.gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      
      // Move element slightly towards cursor (Magnetic)
      xTo(x * 0.15);
      yTo(y * 0.15);

      // Update CSS variables for Spotlight effect (Secondary button)
      const relativeX = e.clientX - left;
      const relativeY = e.clientY - top;
      el.style.setProperty('--x', `${relativeX}px`);
      el.style.setProperty('--y', `${relativeY}px`);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Variant 1: Primary (Rotating Cosmic Border + Rolling Text)
  if (variant === 'primary') {
    return (
      <button
        ref={btnRef}
        className={`relative inline-flex h-14 overflow-hidden rounded-full p-[2px] group focus:outline-none shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-shadow duration-500 ${className}`}
        {...props}
      >
        {/* Spinning Gradient Border */}
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9333EA_0%,#F59E0B_50%,#9333EA_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Inner Content */}
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#080808] px-8 py-1 text-base font-bold text-white backdrop-blur-3xl transition-all duration-300 group-hover:bg-[#0a0a0a]/90 gap-2 font-['Space_Grotesk'] tracking-wide border border-white/5">
          <RollingText>{children}</RollingText>
          {icon && (
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-amber-500" />
          )}
        </span>
      </button>
    );
  }

  // Variant 2: Secondary (Spotlight Reveal + Rolling Text)
  if (variant === 'secondary') {
    return (
      <button 
        ref={btnRef}
        className={`relative inline-flex items-center justify-center h-14 px-8 rounded-full bg-white/5 border border-white/10 text-slate-200 overflow-hidden transition-all duration-300 hover:text-white hover:border-purple-500/50 group backdrop-blur-sm shadow-sm hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] ${className}`}
        style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
        {...props}
      >
        {/* Spotlight Gradient - Follows Mouse via CSS vars */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle 100px at var(--x) var(--y), rgba(147, 51, 234, 0.3) 0%, transparent 100%)'
          }}
        />
        
        <span className="relative flex items-center gap-2 font-bold font-['Space_Grotesk'] tracking-wide z-10">
            <RollingText>{children}</RollingText>
            {icon && <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
        </span>
      </button>
    );
  }

  // Variant 3: Outline / Default (Gold Border + Rolling Text)
  return (
    <button 
      ref={btnRef}
      className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all rounded-full border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] group ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2 font-bold font-['Space_Grotesk']">
        <RollingText>{children}</RollingText>
        {icon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
    </button>
  );
};

export const SectionTitle: React.FC<{ title: string, subtitle?: string, align?: 'left' | 'center' }> = ({ 
  title, 
  subtitle,
  align = 'center' 
}) => {
  return (
    <div className={`mb-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 font-bold tracking-[0.2em] text-sm mb-3 uppercase font-['Space_Grotesk'] animate-pulse-slow">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-['Syne'] drop-shadow-lg">
        {title}
      </h2>
      <div className={`h-1.5 w-24 bg-gradient-to-r from-purple-600 to-amber-500 mt-6 rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.1)] group hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
};