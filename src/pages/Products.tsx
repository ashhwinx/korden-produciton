import React, { useState, useMemo } from 'react';
import { SectionTitle, Card, Button } from '../components/UI';
import { PRODUCTS } from '../constants';
import { ProductCategory } from '../types';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

// --- OPTIMIZED SUB-COMPONENT (Memoized) ---
// Isse search/filter karte waqt unnecessary re-renders nahi honge
const ProductCard = React.memo(({ product }: { product: any }) => (
  <motion.div 
    layout 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    className="h-full"
  >
    <Card className="group p-0 overflow-hidden flex flex-col h-full hover:border-amber-500/30 transition-colors duration-300 bg-[#121212]">
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 will-change-transform"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-black/70 backdrop-blur border border-white/10 text-amber-500 text-xs font-bold px-2 py-1 rounded shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">{product.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {product.specs.map((spec: string) => (
              <span key={spec} className="text-xs text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                {spec}
              </span>
          ))}
        </div>

        <div className="mt-auto">
          <Link to="/contact" className="w-full block">
            <Button variant="secondary" className="w-full text-sm py-2 hover:text-amber-500 hover:border-amber-500/50 transition-colors">
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  </motion.div>
));

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Object.values(ProductCategory)];

  // Optimized Filtering Logic
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      // Agar search empty hai to fast return true
      if (!query) return matchesCategory;
      
      const matchesSearch = product.name.toLowerCase().includes(query) || 
                            product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-[#020005]">
      
      {/* --- HERO SECTION WITH ANIMATION --- */}
      <motion.div 
        className="max-w-7xl mx-auto mb-12 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
             <SectionTitle title="Our Catalog" subtitle="Products" />
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-center">
          
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 scrollbar-hide mask-image-gradient">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                    ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transform scale-105' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-500/50 hover:text-amber-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search parts..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all shadow-sm placeholder-slate-600 focus:bg-white/10"
             />
          </div>
        </div>

        {/* Grid - using AnimatePresence for smooth filtering */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20"
          >
            <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="text-amber-500 mt-4 hover:underline font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;