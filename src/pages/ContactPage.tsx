import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, ShieldCheck, Star, X, Check, Clock, Award, ChevronRight } from 'lucide-react';

export const ContactPage = () => {
  const [formState, setFormState] = React.useState('idle');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: 'WordPress Website Design',
    message: ''
  });
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; phone?: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()+]/g, '');
    return /^\d{7,15}$/.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; phone?: string } = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormState('loading');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="w-full pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Connect & Partner | Preet Web Vision</title>
        <meta name="description" content="Reach out to our engineering team in Gurgaon, NCR to discuss your custom web, SEO, or AI automation project." />
        <link rel="canonical" href="https://preetwebvision.com/contact" />
        <meta property="og:title" content="Connect & Partner | Preet Web Vision" />
        <meta property="og:description" content="Reach out to our engineering team in Gurgaon, NCR to discuss your custom web, SEO, or AI automation project." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://preetwebvision.com/contact" />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              INITIALIZE STRATEGIC ENGAGEMENT
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-6">
            CONNECT WITH OUR <br />
            <span className="text-gradient-orange">ENGINEERING DIRECTORS</span>
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
            Have a project in mind or need a technical speed & SEO audit? Send us a message and our lead strategist will respond within 24 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-[#121212] border border-white/10 space-y-6">
              <h3 className="font-display text-xl font-bold uppercase text-white pb-4 border-b border-white/10">Global Access Hub</h3>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#8B8B8B] uppercase">Headquarters</p>
                  <p className="text-xs font-bold text-white leading-relaxed">DLF Cyber City Phase-II, Gurgaon, Haryana, 122002</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#8B8B8B] uppercase">Direct Phone Line</p>
                  <p className="text-xs font-bold text-white">+91 99990 00000</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#8B8B8B] uppercase">Work Email</p>
                  <p className="text-xs font-bold text-white">hello@preetwebvision.com</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#161616] border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={18} className="text-[#FF6B00]" />
                <span className="text-xs font-mono font-bold text-[#FFB347] uppercase">SLA RESPONSE GUARANTEE</span>
              </div>
              <p className="text-xs text-[#BFBFBF] leading-relaxed">
                All inquiries receive a comprehensive initial response and preliminary technical audit proposal within 24 business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#121212] border border-white/10 shadow-2xl relative">
              <h2 className="font-display text-2xl font-bold uppercase text-white mb-8 pb-4 border-b border-white/10">
                Submit Project Brief
              </h2>

              {formState === 'success' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FF6B00] text-white flex items-center justify-center mx-auto shadow-xl">
                    <Check size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">Brief Successfully Deployed!</h3>
                  <p className="text-xs text-[#BFBFBF] max-w-md mx-auto">
                    Thank you for connecting with Preet Web Vision. Our engineering directors will analyze your details and reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8B8B8B] mb-2">Full Name *</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8B8B8B] mb-2">Work Email *</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@company.com"
                        className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                      />
                      {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8B8B8B] mb-2">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                      />
                      {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#8B8B8B] mb-2">Primary Interest</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                      >
                        <option value="WordPress Website Design">WordPress Custom Web Design</option>
                        <option value="Shopify Development">Shopify E-Commerce</option>
                        <option value="SEO Services">Technical SEO & Search Dominance</option>
                        <option value="Google & Meta Ads">Google Ads & Conversion Funnels</option>
                        <option value="AI Automation">AI Automation & Custom Chatbots</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#8B8B8B] mb-2">Project Brief & Details</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your company, current performance challenges, and goals..."
                      className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest shadow-xl shadow-[#FF6B00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {formState === 'loading' ? 'Transmitting Brief...' : 'Deploy Project Brief'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
