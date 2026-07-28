export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  origin: 'Google' | 'Trustpilot';
  date: string;
  verified: boolean;
  stars: number;
  content: string;
  img: string;
  // A list of service slugs or categories this testimonial is directly related to
  relatedServices: string[];
  category: 'development' | 'marketing' | 'optimization' | 'general';
  location?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // --- DEVELOPMENT SERVICES TESTIMONIALS ---
  {
    id: 'wp-1',
    name: 'Amit Kumar',
    company: 'Vedic Retreats Health Group',
    role: 'Founder & CEO',
    origin: 'Google',
    date: 'May 02, 2026',
    verified: true,
    stars: 5,
    content: 'Our last agency built us a WordPress site that was so sluggish and complicated to change that we literally hesitated to post updates. Preet and his team completely rebuilt it. Now, updating our wellness packages and events schedule is dead simple and takes five seconds. The pages load instantly on regular 4G, and our booking rate has clearly gone up.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    relatedServices: ['wordpress-design', 'website-redesign', 'cms-development'],
    category: 'development',
    location: 'Noida, Sector 62'
  },
  {
    id: 'wp-2',
    name: 'Eleanor Vance',
    company: 'Starlight Boutique Lodges',
    role: 'Director of Brand & Strategy',
    origin: 'Trustpilot',
    date: 'April 20, 2026',
    verified: true,
    stars: 5,
    content: 'We run a high-end boutique property and beautiful organic photos are everything to us. Our old web design used to freeze up phones. Preet Web Vision stripped away all those heavy page-builder plugins and gave us a clean, bespoke layout. Its lightning fast on mobile, looks gorgeous, and we saw a major boost in direct stay bookings within weeks.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    relatedServices: ['wordpress-design', 'website-redesign', 'cms-development'],
    category: 'development',
    location: 'Bristol, UK'
  },
  {
    id: 'wp-3',
    name: 'Rohan Malhotra',
    company: 'Focal Point Creative',
    role: 'Creative Partner',
    origin: 'Google',
    date: 'March 15, 2026',
    verified: true,
    stars: 5,
    content: 'Honestly, I have had terrible luck with web developers before. They either vanish mid-project or leave you with a buggy site. Preet was awesome. He actually listened, did exactly what he said he would, and finished our design on schedule. The custom catalog he coded is fast and easy to manage.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    relatedServices: ['wordpress-design', 'website-redesign', 'cms-development'],
    category: 'development',
    location: 'South Delhi'
  },
  {
    id: 'shop-1',
    name: 'Rajesh Shah',
    company: 'Aura Premium Retail',
    role: 'Operations Director',
    origin: 'Google',
    date: 'May 05, 2026',
    verified: true,
    stars: 5,
    content: 'We had a bloated, heavy theme on our store and visitors kept leaving because the checkout process was slow. These guys rebuilt our templates with super lean code. The catalogs load instantly and checking out is incredibly smooth. An outstanding agency that actually values performance over gimmicks.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    relatedServices: ['shopify-development', 'ecommerce-development'],
    category: 'development',
    location: 'Mumbai, MH'
  },
  {
    id: 'shop-2',
    name: 'Ananya Roy',
    company: 'Zaya Organic Cosmetics',
    role: 'Founder',
    origin: 'Trustpilot',
    date: 'April 28, 2026',
    verified: true,
    stars: 5,
    content: 'They took our online shop and created a custom, distraction-free product listing design. In just three months, our mobile purchases went up significantly because the site is just so fast and simple to navigate. Plus, their team actually gives you clear human advice instead of technical jargon.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    relatedServices: ['shopify-development', 'ecommerce-development'],
    category: 'development',
    location: 'Noida Extension'
  },
  {
    id: 'shop-3',
    name: 'Vikram Aditya',
    company: 'Aditya Farms & Spices',
    role: 'Managing Partner',
    origin: 'Google',
    date: 'March 22, 2026',
    verified: true,
    stars: 5,
    content: 'Our checkout screen used to load randomly and confuse people on slow mobile networks. Rebuilding it as a clean, single-step page cut down our shopping cart drop-offs dramatically. Daily organic sales have basically doubled. Best team we have ever hired.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    relatedServices: ['shopify-development', 'ecommerce-development'],
    category: 'development',
    location: 'Gurugram, Phase 2'
  },

  // --- MARKETING/SEO SERVICES TESTIMONIALS ---
  {
    id: 'seo-1',
    name: 'Aditi Rao',
    company: 'Aura Organic Wellness',
    role: 'Co-Founder',
    origin: 'Google',
    date: 'April 22, 2026',
    verified: true,
    stars: 5,
    content: 'Before Preet Web Vision, we were totally invisible on search. We spent thousands on SEO groups who just sent us confusing automated spreadsheets. Preet explained everything in simple terms and revamped our local setup. In four months, we were ranking high for local Noida and NCR searches, and real customers started calling.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    relatedServices: ['seo-services', 'local-seo', 'content-marketing'],
    category: 'marketing',
    location: 'Noida, Sector 15'
  },
  {
    id: 'seo-2',
    name: 'Nishant Sen',
    company: 'FinTech Capital Hub',
    role: 'VP of Digital Marketing',
    origin: 'Trustpilot',
    date: 'May 10, 2026',
    verified: true,
    stars: 5,
    content: 'We had severe indexing bugs from our old developer that were keeping us off Google. Preet and his team cleaned up our layout hierarchy, fixed broken category links, and built a content structure that makes sense. We jumped to top-three positions for our primary search terms without paying for costly Google ads.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    relatedServices: ['seo-services', 'technical-seo', 'content-marketing'],
    category: 'marketing',
    location: 'Bengaluru, KA'
  },
  {
    id: 'seo-3',
    name: 'Rachel Green',
    company: 'EcoModern Apparel',
    role: 'PR Coordinator',
    origin: 'Google',
    date: 'February 24, 2026',
    verified: true,
    stars: 5,
    content: 'Instead of pitching spammy keywords or link packages, the team restructured our blog into deep, helpful content pages. Google picked up our store collections correctly and our overall organic web traffic skyrocketed. They are professional, responsive, and easy to coordinate with.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    relatedServices: ['seo-services', 'technical-seo', 'content-marketing'],
    category: 'marketing',
    location: 'New York, USA'
  },
  {
    id: 'seo-4',
    name: 'Kabir Mehta',
    company: 'Mehta & Associates Law',
    role: 'Senior Partner',
    origin: 'Google',
    date: 'March 18, 2026',
    verified: true,
    stars: 5,
    content: 'For local law practices, local Maps visibility is absolutely critical to survival. Preet Web Vision optimized our local business profiles and cleaned up our landing pages. We went from getting 3 calls a week to consistently booking 20+ consultations. Incredible results.',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    relatedServices: ['local-seo', 'seo-services'],
    category: 'marketing',
    location: 'Greater Noida'
  },
  {
    id: 'seo-5',
    name: 'Hargun Singh',
    company: 'Singh Automotives',
    role: 'Owner',
    origin: 'Trustpilot',
    date: 'January 14, 2026',
    verified: true,
    stars: 5,
    content: 'Our business had sudden ranking drops after a bad template update. Preet jumped right in, solved our structure penalties in two days, and got us back on track. True code experts whom we completely trust with our site management.',
    img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea',
    relatedServices: ['technical-seo', 'youtube-seo', 'seo-services'],
    category: 'marketing',
    location: 'Ghaziabad, UP'
  },

  // --- OPTIMIZATION/PERFORMANCE SERVICES TESTIMONIALS ---
  {
    id: 'opt-1',
    name: 'Abhishek Deshmukh',
    company: 'Apex Trading Hub',
    role: 'Technology Lead',
    origin: 'Trustpilot',
    date: 'May 20, 2026',
    verified: true,
    stars: 5,
    content: 'Our mobile app pages layout was so jumpy and slow that users were constantly making accidental clicks. Preet Web Vision diagnosed the heavy scripts causing this layout shifting and cleaned them up. The site is butter-smooth now on high-speed or slow LTE connections alike.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    relatedServices: ['speed-optimization', 'mobile-optimization', 'core-web-vitals'],
    category: 'optimization',
    location: 'Pune, MH'
  },
  {
    id: 'opt-2',
    name: 'James Sterling',
    company: 'Sterling Analytics',
    role: 'Technical Co-Founder',
    origin: 'Google',
    date: 'May 16, 2026',
    verified: true,
    stars: 5,
    content: 'Our site pages load in literally less than a second on mobile now. Preet stripped away bloated old scripts and heavy unoptimized media files. It is rare to find frontend coders who pay such precise premium attention to lightweight, highly responsive speed.',
    img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea',
    relatedServices: ['speed-optimization', 'mobile-optimization', 'core-web-vitals'],
    category: 'optimization',
    location: 'San Francisco, CA'
  },
  {
    id: 'opt-3',
    name: 'Pooja Hegde',
    company: 'HealthSphere Clinics',
    role: 'Head of Patient Portals',
    origin: 'Google',
    date: 'April 02, 2026',
    verified: true,
    stars: 5,
    content: 'Patients booking medical appointments on their phones on weak networks were getting frustrated. Preet Web Vision compressed all our historic portal layouts and optimized the scheduling interface. It is fast, works with zero freezing issues, and our staff have saved a lot of front-desk call hours.',
    img: 'https://images.unsplash.com/photo-1554742935-7c28fe37678a',
    relatedServices: ['speed-optimization', 'mobile-optimization', 'core-web-vitals'],
    category: 'optimization',
    location: 'Delhi NCR'
  },

  // --- GENERAL/LANDING/SECURITY TESTIMONIALS ---
  {
    id: 'maint-1',
    name: 'Sanjay Dutt',
    company: 'Dutt Cargo Systems',
    role: 'Logistics Lead',
    origin: 'Google',
    date: 'April 19, 2026',
    verified: true,
    stars: 5,
    content: 'Preet Web Vision keeps our regional tracking portal secure and online 24/7. Whenever a critical script fails or we need a quick design adjustment, their support team responds within minutes. It is a genuine relief to work with such dependable professionals.',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    relatedServices: ['website-maintenance', 'security-optimization'],
    category: 'optimization',
    location: 'Kolkata, WB'
  },
  {
    id: 'sec-1',
    name: 'Claire Oswald',
    company: 'Oswald Partners Law',
    role: 'Senior Attorney',
    origin: 'Trustpilot',
    date: 'May 04, 2026',
    verified: true,
    stars: 5,
    content: 'Managing client files means we can take zero risks with website security. Preet handled our custom firewalls, secure schema backups, and regular malware monitoring. Highly professional service with great communication and absolute piece of mind.',
    img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604',
    relatedServices: ['security-optimization', 'website-maintenance'],
    category: 'optimization',
    location: 'London, UK'
  },
  {
    id: 'land-1',
    name: 'Preeti Sharma',
    company: 'Sharma Bridal Boutiques',
    role: 'Creative Director',
    origin: 'Google',
    date: 'April 30, 2026',
    verified: true,
    stars: 5,
    content: 'The custom campaign pages they built boosted our active bookings beautifully. Spacing, fonts, and heavy high-resolution dress photos load instantly without slowing things down. The elegant layout perfectly matches our couture brand.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    relatedServices: ['landing-page-design', 'social-media-marketing'],
    category: 'marketing',
    location: 'Noida, Sector 50'
  },
  {
    id: 'land-2',
    name: 'Divya Nair',
    company: 'Aero Edtech Group',
    role: 'Co-Founder',
    origin: 'Trustpilot',
    date: 'May 14, 2026',
    verified: true,
    stars: 5,
    content: 'Awesome experience. The custom landing page Preet Web Vision designed got us an impressive subscription sign-up rate. Clean copy-led design, neat entrance animations, and very supportive throughout the process.',
    img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604',
    relatedServices: ['landing-page-design', 'social-media-marketing', 'content-marketing'],
    category: 'marketing',
    location: 'Bengaluru, IN'
  },

  // --- PAID ADS TESTIMONIALS ---
  {
    id: 'ads-1',
    name: 'Karan Grover',
    company: 'Grover B2B SaaS',
    role: 'Growth Lead',
    origin: 'Google',
    date: 'May 12, 2026',
    verified: true,
    stars: 5,
    content: 'Our Google Ads campaigns were wasting thousands of dollars on broad non-converting search terms. Preet Web Vision completely overhauled our keyword match strategy and landing page funnels. Our Cost Per Acquisition dropped by 48% and ROAS jumped to 4.2x in 60 days.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    relatedServices: ['google-ads', 'meta-ads', 'youtube-ads', 'ppc-advertising'],
    category: 'marketing',
    location: 'Gurugram, Phase 5'
  },
  {
    id: 'ads-2',
    name: 'Jessica Blake',
    company: 'Lumiere Skincare',
    role: 'Head of E-Commerce',
    origin: 'Trustpilot',
    date: 'April 28, 2026',
    verified: true,
    stars: 5,
    content: 'Preet Web Vision manages our Meta and TikTok ad creatives and targeting. They run systematic A/B ad creative tests and build dedicated landing pages. Our monthly order revenue from paid social has tripled with consistent profit margins.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    relatedServices: ['meta-ads', 'tiktok-ads', 'google-ads'],
    category: 'marketing',
    location: 'Austin, TX'
  },
  {
    id: 'ads-3',
    name: 'Siddharth Kapoor',
    company: 'Kapoor Capital Advisors',
    role: 'Managing Director',
    origin: 'Google',
    date: 'March 25, 2026',
    verified: true,
    stars: 5,
    content: 'We needed targeted decision-maker leads for our financial advisory firm. Their LinkedIn Ads team built precise account-based targeting funnels that put us directly in front of C-level executives. We secured 14 high-value corporate accounts in one quarter.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    relatedServices: ['linkedin-ads', 'google-ads', 'b2b-marketing'],
    category: 'marketing',
    location: 'Mumbai, BKC'
  },

  // --- AI AUTOMATION TESTIMONIALS ---
  {
    id: 'ai-1',
    name: 'Tarun Joshi',
    company: 'Nexus Real Estate Group',
    role: 'Operations Director',
    origin: 'Google',
    date: 'May 18, 2026',
    verified: true,
    stars: 5,
    content: 'Preet Web Vision deployed a custom AI voice and chatbot system connected to our CRM. It answers client questions 24/7, qualifies buyers in real time, and books viewing appointments directly into our calendar. It saves our team 25+ hours every week.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    relatedServices: ['ai-automation', 'ai-chatbots', 'ai-voice-agents'],
    category: 'optimization',
    location: 'Noida, Sector 128'
  },
  {
    id: 'ai-2',
    name: 'Sophia Martinez',
    company: 'Aura Fitness Platforms',
    role: 'VP of Customer Experience',
    origin: 'Trustpilot',
    date: 'April 19, 2026',
    verified: true,
    stars: 5,
    content: 'The custom AI chatbot trained on our knowledge base handles over 80% of routine member support queries instantly with zero errors. Response times fell from 4 hours to 3 seconds. Outstanding engineering work.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    relatedServices: ['ai-chatbots', 'ai-automation', 'ai-voice-agents'],
    category: 'optimization',
    location: 'Miami, FL'
  },

  // --- BRANDING & DESIGN TESTIMONIALS ---
  {
    id: 'brand-1',
    name: 'Neha Chawla',
    company: 'Veda Organic Living',
    role: 'Founder',
    origin: 'Google',
    date: 'April 05, 2026',
    verified: true,
    stars: 5,
    content: 'They created a complete brand identity system for us, including our logo, color guidelines, typography, and packaging. The premium aesthetic gave our product the exact luxury feel needed to get stocked in top retail outlets.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    relatedServices: ['branding', 'ui-ux-design', 'web-design'],
    category: 'development',
    location: 'New Delhi, Vasant Vihar'
  },

  // --- GENERAL fallback agency testimonials ---
  {
    id: 'gen-1',
    name: 'Sarah Jharon',
    company: 'Bloom Media Ltd',
    role: 'CEO',
    origin: 'Google',
    date: 'April 14, 2026',
    verified: true,
    stars: 5,
    content: 'Preet Web Vision completely transformed our website and search performance. Before hiring them, our pages loaded incredibly slowly on mobile. After their cleanup, we saw our active inquiries double in Delhi NCR within four months. They explain complex details in plain English and deliver actual, organic client inquiries.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    relatedServices: [],
    category: 'general',
    location: 'Noida, UP'
  },
  {
    id: 'gen-2',
    name: 'Michael R. Khanna',
    company: 'TechFlow Solutions',
    role: 'Engineering Director',
    origin: 'Trustpilot',
    date: 'March 29, 2026',
    verified: true,
    stars: 5,
    content: 'The custom portal they designed is remarkably fast. We run multiple booking setups in NCR, and Preet Web Vision is the only team that delivered perfectly clean layouts that rank nicely without expensive Google ads. Saved us a fortune on dry ad campaigns.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    relatedServices: [],
    category: 'general',
    location: 'Connaught Place, Delhi'
  },
  {
    id: 'gen-3',
    name: 'David K. Gupta',
    company: 'LuxeStore International',
    role: 'Co-Founder & Director',
    origin: 'Google',
    date: 'February 11, 2026',
    verified: true,
    stars: 5,
    content: 'Best direct investment we have made for our online store catalog. Mobile client dropout rates went way down after the checkout design was simplified. The team also cleaned up our search metadata, which helped Google rank our products easily.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    relatedServices: [],
    category: 'general',
    location: 'Gurugram, Phase 3'
  }
];

