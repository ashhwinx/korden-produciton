import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { SectionTitle } from '../components/UI';
import { COMPANY_INFO } from '../constants';
import { Target, TrendingUp, Users, Globe, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importing Framer Motion

// --- TYPES ---
interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface Cell {
    x: number;
    y: number;
    type: number;
    rotation: number;
    targetRotation: number;
    scale: number;
    opacity: number;
}

// --- SUB-COMPONENTS ---

const ValueCard: React.FC<ValueCardProps> = React.memo(({ icon: Icon, title, desc }) => (
  <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] overflow-hidden flex flex-col h-full will-change-transform">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 flex flex-col flex-grow">
      <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 text-slate-300 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300 shadow-inner">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 font-['Syne']">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
  </div>
));

const StatItem: React.FC<{ label: string; value: string; suffix?: string }> = React.memo(({ label, value, suffix = "" }) => (
   <div className="flex flex-col items-center justify-center p-6 border-r border-white/5 last:border-0 group cursor-default">
      <div className="text-4xl md:text-6xl font-bold text-white font-['Syne'] mb-2 flex items-baseline group-hover:scale-110 transition-transform duration-300 origin-bottom will-change-transform">
         {value}<span className="text-amber-500 text-2xl md:text-3xl ml-1">{suffix}</span>
      </div>
      <div className="text-xs md:text-sm text-slate-500 uppercase tracking-[0.2em] font-['Space_Grotesk'] group-hover:text-purple-400 transition-colors">{label}</div>
   </div>
));

// --- OPTIMIZED SCHEMATIC GRID (Same Performance Logic) ---
const SchematicGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;
    const CELL_SIZE = 40; 
    const MOUSE_RADIUS = 200;
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS; 
    const mouse = { x: -1000, y: -1000 };

    const init = () => {
        if (canvas.parentElement) {
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }
        if (cellsRef.current.length === 0 || Math.abs((width/CELL_SIZE)*(height/CELL_SIZE) - cellsRef.current.length) > 50) {
            cellsRef.current = [];
            const cols = Math.ceil(width / CELL_SIZE);
            const rows = Math.ceil(height / CELL_SIZE);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    cellsRef.current.push({
                        x: i * CELL_SIZE + CELL_SIZE/2,
                        y: j * CELL_SIZE + CELL_SIZE/2,
                        type: Math.floor(Math.random() * 4),
                        rotation: 0,
                        targetRotation: Math.floor(Math.random() * 4) * (Math.PI/2),
                        scale: 1,
                        opacity: 0.05
                    });
                }
            }
        }
    };

    const drawShape = (ctx: CanvasRenderingContext2D, type: number, size: number) => {
        ctx.beginPath();
        const s = size / 2;
        switch(type) {
            case 0: ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(0, -s); ctx.lineTo(0, s); break;
            case 1: ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2); break;
            case 2: ctx.moveTo(-s, -s/2); ctx.lineTo(-s, -s); ctx.lineTo(-s/2, -s); ctx.moveTo(s, s/2); ctx.lineTo(s, s); ctx.lineTo(s/2, s); break;
            case 3: ctx.rect(-s/4, -s/4, s/2, s/2); break;
        }
        ctx.stroke();
    };

    const animate = () => {
        if (!isVisible) {
             animationId = requestAnimationFrame(animate);
             return;
        }
        ctx.clearRect(0, 0, width, height);
        const cells = cellsRef.current;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const dx = mouse.x - cell.x;
            const dy = mouse.y - cell.y;
            const distSq = dx*dx + dy*dy;
            let active = false;
            
            if (distSq < MOUSE_RADIUS_SQ) {
                active = true;
                const dist = Math.sqrt(distSq);
                const intensity = 1 - (dist / MOUSE_RADIUS);
                cell.opacity = 0.1 + (intensity * 0.8);
                cell.scale = 1 + (intensity * 0.5);
                cell.targetRotation += 0.02; 
            } else {
                if (cell.opacity > 0.051) cell.opacity += (0.05 - cell.opacity) * 0.1;
                if (cell.scale > 1.01) cell.scale += (1 - cell.scale) * 0.1;
            }
            cell.rotation += (cell.targetRotation - cell.rotation) * 0.1;
            if (cell.opacity < 0.01) continue; 

            ctx.save();
            ctx.translate(cell.x, cell.y);
            ctx.rotate(cell.rotation);
            ctx.scale(cell.scale, cell.scale);
            
            if (active) {
                 ctx.strokeStyle = `rgba(245, 158, 11, ${cell.opacity})`;
                 ctx.lineWidth = 1.5;
            } else {
                 ctx.strokeStyle = `rgba(255, 255, 255, ${cell.opacity})`;
                 ctx.lineWidth = 1;
            }
            drawShape(ctx, cell.type, CELL_SIZE * 0.6);
            ctx.restore();
        }
        animationId = requestAnimationFrame(animate);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(init, 200); };
    const handleMouseMove = (e: MouseEvent) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    init();
    window.addEventListener('resize', handleResize);
    const parent = canvas.parentElement;
    if (parent) { parent.addEventListener('mousemove', handleMouseMove); parent.addEventListener('mouseleave', handleMouseLeave); }
    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        if (parent) { parent.removeEventListener('mousemove', handleMouseMove); parent.removeEventListener('mouseleave', handleMouseLeave); }
        cancelAnimationFrame(animationId);
    };
  }, [isVisible]); 

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};


