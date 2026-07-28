import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Cpu, BarChart3, Globe, Code2, Sparkles, ChevronRight, BookOpen, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOOLS = [
  {
    name: 'WP Engine Hosting',
    category: 'Architecture & Managed Cloud',
    description: 'The global gold-standard for managed WordPress builds. We host our high-performance client sites here to leverage their proprietary EverCache server technology, global CDN networks, and automated daily security patches.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'WP Engine remains our absolute prerequisite for client builds. Their custom server engine handles millions of request iterations per second without database lockouts. They block threats before they reach your site and provide built-in staging tools, allowing our development team to test updates safely.'
  },
  {
    name: 'SEMRush SEO Core',
    category: 'Market Intel & Keyword Audit',
    description: 'Our primary software engine for keyword research, checking competitor backlinks, and monitoring search rankings. Essential for finding the exact topics your customers search for.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'We run daily automated reviews using SEMRush to measure search trends, check competitor updates, find broken redirection paths, and track search rankings.'
  },
  {
    name: 'Surfer SEO Editor',
    category: 'Topical Content Optimization',
    description: "A helpful content assistant that analyzes Google's top search results in real-time, helping our copywriters write clear headings and answer the exact questions customers are searching for.",
    link: '#',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'We use Surfer SEO to analyze highly ranked articles in your niche. This tells us exactly what topics and information are required to help your site rank well on Google.'
  },
  {
    name: 'Shopify Plus Commerce',
    category: 'High-Volume Enterprise Retail',
    description: 'The premier choice for large-scale ecommerce. We build customized Liquid setups here to support secure transactional frameworks and multi-currency localized checkouts.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'Shopify Plus delivers 99.98% uptime, even during massive sales events like Black Friday. Bypassing third-party server issues allows commercial brands to focus entirely on conversion rate design.'
  },
  {
    name: 'GeneratePress Theme',
    category: 'Lightweight Design Theme',
    description: 'The ultra-responsive lightweight layout engine we select for our client sites. Delivers clean, unbloated stylesheet assets that easily pass Core Web Vitals checks.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1541462608141-2ff030de4a40?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'GeneratePress keeps page requests under 15KB with zero dependency on heavy design libraries. This makes it the perfect design layout for custom web solutions.'
  },
  {
    name: 'Jasper AI Copywriting',
    category: 'AI Scaling & Ad Optimization',
    description: 'Our certified framework of choice for compiling targeted landing page variations, ad headlines, and product descriptions at scale, while strictly maintaining your brand voice.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&q=80',
    deeperIntel: 'By integrating Jasper’s advanced template models, our content teams can bypass creative blocks, drafting multiple landing page frameworks that our designers optimize for conversion.'
  }
];

export const AffiliatePage = () => {
  const [tools, setTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAffiliates = async () => {
      const defaultTools = TOOLS.map((t, idx) => ({
        id: `fbt-${idx}`,
        name: t.name,
        category: t.category,
        description: t.description,
        link: t.link,
        image: t.image,
        deeperIntel: t.deeperIntel
      }));

      try {
        const response = await fetch('/api/affiliate');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTools([...data, ...defaultTools]);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching live affiliates", err);
      } finally {
        setLoading(false);
      }
      setTools(defaultTools);
    };

    fetchAffiliates();
  }, []);

  return (
    <div className="pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen">
      <Helmet>
        <title>Recommended Resources & Tech Stack | Preet Web Vision</title>
        <meta name="description" content="Explore our curated directory of server hosting packages, technical keyword trackers, and AI content compilers we use to scale international brands." />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              RECOMMENDED TOOLKITS & INFRASTRUCTURE
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-6">
            ESSENTIAL <span className="text-gradient-orange">GROWTH TOOLS</span> <br />
            & PERFORMANCE STACK
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
            We do not endorse software based on affiliate commissions. We only recommend enterprise-ready tools that we use in production to run client systems.
          </p>
        </div>

        {/* Systems Architecture Brief */}
        <section className="py-16 border-t border-white/10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="px-3 py-1 bg-[#161616] border border-white/10 text-[#FFB347] font-mono text-xs font-bold uppercase rounded-lg tracking-widest inline-block mb-4">
                Architecture Brief
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                THE COMMANDMENTS <br />
                OF DIGITAL SPEED.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-[#BFBFBF] text-base sm:text-lg leading-relaxed">
              <p>
                In an era dominated by high customer acquisition costs and decreasing attention spans, your digital infrastructure determines your brand's bottom line. Most companies spend thousands of dollars on heavy visual themes that fail on basic Core Web Vitals checks.
              </p>
              <p>
                We believe site speed is a primary business metric. Hosting your platform on managed, scalable cloud servers ensures your site can handle high traffic volumes seamlessly while remaining protected against cyber threats.
              </p>
            </div>
          </div>
        </section>

        {/* Tool Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#8B8B8B] font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            Loading growth toolkit...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {tools.map((tool, i) => (
              <div
                key={tool.id || i}
                className="bg-[#121212] rounded-3xl border border-white/10 p-8 sm:p-10 hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-[#161616] rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 p-2 shrink-0">
                      <img src={tool.image} alt={tool.name} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFB347] bg-white/5 border border-white/10 px-3 py-1 rounded-full">{tool.category}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-white mb-3">{tool.name}</h3>
                  <p className="text-xs text-[#BFBFBF] leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  
                  {tool.deeperIntel && (
                    <div className="p-4 bg-[#161616] rounded-xl border border-white/5 mb-8">
                      <p className="text-[10px] font-mono font-bold uppercase text-[#FFB347] mb-1 flex items-center gap-1.5">
                        <Activity size={12} className="text-[#FF6B00]" /> Strategic Application
                      </p>
                      <p className="text-xs text-[#BFBFBF] leading-relaxed">{tool.deeperIntel}</p>
                    </div>
                  )}
                </div>

                <a 
                  href={tool.link} 
                  target="_blank" 
                  rel="noreferrer noopener" 
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00] hover:text-[#FF9D00] transition-colors pt-4 border-t border-white/5"
                >
                  <span>Explore Stack Component</span> 
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="p-10 sm:p-14 rounded-3xl bg-[#121212] border border-[#FF6B00]/30 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-black uppercase text-white mb-4">Need a Tech Stack Review?</h2>
          <p className="text-[#BFBFBF] text-xs sm:text-sm leading-relaxed mb-8">
            Our engineering team will perform a comprehensive audit of your hosting, caching layer, CDN setup, database configuration, and third-party scripts.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white px-9 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#FF6B00]/20 hover:scale-105 transition-all">
            <span>Request Infrastructure Audit</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

