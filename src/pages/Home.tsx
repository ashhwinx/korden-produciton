import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SectionTitle } from '../components/UI';
import { ChevronRight, Cpu, Globe, ShieldCheck, ArrowUpRight, Zap, Layers, Factory, Search, Plus, Minus, Lock, Server } from 'lucide-react';
import { SERVICES } from '../constants';
import HeroBackground from '../components/HeroBackground';

// --- IMPORTS FOR ANIMATION FIX ---
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register Plugin (Very Important)
gsap.registerPlugin(ScrollTrigger);

// --- GRAPHIC COMPONENTS ---
const SpotlightHeroText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !overlayRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 150; 
    const maskStyle = `radial-gradient(circle ${size}px at ${x}px ${y}px, transparent 10%, black 70%)`;
    overlayRef.current.style.webkitMaskImage = maskStyle;
    overlayRef.current.style.maskImage = maskStyle;
  };

  const handleMouseLeave = () => {
    if (overlayRef.current) {
      const fullVisible = 'linear-gradient(to right, black, black)';
      overlayRef.current.style.webkitMaskImage = fullVisible;
      overlayRef.current.style.maskImage = fullVisible;
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block cursor-default select-none ${className}`}
    >
      <div className="absolute inset-0 z-0 text-transparent [-webkit-text-stroke:2px_#F59E0B] font-extrabold tracking-tighter font-['Syne']">
        {children}
      </div>
      <div 
        ref={overlayRef}
        className="relative z-10 text-white transition-all duration-300 ease-out font-extrabold tracking-tighter font-['Syne']"
        style={{ WebkitMaskImage: 'linear-gradient(to right, black, black)', maskImage: 'linear-gradient(to right, black, black)' }}
      >
        {children}
      </div>
    </div>
  );
};

const GlobePulse = () => (
  <div className="relative w-full h-full flex items-center justify-center scale-75 md:scale-100 opacity-90 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_60%)]" />
    <div className="absolute w-[280px] h-[280px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
    <div className="absolute w-[240px] h-[240px] rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
    <div className="absolute w-[180px] h-[180px] rounded-full border-2 border-transparent border-t-amber-500/50 border-r-amber-500/30 animate-[spin_10s_linear_infinite_reverse]" />
    <div className="absolute w-[140px] h-[140px] rounded-full border border-white/10 animate-[pulse_3s_ease-in-out_infinite]" />
    <div className="relative z-10 w-32 h-32 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.3)]">
        <Globe className="w-16 h-16 text-slate-300 stroke-[1px]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
    </div>
    <div className="absolute w-[220px] h-[220px] animate-[spin_8s_linear_infinite]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_#F59E0B]" />
    </div>
     <div className="absolute w-[160px] h-[160px] animate-[spin_12s_linear_infinite_reverse] rotate-45">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]" />
    </div>
  </div>
);

const ScannerGrid = () => (
  <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#050505]/50 group-hover:bg-[#050505]/30 transition-colors">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:40px_40px] perspective-[500px] rotate-x-12 scale-150 opacity-40 animate-[gridMove_20s_linear_infinite]" />
    <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-amber-500/0 via-amber-500/10 to-amber-500/0 animate-[scan_3s_ease-in-out_infinite] z-0" />
    <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500/50 blur-[2px] animate-[scan_3s_ease-in-out_infinite] z-10 shadow-[0_0_20px_#F59E0B]" />
    <div className="relative z-20 flex flex-col items-center gap-6 transform group-hover:scale-105 transition-transform duration-500">
       <div className="relative">
          <div className="absolute inset-[-15px] border border-green-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse] border-t-transparent border-l-transparent" />
          <ShieldCheck className="w-24 h-24 text-purple-400/90 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]" strokeWidth={1} />
          <Lock className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" strokeWidth={2} />
       </div>
       <div className="flex flex-col gap-1 items-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
          <div className="flex gap-1">
             <div className="w-12 h-1 bg-green-500/50 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             <div className="w-2 h-1 bg-green-500/30 rounded-full"></div>
             <div className="w-2 h-1 bg-green-500/30 rounded-full"></div>
          </div>
           <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase animate-pulse">System Secure</span>
       </div>
    </div>
  </div>
);

const ChipFlow = () => (
   <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#9333EA 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="w-48 h-48 bg-black/80 backdrop-blur-xl border border-purple-500/30 relative flex items-center justify-center shadow-[0_0_60px_rgba(147,51,234,0.2)] rounded-2xl overflow-hidden group-hover:border-purple-500/60 transition-all duration-500">
         <div className="absolute inset-0">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-500/30"></div>
             <div className="absolute top-0 left-1/2 h-full w-[1px] bg-purple-500/30"></div>
             <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/5 rounded-lg"></div>
             <div className="absolute top-1/2 left-0 w-2 h-2 bg-amber-500 rounded-full animate-[ping_2s_linear_infinite]" />
         </div>
         <Cpu className="w-20 h-20 text-slate-100 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" strokeWidth={1} />
         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 shadow-[0_0_10px_#F59E0B]"></div>
         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 shadow-[0_0_10px_#F59E0B]"></div>
         <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500/50"></div>
         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500/50"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent">
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-[3px] bg-amber-500 blur-[3px] animate-[shimmer_2s_linear_infinite]" />
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-[1px] bg-white animate-[shimmer_2s_linear_infinite]" />
          </div>
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/40 to-transparent">
             <div className="absolute left-1/2 -translate-x-1/2 top-0 h-32 w-[3px] bg-amber-500 blur-[3px] animate-[shimmer_2.5s_linear_infinite]" />
             <div className="absolute left-1/2 -translate-x-1/2 top-0 h-20 w-[1px] bg-white animate-[shimmer_2.5s_linear_infinite]" />
          </div>
      </div>
   </div>
);

const VerticalAccordionItem: React.FC<{
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  Graphic: React.ComponentType;
  isActive: boolean;
  onActivate: (id: number) => void;
}> = ({ id, title, subtitle, desc, icon: Icon, Graphic, isActive, onActivate }) => {
  return (
    <div
      onClick={() => onActivate(id)}
      onMouseEnter={() => onActivate(id)}
      className={`relative w-full rounded-3xl overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group flex flex-col shrink-0
        ${isActive
          ? 'h-auto md:h-full md:flex-[3] border-amber-500/50 shadow-[0_0_50px_-10px_rgba(245,158,11,0.15)] bg-[#080808]' 
          : 'h-24 md:h-full md:flex-[0.8] border-white/5 bg-[#050505] hover:border-white/10 hover:bg-[#0a0a0a]' 
        }
      `}
    >
        <div className={`absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

        <div className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 border-b border-white/5 h-24 md:h-32 transition-colors duration-500 shrink-0">
            <div className="flex items-center gap-6 md:gap-10">
                <div className="relative">
                    <span className={`text-4xl md:text-6xl font-['Space_Grotesk'] font-bold transition-all duration-500 block ${
                        isActive 
                        ? 'text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600 scale-110' 
                        : 'text-transparent [-webkit-text-stroke:1px_rgba(100,116,139,0.5)] group-hover:[-webkit-text-stroke:1px_rgba(148,163,184,0.8)]'
                    }`}>
                        0{id}
                    </span>
                    {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-full blur-[4px] animate-pulse" />}
                </div>

                <div className="flex flex-col justify-center">
                    <h3 className={`text-xl md:text-3xl font-['Syne'] font-bold uppercase tracking-wide transition-all duration-500 ${
                        isActive ? 'text-white translate-x-2' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                        {title}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 ease-out ${isActive ? 'max-h-8 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-[1px] bg-amber-500"></div>
                          <span className="text-xs text-amber-500 font-bold tracking-[0.2em] uppercase">
                              {subtitle}
                          </span>
                      </div>
                    </div>
                </div>
            </div>

            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                isActive 
                ? 'border-amber-500 text-black rotate-180 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                : 'border-white/10 text-slate-600 bg-white/5 group-hover:border-white/30 group-hover:text-white'
            }`}>
                 {isActive && <div className="absolute inset-0 bg-amber-500" />}
                 <div className="relative z-10">
                    {isActive ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} />}
                 </div>
            </div>
        </div>

        <div className="relative z-10 flex-1 overflow-hidden">
             <div 
               className={`
                 relative md:absolute inset-0 
                 flex flex-col md:flex-row 
                 transition-all duration-700 delay-100 ease-out 
                 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 md:translate-y-8'}
               `}
               onClick={(e) => isActive && e.stopPropagation()} 
             >
                 <div className="flex-1 p-6 md:p-12 flex flex-col justify-center relative bg-gradient-to-r from-transparent to-black/20">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden md:block opacity-50"></div>
                    
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                          <Icon size={24} />
                       </div>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border-l border-slate-700 pl-3 ml-1">
                          Core Feature
                       </span>
                    </div>

                    <p className="text-slate-300 text-base md:text-xl leading-relaxed max-w-xl font-light">
                        {desc}
                    </p>
                    
                    <div className="mt-8 md:mt-14 pb-4 md:pb-0">
                      <button className="group/btn relative inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors pl-4">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-700 rounded-full group-hover/btn:bg-amber-500 transition-colors"></span>
                          Explore Capability
                          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300 text-amber-500" />
                      </button>
                    </div>
                 </div>
                 
                 <div className="w-full h-[300px] md:h-auto md:flex-1 bg-black/40 border-t md:border-t-0 md:border-l border-white/5 relative overflow-hidden backdrop-blur-sm shrink-0">
                     <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                     <div className="absolute inset-0 flex items-center justify-center p-8">
                        <Graphic />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-80 md:hidden pointer-events-none" />
                 </div>
             </div>
        </div>
    </div>
  );
}

