import React, { useState } from 'react';
import { SectionTitle } from '../components/UI';
import { COMPANY_INFO } from '../constants';
import { Mail, Phone, Check, Copy, MessageCircle, ArrowUpRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTANT TYPE FIX ---
import type { Variants } from 'framer-motion';

// --- ANIMATION VARIANTS (Fixed with explicit Types) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
};

// --- COMPONENTS ---

interface ActionCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  href?: string;
  isMap?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = React.memo(({ label, value, icon: Icon, href, isMap }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Content = () => (
    <>
      <div className="flex items-center gap-5 overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors border border-white/5 shrink-0">
          <Icon size={20} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</span>
          <span className="text-white font-medium font-['Space_Grotesk'] text-lg group-hover:text-amber-500 transition-colors truncate pr-4">{value}</span>
        </div>
      </div>
      
      <div className="text-slate-600 group-hover:text-white transition-colors shrink-0">
        {href ? (
          <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        ) : (
          <AnimatePresence mode='wait'>
            {copied ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={20} className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );

  const cardClass = "group flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.08] cursor-pointer transition-all duration-300 relative overflow-hidden w-full will-change-transform";

  if (href) {
    return (
      <motion.a 
        href={href} 
        target={isMap ? "_blank" : "_self"}
        rel={isMap ? "noreferrer" : undefined}
        className={cardClass}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Content />
      </motion.a>
    );
  }

  return (
    <motion.div 
      onClick={handleCopy} 
      className={cardClass}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Content />
    </motion.div>
  );
});

const WhatsAppHero = React.memo(() => (
  <motion.a
    href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
    target="_blank"
    rel="noreferrer"
    className="relative group w-full p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#25D366] to-[#075E54] overflow-hidden border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 will-change-transform"
    variants={itemVariants}
    whileHover={{ scale: 1.01, boxShadow: "0 20px 60px -15px rgba(37,211,102,0.4)" }}
    whileTap={{ scale: 0.99 }}
  >
      <div className="absolute -right-20 -top-20 text-white/10 rotate-12 transform group-hover:rotate-0 transition-transform duration-700 ease-out pointer-events-none">
          <MessageCircle size={350} fill="currentColor" />
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Priority Support</span>
          </div>
          
          <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white font-['Syne'] mb-3 leading-tight">
                  Chat on WhatsApp
              </h3>
              <p className="text-white/90 text-lg font-medium max-w-md leading-relaxed">
              Skip the email backlog. Connect directly with a Sourcing Lead to fast-track your quote and lock in stock availability <br/>
                  <span className="opacity-75 text-sm">Typical response time: Under 5 minutes.</span>
              </p>
          </div>
      </div>

      <div className="relative z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white text-[#075E54] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
              <ArrowUpRight size={40} strokeWidth={2.5} />
          </div>
      </div>
  </motion.a>
));

const Contact: React.FC = () => {
  const locationText = "Mumbai, Maharashtra, India";
  // Fixed Google Maps URL Syntax
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#020005] relative overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        className="max-w-5xl mx-auto w-full relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        <motion.div className="mb-16 text-center" variants={itemVariants}>
            <SectionTitle title="Initiate Transmission" subtitle="Get in Touch" />
        </motion.div>

        <div className="flex flex-col gap-6">
          <WhatsAppHero />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard 
                label="Direct Line" 
                value={COMPANY_INFO.phone} 
                icon={Phone} 
                href={`tel:${COMPANY_INFO.phone}`}
              />
              <ActionCard 
                label="SUBMIT BILL OF MATERIALS (BOM)" 
                value={COMPANY_INFO.email} 
                icon={Mail} 
                href={`mailto:${COMPANY_INFO.email}`}
              />
          </div>

          <div className="grid grid-cols-1">
              <ActionCard 
                label="HQ Location" 
                value={locationText}
                icon={MapPin} 
                href={googleMapsUrl}
                isMap={true}
              />
          </div>
        </div>

        <motion.p 
          className="text-center text-slate-500 text-sm mt-12 font-['Space_Grotesk']"
          variants={itemVariants}
        >
           Available Mon-Sat, 9:00 AM - 8:00 PM IST
        </motion.p>

      </motion.div>
    </div>
  );
};

export default Contact;