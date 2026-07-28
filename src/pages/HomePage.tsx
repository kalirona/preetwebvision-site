import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Search, Zap, Layout, ShoppingBag, Share2, Globe, 
  TrendingUp, Users, Star, BarChart3, ShieldCheck, Database, Code2, Rocket, 
  Award, ExternalLink, HelpCircle, ShoppingBasket, FileCode, RefreshCw, 
  MousePointer2, Sparkles, Activity, Layers, Terminal, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { CmsBlockRenderer } from '../components/CmsBlockRenderer';
import { SEO, Breadcrumbs } from '../lib/seo';

const icons: Record<string, any> = { 
  Search, 
  Zap, 
  Layout, 
  ShoppingBag, 
  Share2, 
  ShoppingBasket, 
  FileCode, 
  RefreshCw, 
  MousePointer2 
};

export const HomePage = () => {
  const [cmsPage, setCmsPage] = React.useState<any | null>(null);
  const [loadingCms, setLoadingCms] = React.useState(true);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  React.useEffect(() => {
    fetch('/api/pages/home')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data && data.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCmsPage(parsed);
            }
          } catch {
            // not serialized block list
          }
        }
        setLoadingCms(false);
      })
      .catch(() => setLoadingCms(false));
  }, []);

  if (!loadingCms && cmsPage) {
    return (
      <div className="w-full pt-20 bg-[#080808] text-white font-sans">
        <Helmet>
          <title>Preet Web Vision | Performance-Driven Web & AI Growth Studio</title>
          <meta name="description" content="Expert custom web development, Shopify, SEO & AI automation engineered for industry market dominance." />
        </Helmet>
        <CmsBlockRenderer blocks={cmsPage} />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#080808] text-white selection:bg-[#FF6B00] selection:text-white font-sans overflow-x-hidden">
      <SEO
        title="Next-Gen AI & Web Performance Agency"
        description="A premium digital growth agency specializing in custom high-speed web design, technical SEO, AI automation, and conversion-engineered eCommerce architectures. Based in Gurgaon, serving clients worldwide."
        canonical="/"
        keywords="digital agency, web development, SEO agency Delhi NCR, Shopify agency, AI automation, high conversion design, digital marketing agency Gurgaon"
        breadcrumbs={[]}
      />

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="relative pt-[160px] pb-[110px] md:pt-[190px] md:pb-[140px] overflow-hidden bg-[#080808]">
        {/* Futuristic Mesh Background Glows */}
        <div className="absolute inset-0 grid-bg-dark pointer-events-none opacity-60" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#FF6B00]/20 via-[#FF9D00]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-5xl mx-auto mb-16"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg shadow-[#FF6B00]/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
              <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
                NEXT-GEN AI & DIGITAL PERFORMANCE STUDIO
              </span>
            </div>
            
            {/* Massive Heading */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02] mb-8 uppercase">
              WE ENGINEER <br className="hidden sm:block" />
              <span className="text-gradient-orange underline decoration-[#FF6B00]/40 decoration-4">HYPER-SCALABLE</span> <br />
              DIGITAL ASSETS
            </h1>
            
            <p className="text-[#BFBFBF] text-lg sm:text-xl md:text-2xl font-normal max-w-3xl mx-auto leading-relaxed mb-12">
              Combining ultra-fast web architectures, AI automation, and data-driven SEO to engineer market authority and exponential revenue growth.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF6B00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group text-center"
              >
                <span>Request Growth Audit</span> 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/case-studies" 
                className="w-full sm:w-auto px-10 py-5 bg-[#161616] hover:bg-[#1f1f1f] border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 text-center"
              >
                <span>Explore Client Portfolio</span>
                <ExternalLink size={14} className="text-[#BFBFBF]" />
              </Link>
            </div>
          </motion.div>

          {/* Hero Showcase Glass Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00]/30 via-[#FF9D00]/20 to-[#FF6B00]/30 rounded-[28px] blur-xl opacity-70" />
            <div className="relative rounded-[24px] overflow-hidden border border-white/10 bg-[#121212] p-4 sm:p-6 shadow-2xl">
              {/* Glass Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161616] rounded-xl border border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#080808] border border-white/5 text-[11px] font-mono text-[#8B8B8B]">
                  <Terminal size={12} className="text-[#FF6B00]" />
                  <span>https://preetwebvision.com/engine/v3.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest hidden sm:inline-block">System Active</span>
                </div>
              </div>

              {/* Grid Showcase Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#080808]">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80" 
                    alt="Engineered Digital Platform Dashboard" 
                    width="1400"
                    height="788"
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#FFB347] tracking-widest">REAL-TIME TELEMETRY</span>
                      <p className="text-xl font-black uppercase tracking-tight font-display">Custom High-Conversion Architecture</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FFB347] font-mono text-xs font-bold">
                      99.98% SPEED SCORE
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4">
                  <div className="p-5 rounded-xl bg-[#161616] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-[#8B8B8B] uppercase">Organic Revenue</span>
                      <TrendingUp size={16} className="text-green-400" />
                    </div>
                    <p className="text-3xl font-black text-white font-mono">+340%</p>
                    <p className="text-xs text-[#BFBFBF] mt-1">Average 6-month growth metric</p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#161616] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-[#8B8B8B] uppercase">Core Web Vitals</span>
                      <Activity size={16} className="text-[#FF6B00]" />
                    </div>
                    <p className="text-3xl font-black text-white font-mono">0.00 CLS</p>
                    <p className="text-xs text-[#BFBFBF] mt-1">Zero layout shift guaranteed</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#FF6B00]/20 to-[#161616] border border-[#FF6B00]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-bold">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-wider">Top Tier Agency</p>
                        <p className="text-xs text-[#FFB347]">Clutch & Google Premier Certified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          PARTNERS & COALITION LOGOS
          ========================================= */}
      <section className="py-12 bg-[#121212] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] font-mono uppercase tracking-[0.3em] text-[#8B8B8B] mb-8">
            ENGINEERED WITH INDUSTRY CERTIFIED PARTNERSHIPS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-70 hover:opacity-100 transition-opacity">
            {[
              { name: "SHOPIFY PARTNER", tag: "PLUS EXPERT" },
              { name: "GOOGLE ADS", tag: "PREMIER PARTNER" },
              { name: "SEMRUSH PRO", tag: "AGENCY ALLIANCE" },
              { name: "HUBSPOT", tag: "PLATFORM CERTIFIED" },
              { name: "CLUTCH LEADER", tag: "TOP 1% GLOBAL" },
            ].map((partner, idx) => (
              <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00] group-hover:scale-150 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-widest text-white uppercase font-mono group-hover:text-[#FF6B00] transition-colors">{partner.name}</span>
                  <span className="text-[10px] font-mono text-[#8B8B8B] tracking-wider">{partner.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SERVICES GRID SECTION
          ========================================= */}
      <section className="py-28 relative bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              SPECIALIZED DISCIPLINE CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
              ENGINEERED FOR <span className="text-gradient-orange">MARKET DOMINANCE</span>
            </h2>
            <p className="text-[#BFBFBF] text-base sm:text-lg leading-relaxed">
              We eliminate slow templates and outdated tactics. Every line of code and strategy is optimized to convert visitors into loyal clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.slice(0, 6).map((s, i) => {
              const Icon = icons[s.icon] || Globe;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="p-8 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/50 hover:shadow-2xl hover:shadow-[#FF6B00]/10 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center mb-6 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300 shadow-md">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 tracking-tight text-white uppercase">
                      {s.title}
                    </h3>
                    <p className="text-[#BFBFBF] mb-6 text-sm leading-relaxed line-clamp-3">
                      {s.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {s.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-[#BFBFBF]">
                          <CheckCircle2 size={14} className="text-[#FF6B00] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                    <Link to={`/services/${s.slug}`} className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFB347] group-hover:text-[#FF6B00] transition-colors">
                      Explore Capabilities
                    </Link>
                    <ArrowRight size={14} className="text-[#8B8B8B] group-hover:translate-x-1 group-hover:text-[#FF6B00] transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-3 px-9 py-4 bg-[#161616] hover:bg-[#1f1f1f] border border-white/10 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all duration-300 group"
            >
              <span>View Full Agency Services Catalog</span>
              <ExternalLink size={14} className="text-[#FF6B00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          TECHNICAL ARCHITECTURE SECTION
          ========================================= */}
      <section className="py-28 bg-[#121212] border-y border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
                HIGH PERFORMANCE ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                BUILT FOR THE <span className="text-gradient-orange">2026 SEARCH ERA</span>
              </h2>
              <p className="text-[#BFBFBF] text-base leading-relaxed mb-8">
                Search engines rank websites based on semantic clarity, load speed, and user interaction signals. Our tech stack is engineered explicitly to excel in all modern performance benchmarks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Frontend Engine", tech: "React 18 / Vite / Next.js", icon: <Layout size={18} /> },
                  { label: "AI Integration", tech: "Gemini / Custom ML Models", icon: <Sparkles size={18} /> },
                  { label: "Edge Commerce", tech: "Shopify Storefront API", icon: <ShoppingBag size={18} /> },
                  { label: "Performance Ops", tech: "0.00 CLS / <20ms INP", icon: <Zap size={18} /> },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#161616] border border-white/5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#080808] border border-white/10 flex items-center justify-center text-[#FF6B00]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[#8B8B8B] uppercase">{item.label}</p>
                      <p className="text-xs font-bold text-white">{item.tech}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-2xl bg-[#161616] border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs font-mono text-[#FFB347] uppercase">Core Web Vitals Metric</p>
                    <h3 className="text-lg font-bold text-white font-display">Live Benchmark Audits</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase">
                    PASSING 100%
                  </span>
                </div>

                <div className="space-y-5">
                  {[
                    { title: "Largest Contentful Paint (LCP)", val: "0.8s", label: "Instant Load" },
                    { title: "Interaction to Next Paint (INP)", val: "12ms", label: "Ultra Responsive" },
                    { title: "Cumulative Layout Shift (CLS)", val: "0.00", label: "Zero Shift" },
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#BFBFBF]">{metric.title}</span>
                        <span className="font-mono text-[#FFB347] font-bold">{metric.val} ({metric.label})</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#080808] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] rounded-full w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          VERIFIED CLIENT REVIEWS
          ========================================= */}
      <section className="py-28 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              CLIENT TESTIMONIALS & RESULTS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              TRUSTED BY <span className="text-gradient-orange">INDUSTRY LEADERS</span>
            </h2>
            <p className="text-[#BFBFBF] text-base leading-relaxed">
              Real feedback from founders and executives who expanded their business authority with Preet Web Vision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Jharon",
                title: "CEO, Bloom Media",
                stars: 5,
                content: "Preet Web Vision completely transformed our web platform. Our organic lead inquiries increased by 140% in just four months after launching our high-performance site.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              },
              {
                name: "Michael R. Khanna",
                title: "Director, TechFlow Systems",
                stars: 5,
                content: "The custom Web & SEO strategy delivered instant results. Our Google PageSpeed score jumped to 99+ and conversion rates doubled across our core service pages.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              },
              {
                name: "David K. Gupta",
                title: "Co-Founder, LuxeStore",
                stars: 5,
                content: "Best investment for our eCommerce scaling strategy. Our checkout drop-off rate dropped dramatically and revenue grew steadily month over month.",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              },
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#161616] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex text-[#FFB347] mb-4">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#FFB347] text-[#FFB347]" />
                    ))}
                  </div>
                  <p className="text-[#BFBFBF] text-sm leading-relaxed mb-8">
                    "{review.content}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <img src={`${review.img}?auto=format&fit=crop&w=100&q=80`} alt={review.name} width="100" height="100" loading="lazy" className="w-11 h-11 rounded-full object-cover border border-[#FF6B00]" />
                  <div>
                    <p className="text-sm font-bold text-white">{review.name}</p>
                    <p className="text-xs text-[#8B8B8B] font-mono">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          INDUSTRIES WE SERVE
          ========================================= */}
      <section className="py-28 bg-[#121212] border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              INDUSTRIES WE SERVE
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              EXPERTISE ACROSS <span className="text-gradient-orange">EVERY SECTOR</span>
            </h2>
            <p className="text-[#BFBFBF] text-base leading-relaxed">
              Our technical solutions are tailored to the unique challenges of each industry we serve.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'E-Commerce & Retail', icon: '🛒' },
              { name: 'Healthcare & Medical', icon: '🏥' },
              { name: 'Real Estate & Property', icon: '🏢' },
              { name: 'Education & E-Learning', icon: '📚' },
              { name: 'Financial Services', icon: '💰' },
              { name: 'Technology & SaaS', icon: '💻' },
              { name: 'Hospitality & Travel', icon: '✈️' },
              { name: 'Legal & Professional', icon: '⚖️' },
              { name: 'Manufacturing & Industrial', icon: '🏭' },
              { name: 'Food & Beverage', icon: '🍽️' },
              { name: 'Automotive & Transport', icon: '🚗' },
              { name: 'Non-Profit & Education', icon: '🎓' }
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="p-5 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/40 transition-all text-center group"
              >
                <span className="text-3xl block mb-2">{industry.icon}</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#BFBFBF] group-hover:text-[#FF6B00] transition-colors">
                  {industry.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          OUR PROCESS
          ========================================= */}
      <section className="py-28 bg-[#080808] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              OUR PROCESS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              HOW WE <span className="text-gradient-orange">DELIVER RESULTS</span>
            </h2>
            <p className="text-[#BFBFBF] text-base leading-relaxed">
              A proven methodology that ensures every project delivers measurable business impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery & Audit', desc: 'Deep analysis of your business goals, technical stack, market position, and growth opportunities.' },
              { step: '02', title: 'Strategy & Architecture', desc: 'Custom blueprint development with clear milestones, KPIs, and technical specifications.' },
              { step: '03', title: 'Execution & Development', desc: 'Agile development with weekly sprints, continuous testing, and transparent progress reporting.' },
              { step: '04', title: 'Launch & Optimization', desc: 'Production deployment with performance monitoring, A/B testing, and iterative improvements.' }
            ].map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/50 transition-all relative"
              >
                <span className="font-display text-5xl font-black text-[#FF6B00]/20 block mb-4">{phase.step}</span>
                <h3 className="font-display text-xl font-bold text-white uppercase mb-3">{phase.title}</h3>
                <p className="text-[#BFBFBF] text-sm leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TECHNOLOGIES WE USE
          ========================================= */}
      <section className="py-28 bg-[#121212] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              TECHNOLOGY STACK
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              MODERN <span className="text-gradient-orange">TECH ARCHITECTURE</span>
            </h2>
            <p className="text-[#BFBFBF] text-base leading-relaxed">
              We leverage cutting-edge technologies to build fast, secure, and scalable digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'React / Next.js', cat: 'Frontend' },
              { name: 'TypeScript', cat: 'Language' },
              { name: 'Node.js', cat: 'Backend' },
              { name: 'WordPress', cat: 'CMS' },
              { name: 'Shopify', cat: 'E-Commerce' },
              { name: 'Tailwind CSS', cat: 'Styling' },
              { name: 'PostgreSQL', cat: 'Database' },
              { name: 'MongoDB', cat: 'Database' },
              { name: 'Firebase', cat: 'Backend' },
              { name: 'AWS / GCP', cat: 'Cloud' },
              { name: 'Docker', cat: 'DevOps' },
              { name: 'GitHub Actions', cat: 'CI/CD' }
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
                className="p-5 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/40 transition-all text-center group"
              >
                <span className="text-[10px] font-mono font-bold text-[#FFB347] uppercase tracking-wider block mb-1">{tech.cat}</span>
                <span className="text-xs font-bold text-white group-hover:text-[#FF6B00] transition-colors">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ SECTION
          ========================================= */}
      <section className="py-28 bg-[#080808] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              COMMON <span className="text-gradient-orange">INQUIRIES</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How long does it take to see results from SEO?', a: 'Initial improvements can be seen within 4-6 weeks, but significant organic growth typically compounds over 3-6 months as search engines recognize your authority.' },
              { q: 'What makes Preet Web Vision different from other agencies?', a: 'We are code-first engineers, not template users. Every website is built from scratch with clean code, sub-second load speeds, and SEO-native architecture. We don\'t use bloated page builders or automated link schemes.' },
              { q: 'Do you offer ongoing support after project completion?', a: 'Yes. We provide comprehensive maintenance plans including security updates, performance monitoring, content updates, and priority technical support.' },
              { q: 'Can you work with our existing website or do we need a rebuild?', a: 'We can optimize existing sites or recommend a rebuild if the current architecture limits performance. We always provide a detailed audit before recommending the best path forward.' },
              { q: 'What is your pricing model?', a: 'We offer transparent monthly retainers and project-based pricing. Every engagement starts with a free strategy audit to define scope and investment.' }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-2xl bg-[#121212] border border-white/10 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display text-sm font-bold uppercase text-white">{faq.q}</span>
                    <ChevronDown size={18} className={`text-[#FF6B00] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-xs text-[#BFBFBF] leading-relaxed border-t border-white/5">
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          BLOG PREVIEW
          ========================================= */}
      <section className="py-28 bg-[#121212] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
                GROWTH JOURNAL
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                LATEST <span className="text-gradient-orange">INSIGHTS</span>
              </h2>
            </div>
            <Link to="/blog" className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00] hover:text-[#FF9D00] transition-colors inline-flex items-center gap-2">
              <span>View All Articles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'WordPress Technical SEO: Ultimate Deep-Dive Guide',
                excerpt: 'Learn the latest technical SEO and architecture guidelines to make your site rank higher and load faster in the AI search era.',
                category: 'SEO & Technical Growth',
                date: 'May 15, 2026',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
              },
              {
                title: 'AI Automation Engines for Enterprise Growth',
                excerpt: 'Efficiency is the new growth lever. Discover the AI architectures that save performance agencies 20+ hours per week.',
                category: 'AI & Automation',
                date: 'May 10, 2026',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
              }
            ].map((post, idx) => (
              <Link
                key={idx}
                to={`/blog?post=${idx === 0 ? 'wordpress-seo-2026' : 'ai-tools-for-digital-growth'}`}
                className="p-8 rounded-3xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/40 transition-all group"
              >
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-6 bg-[#121212]">
                  <img src={post.image} alt={post.title} width="800" height="600" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#8B8B8B] mb-3">
                  <span className="text-[#FFB347] uppercase">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white mb-3 group-hover:text-[#FF6B00] transition-colors">{post.title}</h3>
                <p className="text-xs text-[#BFBFBF] leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00] inline-flex items-center gap-2">
                  <span>Read Full Article</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT SECTION
          ========================================= */}
      <section className="py-28 bg-[#080808] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
                START YOUR JOURNEY
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                READY TO <span className="text-gradient-orange">TRANSFORM</span> YOUR DIGITAL PRESENCE?
              </h2>
              <p className="text-[#BFBFBF] text-base leading-relaxed mb-8">
                Book a complimentary strategy session with our engineering team. We'll analyze your current setup and provide a roadmap for growth.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#BFBFBF]">
                  <CheckCircle2 size={18} className="text-[#FF6B00] shrink-0" />
                  <span>Free 100+ point technical audit</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#BFBFBF]">
                  <CheckCircle2 size={18} className="text-[#FF6B00] shrink-0" />
                  <span>Custom growth strategy proposal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#BFBFBF]">
                  <CheckCircle2 size={18} className="text-[#FF6B00] shrink-0" />
                  <span>No commitment required</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#121212] border border-white/10 shadow-2xl">
                <h3 className="font-display text-xl font-bold uppercase text-white mb-6">Send Us a Message</h3>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input type="text" placeholder="Your Name" className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-neutral-600" />
                    <input type="email" placeholder="Work Email" className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-neutral-600" />
                  </div>
                  <select className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors">
                    <option>I'm interested in...</option>
                    <option>Web Design & Development</option>
                    <option>SEO Services</option>
                    <option>Google Ads</option>
                    <option>AI Automation</option>
                    <option>E-Commerce Solutions</option>
                  </select>
                  <textarea rows={3} placeholder="Tell us about your project..." className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-neutral-600" />
                  <Link to="/contact" className="w-full block py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest text-center shadow-xl shadow-[#FF6B00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                    Submit Inquiry
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL MASSIVE CALL TO ACTION
          ========================================= */}
      <section className="py-28 bg-[#121212] border-t border-white/10 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/50 to-[#121212] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-4">
            READY TO ELEVATE YOUR BRAND?
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-8">
            LET'S BUILD YOUR <span className="text-gradient-orange">DIGITAL ASSET</span>
          </h2>
          <p className="text-[#BFBFBF] text-base sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Book a complimentary strategic consultation and receive a comprehensive website audit & technical roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF6B00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Start Free Strategy Call
            </Link>
            <Link 
              to="/pricing" 
              className="w-full sm:w-auto px-10 py-5 bg-[#161616] hover:bg-[#1f1f1f] border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300"
            >
              View Pricing Models
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
