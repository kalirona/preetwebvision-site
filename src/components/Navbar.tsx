import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ArrowRight, ChevronDown, Search, Target, Share2, Bot, 
  Layout, Mail, Sparkles, Shield, Users, Zap, ShoppingBag, Code2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SERVICES, BLOG_POSTS } from '../constants';

const MAIN_SERVICES_MEGA_MENU = [
  {
    id: 'web-design',
    title: 'Website Design & Development',
    slug: 'web-design',
    path: '/services/web-design',
    icon: Layout,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    desc: 'Custom high-performance websites, WordPress development, landing pages, and responsive design engineered for speed and conversions.',
    highlights: ['Custom Web Development', 'WordPress Solutions', 'Landing Pages', 'Website Redesign']
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-development',
    path: '/services/ecommerce-development',
    icon: ShoppingBag,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    desc: 'Shopify, WooCommerce, and custom e-commerce platforms designed to maximize AOV, reduce cart abandonment, and scale revenue.',
    highlights: ['Shopify Development', 'WooCommerce Stores', 'Payment Integration', 'Store Migration']
  },
  {
    id: 'seo',
    title: 'SEO Services',
    slug: 'seo',
    path: '/services/seo',
    icon: Search,
    color: 'text-[#FFB347]',
    bg: 'bg-[#FFB347]/10',
    desc: 'Technical SEO, local search domination, keyword strategy, and content optimization for sustainable organic growth.',
    highlights: ['Local SEO', 'Technical Audits', 'E-commerce SEO', 'Link Building']
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    slug: 'google-ads',
    path: '/services/google-ads',
    icon: Target,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    desc: 'High-ROAS Google Search, Performance Max, and Shopping campaigns engineered for maximum conversion efficiency.',
    highlights: ['Search & PMax', 'Shopping Ads', 'Conversion Tracking', 'Landing Page Optimization']
  },
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    slug: 'social-media',
    path: '/services/social-media',
    icon: Share2,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    desc: 'Strategic social media management, content creation, community engagement, and paid social campaigns across all major platforms.',
    highlights: ['Content Strategy', 'Paid Social Ads', 'Community Management', 'Analytics & Reporting']
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    slug: 'ai-automation',
    path: '/services/ai-automation',
    icon: Bot,
    color: 'text-[#FFB347]',
    bg: 'bg-[#FFB347]/10',
    desc: 'Workflow automation, CRM integration, email sequences, and API connections that eliminate repetitive manual tasks.',
    highlights: ['Workflow Automation', 'CRM Automation', 'Email Automation', 'API Integrations']
  },
  {
    id: 'ai-agents',
    title: 'AI Agents for Businesses',
    slug: 'ai-agents',
    path: '/services/ai-agents',
    icon: Zap,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    desc: 'Custom AI chatbots, voice agents, customer support automation, and sales assistants trained on your business data.',
    highlights: ['AI Chatbots', 'Voice Agents', 'AI Sales Agents', 'WhatsApp Bots']
  },
  {
    id: 'web-apps',
    title: 'Web Application Development',
    slug: 'web-apps',
    path: '/services/web-apps',
    icon: Code2,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    desc: 'Custom SaaS platforms, CRM systems, admin dashboards, and AI-powered web applications built with modern frameworks.',
    highlights: ['SaaS Development', 'CRM & ERP Systems', 'Admin Dashboards', 'API Development']
  }
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const { pathname } = useLocation();

  // Search states
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [allPosts, setAllPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchPostsForSearch = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllPosts(data);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic posts for search index:", err);
      }
      setAllPosts(BLOG_POSTS);
    };
    fetchPostsForSearch();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SERVICES.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.features.some(f => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredBlogPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [searchQuery, allPosts]);

  const timeoutRef = React.useRef<any>(null);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const defaultNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', dropdown: true },
    { name: 'Portfolio', path: '/case-studies' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Tools', path: '/tools' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans",
        scrolled 
          ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF9D00] rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-[#FF6B00]/30 transition-all duration-300 group-hover:scale-105">
              P
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-[#FF6B00] transition-colors block leading-tight">
                Preet Web Vision
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFB347] block font-mono">
                AI Growth Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {defaultNavLinks.map((link) => (
              <div 
                key={link.name} 
                className={cn(
                  "group/nav",
                  link.dropdown ? "" : "relative"
                )}
                onMouseEnter={() => link.dropdown && handleMouseEnter(link.name)}
                onMouseLeave={() => link.dropdown && handleMouseLeave()}
              >
                {link.dropdown ? (
                  <button 
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer",
                      activeDropdown === link.name || pathname.startsWith(link.path) 
                        ? "text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30" 
                        : "text-[#BFBFBF] hover:text-[#FF6B00] hover:bg-white/5"
                    )}
                  >
                    {link.name} 
                    <ChevronDown size={11} className={cn("transition-transform duration-300", activeDropdown === link.name ? "rotate-180" : "")} />
                  </button>
                ) : (
                  <NavLink 
                    to={link.path}
                    className={({ isActive }) => cn(
                      "px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all block",
                      isActive 
                        ? "text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30" 
                        : "text-[#BFBFBF] hover:text-[#FF6B00] hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </NavLink>
                )}

                {/* MEGA MENU CONTAINER */}
                {link.dropdown && (
                  <div 
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 origin-top z-[70]",
                      activeDropdown === link.name ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
                    )}
                  >
                    <div className="bg-[#121212]/98 border border-white/10 shadow-[0_40px_100px_rgba(255,107,0,0.15)] rounded-[2.5rem] p-8 w-[95vw] max-w-[1240px] grid grid-cols-12 gap-8 backdrop-blur-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 via-transparent to-transparent pointer-events-none" />

                      {/* Left: Main Services Grid (8 cols) */}
                      <div className="col-span-8 relative z-10">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                            <h4 className="font-mono font-black text-xs uppercase tracking-[0.2em] text-[#FFB347]">
                              MAIN SERVICES & AGENCY CAPABILITIES
                            </h4>
                          </div>
                          <Link 
                            to="/services" 
                            onClick={() => setActiveDropdown(null)}
                            className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] hover:text-[#FF9D00] flex items-center gap-1 font-mono group/all"
                          >
                            <span>Explore Service Hub</span> 
                            <ArrowRight size={10} className="group-hover/all:translate-x-1 transition-transform" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {MAIN_SERVICES_MEGA_MENU.map((service) => {
                            const ServiceIcon = service.icon;
                            return (
                              <Link
                                key={service.id}
                                to={service.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group/item p-3.5 rounded-2xl bg-[#161616]/60 hover:bg-[#161616] border border-white/5 hover:border-[#FF6B00]/40 transition-all duration-200 block relative overflow-hidden"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110", service.bg, service.color)}>
                                    <ServiceIcon size={18} />
                                  </div>
                                  <div>
                                    <h5 className="font-extrabold text-[12px] text-white group-hover/item:text-[#FF6B00] uppercase tracking-tight mb-1 flex items-center gap-1.5 transition-colors">
                                      {service.title}
                                      <ArrowRight size={11} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all text-[#FF6B00]" />
                                    </h5>
                                    <p className="text-[10px] text-[#BFBFBF] font-normal leading-relaxed line-clamp-2">
                                      {service.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {service.highlights.slice(0, 2).map((h, idx) => (
                                        <span key={idx} className="text-[8px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/5 text-[#8B8B8B]">
                                          {h}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Featured Spotlight Audit Card (4 cols) */}
                      <div className="col-span-4 bg-[#161616] text-white rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden group/audit shadow-2xl border border-white/10 z-10">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6B00]/20 rounded-full blur-3xl group-hover/audit:bg-[#FF6B00]/30 transition-all duration-500 pointer-events-none" />

                        <div>
                          <span className="px-3 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FFB347] text-[9px] font-bold uppercase tracking-wider rounded-full inline-block mb-4 font-mono">
                            FREE AGENCY AUDIT
                          </span>
                          <h5 className="text-xl font-black tracking-tighter uppercase leading-tight mb-3">
                            DOMINATE YOUR <br /><span className="text-[#FF6B00]">MARKET NICHES</span>.
                          </h5>
                          <p className="text-[#BFBFBF] text-[11px] font-medium leading-relaxed mb-6">
                            Receive a complimentary 100+ point technical roadmap covering search rankings, Core Web Vitals, and conversion optimization opportunities.
                          </p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#BFBFBF]">
                              <Shield size={12} className="text-emerald-400" />
                              <span>Zero Commitment Required</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#BFBFBF]">
                              <Zap size={12} className="text-[#FFB347]" />
                              <span>Delivered in 24 Hours</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/contact"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] hover:from-[#FF9D00] hover:to-[#FF6B00] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#FF6B00]/25 group/btn"
                        >
                          <span>Claim Strategy Audit</span>
                          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
             <button
               type="button"
               onClick={() => setIsSearchOpen(true)}
               className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#161616] border border-white/10 hover:border-[#FF6B00]/50 rounded-full text-[10px] font-black uppercase tracking-wider text-[#BFBFBF] hover:text-white transition-all cursor-pointer shadow-inner"
             >
               <Search size={12} className="text-[#FF6B00]" />
               <span className="font-mono">SEARCH...</span>
             </button>

             <Link 
               to="/contact" 
               className="hidden md:flex px-6 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-full text-[10px] font-black uppercase tracking-[0.18em] hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all group cursor-pointer"
             >
               Book Consultation
               <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </Link>

             {/* Mobile Active Search Button */}
             <button
               onClick={() => setIsSearchOpen(true)}
               className="sm:hidden w-10 h-10 bg-[#161616] border border-white/10 rounded-full flex items-center justify-center text-[#BFBFBF] active:scale-95 transition-all cursor-pointer"
             >
               <Search size={16} />
             </button>

             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsOpen(!isOpen)}
               className="lg:hidden w-10 h-10 bg-[#161616] border border-white/10 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer"
             >
               {isOpen ? <X size={18} /> : <Menu size={18} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="fixed inset-0 w-screen h-[100dvh] bg-[#080808] z-[90] lg:hidden flex flex-col overflow-hidden font-sans border-l border-white/10"
            >
               <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 bg-[#080808]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B00] to-[#FF9D00] rounded-xl flex items-center justify-center text-white font-black shadow-inner">P</div>
                    <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">Preet Web Vision</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 bg-[#161616] border border-white/10 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <X size={16} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  <nav className="space-y-1">
                     {defaultNavLinks.map((link) => (
                       <div key={link.name} className="py-2">
                          {link.dropdown ? (
                            <div className="space-y-3">
                               <button 
                                 onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                 className="w-full flex justify-between items-center py-2 text-sm font-black uppercase tracking-[0.15em] text-white hover:text-[#FF6B00] transition-colors border-b border-white/10"
                               >
                                  {link.name}
                                  <ChevronDown size={18} className={cn("transition-transform", activeDropdown === link.name ? "rotate-180 text-[#FF6B00]" : "text-[#8B8B8B]")} />
                               </button>
                               <AnimatePresence>
                                  {activeDropdown === link.name && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden space-y-4 pl-4 border-l-2 border-[#FF6B00]/40"
                                    >
                                       {MAIN_SERVICES_MEGA_MENU.map(service => {
                                         const SIcon = service.icon;
                                         return (
                                           <Link
                                             key={service.id}
                                             to={service.path}
                                             onClick={() => setIsOpen(false)}
                                             className="block p-2.5 rounded-xl bg-[#161616] border border-white/5 hover:border-[#FF6B00]/40 transition-all"
                                           >
                                             <div className="flex items-center gap-2.5 text-[11px] font-black uppercase text-white hover:text-[#FF6B00]">
                                               <SIcon size={14} className={service.color} />
                                               <span>{service.title}</span>
                                             </div>
                                             <p className="text-[10px] text-[#BFBFBF] font-normal leading-tight mt-1 line-clamp-1 pl-6">
                                               {service.desc}
                                             </p>
                                           </Link>
                                         );
                                       })}
                                       <Link 
                                         to="/services" 
                                         onClick={() => setIsOpen(false)}
                                         className="block text-[10px] font-mono font-bold text-[#FF6B00] hover:text-[#FF9D00] uppercase tracking-[0.2em] pt-2"
                                       >
                                         Explore All Services →
                                       </Link>
                                    </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
                          ) : (
                            <Link 
                              to={link.path} 
                              onClick={() => setIsOpen(false)}
                              className="block py-2.5 text-sm font-black uppercase tracking-[0.15em] text-white hover:text-[#FF6B00] transition-colors border-b border-white/10"
                            >
                               {link.name}
                            </Link>
                          )}
                       </div>
                     ))}
                  </nav>

                  <div className="pt-6 border-t border-white/10">
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B8B8B] mb-4 font-mono">Direct Communication</p>
                     <div className="grid grid-cols-2 gap-3">
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="p-4 bg-[#161616] rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors border border-white/10 text-white">
                           <Mail size={16} className="text-[#FF6B00]" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Email Us</span>
                        </Link>
                        <a href="https://wa.me/919999000000" className="p-4 bg-[#161616] rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors border border-white/10 text-white">
                           <Zap size={16} className="text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                        </a>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-white/10 bg-[#121212]">
                  <Link 
                    to="/contact" 
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#FF6B00]/20 active:scale-[0.98]"
                  >
                    Get Started <ArrowRight size={12} />
                  </Link>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-10 md:top-24 max-w-2xl mx-auto bg-[#121212] rounded-[2.5rem] shadow-2xl border border-white/10 p-8 z-[160] overflow-hidden flex flex-col max-h-[85vh] font-sans"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Agency Search Index</h3>
                  <p className="text-[9px] text-[#FF6B00] font-bold uppercase tracking-widest mt-0.5 font-mono">Instant Services & Journal Database</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-10 h-10 rounded-2xl bg-[#161616] border border-white/10 flex items-center justify-center text-[#8B8B8B] hover:text-white cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B8B8B]" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search SEO, Paid Ads, Web Design, AI Automation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 focus:border-[#FF6B00] rounded-2xl pl-12 pr-5 py-4 focus:outline-none transition-all font-bold text-sm text-white placeholder:text-[#8B8B8B]"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                {searchQuery.trim() ? (
                  <div className="space-y-6">
                    {filteredServices.length > 0 && (
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[#FF6B00] mb-3 ml-1 font-mono">
                          Services ({filteredServices.length})
                        </div>
                        <div className="space-y-2">
                          {filteredServices.map((srv) => (
                            <Link
                              key={srv.slug}
                              to={`/services/${srv.slug}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="group block p-4 bg-[#161616] hover:bg-[#FF6B00]/10 rounded-2xl border border-white/5 hover:border-[#FF6B00]/30 transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-[12px] text-white group-hover:text-[#FF6B00] uppercase tracking-tight">
                                  {srv.title}
                                </span>
                                <span className="text-[8px] font-black uppercase text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-md leading-none font-mono">
                                  Service
                                </span>
                              </div>
                              <p className="text-[10px] text-[#8B8B8B] font-medium mt-1 line-clamp-1">{srv.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredBlogPosts.length > 0 && (
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[#FF6B00] mb-3 ml-1 font-mono">
                          Articles ({filteredBlogPosts.length})
                        </div>
                        <div className="space-y-2">
                          {filteredBlogPosts.map((post) => (
                            <Link
                              key={post.slug || post.id}
                              to={`/blog?post=${post.slug || post.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="group block p-4 bg-[#161616] hover:bg-[#FF6B00]/10 rounded-2xl border border-white/5 hover:border-[#FF6B00]/30 transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-[12px] text-white group-hover:text-[#FF6B00] uppercase tracking-tight">
                                  {post.title}
                                </span>
                                <span className="text-[8px] font-black uppercase text-[#FFB347] bg-[#FFB347]/10 px-2 py-0.5 rounded-md leading-none font-mono">
                                  Article
                                </span>
                              </div>
                              <p className="text-[10px] text-[#8B8B8B] font-medium mt-1 line-clamp-1">{post.excerpt}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredServices.length === 0 && filteredBlogPosts.length === 0 && (
                      <div className="text-center py-12 text-[#8B8B8B] text-xs font-bold">
                        No results found for "{searchQuery}". Try another keyword!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-[9px] font-black uppercase tracking-widest text-[#8B8B8B] ml-1 font-mono">
                      Popular Searches
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { title: 'SEO Services & Audits', path: '/services/seo', category: 'Service' },
                        { title: 'Google & Meta Ads', path: '/services/google-ads', category: 'Service' },
                        { title: 'Web Design & Shopify', path: '/services/web-design', category: 'Service' },
                        { title: 'AI Automation & Agents', path: '/services/ai-automation', category: 'Service' }
                      ].map((sug, i) => (
                        <Link
                          key={i}
                          to={sug.path}
                          onClick={() => setIsSearchOpen(false)}
                          className="p-3.5 bg-[#161616] hover:bg-[#FF6B00]/10 border border-white/5 hover:border-[#FF6B00]/30 rounded-2xl transition-all cursor-pointer block"
                        >
                          <span className="text-[8px] font-mono font-black uppercase text-[#FF6B00] bg-[#FF6B00]/10 px-1.5 py-0.5 rounded inline-block mb-1.5">
                            {sug.category}
                          </span>
                          <p className="font-extrabold text-[11px] text-white uppercase tracking-tight">{sug.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-[9px] font-black text-[#8B8B8B] uppercase tracking-wider font-mono">
                <span>Press ESC to exit</span>
                <span>Preet Web Vision 2026</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
