import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ArrowUp, Globe, Linkedin, Twitter, Instagram, ArrowUpRight, ChevronRight } from 'lucide-react';
import { NAV_LINKS, COMPANY_INFO } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTANT TYPE FIX ---
import type { Variants } from 'framer-motion'; 

// --- FIXED ELASTIC GRID (Hover restored + Optimized) ---
const ElasticGridBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return; 

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;

    const SPACING = 45; 
    const MOUSE_INFLUENCE = 180;
    const MOUSE_INFLUENCE_SQ = MOUSE_INFLUENCE * MOUSE_INFLUENCE; 
    const MOUSE_FORCE = 5; 
    const SPRING_STRENGTH = 0.08; 
    const FRICTION = 0.85; 

    const mouse = { x: -1000, y: -1000 };
    interface Point {
      x: number; y: number; ox: number; oy: number; vx: number; vy: number;
    }
    const points: Point[] = [];

    const init = () => {
        points.length = 0;
        const cols = Math.ceil(width / SPACING) + 2;
        const rows = Math.ceil(height / SPACING) + 2;
        
        for (let i = -1; i < cols; i++) {
          for (let j = -1; j < rows; j++) {
            const x = i * SPACING;
            const y = j * SPACING;
            points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
          }
        }
    };

    const update = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < points.length; i++) {
           const p = points[i];
           const dx = mouse.x - p.x;
           const dy = mouse.y - p.y;
           const distSq = dx*dx + dy*dy; 

           if (distSq < MOUSE_INFLUENCE_SQ) {
               const dist = Math.sqrt(distSq);
               const angle = Math.atan2(dy, dx);
               const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE;
               p.vx -= Math.cos(angle) * force * MOUSE_FORCE;
               p.vy -= Math.sin(angle) * force * MOUSE_FORCE;
           }

           const dxHome = p.ox - p.x;
           const dyHome = p.oy - p.y;
           
           p.vx += dxHome * SPRING_STRENGTH;
           p.vy += dyHome * SPRING_STRENGTH;
           p.vx *= FRICTION;
           p.vy *= FRICTION;
           p.x += p.vx;
           p.y += p.vy;
        }

        const rowsVal = Math.ceil(height / SPACING) + 2;
        const rowStride = rowsVal + 1; 
        ctx.lineWidth = 1;

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const d = Math.abs(p.x - p.ox) + Math.abs(p.y - p.oy);
            const intensity = Math.min(1, d / 40);

            const r = 147 + (98 * intensity);
            const g = 51 + (107 * intensity);
            const b = 234 - (223 * intensity);
            const alpha = 0.15 + (0.5 * intensity);

            ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(2)})`;
            
            const rightIndex = i + rowStride;
            if (rightIndex < points.length) {
                 const n = points[rightIndex];
                 ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
            }

            const bottomIndex = i + 1;
            if (bottomIndex < points.length && (i + 1) % rowStride !== 0) {
                 const n = points[bottomIndex];
                 ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
            }
        }

        animationId = requestAnimationFrame(update);
    };

    let resizeTimeout: any;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (containerRef.current) {
                width = containerRef.current.clientWidth;
                height = containerRef.current.clientHeight;
                canvas.width = width;
                canvas.height = height;
                init();
            }
        }, 200);
    };

    const handleMouseMove = (e: MouseEvent) => {
       if (!canvas) return;
       const rect = canvas.getBoundingClientRect();
       mouse.x = e.clientX - rect.left;
       mouse.y = e.clientY - rect.top;
    };
    
    if (containerRef.current) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove); 
    
    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full">
         <canvas ref={canvasRef} className="block w-full h-full" style={{ opacity: 1 }} />
    </div>
  );
});

// --- OPTIMIZED NAVBAR ---
export const Navbar: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 50);

          if (currentScrollY < 10) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 600) {
            setIsVisible(false);
            setIsOpen(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  // --- ANIMATION VARIANTS ---
  const menuVariants: Variants = {
    closed: { 
      opacity: 0, 
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    open: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "backOut" }
    }
  };

  const linkStagger: Variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const linkItem: Variants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <nav 
      className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] left-1/2 -translate-x-1/2 flex flex-col items-center will-change-[transform,opacity]
        ${!isVisible ? '-translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
        ${scrolled 
            ? 'top-4 w-[95%] md:w-[1050px] rounded-[2rem] bg-[#050505]/90 backdrop-blur-xl border border-white/10 shadow-2xl py-3 px-6' 
            : 'top-0 w-full bg-transparent border-transparent py-6 px-4 md:px-8'
        }
      `}
    >
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto relative">
        <Link to="/" className="flex items-center gap-3 group shrink-0 relative z-50">
          <div className={`relative flex items-center justify-center transition-all duration-500 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
            <img src="/logo.png" alt="Korden Logo" className={`transition-all duration-500 object-contain ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`} />
          </div>
          <span className={`font-bold font-['Space_Grotesk'] tracking-widest text-white transition-all duration-500 ${scrolled ? 'text-sm' : 'text-base'}`}>
            KORDEN TECHNOLOGY
          </span>
        </Link>

        <div className={`hidden md:flex items-center transition-all duration-500 ${scrolled ? 'gap-1' : 'gap-4'}`}>
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => 
                `relative px-5 py-2.5 rounded-full group overflow-hidden transition-all duration-300 font-['Space_Grotesk'] font-bold text-sm tracking-wide
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${isActive ? 'opacity-100 bg-white/10' : ''}`} />
                  <span className="relative z-10">{link.label}</span>
                  {isActive && <motion.span layoutId="nav-dot" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#F59E0B]" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4 relative z-50">
            <Link to="/contact" className="hidden md:block">
              <button className={`relative overflow-hidden flex items-center gap-2 bg-white text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group ${scrolled ? 'px-5 py-2 text-xs' : 'px-7 py-2.5 text-sm'}`}>
                <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent z-20 skew-x-12" />
                <span className="relative z-10 font-['Space_Grotesk']">Get Quote</span>
                <ChevronRight className={`w-3 h-3 transition-transform group-hover:translate-x-1 ${scrolled ? 'hidden' : 'block'}`} />
              </button>
            </Link>

            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-2.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-white text-black rotate-90' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="md:hidden absolute top-full left-0 w-full px-2 mt-2 origin-top"
            >
                <div className="bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/15 rounded-[2rem] p-5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />

                    <motion.div variants={linkStagger} className="flex flex-col gap-2 relative z-10">
                        {NAV_LINKS.map((link) => (
                          <motion.div key={link.path} variants={linkItem}>
                              <NavLink 
                                  to={link.path}
                                  className={({ isActive }) => 
                                  `flex items-center justify-between p-4 rounded-2xl transition-all group
                                  ${isActive 
                                    ? 'bg-white text-black font-bold shadow-lg shadow-white/10' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}
                                  `
                                  }
                              >
                                  {({ isActive }) => (
                                     <>
                                       <span className="font-['Space_Grotesk'] text-lg">{link.label}</span>
                                       {isActive ? (
                                          <ArrowUpRight size={20} />
                                       ) : (
                                          <ArrowRight size={20} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                                       )}
                                     </>
                                  )}
                              </NavLink>
                          </motion.div>
                        ))}

                        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />
                        
                        <motion.div variants={linkItem}>
                            <Link to="/contact">
                            <button className="w-full py-4 bg-gradient-to-r from-amber-200 to-amber-500 text-black font-bold rounded-2xl font-['Space_Grotesk'] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                Get Quote
                                <ChevronRight size={20} />
                            </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

// --- FOOTER ---
export const Footer: React.FC = React.memo(() => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="relative bg-[#020005] overflow-hidden border-t border-purple-900/20">
      <ElasticGridBackground />
      
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#020005] via-[#020005]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020005_100%)] z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16 md:pt-20 pb-10">

        {isHomePage && (
          <div className="relative flex flex-col items-center justify-center text-center mb-20 md:mb-32">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 shadow-lg hover:bg-white/10 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#F59E0B]"/>
                  Future Ready
              </div>

              <div className="relative group flex flex-col items-center">
                  <h3 className="font-['Space_Grotesk'] font-medium text-lg md:text-2xl tracking-[0.8em] md:tracking-[1em] text-slate-300 uppercase mb-4 select-none drop-shadow-md transition-all duration-300 group-hover:tracking-[1.1em]">
                    Scale Your
                  </h3>
                  <h2 className="font-syne font-extrabold text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter select-none relative z-10 transition-all duration-500 group-hover:scale-105">
                    <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">VISION</span>
                  </h2>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/10 blur-[100px] rounded-full -z-10 pointer-events-none mix-blend-screen" />
              </div>

              <div className="mt-16 relative z-20">
                <Link to="/contact">
                    <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold text-base font-['Space_Grotesk'] tracking-wide transition-all duration-300 hover:bg-amber-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                      <span className="relative z-10">Start a Project</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>
                </Link>
              </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-0 bg-[#050505]/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl relative z-10">

            <div className="order-1 col-span-2 md:col-span-4 md:pr-12 md:border-r border-white/5 flex flex-col justify-between items-center md:items-start text-center md:text-left">
                <div>
                    <Link to="/" className="flex items-center gap-3 mb-6 group w-fit mx-auto md:mx-0">
                        <img src="/logo.png" alt="Korden Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" />
                        <span className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-wider">KORDEN TECHNOLOGIES</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                    Bridging the gap between global innovation and local manufacturing. Your premium partner for electronics sourcing.
                    </p>
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                    {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <Icon size={18} />
                    </a>
                    ))}
                </div>
            </div>

            <div className="order-2 col-span-1 md:col-span-2 md:px-8 md:border-r border-white/5">
                <h4 className="font-['Syne'] font-bold text-white uppercase tracking-widest mb-6 text-xs opacity-50">Explore</h4>
                <ul className="space-y-3">
                    {NAV_LINKS.map(link => (
                    <li key={link.path}>
                        <Link to={link.path} className="text-slate-400 hover:text-amber-500 transition-colors text-sm font-medium block hover:translate-x-2 transition-transform duration-300">
                            {link.label}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>

            <div className="order-3 col-span-1 md:col-span-3 md:pl-8 flex flex-col justify-between h-full">
                <div>
                    <h4 className="font-['Syne'] font-bold text-white uppercase tracking-widest mb-6 text-xs opacity-50">Legal</h4>
                    <ul className="space-y-3">
                    <li><a href="#" className="text-slate-400 hover:text-amber-500 text-sm font-medium block hover:translate-x-2 transition-transform duration-300">Privacy Policy</a></li>
                    <li><a href="#" className="text-slate-400 hover:text-amber-500 text-sm font-medium block hover:translate-x-2 transition-transform duration-300">Terms of Service</a></li>
                    <li><a href="#" className="text-slate-400 hover:text-amber-500 text-sm font-medium block hover:translate-x-2 transition-transform duration-300">Cookie Settings</a></li>
                    </ul>
                </div>
                <button onClick={scrollToTop} className="hidden md:flex mt-8 md:mt-0 self-start group items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    Back to Top
                    <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUp className="w-4 h-4" />
                    </div>
                </button>
            </div>

            <div className="order-4 col-span-2 md:col-span-3 md:px-8 md:border-r border-white/5 border-t border-white/5 md:border-t-0 pt-8 md:pt-0 mt-4 md:mt-0">
                <h4 className="font-['Syne'] font-bold text-white uppercase tracking-widest mb-6 text-xs opacity-50">Office</h4>
                <ul className="space-y-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 md:gap-0">
                    <li>
                    <span className="block text-[10px] text-purple-400 font-bold mb-1 tracking-wider">LOCATION</span>
                    <span className="text-slate-300 text-sm leading-relaxed block hover:text-white transition-colors">{COMPANY_INFO.address}</span>
                    </li>
                    <li>
                    <span className="block text-[10px] text-purple-400 font-bold mb-1 tracking-wider">INQUIRIES</span>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 text-sm hover:text-white transition-colors block">{COMPANY_INFO.email}</a>
                    </li>
                </ul>
                <button onClick={scrollToTop} className="flex md:hidden mt-8 w-full justify-between group items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-t border-white/5 pt-6">
                    Back to Top
                    <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUp className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-8 opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-slate-500 font-['Space_Grotesk'] uppercase tracking-widest">
              © {new Date().getFullYear()} KORDEN TECHNOLOGIES.
            </p>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-help">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-green-500 transition-colors">Systems Nominal</span>
                </div>
                <div className="hidden md:flex items-center gap-2 group cursor-help">
                   <Globe className="w-3 h-3 text-slate-500 group-hover:text-amber-500 transition-colors" />
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-amber-500 transition-colors">Mumbai, IN</span>
                </div>
            </div>
        </div>

      </div>
    </footer>
  );
});