// --- MAIN HOME COMPONENT ---
const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  
  // FIX: Using a ref to store active index for loop efficiency
  const activeIndexRef = useRef(0);
  const progressBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [activeService, setActiveService] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number>(1); 

  const handleAccordionActivate = (id: number) => {
    setActiveAccordion(id);
  };

  useLayoutEffect(() => {
    // Refs reset to keep clean
    progressBarsRef.current = progressBarsRef.current.slice(0, 4);

    // Context for Cleanup
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline();
      
      // Hero Animations
      gsap.fromTo(badgeRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      tl.fromTo(heroRef.current?.querySelector('h1'), 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(heroRef.current?.querySelector('p'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(heroRef.current?.querySelector('.hero-btns'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      // --- SERVICES SCROLL TRIGGER LOGIC ---
      if (scrollSectionRef.current) {
        ScrollTrigger.create({
          trigger: scrollSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
             const total = 4;
             const rawProgress = self.progress * total;
             const currentIndex = Math.floor(rawProgress);
             const safeIndex = Math.min(currentIndex, total - 1);
             
             // 1. UPDATE REACT STATE (Only if changed, to switch Content/Image)
             if (activeIndexRef.current !== safeIndex) {
                 activeIndexRef.current = safeIndex;
                 setActiveService(safeIndex);
             }

             // 2. ANIMATE PROGRESS BARS (Direct DOM, No React Renders)
             progressBarsRef.current.forEach((bar, idx) => {
               if (!bar) return;
               
               if (idx === safeIndex) {
                 // Current Bar: Fill based on scroll percent
                 const itemProgress = rawProgress - currentIndex;
                 const clamped = Math.max(0, Math.min(1, itemProgress));
                 
                 bar.style.width = `${clamped * 100}%`;
                 bar.style.opacity = '1';

               } else if (idx < safeIndex) {
                 // Past Bars: Full
                 bar.style.width = '100%';
                 bar.style.opacity = '1'; 
               } else {
                 // Future Bars: Empty
                 bar.style.width = '0%';
                 bar.style.opacity = '0.3';
               }
             });
          }
        });
      }
    }, scrollSectionRef); // Scope to section

    return () => ctx.revert(); // Cleanup on unmount

  }, []);

  const scrollToService = (index: number) => {
    if (!scrollSectionRef.current) return;
    const rect = scrollSectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top;
    const sectionHeight = scrollSectionRef.current.offsetHeight;
    const viewHeight = window.innerHeight;
    const start = scrollTop;
    const end = start + sectionHeight - viewHeight; 
    const progress = (index + 0.1) / 4; 
    
    window.scrollTo({
      top: start + (end - start) * progress,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full">
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-32 pb-40 px-4 overflow-hidden">
        <HeroBackground />
        
        <div ref={heroRef} className="max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10">
         
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl mt-8 font-bold leading-[0.9] mb-8 text-white flex flex-col items-center tracking-tighter w-full">
            <SpotlightHeroText>
              <span className="block">Powering the</span>
              <span className="block">Next Generation</span>
            </SpotlightHeroText>
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Delivering the advanced electronic components that drive modern industry. Your strategic partner for semiconductors, sensors, and next-gen supply chain solutions.
          </p>
          
          <div className="hero-btns flex flex-wrap gap-4 justify-center">
            <Link to="/products">
              <Button variant="primary" icon>Explore Products</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-[#020202] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <SectionTitle title="The Korden Advantage" subtitle="Why Choose Us" />
          <div 
            className="mt-16 flex flex-col gap-4 h-auto md:h-[700px] w-full"
            onMouseLeave={() => setActiveAccordion(0)}
          >
            <VerticalAccordionItem 
              id={1} title="Global Network" subtitle="Borderless Sourcing" desc="Access a vast, resilient network of tier-1 manufacturers across Asia and Europe. We eliminate regional bottlenecks and ensure continuous supply even in volatile markets."
              icon={Globe} Graphic={GlobePulse} isActive={activeAccordion === 1} onActivate={handleAccordionActivate}
            />
             <VerticalAccordionItem 
              id={2} title="Quality Assured" subtitle="Zero Compromise" desc="Rigorous anti-counterfeit testing in our certified labs guarantees 100% authenticity for every component. From microscopic inspection to functional testing, we verify everything."
              icon={ShieldCheck} Graphic={ScannerGrid} isActive={activeAccordion === 2} onActivate={handleAccordionActivate}
            />
             <VerticalAccordionItem 
              id={3} title="Market Intelligence" subtitle="Procurement First" desc="We optimize your Bill of Materials (BOM). Our market insights help you anticipate shortages, stabilize costs, and secure stock when others can't."
              icon={Cpu} Graphic={ChipFlow} isActive={activeAccordion === 3} onActivate={handleAccordionActivate}
            />
          </div>
        </div>
      </section>

      {/* Comprehensive Solutions - FIXED HEIGHT & SCROLL */}
      <section ref={scrollSectionRef} className="relative h-[600vh] bg-[#050505]">
         <div className="sticky top-0 h-screen w-full flex flex-col justify-center py-10 overflow-hidden">
           
           {/* Mobile Background */}
           <div className="absolute inset-0 md:hidden z-0">
             {SERVICES.slice(0, 4).map((service, index) => (
                 <div key={`mobile-bg-${index}`} 
                      className={`absolute inset-0 transition-opacity duration-700 ${activeService === index ? 'opacity-30' : 'opacity-0'}`}>
                    <img src={`https://picsum.photos/1000/800?random=${index + 100}`} className="w-full h-full object-cover grayscale" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-[#050505]/50" />
                 </div>
             ))}
           </div>

           <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20 animate-[spin_60s_linear_infinite] pointer-events-none"></div>
           <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20 animate-[spin_40s_linear_infinite_reverse] pointer-events-none"></div>

           <div className="max-w-7xl mx-auto w-full px-12 relative z-10 flex flex-col justify-center h-full">
              <div className="shrink-0 mb-4 ">
                  <SectionTitle title="Comprehensive Solutions" subtitle="Services" />
              </div>
              
              {/* CONTENT CONTAINER */}
              <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
                  
                  {/* Left: Interactive Control Panel */}
                  <div className="w-full md:w-1/3 flex flex-col gap-2 justify-center">
                      {SERVICES.slice(0, 4).map((service, index) => (
                          <div 
                              key={service.id}
                              onClick={() => scrollToService(index)}
                              className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 border relative overflow-hidden group shrink-0 ${
                                  activeService === index 
                                  ? 'bg-white/10 md:bg-white/5 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] translate-x-2' 
                                  : 'bg-black/40 md:bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                              }`}
                          >
                              {/* IMPORTANT FIX: 
                                  1. Added 'transition-none' to prevent CSS conflicts
                                  2. Using direct ref assignment
                              */}
                              <div 
                                ref={(el) => { progressBarsRef.current[index] = el; }}
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-purple-600 z-20 transition-none"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                              <div className="flex items-center justify-between relative z-10">
                                <h3 className={`text-xl font-bold font-['Space_Grotesk'] transition-colors ${activeService === index ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {service.title}
                                </h3>
                                {activeService === index && <ArrowUpRight className="w-6 h-6 text-amber-500" />}
                              </div>
                              
                              <p className={`text-sm mt-3 line-clamp-2 transition-colors duration-300 ${activeService === index ? 'text-slate-200' : 'text-slate-600'}`}>
                                  {service.description}
                              </p>
                          </div>
                      ))}
                      
                      <div className="mt-4 hidden md:block">
                          <Link to="/services">
                              <Button variant="outline" className="w-full text-sm">View All Services</Button>
                          </Link>
                      </div>
                  </div>

                  {/* Right: Holographic Display Viewport */}
                  <div className="md:w-2/3 relative rounded-3xl overflow-hidden border border-white/10 bg-[#020202] shadow-2xl min-h-[500px] hidden md:block">
                        <div className="absolute inset-0 pointer-events-none z-20 border border-white/5 rounded-3xl">
                           <div className="absolute top-8 right-8 flex gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           </div>
                        </div>

                        {SERVICES.slice(0, 4).map((service, index) => {
                            const IconsList = [Globe, Layers, Factory, Search];
                            const ActiveIcon = IconsList[index % IconsList.length];

                            return (
                              <div 
                                 key={service.id}
                                 className={`absolute inset-0 transition-all duration-700 ease-in-out ${activeService === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}
                              >
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                                  <img 
                                      src={`https://picsum.photos/1000/800?random=${index + 100}`} 
                                      alt={service.title}
                                      className="w-full h-full object-cover filter saturate-[0.8] contrast-[1.1]" 
                                  />
                                  
                                  <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 z-20">
                                      <div className="flex items-center gap-4 mb-4 lg:mb-6">
                                          <div className="inline-block px-3 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] lg:text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                                              Service Module 0{index + 1}
                                          </div>
                                          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                                      </div>

                                      <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 font-['Syne'] leading-tight drop-shadow-lg">
                                          {service.title}
                                      </h2>
                                      
                                      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                                          <p className="text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed drop-shadow-md">
                                              {service.description} Korden Technologies ensures top-tier quality control and seamless integration for your supply chain needs.
                                          </p>
                                          <div className="flex-shrink-0">
                                             <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                                <ActiveIcon size={32} strokeWidth={1.5} className="lg:w-10 lg:h-10" />
                                             </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            );
                        })}
                  </div>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Home;