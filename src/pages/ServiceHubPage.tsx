import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { SERVICES } from '../constants';
import { 
  ArrowRight, Code2, Search, Zap, CheckCircle2, ChevronDown, 
  HelpCircle, Shield, Sparkles, BarChart3, Bot, Mail, Megaphone, LayoutGrid, Check,
  Layout, ShoppingBag, Target, Share2
} from 'lucide-react';

const MAIN_SERVICE_HUBS = [
  {
    id: 'web-design',
    slug: 'web-design',
    title: 'Website Design & Development',
    category: 'DIGITAL INFRASTRUCTURE',
    icon: Layout,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    tagline: 'Custom High-Speed Web Development & WordPress Solutions',
    description: 'We engineer custom WordPress websites, business sites, landing pages, and responsive designs with sub-second load speeds, modern UI, and conversion-focused architectures.',
    deliverables: [
      'Custom WordPress Theme Development',
      'Business & Corporate Websites',
      'High-Converting Landing Pages',
      'Website Redesign & Performance Overhaul'
    ],
    popularSubServices: ['Business Websites', 'Corporate Sites', 'Landing Pages', 'Website Maintenance']
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce-development',
    title: 'E-Commerce Solutions',
    category: 'REVENUE ENGINE',
    icon: ShoppingBag,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    tagline: 'Shopify, WooCommerce & Custom E-Commerce Platforms',
    description: 'Maximize online sales with high-performance e-commerce stores built for speed, conversion, and scalability. Shopify Plus, WooCommerce, and custom solutions available.',
    deliverables: [
      'Custom Shopify Theme Development',
      'WooCommerce & WordPress Stores',
      'Payment Gateway Integration',
      'E-Commerce SEO & Speed Optimization'
    ],
    popularSubServices: ['Shopify Development', 'WooCommerce', 'Store Migration', 'Payment Integration']
  },
  {
    id: 'seo',
    slug: 'seo',
    title: 'Search Engine Optimization (SEO)',
    category: 'ORGANIC GROWTH',
    icon: Search,
    color: 'text-[#FFB347]',
    bg: 'bg-[#FFB347]/10',
    tagline: 'Technical SEO, Local Search & Organic Market Domination',
    description: 'We build enterprise search authority by fixing Core Web Vitals, structuring schema markup, building high-authority backlinks, and scaling topic clusters that rank #1 for high-intent keywords.',
    deliverables: [
      'Comprehensive 100+ Point Technical SEO Audit',
      'Schema.org Structured Data & Rich Snippet Engineering',
      'High-Authority Manual Outreach Link Acquisition',
      'Topic Cluster & Search Intent Content Architecture'
    ],
    popularSubServices: ['Local SEO', 'E-Commerce SEO', 'Technical Audits', 'Link Building']
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    title: 'Google & Paid Advertising',
    category: 'PAID PERFORMANCE',
    icon: Target,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    tagline: 'High-ROAS Google Ads, Shopping & Performance Max Campaigns',
    description: 'Maximize your advertising return with data-driven Search, Shopping, Performance Max, and Remarketing campaigns structured to capture bottom-of-funnel buyers at minimal customer acquisition cost.',
    deliverables: [
      'Negative Keyword Filtering & Query Sculpting',
      'Conversion API & Server-Side Pixel Tracking',
      'A/B Tested Ad Copy & High-Converting Landing Pages',
      'Bid Management & Weekly ROAS Optimization'
    ],
    popularSubServices: ['Search Ads', 'Shopping Ads', 'Performance Max', 'Retargeting']
  },
  {
    id: 'social-media',
    slug: 'social-media',
    title: 'Social Media Marketing',
    category: 'BRAND DOMINANCE',
    icon: Share2,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    tagline: 'Meta Ads, TikTok Campaigns & Content Creation',
    description: 'Scale your brand presence across Instagram, Facebook, TikTok, and LinkedIn with thumb-stopping video ad creatives, community engagement strategies, and targeted social ad funnels.',
    deliverables: [
      'Short-Form Vertical Video Ad Production',
      'Audience Persona & Retargeting Funnel Design',
      'Monthly Content Calendar & Asset Creation',
      'Paid Social Campaign Management & Scaling'
    ],
    popularSubServices: ['Instagram Ads', 'TikTok Advertising', 'Content Strategy', 'Community Management']
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    title: 'AI Automation',
    category: 'INTELLIGENT OPS',
    icon: Bot,
    color: 'text-[#FFB347]',
    bg: 'bg-[#FFB347]/10',
    tagline: 'Workflow Automation, CRM Sync & API Integrations',
    description: 'Automate manual processes, synchronize CRM data, build custom API workflows, and eliminate repetitive tasks with enterprise-grade AI automation solutions.',
    deliverables: [
      'Custom Workflow Automation & Triggers',
      'CRM Synchronization & Pipeline Automation',
      'Email Automation & Lead Nurturing Flows',
      'API & Webhook Integration Development'
    ],
    popularSubServices: ['Workflow Automation', 'CRM Automation', 'Email Automation', 'API Integrations']
  },
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    title: 'AI Agents for Businesses',
    category: 'INTELLIGENT OPS',
    icon: Zap,
    color: 'text-[#FF6B00]',
    bg: 'bg-[#FF6B00]/10',
    tagline: 'AI Chatbots, Voice Agents & Customer Support Automation',
    description: 'Deploy custom-trained AI agents that handle inquiries, qualify leads, book appointments, and provide 24/7 customer support. Voice, text, and WhatsApp agents available.',
    deliverables: [
      'Custom RAG-Trained AI Chatbots',
      'AI Voice Agents for Inbound Calls',
      'AI Customer Support Automation',
      'WhatsApp & Messenger AI Integration'
    ],
    popularSubServices: ['AI Chatbots', 'Voice Agents', 'Customer Support', 'WhatsApp Bots']
  },
  {
    id: 'web-apps',
    slug: 'web-apps',
    title: 'Web Application Development',
    category: 'DIGITAL INFRASTRUCTURE',
    icon: Code2,
    color: 'text-[#FF9D00]',
    bg: 'bg-[#FF9D00]/10',
    tagline: 'SaaS, CRM Systems & Custom Web Applications',
    description: 'Build custom SaaS platforms, CRM systems, admin dashboards, and AI-powered web applications with modern React, Node.js, and cloud infrastructure.',
    deliverables: [
      'Custom SaaS Platform Development',
      'CRM & ERP System Architecture',
      'Admin Dashboard & Analytics Portals',
      'API Development & Database Solutions'
    ],
    popularSubServices: ['SaaS Development', 'CRM Systems', 'Admin Dashboards', 'API Development']
  }
];

