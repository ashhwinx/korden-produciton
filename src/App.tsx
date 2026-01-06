import React, { useEffect, useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import FuturisticBackground from './components/FuturisticBackground';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Contact from './pages/Contact';

// 1. Import Lenis and GSAP
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to avoid bugs
gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Native scroll reset works well with Lenis intercepting it
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  
  // --- LENIS SETUP START ---
  useLayoutEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // The "heaviness" of the scroll (higher = smoother/slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      orientation: 'vertical', 
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // 2. Connect Lenis to GSAP ScrollTrigger
    // This updates ScrollTrigger positions whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Sync GSAP Ticker with Lenis RAF (Request Animation Frame)
    // This is the MAGIC part that makes animations lag-free
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time to ms
    });

    // 4. Disable GSAP lag smoothing to ensure instant sync
    gsap.ticker.lagSmoothing(0);

    // Cleanup function
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);
  // --- LENIS SETUP END ---

  return (
    <HashRouter>
      <div className="relative min-h-screen text-slate-100 selection:bg-purple-500/30 selection:text-amber-400">
        <CustomCursor />
        <FuturisticBackground />
        <Navbar />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;