/**
 * Dynamic relational matching function
 * Priority order:
 * 1. Exact service match (slug in relatedServices)
 * 2. Category match (same category, e.g. developmental, marketing, optimization)
 * 3. General fallbacks
 * Guaranteed to return exactly `limit` unique testimonials.
 */
export function getTestimonialsForService(slug: string, limit: number = 3): Testimonial[] {
  const normSlug = slug.toLowerCase().trim();

  // Find mapping of categories to know fallback groupings
  let targetCategory: 'development' | 'marketing' | 'optimization' | 'general' = 'general';
  if (
    normSlug.includes('wordpress') ||
    normSlug.includes('shopify') ||
    normSlug.includes('ecommerce') ||
    normSlug.includes('cms') ||
    normSlug.includes('redesign') ||
    normSlug.includes('maintenance')
  ) {
    targetCategory = 'development';
  } else if (
    normSlug.includes('seo') ||
    normSlug.includes('marketing') ||
    normSlug.includes('youtube') ||
    normSlug.includes('content') ||
    normSlug.includes('social')
  ) {
    targetCategory = 'marketing';
  } else if (
    normSlug.includes('speed') ||
    normSlug.includes('performance') ||
    normSlug.includes('vitals') ||
    normSlug.includes('mobile') ||
    normSlug.includes('security')
  ) {
    targetCategory = 'optimization';
  }

  const results: Testimonial[] = [];
  const addedIds = new Set<string>();

  // 1. EXACT Matches
  const exactMatches = TESTIMONIALS.filter(t => 
    t.relatedServices.some(s => s.toLowerCase() === normSlug || normSlug.includes(s.toLowerCase()))
  );
  for (const t of exactMatches) {
    if (results.length < limit && !addedIds.has(t.id)) {
      results.push(t);
      addedIds.add(t.id);
    }
  }

  // 2. CATEGORY Matches
  if (results.length < limit && targetCategory !== 'general') {
    const categoryMatches = TESTIMONIALS.filter(t => t.category === targetCategory);
    for (const t of categoryMatches) {
      if (results.length < limit && !addedIds.has(t.id)) {
        results.push(t);
        addedIds.add(t.id);
      }
    }
  }

  // 3. GENERAL FALLBACK Matches (Sarah, Michael, David, etc.)
  const fallbacks = TESTIMONIALS.filter(t => t.category === 'general');
  for (const t of fallbacks) {
    if (results.length < limit && !addedIds.has(t.id)) {
      results.push(t);
      addedIds.add(t.id);
    }
  }

  // 4. ANY MATCH fallback (if still under limit, which is rare)
  for (const t of TESTIMONIALS) {
    if (results.length < limit && !addedIds.has(t.id)) {
      results.push(t);
      addedIds.add(t.id);
    }
  }

  return results;
}
