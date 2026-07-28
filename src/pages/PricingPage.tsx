import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Check, ArrowRight, Zap, ShieldCheck, HelpCircle, 
  Sparkles, DollarSign, TrendingUp, BarChart3, Calculator, Users
} from 'lucide-react';

export const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // ROI Calculator states
  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(15000);
  const [conversionRate, setConversionRate] = useState<number>(2.5);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(250);

  // Calculated ROI values
  const currentLeads = Math.round((monthlyTraffic * (conversionRate / 100)));
  const currentRevenue = Math.round(currentLeads * avgOrderValue);
  
  // Projection with PV Optimization (+65% conversion increase, +80% organic boost)
  const projectedTraffic = Math.round(monthlyTraffic * 1.8);
  const projectedConvRate = Number((conversionRate * 1.65).toFixed(2));
  const projectedLeads = Math.round(projectedTraffic * (projectedConvRate / 100));
  const projectedRevenue = Math.round(projectedLeads * avgOrderValue);
  const revenueGain = projectedRevenue - currentRevenue;

  const plans = [
    {
      name: 'Starter Growth',
      tagline: 'Ideal for growing businesses looking to dominate local search and upgrade speed.',
      monthlyPrice: 1499,
      annualPrice: 1199,
      features: [
        'Complete Technical SEO Audit & Code Cleanup',
        'Google Business Profile & Local 3-Pack Optimization',
        'Custom High-Speed 5-Page Website Architecture',
        'Sub-1s Page Load Guarantee (0.00 CLS)',
        'Monthly Organic Search Performance Reports',
        'Dedicated Technical Specialist'
      ],
      popular: false,
      cta: 'Initialize Growth'
    },
    {
      name: 'Market Dominance',
      tagline: 'Engineered for scaling companies ready to capture aggressive organic & paid market share.',
      monthlyPrice: 3499,
      annualPrice: 2799,
      features: [
        'Everything in Starter Growth',
        'Google Ads & Meta Ads Full Funnel Management',
        'Custom WordPress / Shopify E-Commerce Engine',
        '24/7 AI Lead Qualifier Integration',
        'Continuous A/B Conversion Rate Optimization (CRO)',
        'Bi-Weekly Strategy Reviews & Dedicated Slack Channel'
      ],
      popular: true,
      cta: 'Claim Market Leadership'
    },
    {
      name: 'Enterprise Scale',
      tagline: 'Bespoke growth engine for multi-channel enterprises and high-volume brands.',
      monthlyPrice: 6999,
      annualPrice: 5599,
      features: [
        'Everything in Market Dominance',
        'Multi-Channel Paid Media (Google, Meta, YouTube, LinkedIn)',
        'Custom AI Voice Agent & Autonomous CRM Workflows',
        'Headless Web Engineering & Custom API Integrations',
        'Executive Strategy Sessions & Priority 24/7 Support SLA'
      ],
      popular: false,
      cta: 'Schedule Executive Briefing'
    }
  ];

  return (
    <div className="pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen">
      <Helmet>
        <title>Pricing & ROI Investment Models | Preet Web Vision</title>
        <meta name="description" content="Transparent, performance-driven investment models for technical SEO, web development, and AI growth engineering. Use our interactive ROI calculator." />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              TRANSPARENT INVESTMENT MODELS
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-6">
            INVESTMENT BUILT FOR <br />
            <span className="text-gradient-orange">EXPONENTIAL ROI</span>
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10">
            No hidden fees or long lock-in contracts. Predictable monthly pricing models engineered to scale your digital market authority.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-2xl bg-[#161616] border border-white/10">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${!isAnnual ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'text-[#8B8B8B] hover:text-white'}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${isAnnual ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'text-[#8B8B8B] hover:text-white'}`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-md bg-[#080808] text-[#FFB347] text-[10px]">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div 
                key={idx} 
                className={`p-8 sm:p-10 rounded-3xl bg-[#121212] border transition-all flex flex-col justify-between relative ${
                  plan.popular ? 'border-[#FF6B00] shadow-2xl shadow-[#FF6B00]/15' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md">
                    MOST POPULAR MODEL
                  </div>
                )}

                <div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-[#BFBFBF] leading-relaxed mb-8">{plan.tagline}</p>

                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-bold text-[#FFB347]">$</span>
                      <span className="text-5xl font-black text-white">{price.toLocaleString()}</span>
                      <span className="text-xs text-[#8B8B8B] font-sans">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-[#BFBFBF]">
                        <Check size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/contact" 
                  className={`w-full py-4 rounded-2xl text-center text-xs font-mono font-bold uppercase tracking-widest transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white shadow-xl shadow-[#FF6B00]/30 hover:scale-[1.02]' 
                      : 'bg-[#161616] hover:bg-[#1f1f1f] text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* ROI CALCULATOR SECTION */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121212] border border-white/10 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-2">
              INTERACTIVE REVENUE SIMULATOR
            </span>
            <h2 className="font-display text-3xl font-black uppercase text-white">ESTIMATE YOUR GROWTH LIFT</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="flex justify-between text-xs font-mono text-[#BFBFBF] mb-2">
                  <span>Monthly Website Traffic:</span>
                  <span className="font-bold text-[#FFB347]">{monthlyTraffic.toLocaleString()} visitors</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={monthlyTraffic} 
                  onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                  className="w-full accent-[#FF6B00] bg-[#080808]"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-mono text-[#BFBFBF] mb-2">
                  <span>Current Conversion Rate:</span>
                  <span className="font-bold text-[#FFB347]">{conversionRate}%</span>
                </label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10" 
                  step="0.1"
                  value={conversionRate} 
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full accent-[#FF6B00] bg-[#080808]"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-mono text-[#BFBFBF] mb-2">
                  <span>Average Customer Value ($):</span>
                  <span className="font-bold text-[#FFB347]">${avgOrderValue}</span>
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="2000" 
                  step="10"
                  value={avgOrderValue} 
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full accent-[#FF6B00] bg-[#080808]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 p-8 rounded-2xl bg-[#161616] border border-white/10 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 text-center font-mono">
                <div>
                  <p className="text-[10px] text-[#8B8B8B] uppercase">Current Monthly Revenue</p>
                  <p className="text-2xl font-bold text-[#BFBFBF]">${currentRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#FFB347] uppercase">Projected Revenue</p>
                  <p className="text-2xl font-black text-[#FF6B00]">${projectedRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-mono text-[#8B8B8B] uppercase mb-1">Estimated Net Revenue Increase</p>
                <p className="text-4xl font-black text-green-400 font-mono">+${revenueGain.toLocaleString()} / mo</p>
              </div>

              <Link to="/contact" className="w-full block py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-center text-xs font-mono font-bold uppercase tracking-widest text-white shadow-xl shadow-[#FF6B00]/20">
                Claim Projected Growth Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
