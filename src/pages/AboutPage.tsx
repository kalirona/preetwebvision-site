import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Target, Users, Zap, Award, CheckCircle2, History, TrendingUp, ShieldCheck, Heart, Sparkles, MessageSquare, BookOpen, Shield, Code, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Could not fetch settings in AboutPage:", err));
  }, []);

  return (
    <div className="w-full pt-36 pb-32 bg-[#080808] text-white relative overflow-hidden font-sans overflow-x-hidden">
      <Helmet>
        <title>About Agency | Preet Web Vision</title>
        <meta name="description" content="Discover the story and engineering growth philosophy behind Preet Web Vision. Read our web performance manifesto, core pillars, and client scaling methodology." />
        <meta name="keywords" content="digital agency delhi, technical seo experts, founder preet, web performance guidelines, sustainable search growth" />
        <link rel="canonical" href="https://preetwebvision.com/about" />
        <meta property="og:title" content="About Agency | Preet Web Vision" />
        <meta property="og:description" content="Discover the story and engineering growth philosophy behind Preet Web Vision." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://preetwebvision.com/about" />
      </Helmet>

      {/* Abstract background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#FF9D00]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              OUR CORPORATE DNA & PHILOSOPHY
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight leading-[1.02]">
            ENGINEERING THE <br />
            FUTURE OF <span className="text-gradient-orange underline decoration-[#FF6B00]/40">DIGITAL GROWTH</span>
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-3xl">
            Preet Web Vision was founded to bridge the gap between high-level engineering disciplines and performance growth marketing. We reject slow templates, ignore vanity metrics, and deliver pure business ROI.
          </p>
        </div>

        {/* CHAPTER 1 */}
        <section className="py-16 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="px-3 py-1 bg-[#161616] border border-white/10 text-[#FFB347] font-mono text-xs font-bold uppercase rounded-lg tracking-widest inline-block mb-4">
                Philosophy Brief
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                CHAPTER ONE: <br />
                ENGINEERED FOR <br />
                SEARCH DOMINANCE.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-[#BFBFBF] text-base sm:text-lg leading-relaxed font-normal">
              <p>
                In the modern digital landscape, millions of websites fight for space on search engines. Most businesses assume that ranking on page one is simply a matter of writing blogs or buying backlinks. However, actual search success starts with clean engineering. Search crawlers operate with strict limits on time and computing resources.
              </p>
              <p>
                When a search engine visits a slow or poorly programmed website—one weighed down by heavy templates and broken backend paths—it wastes resources and leaves before indexing your most valuable pages. At Preet Web Vision, our goal is to eliminate this bottleneck completely.
              </p>
              <p>
                We have engineered a clean development methodology that strips away heavy code, resolves server delay headers, and enforces seamless rendering paths. When search engines visit a website built by Preet Web Vision, they index your pages in a fraction of the time.
              </p>
            </div>
          </div>
        </section>

        {/* FOUNDER JOURNEY */}
        <section className="py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#121212]">
                <img 
                  src={settings?.founder_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"} 
                  alt="Founder Preet Web Vision" 
                  width="800"
                  height="800"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FFB347] mb-1">FOUNDER & CEO</p>
                  <h3 className="text-3xl font-black uppercase tracking-tight font-display">PREET KALIRONA</h3>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block">
                FOUNDER VISION
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                MEET OUR <span className="text-gradient-orange">FOUNDER</span>
              </h2>
              <div className="text-[#BFBFBF] text-base sm:text-lg leading-relaxed space-y-4">
                <p className="text-white font-medium">
                  "I launched Preet Web Vision after watching organizations waste massive budgets on low-ROI marketing campaigns because their technical foundations were fundamentally broken. A beautiful UI is worthless if it loads slowly and is invisible to search engines."
                </p>
                <p>
                  Preet Kalirona began as a systems engineer and developer specializing in back-end optimization and high-speed data structures. Over years of hands-on technical work, he realized that traditional marketing agencies lacked coding depth, and web agencies lacked marketing insights.
                </p>
                <p>
                  Preet Web Vision was built to merge those two halves into one unified growth engine. Today, our team directly oversees core framework integrations, ensuring every project represents the state of the art in speed and conversion optimization.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-white/10">
                <div>
                  <p className="text-3xl font-black text-white font-mono leading-none mb-1">50+</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8B8B8B]">Clients Scaled</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#FF6B00] font-mono leading-none mb-1">10X</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8B8B8B]">Traffic Expansion</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white font-mono leading-none mb-1">99.9%</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#8B8B8B]">Performance Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-3xl mb-16">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">OUR GUIDING PRINCIPLES</span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">PILLARS OF EXCELLENCE</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: ShieldCheck, title: "Mathematical Transparency", desc: "We focus on concrete data: qualified organic leads, digital transactions, and clear client acquisition metrics. You will always know how your investment translates into revenue." },
              { icon: Heart, title: "Collaborative Alignment", desc: "We do not operate as an isolated external vendor. We align directly with your core team, mapping out challenges together and maintaining immediate communication channels." },
              { icon: Sparkles, title: "Obsessive Optimization", desc: "Good is never enough. We continuously review your data pipelines, adjust schema structures, and test user behaviors to maximize conversion rates." },
            ].map((pillar, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#121212] border border-white/10 flex items-center justify-center text-[#FF6B00] mb-8">
                  <pillar.icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-white uppercase mb-4">{pillar.title}</h3>
                <p className="text-sm text-[#BFBFBF] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#8B8B8B] mb-8">Ready to initiate your growth roadmap?</p>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF6B00]/30 hover:scale-105 transition-all">
            <span>Partner With Our Team</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
