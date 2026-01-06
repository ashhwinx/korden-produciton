import React, { useEffect, useRef, useMemo } from 'react';
import { SectionTitle } from '../components/UI';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap, Settings, Truck, Search, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion'; // Import Framer Motion

// --- CUSTOM CAPABILITIES MAPPING ---
const CAPABILITIES_MAP: Record<string, string[]> = {
  's1': ['Global Sourcing', 'Obsolete Part Tracking', 'Shortage Management', 'BOM Kitting'],
  's2': ['Server Racks', 'Cooling Systems', 'Power Distribution Units', 'Cable Management'],
  's3': ['JIT Delivery', 'Inventory Forecasting', 'Warehousing', 'Logistics Optimization'],
  's4': ['Visual Inspection', 'Decapsulation', 'X-Ray Analysis', 'Solderability Testing']
};

// --- OPTIMIZED SUB-COMPONENTS (Memoized to prevent Lag) ---

const ServiceCardHorizontal: React.FC<{ service: any; index: number }> = React.memo(({ service, index }) => {
  // @ts-ignore
  const IconComponent = Icons[service.icon] || Icons.HelpCircle;
  const capabilities = CAPABILITIES_MAP[service.id] || ['Quality Assurance', 'Rapid Delivery', 'Tech Support'];
  const isEven = index % 2 === 0;

  return (
    <div className="group relative w-full flex flex-col md:flex-row bg-[#121212] border border-white/15 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 shadow-xl shadow-black/50 hover:shadow-[0_0_50px_rgba(147,51,234,0.15)] service-card min-h-[400px] will-change-transform transform-gpu"> 
      
      {/* 1. VISUAL PANEL */}
      <div className={`relative w-full md:w-[45%] h-64 md:h-auto overflow-hidden border-b md:border-b-0 ${isEven ? 'md:order-1 md:border-r border-white/10' : 'md:order-2 md:border-l border-white/10'}`}>
         <img 
            src={`https://picsum.photos/800/600?random=${index + 20}`} 
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 filter saturate-[0.8] group-hover:saturate-100 brightness-90 group-hover:brightness-110"
            loading="lazy"
         />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 pointer-events-none mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

         <div className="absolute top-6 left-6 w-16 h-16 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white group-hover:text-amber-500 group-hover:border-amber-500/50 transition-all duration-500 shadow-xl group-hover:scale-110">
            <IconComponent size={32} strokeWidth={1.5} />
         </div>

         <div className="absolute -bottom-10 -right-4 text-[120px] font-bold font-['Syne'] text-white opacity-[0.05] select-none pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-500">
            0{index + 1}
         </div>
      </div>

      {/* 2. CONTENT PANEL */}
      <div className={`relative w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] ${isEven ? 'md:order-2' : 'md:order-1'}`}>
         
         <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-[2px] ${isEven ? 'bg-amber-500' : 'bg-purple-500'} transition-all duration-300 group-hover:w-20`} />
            <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Service Module 0{index + 1}</span>
         </div>

         <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-['Syne'] leading-[1.1] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
            {service.title}
         </h3>
         
         <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-light">
            {service.description} Korden Technologies integrates advanced logistics with component verification to ensure your production line never stops.
         </p>

         <div className="mb-10">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 opacity-80">Key Capabilities</h4>
            <div className="grid grid-cols-2 gap-3">
               {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400 group/item">
                     <div className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover/item:bg-amber-500 transition-colors" />
                     <span className="group-hover/item:text-slate-200 transition-colors">{cap}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
            <Link to="/contact" className="group/btn inline-flex items-center gap-3 text-white font-bold font-['Space_Grotesk'] tracking-wide uppercase text-sm hover:text-amber-500 transition-colors">
               <span>Initialize Request</span>
               <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-amber-500 group-hover/btn:bg-amber-500/10 transition-all">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:-rotate-45" />
               </div>
            </Link>
            <Activity className="w-5 h-5 text-slate-700 group-hover:text-green-500 transition-colors" />
         </div>

      </div>
    </div>
  );
});

const ProcessStep: React.FC<{ number: string; title: string; desc: string; icon: React.ElementType }> = React.memo(({ number, title, desc, icon: Icon }) => (
    <div className="relative p-8 rounded-3xl bg-[#121212] border border-white/10 
      transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform 
      hover:border-white/20 group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]">
       
       <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-[1px] bg-white/10 z-0 group-last:hidden" />
       
       <div className="relative z-10 flex flex-col h-full">
           <div className="flex justify-between items-start mb-6">
               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 
                 transition-all duration-300 group-hover:text-amber-500 group-hover:scale-110 
                 border border-white/10 group-hover:border-amber-500/30">
                  <Icon size={28} />
               </div>
               <span className="text-4xl font-['Syne'] font-bold text-white/5 group-hover:text-white/10 transition-colors select-none">
                  {number}
               </span>
           </div>
           
           <h4 className="text-xl font-bold text-white mb-3 font-['Syne']">{title}</h4>
           <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
       </div>
    </div>
));

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- FRAMER MOTION VARIANTS ---
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const heroItemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 1
      }
    }
  };

  return (
    <div ref={containerRef} className="bg-[#020005] min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* HERO SECTION (Animated with Framer Motion) */}
      <motion.div 
        className="max-w-7xl mx-auto mb-24 text-center relative z-10"
        initial="hidden"
        whileInView="visible" // Runs when scrolled into view
        viewport={{ once: true, margin: "-100px" }} // Runs once
        variants={heroContainerVariants}
      >
         <motion.div variants={heroItemVariants}>
            <SectionTitle title="Operational Excellence" subtitle="Our Expertise" />
         </motion.div>
         
         <motion.p 
            variants={heroItemVariants}
            className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed font-['Space_Grotesk']"
         >
            We deliver end-to-end supply chain solutions tailored for the high-stakes electronics industry. Precision, speed, and reliability are engineered into every service we offer.
         </motion.p>
      </motion.div>

      {/* HORIZONTAL CARD LIST */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-16 service-list relative z-10 mb-40">
        {SERVICES.map((service, index) => (
          <ServiceCardHorizontal key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* PROCESS SECTION */}
      <div className="relative py-32 border-t border-white/5 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto px-4">
             <div className="mb-20 text-center">
                <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Workflow</span>
                <h2 className="text-4xl md:text-6xl font-bold text-white font-['Syne'] mb-6">How We Execute</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto rounded-full" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                <div className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent border-t border-dashed border-white/10 z-0"></div>

                <ProcessStep 
                   number="01" title="Consultation" 
                   desc="We analyze your BOM and production timeline to identify critical path components." icon={Search}
                />
                 <ProcessStep 
                   number="02" title="Sourcing" 
                   desc="Leveraging our global network to secure authentic parts at competitive rates." icon={Settings}
                />
                 <ProcessStep 
                   number="03" title="Verification" 
                   desc="Rigorous QA testing in our labs to ensure every component meets spec." icon={CheckCircle2}
                />
                 <ProcessStep 
                   number="04" title="Delivery" 
                   desc="Secure packaging and expedited logistics to get parts to your line." icon={Truck}
                />
             </div>
         </div>
      </div>

      {/* FINAL CTA */}
      <div className="mt-24 max-w-6xl mx-auto px-4 relative z-20">
        <div className="relative group w-full overflow-hidden rounded-[3rem] border border-white/10 bg-[#080808] transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-15px_rgba(147,51,234,0.15)]">
            
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />
            
            <div className="absolute top-6 left-8 w-4 h-4 border-l-2 border-t-2 border-slate-600 opacity-50 group-hover:border-amber-500 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute top-6 right-8 w-4 h-4 border-r-2 border-t-2 border-slate-600 opacity-50 group-hover:border-purple-500 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute bottom-6 left-8 w-4 h-4 border-l-2 border-b-2 border-slate-600 opacity-50 group-hover:border-purple-500 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute bottom-6 right-8 w-4 h-4 border-r-2 border-b-2 border-slate-600 opacity-50 group-hover:border-amber-500 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-20">
                
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-300">Custom Engineering</span>
                    </div>

                    <h3 className="text-4xl md:text-6xl font-bold text-white font-['Syne'] leading-tight mb-6">
                        Need a specialized <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-amber-400 animate-gradient-x">
                            Solution?
                        </span>
                    </h3>
                    
                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                        Standard catalogs don't cover every edge case. Our engineering team builds custom procurement strategies tailored to your exact technical specifications.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-8 shrink-0">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-xl" />
                        <div className="relative w-full h-full bg-[#151515] border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                           <img src="/logo.png" alt="korden Logo" className="w-10 h-14 group-hover:text-amber-500 transition-colors duration-500" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                        </div>
                    </div>

                    <Link to="/contact">
                        <button className="group relative px-8 py-4 bg-white text-black font-bold font-['Space_Grotesk'] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                           <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                           <div className="relative z-10 flex items-center gap-3">
                               <span>Start Consultation</span>
                               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </div>
                        </button>
                    </Link>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
};

export default Services;