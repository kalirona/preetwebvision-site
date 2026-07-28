import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, BarChart3, Globe, Zap, ArrowUpRight, CheckCircle2, Shield, Users, BookOpen, Clock, Activity, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CASE_STUDIES = [
  {
    id: 1,
    title: 'E-Commerce Organic Revenue 4x Transformation',
    client: 'Velvet & Vine',
    category: 'Shopify Plus / Technical SEO',
    description: 'Complete architecture rebuild for a luxury fashion retailer, driving $1.2M in additional annual revenue.',
    result: '+380%',
    resultLabel: 'Sales Growth',
    tags: ['Custom Theme Code', 'Core Web Vitals 99', 'Schema Automation'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    challenge: 'Velvet & Vine suffered from a sluggish pre-built Shopify theme with over 12 seconds of mobile load times. High page weight and unstable app scripts caused cart abandonment rates exceeding 78%.',
    strategy: 'Our team completely bypassed generic page builders. We coded a custom Shopify Storefront theme from scratch, stripping unnecessary app scripts and optimizing checkout sequences. We injected schema markup to highlight stock and pricing directly on Google Search.',
    impact: 'The portal now renders in 0.8 seconds. Cart abandonment dropped from 78% to 32%, organic conversions surged by 215%, and the store generated an additional $1.2M in net profit within 12 months.'
  },
  {
    id: 2,
    title: 'SaaS Organic Domain Authority Overhaul',
    client: 'DataFlow Systems',
    category: 'Technical SEO / Content',
    description: 'Resolving technical crawl bottlenecks and organizing topic clusters for a B2B SaaS platform.',
    result: '120k',
    resultLabel: 'Monthly Traffic',
    tags: ['Content Clustering', 'JSON-LD Schema', 'Authority Backlinks'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    challenge: 'DataFlow Systems was stuck on page two of Google search for high-value B2B queries. Technical crawl errors meant search engine bots wasted crawl budget on unoptimized admin paths.',
    strategy: 'We performed a comprehensive technical audit, fixing canonical URLs, clearing redirect chains, and organizing their technical content into structured topic authority clusters.',
    impact: 'Organic impressions surged 450% in under 5 months. DataFlow now holds top 3 rankings for 14 enterprise keywords, reaching 120,000 monthly organic visitors and doubling software demo requests.'
  },
  {
    id: 3,
    title: 'High-Conversion Booking Engine Architecture',
    client: 'The Azure Retreat',
    category: 'Custom Web Dev / CRO',
    description: 'Custom React-based booking portal with sub-second page loads and zero layout shift.',
    result: '0.4s',
    resultLabel: 'Load Speed',
    tags: ['Headless React Engine', '0.00 CLS', 'Conversion Funnel'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    challenge: 'The hotel relied on an external iframe booking engine that suffered from severe layout shifts and slow response times, causing a low booking conversion rate of just 0.6%.',
    strategy: 'We designed a custom React booking interface integrated directly with fast server APIs. We eliminated layout shifts, streamlined input fields into three intuitive steps, and optimized mobile touch states.',
    impact: 'Page load times dropped from 4.2 seconds to 0.4 seconds. Direct booking conversions jumped to 2.4%, mobile reservations increased by 310%, saving $80,000+ in annual OTA commissions.'
  }
];

export const PortfolioPage = () => {
  return (
    <div className="w-full pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Portfolio & Case Studies | Preet Web Vision</title>
        <meta name="description" content="Explore real client success stories. See how we help ambitious brands achieve massive organic search rankings, speed boosts, and sales expansion." />
        <link rel="canonical" href="https://preetwebvision.com/case-studies" />
        <meta property="og:title" content="Portfolio & Case Studies | Preet Web Vision" />
        <meta property="og:description" content="Explore real client success stories. See how we help ambitious brands achieve massive organic search rankings, speed boosts, and sales expansion." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://preetwebvision.com/case-studies" />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              VERIFIABLE CLIENT PERFORMANCE PORTFOLIO
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-8">
            PROVEN <span className="text-gradient-orange">MEASURABLE LIFT</span> <br />
            FOR AMBITIOUS BRANDS
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-3xl">
            We don't sell promises. Explore detailed breakdowns of how our custom code architectures, technical SEO, and conversion engineering transform business metrics.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-16 mb-28">
          {CASE_STUDIES.map((cs) => (
            <div key={cs.id} className="p-8 sm:p-12 rounded-3xl bg-[#121212] border border-white/10 hover:border-[#FF6B00]/40 transition-all grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#161616]">
                  <img src={cs.image} alt={cs.title} width="800" height="600" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#080808]/80 backdrop-blur-md border border-white/10 font-mono text-xs font-bold text-[#FFB347]">
                    {cs.category}
                  </div>
                </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8B8B8B] uppercase">{cs.client}</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#FF6B00] font-mono">{cs.result}</span>
                    <span className="block text-[10px] font-mono text-[#8B8B8B] uppercase">{cs.resultLabel}</span>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">{cs.title}</h2>
                <p className="text-sm text-[#BFBFBF] leading-relaxed">{cs.description}</p>

                <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="font-mono text-[#FFB347] font-bold block mb-1">CHALLENGE:</span>
                    <p className="text-[#BFBFBF] leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[#FFB347] font-bold block mb-1">STRATEGY & EXECUTION:</span>
                    <p className="text-[#BFBFBF] leading-relaxed">{cs.strategy}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cs.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#161616] border border-white/5 rounded-md font-mono text-[10px] text-[#8B8B8B]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-3xl bg-[#121212] border border-[#FF6B00]/30 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-black uppercase text-white mb-4">Ready to Be Our Next Case Study?</h2>
          <p className="text-[#BFBFBF] text-sm leading-relaxed mb-8">
            Let us engineer a custom high-performance platform for your brand and accelerate your organic search dominance.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white px-9 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#FF6B00]/20 hover:scale-105 transition-all">
            <span>Request Performance Audit</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