const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion Variants (Simple & Reliable)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each text element
        delayChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  // Keep GSAP ONLY for Scroll Effects (Parallax & Stats)
  useLayoutEffect(() => {
    // @ts-ignore
    if(!window.gsap || !window.ScrollTrigger) return;
    
    // @ts-ignore
    const ctx = window.gsap.context(() => {
        // Image Parallax
        // @ts-ignore
        window.gsap.to(".about-image", {
            scrollTrigger: {
                trigger: ".about-image-container",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: -50,
            scale: 1.05,
            force3D: true
        });
        
        // Stats Count up
        // @ts-ignore
        window.gsap.from(".stat-strip", {
            scrollTrigger: {
               trigger: ".stat-strip",
               start: "top 85%"
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power2.out"
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#020005] min-h-screen pt-32 pb-20 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none translate-z-0" />
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-900/5 blur-[100px] rounded-full pointer-events-none translate-z-0" />

       {/* HERO */}
       <div className="max-w-7xl mx-auto px-4 mb-32 relative z-10">
          <motion.div 
            className="max-w-5xl"
            initial="hidden"
            whileInView="visible" // Triggers when in view (or use 'animate' for page load)
            viewport={{ once: true }}
            variants={containerVariants}
          >
             {/* 1. Tagline */}
             <motion.div variants={textVariants} className="mb-6">
                <span className="inline-block text-amber-500 font-bold tracking-[0.3em] uppercase text-xs md:text-sm pl-1 border-l-2 border-amber-500 pl-4">
                    Who We Are
                </span>
             </motion.div>
             
             {/* 2. Main Title */}
             <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] font-['Syne'] mb-10 tracking-tighter">
                <div className="overflow-hidden">
                    <motion.span variants={textVariants} className="block">Architects of</motion.span>
                </div>
                <div className="overflow-hidden">
                    <motion.span variants={textVariants} className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)] opacity-80">Supply Chains.</motion.span>
                </div>
             </h1>
             
             {/* 3. Description */}
             <div className="overflow-hidden">
                 <motion.p variants={textVariants} className="text-lg md:text-2xl text-slate-400 max-w-3xl leading-relaxed font-light font-['Space_Grotesk']">
                    Bridging the gap between global semiconductor innovation and local manufacturing reality. We don't just ship parts; we engineer reliability for the next generation of Indian hardware.
                 </motion.p>
             </div>
          </motion.div>
       </div>

       {/* STATS STRIP */}
       <div className="stat-strip border-y border-white/5 bg-white/[0.02] backdrop-blur-sm mb-32 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-white/5">
             <StatItem label="Support & Sourcing" value="24/7" suffix="+" />
             <StatItem label="Supplier Network" value="Global" suffix="" />
             <StatItem label="Sourcing Partners" value="Tier-1" suffix="" />
             <StatItem label="Client Trust" value="100" suffix="%" />
          </div>
       </div>

       {/* IMAGE & STORY SPLIT */}
       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32 relative z-10">
           {/* Image Container */}
           <div className="about-image-container relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl transform-gpu">
               <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0" />
               <img 
                 src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000" 
                 alt="Server Room" 
                 className="about-image w-full h-[120%] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000 will-change-transform"
               />
               {/* Overlay Data */}
               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                  <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-white">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                          <span className="text-sm font-mono tracking-widest uppercase text-green-400">System Nominal</span>
                      </div>
                      <h4 className="text-white font-bold text-lg">India Operations Hub</h4>
                      <p className="text-slate-400 text-xs uppercase tracking-wider">Coordinates: 19.1136° N, 72.8697° E</p>
                  </div>
               </div>
               
               <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-white/30 z-20" />
               <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-white/30 z-20" />
           </div>

           {/* Narrative Text */}
           <div className="space-y-12">
               <div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 font-['Syne']">The Korden Philosophy</h3>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-purple-600 rounded-full mb-8" />
                  
                  <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
                    <p>
                        In an era where a single missing capacitor can halt an entire production line, <span className="text-white font-medium">reliability is the only currency that matters</span>.
                    </p>
                    <p>
                        Founded in {COMPANY_INFO.founded}, Korden Technologies emerged from a simple observation: the Indian electronics manufacturing sector needed a partner, not just a vendor. A partner who understands that "Just-in-Time" isn't a buzzword it's a survival strategy.
                    </p>
                    <p>
                        We leverage data-driven logistics and deep supplier relationships to navigate the volatility of the global component market, ensuring your innovation never stalls.
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10 pt-8">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                          <Globe size={20} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold mb-1 font-['Syne']">Global Reach</h4>
                          <p className="text-sm text-slate-500 leading-snug">Sourcing from authorized distributors across 3 continents.</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                          <ShieldCheck size={20} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold mb-1 font-['Syne']">100% Genuine</h4>
                          <p className="text-sm text-slate-500 leading-snug">Vetted Supply Chain process for every batch.</p>
                      </div>
                  </div>
               </div>
           </div>
       </div>

       {/* VALUES GRID */}
       <div className="max-w-7xl mx-auto px-4 mb-32 relative z-10">
           <SectionTitle title="Core Principles" subtitle="Our DNA" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               <ValueCard 
                  icon={Target}
                  title="Precision"
                  desc="We treat logistics with the same precision as engineering. Right part, right place, right time. No excuses."
               />
               <ValueCard 
                  icon={Users}
                  title="Partnership"
                  desc="We don't aim for transactions. We aim for deep integration into your workflow as a trusted strategic ally."
               />
               <ValueCard 
                  icon={Zap}
                  title="Agility"
                  desc="Markets change. Production schedules shift. We adapt instantly, using predictive sourcing to keep your lines running."
               />
           </div>
       </div>
       
       {/* CTA - Big Bold Finish with Interactive Background */}
       <div className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
           {/* Schematic Grid */}
           <SchematicGridBackground />
           
           {/* Vignette Overlay */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020005_85%)] pointer-events-none" />
           
           <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
               
               <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 font-['Syne'] leading-tight relative drop-shadow-xl">
                  Ready to upgrade your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">supply chain?</span>
               </h2>
               
               <Link to="/contact">
                 <button className="relative group px-12 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                    <span className="relative z-10 font-['Space_Grotesk'] tracking-wide">START THE CONVERSATION</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </button>
               </Link>
           </div>
       </div>

    </div>
  );
};

export default About;