const HUB_FAQS = [
  {
    q: 'How is Preet Web Vision different from generic digital marketing agencies?',
    a: 'Unlike traditional agencies that rely on visual drag-and-drop builders and automated low-quality backlinks, we engineer custom technical architectures with clean code, sub-second page speeds, and transparent ROAS reporting. Every strategy is custom tailored to your target unit economics.'
  },
  {
    q: 'Can we combine multiple services into an integrated enterprise retainer?',
    a: 'Yes. Most of our high-growth clients combine Custom Web Development, Technical SEO, Google Ads, and AI Lead Automation into a single unified growth strategy with dedicated project management and weekly reporting.'
  },
  {
    q: 'What is your timeline for technical SEO & web development projects?',
    a: 'Custom Web Design & Development projects typically launch in 2-4 weeks. Technical SEO audits and initial fixes are implemented within the first 14 days, with measurable organic keyword ranking growth within 30-60 days.'
  },
  {
    q: 'Do you offer a free website & SEO strategy audit before onboarding?',
    a: 'Absolutely. We provide a complimentary 100+ point technical roadmap covering Core Web Vitals, keyword gaps, ad spend waste, and conversion leaks delivered within 24 hours.'
  }
];

export const ServiceHubPage = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden">
      <Helmet>
        <title>Services & Capabilities Hub | Preet Web Vision</title>
        <meta name="description" content="Explore our suite of technical SEO, Google Ads, custom web design, AI automation, social media, and email marketing services engineered for market leadership." />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#FF9D00]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO HEADER */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              AGENCY DISCIPLINE & CAPABILITY CATALOG
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-8">
            ENGINEERING YOUR <br />
            <span className="text-gradient-orange">COMPETITIVE ADVANTAGE</span>
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-3xl">
            From high-speed web development to technical SEO, Google Ads, and AI automation, we build scalable digital infrastructure engineered to drive high-margin revenue.
          </p>
        </div>

        {/* METRICS & PROOF TICKER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 p-6 rounded-3xl bg-[#121212] border border-white/10 shadow-2xl">
          <div className="p-4 text-center border-r border-b md:border-b-0 border-white/5">
            <div className="font-display text-2xl sm:text-3xl font-black text-[#FF6B00] mb-1">&lt;1.0s</div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">Mobile Speed Standard</div>
          </div>
          <div className="p-4 text-center md:border-r border-b md:border-b-0 border-white/5">
            <div className="font-display text-2xl sm:text-3xl font-black text-white mb-1">98%+</div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">Core Web Vitals Pass</div>
          </div>
          <div className="p-4 text-center border-r border-white/5">
            <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400 mb-1">4.8x</div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">Average Client ROAS</div>
          </div>
          <div className="p-4 text-center">
            <div className="font-display text-2xl sm:text-3xl font-black text-[#FFB347] mb-1">24/7</div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">AI Agent Availability</div>
          </div>
        </div>

        {/* MAIN SERVICES GRID */}
        <div className="mb-28">
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FFB347] block mb-1">
                CORE DISCIPLINES
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                OUR MAIN CAPABILITY MATRIX
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-[#8B8B8B]">
              8 Specialized Practice Areas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MAIN_SERVICE_HUBS.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div 
                  key={service.id}
                  className="p-8 rounded-3xl bg-[#121212] border border-white/10 hover:border-[#FF6B00]/40 transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 rounded-full blur-2xl group-hover/card:bg-[#FF6B00]/15 transition-all pointer-events-none" />

                  <div>
                    {/* Header Top */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FFB347]">
                        {service.category}
                      </span>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${service.bg} ${service.color}`}>
                        <ServiceIcon size={20} />
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover/card:text-[#FF6B00] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-mono text-[#FFB347] mb-4">
                      {service.tagline}
                    </p>
                    <p className="text-[#BFBFBF] text-xs font-normal leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-2.5 mb-8 pt-4 border-t border-white/5">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B] mb-2">
                        Key Capabilities Included:
                      </p>
                      {service.deliverables.map((deliv, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#BFBFBF]">
                          <Check size={14} className="text-[#FF6B00] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Popular Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {service.popularSubServices.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-[#BFBFBF] border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Link */}
                  <Link 
                    to={`/services/${service.slug}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 group/btn"
                  >
                    <span>Explore {service.title.split(' ')[0]} Hub</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-STEP EXECUTION PROCESS */}
        <div className="p-10 sm:p-14 rounded-3xl bg-[#121212] border border-white/10 mb-28 relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="px-3.5 py-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FFB347] text-xs font-mono font-bold rounded-full uppercase tracking-widest inline-block mb-4">
              EXECUTION FRAMEWORK
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              HOW WE DELIVER <span className="text-[#FF6B00]">MEASURABLE ROI</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', step: 'Technical Audit & Blueprint', desc: 'Detailed 100+ point analysis of site code, speed, search positions, and conversion leaks.' },
              { num: '02', step: 'Custom Architecture', desc: 'Hand-crafted React/WordPress code development with schema integration and fast servers.' },
              { num: '03', step: 'Conversion Optimization', desc: 'A/B testing ad copy, landing page funnels, and frictionless lead capture forms.' },
              { num: '04', step: 'Scale & Retention', desc: 'Weekly analytics reporting, ROAS tracking, and automated AI workflow improvements.' }
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#161616] border border-white/5 relative">
                <span className="font-display text-4xl font-black text-[#FF6B00] block mb-3 opacity-90">{p.num}</span>
                <h4 className="font-display text-lg font-bold uppercase text-white mb-2">{p.step}</h4>
                <p className="text-xs text-[#BFBFBF] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <div className="max-w-4xl mx-auto mb-28">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FFB347] text-xs font-mono font-bold rounded-full uppercase tracking-widest inline-block mb-4">
              CLEAR TRANSPARENCY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white">
              SERVICE & EXECUTION FAQS
            </h2>
          </div>

          <div className="space-y-4">
            {HUB_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#121212] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display text-base font-bold uppercase text-white">
                      {faq.q}
                    </span>
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

        {/* BOTTOM HIGH-CONVERTING AUDIT BANNER */}
        <div className="p-12 sm:p-16 rounded-[2.5rem] bg-gradient-to-br from-[#161616] via-[#121212] to-[#080808] border border-[#FF6B00]/40 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF6B00]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10">
            <span className="px-4 py-1.5 bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FFB347] text-xs font-mono font-bold uppercase tracking-widest rounded-full inline-block mb-6">
              COMPLIMENTARY STRATEGY SESSION
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mb-6 leading-tight">
              READY TO DOMINATE YOUR <br />
              <span className="text-[#FF6B00]">DIGITAL MARKET</span>?
            </h2>
            <p className="text-[#BFBFBF] text-sm leading-relaxed mb-8 max-w-xl mx-auto">
              Get a custom 100+ point inspection of your search rankings, Core Web Vitals, ad campaigns, and conversion bottlenecks delivered in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] hover:from-[#FF9D00] hover:to-[#FF6B00] text-white px-9 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#FF6B00]/25 transition-all hover:scale-105"
              >
                <span>Request Free Strategy Audit</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                to="/portfolio" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#161616] hover:bg-white/5 border border-white/10 text-white px-7 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
              >
                <span>View Client Case Studies</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

