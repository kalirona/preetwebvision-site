import React from 'react';
import { ReviewsSection } from './ReviewsSection';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Layout, Sparkles, Star, Code, User, CheckCircle2, 
  ChevronDown, Send, Check, HelpCircle, TrendingUp, BarChart3, 
  Award, ShieldCheck, ArrowRight, Video, Mail, Phone, Image as ImageIcon
} from 'lucide-react';

export interface SectionBlock {
  id: string;
  type: string;
  settings: any;
}

const getIconComponent = (key: string) => {
  switch(key) {
    case 'Zap': return <Zap className="text-indigo-500" size={20} />;
    case 'Layout': return <Layout className="text-indigo-500" size={20} />;
    case 'Sparkles': return <Sparkles className="text-indigo-500" size={20} />;
    case 'Star': return <Star className="text-amber-500 fill-amber-500" size={20} />;
    case 'Code': return <Code className="text-indigo-500" size={20} />;
    case 'User': return <User className="text-indigo-500" size={20} />;
    case 'TrendingUp': return <TrendingUp className="text-indigo-500" size={20} />;
    case 'BarChart3': return <BarChart3 className="text-indigo-500" size={20} />;
    case 'Award': return <Award className="text-indigo-500" size={20} />;
    case 'Shield': return <ShieldCheck className="text-indigo-500" size={20} />;
    default: return <Sparkles className="text-indigo-500" size={20} />;
  }
};

interface CmsBlockRendererProps {
  blocks: SectionBlock[];
  isFrontEditActive?: boolean;
  selectedBlockIdx?: number | null;
  onBlockClick?: (idx: number, block: SectionBlock) => void;
  updateBlockValueLocal?: (blockIdx: number, fieldPath: string, newVal: string) => void;
}

