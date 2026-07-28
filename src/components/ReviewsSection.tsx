import React from 'react';
import { Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getTestimonialsForService } from '../data/testimonialsData';

interface ReviewsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  slug?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  className = '', 
  title = 'TRUSTED BY AMBITIOUS BUSINESSES',
  subtitle = 'Genuine feedback from clients who partner with us for transparent engineering, speed optimization, and revenue growth.',
  slug
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Extract slug from path if not provided
  const activeSlug = slug || currentPath.split('/').filter(Boolean).pop() || 'general';
  const reviews = getTestimonialsForService(activeSlug);

  // Derive service-aware copy when standard default headers are present
  const getServiceHeaderCopy = (slugStr: string) => {
    const s = slugStr.toLowerCase();
    if (s.includes('seo')) {
      return {
        badge: 'VERIFIABLE SEO & RANKINGS',
        title: 'CLIENT PROOF IN ORGANIC SEARCH',
        subtitle: 'Real growth stories from partners who achieved Page 1 rankings, domain authority, and lower acquisition costs.'
      };
    }
    if (s.includes('ads') || s.includes('google-ads') || s.includes('meta') || s.includes('tiktok') || s.includes('linkedin')) {
      return {
        badge: 'VERIFIABLE CAMPAIGN & ROAS IMPACT',
        title: 'PROVEN PAID MEDIA PERFORMANCE',
        subtitle: 'Authentic feedback from brands scaling profitably with targeted PPC, social ads, and conversion funnels.'
      };
    }
    if (s.includes('ai') || s.includes('automation') || s.includes('chatbot')) {
      return {
        badge: 'VERIFIABLE WORKFLOW EFFICIENCY',
        title: 'AI & AUTOMATION CLIENT SUCCESS',
        subtitle: 'See how companies save hundreds of labor hours using custom chatbots, voice agents, and CRM webhooks.'
      };
    }
    if (s.includes('speed') || s.includes('vitals') || s.includes('security') || s.includes('performance')) {
      return {
        badge: 'VERIFIABLE CORE WEB VITALS',
        title: 'UNMATCHED SPEED & SECURITY PROOF',
        subtitle: 'Discover how sub-second page rendering and hardened infrastructure drive conversion rates for our partners.'
      };
    }
    if (s.includes('design') || s.includes('wordpress') || s.includes('shopify') || s.includes('ecommerce') || s.includes('branding')) {
      return {
        badge: 'VERIFIABLE UI & CODE RESULTS',
        title: 'TRUSTED BY GROWTH-DRIVEN BRANDS',
        subtitle: 'Client feedback on bespoke web design, custom Gutenberg themes, and high-converting e-commerce builds.'
      };
    }
    return {
      badge: 'VERIFIABLE CLIENT RESULTS',
      title: 'TRUSTED BY AMBITIOUS BUSINESSES',
      subtitle: 'Genuine feedback from clients who partner with us for transparent engineering, speed optimization, and revenue growth.'
    };
  };

  const autoCopy = getServiceHeaderCopy(activeSlug);
  const displayTitle = title === 'TRUSTED BY AMBITIOUS BUSINESSES' ? autoCopy.title : title;
  const displaySubtitle = subtitle === 'Genuine feedback from clients who partner with us for transparent engineering, speed optimization, and revenue growth.' ? autoCopy.subtitle : subtitle;
  const displayBadge = autoCopy.badge;

  return (
    <section className={`py-24 bg-[#080808] text-white border-t border-b border-white/10 relative overflow-hidden font-sans ${className}`}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Rating Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#FF6B00]/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FFB347]">
                {displayBadge}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {displayTitle}
            </h2>
            <p className="text-[#BFBFBF] text-sm sm:text-base leading-relaxed mt-4 max-w-xl">
              {displaySubtitle}
            </p>
          </div>
          
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Google trust card */}
            <div className="p-6 bg-[#121212] border border-white/10 rounded-3xl flex flex-col justify-between hover:border-[#FF6B00]/40 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                 <svg className="w-8 h-8 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FFB347] bg-[#161616] border border-white/10 px-2.5 py-1 rounded-full">
                   4.9 Rating
                 </span>
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-2xl font-black text-white">4.9</span>
                    <div className="flex text-amber-400">
                       {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                    </div>
                 </div>
                 <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">Google Business Reviews</p>
                 <p className="text-[#BFBFBF] text-[10px] font-mono mt-0.5">Based on 84 business reviews</p>
              </div>
            </div>

            {/* Trustpilot trust card */}
            <div className="p-6 bg-[#121212] border border-white/10 rounded-3xl flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1.5">
                    <svg className="w-7 h-7 text-emerald-400 fill-emerald-400" viewBox="0 0 24 24">
                       <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="font-mono font-bold text-xs tracking-tight text-white">Trustpilot</span>
                 </div>
                 <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                   Excellent
                 </span>
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-2xl font-black text-white">4.8</span>
                    <div className="flex gap-0.5">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-3.5 h-3.5 bg-emerald-500 flex items-center justify-center rounded-sm">
                            <svg className="w-2.5 h-2.5 text-white fill-white" viewBox="0 0 24 24">
                               <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                         </div>
                       ))}
                    </div>
                 </div>
                 <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B]">Trustpilot Rating</p>
                 <p className="text-[#BFBFBF] text-[10px] font-mono mt-0.5">From 112 audited active stories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews dynamic list layout */}
        <div className={
          reviews.length === 4 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : reviews.length === 2
            ? "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {reviews.map((t, i) => (
            <div key={i} className="p-8 bg-[#121212] border border-white/10 rounded-3xl hover:bg-[#161616] hover:border-[#FF6B00]/40 transition-all duration-300 group flex flex-col justify-between shadow-xl">
               <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                     <div className="flex items-center gap-1.5">
                        {t.origin === 'Google' ? (
                           <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                              </svg>
                              <span className="text-[9px] font-mono uppercase text-[#8B8B8B] tracking-wider">Google Review</span>
                           </div>
                        ) : (
                           <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 fill-emerald-400 text-emerald-400" viewBox="0 0 24 24">
                                 <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider">Trustpilot Review</span>
                           </div>
                        )}
                     </div>
                     <div className="flex text-amber-400">
                        {[...Array(t.stars)].map((_, idx) => <Star key={idx} size={11} className="fill-amber-400 text-amber-400" />)}
                     </div>
                  </div>

                  <p className="text-[#BFBFBF] font-normal text-xs leading-relaxed mb-6">
                     "{t.content}"
                  </p>
               </div>

               <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#161616]">
                     <img src={`${t.img}?auto=format&fit=facearea&facepad=2&w=150&h=150&q=80`} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                     <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">{t.name}</span>
                        {t.verified && (
                           <span className="inline-flex items-center bg-emerald-950/60 text-[8px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                              Verified
                           </span>
                        )}
                     </div>
                     <p className="text-[10px] text-[#8B8B8B] truncate">{t.role} — <span className="text-[#BFBFBF] font-semibold">{t.company}</span></p>
                     <p className="text-[8px] font-mono text-[#8B8B8B] uppercase tracking-widest mt-0.5">
                        {t.date} {t.location ? `• ${t.location}` : ''}
                     </p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
