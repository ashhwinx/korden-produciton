import { ProductCategory } from './types';
import type { Product, ServiceItem, NavLink } from './types';
import { Cpu, Factory, Globe, Zap, Microchip, Layers, Wifi, Battery, Search } from 'lucide-react';

export const COMPANY_INFO = {
  name: "Korden Technologies",
  address: "B/2402, 24th Floor, Tulsi Tower, M.G road, Goregaon West, Mumbai, Maharashtra 400104",
  email: "sales@korden.tech",
  phone: "+91 98765 43210",
  whatsapp: "+91 84529 88088",
  founded: "2024"
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'High Performance Interconnects',
    description: 'Connectivity is the single most common point of failure in industrial environments. We source and stock rugged, high-reliabilityinterconnects designed to withstand vibration, moisture (IP67/68), and EMI interference. Whether you need Mil-Spec circular connectors for a defense chassis or high-speed M12 data cables for AMR sensors, we secure the exact pin configurations that standard distributors often leave on backorder.',
    icon: 'Globe'
  },
  {
    id: 's2',
    title: 'Data Center Solutions',
    description: 'High-performance infrastructure sourcing, including Servo Motors, cooling systems, and power management units for enterprise data centers.',
    icon: 'Layers'
  },
  {
    id: 's3',
    title: 'Unified Automation Kits',
    description: 'Stop managing 5 different vendors for one machine. We consolidate your Motion and Control hardware into a single,pre-validated SKU.From Servo Motors and Drives to PLCs and HMIs, receive your complete "Retrofit Kit" in one shipment, ready for immediate installation. We simplify your Bill of Materials so you can focus on assembly.',
    icon: 'Factory'
  },
  {
    id: 's4',
    title: 'Industrial Computing & Edge AI',
    description: 'Powering the intelligence of modern machinery. We source and stock rugged, fanless Industrial PCs (IPCs) and AI Inference Systems designed for harsh environments. Whether you need high-processing power for AI Visual Inspection or vibration-resistant computing for Defense & AMRs, we secure the specific configurations that standard IT vendors cannot supply.',
    icon: 'Search'
  }
];

// Helper to generate products
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categories = Object.values(ProductCategory);
  
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    products.push({
      id: `prod-${i}`,
      name: `K-Tech ${category.split(' ')[0]} Series ${100 + i}`,
      category: category,
      description: `High-performance ${category.toLowerCase()} solution for industrial and consumer electronics. Designed for durability and efficiency.`,
      image: `https://picsum.photos/400/300?random=${i}`,
      specs: ['Industrial Grade', 'RoHS Compliant', 'High Efficiency']
    });
  }
  return products;
};

export const PRODUCTS = generateProducts();