export const CmsBlockRenderer: React.FC<CmsBlockRendererProps> = ({
  blocks,
  isFrontEditActive = false,
  selectedBlockIdx = null,
  onBlockClick,
  updateBlockValueLocal
}) => {
  const [activeFaq, setActiveFaq] = React.useState<Record<string, number | null>>({});

  // Forms states keyed by block ID
  const [formFields, setFormFields] = React.useState<Record<string, { name: string; email: string; subject: string; message: string }>>({});
  const [formStatuses, setFormStatuses] = React.useState<Record<string, { submitting: boolean; success: boolean; error: string }>>({});

  const toggleFaq = (blockId: string, itemIdx: number) => {
    setActiveFaq(prev => ({
      ...prev,
      [blockId]: prev[blockId] === itemIdx ? null : itemIdx
    }));
  };

  const handleFormChange = (blockId: string, field: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || { name: '', email: '', subject: '', message: '' }),
        [field]: value
      }
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent, blockId: string, settings: any) => {
    e.preventDefault();
    const fields = formFields[blockId] || { name: '', email: '', subject: '', message: '' };
    
    if (!fields.name || !fields.email) {
      setFormStatuses(prev => ({
        ...prev,
        [blockId]: { submitting: false, success: false, error: 'Name and Email are mandatory fields.' }
      }));
      return;
    }

    setFormStatuses(prev => ({
      ...prev,
      [blockId]: { submitting: true, success: false, error: '' }
    }));

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          subject: fields.subject || settings.formTitle || 'Contact Form Submission',
          message: fields.message || 'No custom message.'
        })
      });

      if (response.ok) {
        setFormStatuses(prev => ({
          ...prev,
          [blockId]: { submitting: false, success: true, error: '' }
        }));
        setFormFields(prev => ({
          ...prev,
          [blockId]: { name: '', email: '', subject: '', message: '' }
        }));
      } else {
        setFormStatuses(prev => ({
          ...prev,
          [blockId]: { submitting: false, success: false, error: 'Could not submit your request. Please try again.' }
        }));
      }
    } catch (err) {
      setFormStatuses(prev => ({
        ...prev,
        [blockId]: { submitting: false, success: false, error: 'Failed to reach the database server.' }
      }));
    }
  };

  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {blocks.map((block, idx) => {
        const s = block.settings || {};
        const isSelected = selectedBlockIdx === idx && isFrontEditActive;

        return (
          <div
            key={block.id || idx}
            onClick={() => onBlockClick && onBlockClick(idx, block)}
            className={`relative group/cms-block transition-all duration-150 ${
              isFrontEditActive 
                ? `cursor-pointer border-2 border-dashed ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/10 ring-4 ring-indigo-500/20' 
                      : 'border-slate-200 hover:border-indigo-450 hover:bg-slate-50/40 hover:shadow-lg'
                  } min-h-[80px]'` 
                : ''
            }`}
          >
            {/* Inline Quick badge when editing */}
            {isFrontEditActive && (
              <>
                <div className="absolute top-2 left-2 z-30 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white font-mono text-[8.5px] font-black uppercase tracking-widest rounded-lg opacity-65 group-hover/cms-block:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                  <span>{block.type.toUpperCase()} ELEMENT</span>
                </div>
                
                {/* Floating pill with direct Edit controls on hover */}
                <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 opacity-0 group-hover/cms-block:opacity-100 transition-all duration-200 bg-slate-950 border border-slate-800 p-1 rounded-xl shadow-xl backdrop-blur-md">
                  <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-wider px-2 font-mono">SECT-{idx + 1}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlockClick && onBlockClick(idx, block);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[8.5px] uppercase tracking-widest rounded-[10px] flex items-center gap-1 transition-all duration-150 cursor-pointer"
                  >
                    <Sparkles size={10} /> Customize settings
                  </button>
                </div>
              </>
            )}

            {/* BLOCK LAYOUT: HERO */}
            {block.type === 'hero' && (
              <section className="relative pt-32 pb-24 overflow-hidden bg-[#080808] text-white font-sans">
                {/* Visual backdrops */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.15),transparent_60%)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                      <span className="px-3.5 py-1.5 bg-[#161616] border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold rounded-full uppercase tracking-widest inline-block">
                        AGENCY CAPABILITY
                      </span>
                      <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white">
                        {s.headline || 'HANDCRAFTING BEAUTIFUL, HIGH-CONVERTING WEBSITES.'}
                      </h1>
                      <p className="text-[#BFBFBF] text-sm md:text-lg font-normal leading-relaxed max-w-xl">
                        {s.subheadline || 'Custom WordPress themes, Shopify online stores, and organic SEO results built to grow your business.'}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-2">
                        {s.ctaText && (
                          <a
                            href={s.ctaLink || '#contact'}
                            className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white font-mono font-bold text-xs uppercase tracking-widest rounded-2xl transition duration-200 shadow-xl shadow-[#FF6B00]/20 inline-flex items-center gap-2 cursor-pointer hover:scale-105"
                          >
                            <span>{s.ctaText}</span>
                            <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] w-full bg-[#121212] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img 
                          src={s.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'} 
                          alt="Layout illustration" 
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent flex items-end p-6 md:p-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: TEXT BLOCK (Markdown) */}
            {block.type === 'markdown' && (
              <section className="py-16 bg-[#080808] text-[#BFBFBF] font-sans">
                <div className="container mx-auto px-6 max-w-4xl">
                  <div className={`prose prose-invert max-w-none text-[#BFBFBF] leading-relaxed text-sm md:text-base ${s.textAlign === 'center' ? 'text-center' : 'text-left'}`}>
                    {(s.bodyText || '').split('\n').map((line: string, lineKey: number) => {
                      if (line.startsWith('##')) {
                        return <h2 key={lineKey} className="font-display text-2xl font-black text-white tracking-tight mt-6 mb-3 uppercase">{line.replace('##', '').trim()}</h2>;
                      }
                      if (line.startsWith('#')) {
                        return <h1 key={lineKey} className="font-display text-3xl font-black text-white tracking-tight mt-8 mb-4 uppercase">{line.replace('#', '').trim()}</h1>;
                      }
                      if (line.trim() === '') return <div key={lineKey} className="h-2" />;
                      return <p key={lineKey} className="mb-4">{line}</p>;
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: HEADING BLOCK */}
            {block.type === 'heading' && (
              <section className="py-10 bg-[#121212] border-y border-white/10 font-sans">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                  {s.level === 'h1' ? (
                    <h1 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                      {s.text || 'Heading 1 Title'}
                    </h1>
                  ) : s.level === 'h3' ? (
                    <h3 className="font-display text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {s.text || 'Heading 3 Title'}
                    </h3>
                  ) : (
                    <h2 className="font-display text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                      {s.text || 'Heading 2 Title'}
                    </h2>
                  )}
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: FEATURES SECTION */}
            {block.type === 'features' && (
              <section className="py-20 bg-[#080808] border-y border-white/10 font-sans">
                <div className="container mx-auto px-6">
                  <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="px-3.5 py-1.5 bg-[#161616] border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold rounded-full uppercase tracking-widest inline-block">
                      CORE CAPABILITIES
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
                      {s.title || 'Why Our Clients Trust Us'}
                    </h2>
                    <p className="text-[#BFBFBF] font-normal text-xs md:text-sm max-w-xl mx-auto">
                      {s.description || 'We build clean, fast, and easy-to-use custom websites designed to help grow your business.'}
                    </p>
                  </div>

                  <div className={
                    (s.featuresList || []).length === 4
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                      : (s.featuresList || []).length === 2
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  }>
                    {(s.featuresList || []).map((feat: any, fIdx: number) => (
                      <div key={fIdx} className="bg-[#121212] p-8 border border-white/10 rounded-3xl shadow-xl hover:border-[#FF6B00]/40 transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#FF6B00]/30 flex items-center justify-center mb-6 text-[#FF6B00]">
                          {getIconComponent(feat.icon || 'Zap')}
                        </div>
                        <h3 className="font-display text-lg font-black text-white uppercase mb-3">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-[#BFBFBF] leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: SERVICES GRID */}
            {block.type === 'services_grid' && (
              <section className="py-20 bg-[#080808] font-sans">
                <div className="container mx-auto px-6">
                  <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="px-3.5 py-1.5 bg-[#161616] border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold rounded-full uppercase tracking-widest inline-block">
                      OUR CAPABILITY MATRIX
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
                      {s.title || 'Our Digital Services'}
                    </h2>
                    <p className="text-[#BFBFBF] font-normal text-xs md:text-sm max-w-xl mx-auto">
                      {s.subtitle || 'Choose custom solutions designed of high quality to expand your business and reach more clients.'}
                    </p>
                  </div>

                  <div className={
                    (s.servicesList || []).length === 4
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                      : (s.servicesList || []).length === 2
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  }>
                    {(s.servicesList || [
                      { title: 'Search Engine Optimization (SEO)', desc: 'Boost organic search rankings with on-page optimization, content strategies, and speed tuning.', icon: 'TrendingUp', link: '/services' },
                      { title: 'Handcrafted WordPress Development', desc: 'Secure custom-designed themes built from scratch with zero slow-loading plugins.', icon: 'Layout', link: '/services' },
                      { title: 'Website Speed Optimization', desc: 'Increase website load times, optimize media, and fix visual stability score issues.', icon: 'Zap', link: '/services' }
                    ]).map((srv: any, sIdx: number) => (
                      <div key={sIdx} className="bg-[#121212] border border-white/10 p-8 rounded-3xl hover:border-[#FF6B00]/40 transition-all duration-300 group/srv-card shadow-xl">
                        <div className="w-10 h-10 bg-[#161616] border border-[#FF6B00]/30 rounded-xl flex items-center justify-center text-[#FF6B00] mb-6">
                          {getIconComponent(srv.icon)}
                        </div>
                        <h3 className="font-display text-lg font-black uppercase text-white tracking-tight mb-2">{srv.title}</h3>
                        <p className="text-xs text-[#BFBFBF] leading-relaxed mb-6">{srv.desc}</p>
                        <a href={srv.link || '/services'} className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF6B00] group-hover/srv-card:text-[#FF9D00] inline-flex items-center gap-1.5 cursor-pointer">
                          <span>Learn More</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: STATS COUNTER */}
            {block.type === 'stats' && (
              <section className="py-16 bg-[#121212] border-y border-white/10 text-white relative font-sans">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.06),transparent)] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                  {s.title && <h2 className="text-center text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FFB347] mb-12">{s.title}</h2>}
                  <div className={
                    (s.statsList || []).length === 3
                      ? "grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center"
                      : (s.statsList || []).length === 2
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center max-w-3xl mx-auto"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center"
                  }>
                    {(s.statsList || [
                      { value: '380%', label: 'Organic Traffic Growth', desc: 'Average increase from organic design updates.' },
                      { value: '100%', label: 'Dedicated Support Response', desc: 'Support on real-world projects.' },
                      { value: '98%', label: 'SEO Friendly Layout Score', desc: 'Clean structuring recommended by Google.' },
                      { value: '120+', label: 'Successful Web Launches', desc: 'Completed for our global B2B & local clients.' }
                    ]).map((stat: any, statIdx: number) => (
                      <div key={statIdx} className="space-y-2">
                        <div className="font-display text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] tracking-tight">
                          {stat.value}
                        </div>
                        <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wide">{stat.label}</h4>
                        <p className="text-[10px] text-[#8B8B8B] leading-relaxed">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: CTA BLOCK */}
            {block.type === 'cta' && (
              <section className="py-16 bg-[#080808] font-sans">
                <div className="container mx-auto px-6 max-w-5xl">
                  <div className="bg-[#121212] border border-[#FF6B00]/40 p-10 md:p-14 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="font-display text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight max-w-2xl mx-auto">
                      {s.ctaTitle || 'Ready to improve your website rankings and speed?'}
                    </h2>
                    <p className="text-xs md:text-base text-[#BFBFBF] font-normal max-w-lg mx-auto leading-relaxed">
                      {s.ctaSubtitle || 'Request a free, friendly website speed and design audit with absolutely no obligation.'}
                    </p>
                    <div className="pt-2">
                      {s.ctaBtnText && (
                        <a
                          href={s.ctaBtnLink || '#contact'}
                          className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl transition shadow-xl shadow-[#FF6B00]/20 cursor-pointer inline-flex items-center gap-2 hover:scale-105"
                        >
                          <span>{s.ctaBtnText}</span>
                          <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: TESTIMONIALS */}
            {block.type === 'testimonials' && (
              <ReviewsSection 
                title={s.title || undefined} 
                subtitle={s.subtitle || undefined}
              />
            )}

            {/* BLOCK LAYOUT: FAQ */}
            {block.type === 'faq' && (
              <section className="py-20 bg-[#080808] font-sans">
                <div className="container mx-auto px-6 max-w-4xl">
                  <h2 className="font-display text-center text-2xl md:text-4xl font-black tracking-tight text-white uppercase mb-16">
                    {s.title || 'Frequently Asked Questions'}
                  </h2>

                  <div className="space-y-4">
                    {(s.faqItems || []).map((faq: any, fIdx: number) => {
                      const isExpanded = activeFaq[block.id] === fIdx;
                      return (
                        <div key={fIdx} className="border border-white/10 rounded-2xl overflow-hidden bg-[#121212]">
                          <button
                            type="button"
                            onClick={() => toggleFaq(block.id, fIdx)}
                            className="w-full px-6 py-5 flex justify-between items-center text-left bg-[#121212] hover:bg-[#161616] cursor-pointer transition-colors"
                          >
                            <span className="font-display text-sm md:text-base font-bold text-white uppercase">{faq.q}</span>
                            <span className={`text-[#FF6B00] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDown size={18} />
                            </span>
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 text-xs md:text-sm text-[#BFBFBF] border-t border-white/5 bg-[#161616] leading-relaxed">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: TEAM SECTION */}
            {block.type === 'team' && (
              <section className="py-20 bg-[#080808] border-y border-white/10 font-sans">
                <div className="container mx-auto px-6">
                  <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="px-3.5 py-1.5 bg-[#161616] border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold rounded-full uppercase tracking-widest inline-block">
                      EXPERT TEAM
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
                      {s.title || 'Meet Our Dedicated Team'}
                    </h2>
                    <p className="text-[#BFBFBF] font-normal text-xs md:text-sm max-w-xl mx-auto">
                      {s.subtitle || 'A small, focused team dedicated to building beautiful websites and organic search results.'}
                    </p>
                  </div>

                  <div className={
                    (s.teamList || []).length === 3
                      ? "grid grid-cols-1 sm:grid-cols-3 gap-8"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                  }>
                    {(s.teamList || [
                      { name: 'Preet Kalirona', role: 'Founder & Web Designer', avatarUrl: '/images/preet_founder.png', bio: 'Dedicated web developer and custom WordPress consultant.' },
                      { name: 'Kunal Verma', role: 'SEO Lead Strategist', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', bio: 'Helping client sites improve search rankings and organic traffic.' },
                      { name: 'Amandine L.', role: 'Creative Graphic Designer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', bio: 'Handcrafting clean website designs and modern visual identities.' },
                      { name: 'Rajesh K.', role: 'Digital Project Manager', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', bio: 'Ensuring smooth client communications and timely delivery.' }
                    ]).map((member: any, mIdx: number) => (
                      <div key={mIdx} className="bg-[#121212] p-6 rounded-3xl border border-white/10 shadow-xl text-center">
                        <img 
                          src={member.avatarUrl} 
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border border-white/10 mb-6"
                        />
                        <h4 className="font-display text-base font-black text-white uppercase leading-none">{member.name}</h4>
                        <span className="text-[10px] text-[#FFB347] font-mono font-bold uppercase tracking-widest mt-2 block mb-3">{member.role}</span>
                        <p className="text-xs text-[#BFBFBF] leading-relaxed">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: CONTACT FORM */}
            {block.type === 'contact_form' && (
              <section className="py-20 bg-[#080808] font-sans" id="contact-form">
                <div className="container mx-auto px-6 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-[#121212] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
                    {/* Left text sidebar */}
                    <div className="md:col-span-5 space-y-6">
                      <span className="px-3 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold uppercase tracking-widest rounded-full inline-block">
                        FREE STRATEGY AUDIT
                      </span>
                      <h2 className="font-display text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                        {s.formTitle || 'Request a Website Speed & Design Audit'}
                      </h2>
                      <p className="text-[#BFBFBF] text-xs leading-relaxed max-w-sm">
                        {s.formSubtitle || 'Get a friendly, detailed review of your website speed, design flaws, and easy solutions.'}
                      </p>
                      <div className="space-y-4 pt-4 text-xs font-mono text-[#BFBFBF]">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-[#FF6B00]" />
                          <span>contact@preetwebvision.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-[#FF6B00]" />
                          <span>+91 9540XXXXXX</span>
                        </div>
                      </div>
                    </div>

                    {/* Right true input columns */}
                    <div className="md:col-span-7">
                      <form onSubmit={(e) => handleFormSubmit(e, block.id, s)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            value={(formFields[block.id] || { name: '' }).name}
                            onChange={(e) => handleFormChange(block.id, 'name', e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:outline-none focus:border-[#FF6B00] rounded-xl px-4 py-3.5 text-white placeholder:text-[#8B8B8B] text-xs font-mono"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your Email *"
                            value={(formFields[block.id] || { email: '' }).email}
                            onChange={(e) => handleFormChange(block.id, 'email', e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:outline-none focus:border-[#FF6B00] rounded-xl px-4 py-3.5 text-white placeholder:text-[#8B8B8B] text-xs font-mono"
                          />
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Audit Subject (Or your URL)"
                          value={(formFields[block.id] || { subject: '' }).subject}
                          onChange={(e) => handleFormChange(block.id, 'subject', e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 focus:outline-none focus:border-[#FF6B00] rounded-xl px-4 py-3.5 text-white placeholder:text-[#8B8B8B] text-xs font-mono"
                        />
                        
                        <textarea
                          rows={4}
                          placeholder="Your Message, challenges, or specifications..."
                          value={(formFields[block.id] || { message: '' }).message}
                          onChange={(e) => handleFormChange(block.id, 'message', e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 focus:outline-none focus:border-[#FF6B00] rounded-xl px-4 py-3.5 text-white placeholder:text-[#8B8B8B] text-xs font-mono"
                        />

                        {formStatuses[block.id]?.error && (
                          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-xl leading-tight">
                            {formStatuses[block.id].error}
                          </div>
                        )}

                        {formStatuses[block.id]?.success && (
                          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-xl flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span>Thank you! We have received your request and will get back to you shortly.</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={formStatuses[block.id]?.submitting || isFrontEditActive}
                          className="w-full py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition duration-200 shadow-xl shadow-[#FF6B00]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                        >
                          <Send size={14} />
                          <span>{formStatuses[block.id]?.submitting ? 'Submitting...' : s.submitBtnText || 'Submit Request'}</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: IMAGE BLOCK */}
            {block.type === 'image_block' && (
              <section className="py-12 bg-[#080808] text-center font-sans">
                <div className="container mx-auto px-6 max-w-4xl">
                  <div className={`mx-auto ${
                    s.rounded ? 'rounded-3xl' : ''
                  } overflow-hidden inline-block border border-white/10 shadow-2xl max-h-[500px]`}>
                    <img 
                      src={s.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80'} 
                      alt={s.caption || 'CMS Display Graphic'}
                      className="object-cover max-w-full h-auto select-none"
                    />
                  </div>
                  {s.caption && <p className="text-xs text-[#8B8B8B] font-mono uppercase tracking-widest mt-4">{s.caption}</p>}
                </div>
              </section>
            )}

            {/* BLOCK LAYOUT: VIDEO BLOCK */}
            {block.type === 'video_block' && (
              <section className="py-12 bg-[#080808] font-sans">
                <div className="container mx-auto px-6 max-w-3xl">
                  <div className="relative aspect-video w-full bg-[#121212] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                    {s.videoUrl ? (
                      <iframe 
                        src={s.videoUrl.includes('youtube.com') || s.videoUrl.includes('youtu.be')
                          ? s.videoUrl.replace('watch?v=', 'embed/')
                          : s.videoUrl}
                        title={s.title || 'Dynamic Video Stream'}
                        className="w-full h-full border-0 absolute inset-0" 
                        allowFullScreen 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-[#8B8B8B]">
                        <Video size={40} className="text-[#8B8B8B]" />
                        <span className="text-xs font-mono uppercase tracking-widest">Interactive Video Stream: URL blank</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>
        );
      })}
    </div>
  );
};
