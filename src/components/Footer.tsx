import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#080808] text-white relative overflow-hidden border-t border-white/10 font-sans">
      {/* Pre-Footer CTA */}
      <section className="border-b border-white/10 py-[64px] px-6 relative bg-[#121212]/60">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FF6B00]/10 rounded-full blur-[100px] pointer-events-none" />
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
               <div className="max-w-2xl text-center lg:text-left">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4 font-display">
                    READY TO DOMINATE<br /> YOUR <span className="text-gradient-orange underline uppercase">MARKET?</span>
                  </h2>
                  <p className="text-[#BFBFBF] text-lg sm:text-xl font-medium">
                    Architecting high-converting digital platforms powered by AI & performance engineering.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-5">
                  <Link to="/contact" className="bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white px-9 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-[#FF6B00]/30 transition-all text-center">
                    Initialize Engagement
                  </Link>
                  <a href="https://wa.me/919999000000" className="bg-[#161616] border border-white/10 px-9 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-center text-white">
                    WhatsApp Strategist
                  </a>
               </div>
            </div>
         </div>
      </section>

      <div className="pt-24 pb-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/40 to-transparent" />
        <div className="absolute -right-20 bottom-20 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
            <div className="lg:col-span-5">
              <Link to="/" className="flex items-center gap-4 mb-8 group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF9D00] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-[#FF6B00]/25">
                  <span className="text-white font-black text-2xl">P</span>
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase underline decoration-[#FF6B00] decoration-4 font-display">Preet Web Vision</span>
              </Link>
              <p className="text-[#BFBFBF] mb-8 max-w-sm leading-relaxed font-medium text-base">
                Elite growth engineering for brands that refuse to settle for average. Data-driven, human-centered, and performance-obsessed.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-11 h-11 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white hover:-translate-y-1 transition-all duration-300 bg-[#161616] text-[#BFBFBF]">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFB347] mb-8 font-mono">Services</h4>
              <ul className="space-y-4">
                <li><Link to="/services/seo" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">SEO Services</Link></li>
                <li><Link to="/services/google-ads" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Google & Meta Ads</Link></li>
                <li><Link to="/services/web-design" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Web Design</Link></li>
                <li><Link to="/services/ecommerce-development" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">E-Commerce</Link></li>
                <li><Link to="/services/ai-automation" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">AI Automation</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFB347] mb-8 font-mono">Ecosystem</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">About Agency</Link></li>
                <li><Link to="/case-studies" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Portfolio</Link></li>
                <li><Link to="/pricing" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Pricing & ROI</Link></li>
                <li><Link to="/blog" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Growth Journal</Link></li>
                <li><Link to="/contact" className="text-[#BFBFBF] hover:text-[#FF6B00] transition-colors font-bold text-xs uppercase tracking-wider">Connect</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFB347] mb-8 font-mono">Global Access</h4>
              <ul className="space-y-6">
                <li className="flex gap-3 items-start text-[#BFBFBF]">
                  <MapPin size={18} className="shrink-0 text-[#FF6B00] mt-0.5" />
                  <span className="text-xs font-medium leading-relaxed">DLF Cyber City Phase-II, <br /> Gurgaon, Haryana, 122002</span>
                </li>
                <li className="flex gap-3 items-center text-[#BFBFBF]">
                  <Phone size={18} className="shrink-0 text-[#FF6B00]" />
                  <span className="text-xs font-medium">+91 99990 00000</span>
                </li>
                <li className="flex gap-3 items-center text-[#BFBFBF]">
                  <Mail size={18} className="shrink-0 text-[#FF6B00]" />
                  <span className="text-xs font-medium">hello@preetwebvision.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-mono text-[#8B8B8B]">
            <p className="uppercase tracking-widest">
              © {new Date().getFullYear()} Built by Preet Web Vision Group.
            </p>
            <div className="flex gap-8 uppercase tracking-widest">
              <Link to="/privacy-ops" className="hover:text-white transition-colors">Privacy Ops</Link>
              <Link to="/terms-of-engagement" className="hover:text-white transition-colors">Terms of Engagement</Link>
              <Link to="/legal-brief" className="hover:text-white transition-colors">Legal Brief</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
