import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import Markdown from 'react-markdown';
import { cmsService } from '../services/cmsService';
import { CmsBlockRenderer, SectionBlock } from '../components/CmsBlockRenderer';
import { SERVICES } from '../constants';
import { ReviewsSection } from '../components/ReviewsSection';
import { getTestimonialsForService } from '../data/testimonialsData';

// Strict SEO-driven block rendering weight order
const TYPE_WEIGHTS: Record<string, number> = {
  'hero': 10,
  'markdown': 20,
  'heading': 25,
  'stats': 30,
  'features': 40,
  'testimonials': 50,
  'faq': 60,
  'cta': 70,
  'contact_form': 80,
  'image_block': 90,
  'video_block': 100,
};

const getHeroImageUrl = (slug: string, category: string) => {
  const s = (slug || '').toLowerCase();
  if (s.includes('seo') || s.includes('search') || s.includes('audit')) {
    return 'https://images.unsplash.com/photo-1504868584819-f8eecf021749?auto=format&fit=crop&w=1200&q=80';
  }
  if (s.includes('ads') || s.includes('ppc') || s.includes('google-ads') || s.includes('meta-ads') || s.includes('linkedin') || s.includes('tiktok') || s.includes('youtube')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  }
  if (s.includes('shop') || s.includes('ecommerce') || s.includes('cart') || s.includes('checkout') || s.includes('shopify')) {
    return 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80';
  }
  if (s.includes('ai') || s.includes('automation') || s.includes('bot') || s.includes('voice')) {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
  }
  if (s.includes('speed') || s.includes('vitals') || s.includes('security') || s.includes('technical')) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80';
  }
  if (s.includes('social') || s.includes('email') || s.includes('brand') || s.includes('community')) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80';
};

const SUB_SERVICES: Record<string, { title: string; desc: string; benefits: string[]; icon: string }[]> = {
  'web-design': [
    { title: 'Business Websites', desc: 'Professional business websites engineered to project authority, generate leads, and establish your brand as an industry leader.', benefits: ['Custom CMS Integration', 'Lead Capture Funnels', 'Brand Alignment', 'SEO Foundation'], icon: 'Briefcase' },
    { title: 'Corporate Websites', desc: 'Enterprise-grade corporate websites with advanced functionality, multi-language support, and scalable architecture.', benefits: ['Enterprise Architecture', 'Multi-Language Support', 'Advanced Security', 'Team Collaboration Tools'], icon: 'Building2' },
    { title: 'WordPress Development', desc: 'Custom WordPress themes and plugins built with clean code, Gutenberg blocks, and performance optimization.', benefits: ['Custom Theme Design', 'Advanced Security', 'LMS & Portal Integration', 'Gutenberg & React Optimization'], icon: 'Globe' },
    { title: 'Landing Pages', desc: 'High-converting landing pages engineered to turn paid ad traffic into paying customers with surgical precision.', benefits: ['A/B Testing Integration', 'Direct Response Copywriting', 'Speed-Optimized Layouts', 'Clear CTAs'], icon: 'MousePointer2' },
    { title: 'Responsive Design', desc: 'Mobile-first responsive designs that deliver flawless experiences across all devices and screen sizes.', benefits: ['Mobile-First Approach', 'Cross-Browser Compatibility', 'Touch Optimization', 'Fluid Grid Layouts'], icon: 'Smartphone' },
    { title: 'Website Redesign', desc: 'Complete website transformations that modernize your brand, improve UX, and boost conversion rates.', benefits: ['UX Audit & Research', 'Modern UI Refresh', 'Performance Upgrade', 'SEO Preservation'], icon: 'RefreshCw' },
    { title: 'Website Maintenance', desc: 'Ongoing maintenance, security updates, performance monitoring, and content updates to keep your site running smoothly.', benefits: ['24/7 Uptime Monitoring', 'Security Patches', 'Speed Optimization', 'Content Updates'], icon: 'Wrench' }
  ],
  'ecommerce-development': [
    { title: 'Shopify Development', desc: 'Custom Shopify Plus stores with bespoke themes, optimized checkout flows, and seamless app integrations.', benefits: ['Custom Theme Development', 'Checkout Optimization', 'App Integration', 'Sub-Second Load Times'], icon: 'ShoppingBag' },
    { title: 'WooCommerce Development', desc: 'High-performance WooCommerce stores with custom product configurations, subscription models, and membership features.', benefits: ['Custom Product Configurations', 'Subscription Models', 'Membership Features', 'Inventory Management'], icon: 'ShoppingCart' },
    { title: 'Wix Ecommerce', desc: 'Professional Wix stores with custom designs, inventory management, and integrated marketing tools.', benefits: ['Custom Wix Design', 'Inventory Management', 'Marketing Integration', 'SEO Optimization'], icon: 'Layout' },
    { title: 'Custom Ecommerce', desc: 'Bespoke e-commerce solutions built from the ground up for unique business models and complex requirements.', benefits: ['Custom Architecture', 'Unique Business Logic', 'Scalable Infrastructure', 'Full Ownership'], icon: 'Code2' },
    { title: 'Store Migration', desc: 'Seamless migration from Magento, WooCommerce, BigCommerce, or custom platforms without SEO loss.', benefits: ['Zero Downtime Migration', 'SEO Preservation', 'Data Integrity', 'Post-Migration Support'], icon: 'ArrowRightLeft' },
    { title: 'Payment Integration', desc: 'Multi-currency payment gateways with PCI-compliant security and seamless checkout experiences.', benefits: ['Multi-Currency Support', 'PCI Compliance', 'Fraud Protection', 'One-Click Checkout'], icon: 'CreditCard' },
    { title: 'Ecommerce SEO', desc: 'Technical SEO for product pages, category optimization, and product schema markup for maximum visibility.', benefits: ['Product Schema Markup', 'Category Optimization', 'Faceted Navigation SEO', 'Review Optimization'], icon: 'Search' }
  ],
  'seo': [
    { title: 'Local SEO', desc: 'Dominate local search results and Google Maps with hyper-targeted location-based optimization strategies.', benefits: ['Google Business Profile', 'Citation Building', 'Local Keyword Targets', 'Review Management'], icon: 'MapPin' },
    { title: 'Technical SEO', desc: 'Fix hidden technical issues preventing your website from ranking and scaling in search results.', benefits: ['Search Index Tuning', 'Core Web Vitals', 'Schema Deployment', 'Site Architecture Fixes'], icon: 'Cpu' },
    { title: 'Ecommerce SEO', desc: 'Rank product catalogs and category pages on high-intent commercial keywords to drive organic sales.', benefits: ['Product Schema', 'Faceted Navigation SEO', 'Category Clustering', 'Review Optimization'], icon: 'ShoppingBasket' },
    { title: 'Enterprise SEO', desc: 'Scalable SEO operations for large-scale websites, multi-location brands, and international enterprises.', benefits: ['Internationalization (hreflang)', 'Massive Page Audits', 'Log File Analysis', 'Custom Reporting'], icon: 'Globe' },
    { title: 'SEO Audits', desc: 'In-depth 100+ point technical, content, and backlink audit with actionable growth roadmaps.', benefits: ['100+ Diagnostic Points', 'Competitor Gap Analysis', 'Action Plan', 'Executive Briefing'], icon: 'CheckSquare' },
    { title: 'Keyword Research', desc: 'Data-driven keyword discovery and intent mapping to target high-value search opportunities.', benefits: ['Intent Mapping', 'Competitor Analysis', 'Long-Tail Discovery', 'Search Volume Analysis'], icon: 'Search' },
    { title: 'Link Building', desc: 'Ethical, high-authority backlink acquisition through digital PR, guest posting, and strategic partnerships.', benefits: ['Digital PR', 'Guest Posting', 'Broken Link Building', 'Competitor Backlink Analysis'], icon: 'Link2' },
    { title: 'Content Optimization', desc: 'Optimize existing content and create new content strategies that rank for target keywords.', benefits: ['Content Audits', 'Topic Clusters', 'Internal Linking', 'Readability Optimization'], icon: 'FileText' },
    { title: 'International SEO', desc: 'Multi-country and multi-language SEO strategies for global brands expanding into new markets.', benefits: ['Hreflang Implementation', 'Geo-Targeting', 'Localized Content', 'International Keyword Research'], icon: 'Languages' }
  ],
  'google-ads': [
    { title: 'Search Ads', desc: 'High-intent search campaigns that capture buyers at the exact moment they search for your products.', benefits: ['Keyword Targeting', 'Ad Copy Testing', 'Quality Score Optimization', 'Conversion Tracking'], icon: 'Search' },
    { title: 'Shopping Ads', desc: 'Product listing ads optimized for maximum visibility, click-through rates, and ROAS.', benefits: ['Product Feed Optimization', 'Smart Shopping', 'Price Competitiveness', 'Merchant Center Management'], icon: 'ShoppingBag' },
    { title: 'Performance Max', desc: 'AI-powered campaign optimization across all Google channels for maximum conversion efficiency.', benefits: ['Cross-Channel Reach', 'Automated Bidding', 'Creative Optimization', 'Audience Signals'], icon: 'Zap' },
    { title: 'Display Ads', desc: 'Visual display campaigns with strategic placement and retargeting to build brand awareness.', benefits: ['Audience Targeting', 'Remarketing Lists', 'Visual Creative', 'Placement Optimization'], icon: 'Monitor' },
    { title: 'Video Ads', desc: 'YouTube and video campaign strategies that engage viewers and drive measurable conversions.', benefits: ['In-Stream Ads', 'Bumper Ads', 'TrueView', 'Video SEO'], icon: 'Video' },
    { title: 'Retargeting', desc: 'Strategic retargeting campaigns that re-engage website visitors and convert abandoned leads.', benefits: ['Dynamic Remarketing', 'Audience Segmentation', 'Frequency Capping', 'Cross-Device Tracking'], icon: 'RefreshCw' }
  ],
  'social-media': [
    { title: 'Content Strategy', desc: 'Comprehensive social media content strategies aligned with your brand voice and business goals.', benefits: ['Content Calendar', 'Brand Voice Guidelines', 'Visual Identity', 'Platform-Specific Strategy'], icon: 'FileText' },
    { title: 'Paid Social Ads', desc: 'Targeted social media advertising campaigns across Meta, LinkedIn, TikTok, and X.', benefits: ['Audience Targeting', 'Ad Creative', 'A/B Testing', 'ROAS Optimization'], icon: 'Target' },
    { title: 'Community Management', desc: 'Active community engagement, comment moderation, and customer relationship building.', benefits: ['24/7 Response SLA', 'Brand Voice Guidelines', 'Crisis Prevention', 'Customer Support Sync'], icon: 'Users' },
    { title: 'Analytics & Reporting', desc: 'Data-driven social media analytics and reporting to measure ROI and optimize performance.', benefits: ['Performance Dashboards', 'Competitor Analysis', 'ROI Tracking', 'Actionable Insights'], icon: 'BarChart3' }
  ],
  'ai-automation': [
    { title: 'Workflow Automation', desc: 'Automate repetitive business processes with custom workflow triggers and intelligent routing.', benefits: ['Process Automation', 'Task Routing', 'Approval Workflows', 'Time Savings'], icon: 'Zap' },
    { title: 'CRM Automation', desc: 'Synchronize customer data, automate follow-ups, and streamline sales pipeline management.', benefits: ['Lead Scoring', 'Automated Follow-ups', 'Pipeline Management', 'Data Sync'], icon: 'Database' },
    { title: 'Email Automation', desc: 'Automated email sequences for lead nurturing, customer onboarding, and retention campaigns.', benefits: ['Welcome Sequences', 'Abandoned Cart Flows', 'List Segmentation', 'Custom HTML Design'], icon: 'Mail' },
    { title: 'API Integrations', desc: 'Custom API connections between your business tools, CRMs, and marketing platforms.', benefits: ['RESTful APIs', 'Webhook Setup', 'Data Transformation', 'Real-Time Sync'], icon: 'Code2' },
    { title: 'Lead Automation', desc: 'Automated lead capture, qualification, and distribution to your sales team in real-time.', benefits: ['Lead Capture', 'Auto-Qualification', 'Smart Routing', 'CRM Integration'], icon: 'Users' },
    { title: 'Business Automation', desc: 'End-to-end business process automation connecting sales, marketing, and operations.', benefits: ['Process Mapping', 'System Integration', 'Scalable Architecture', 'ROI Tracking'], icon: 'Building2' }
  ],
  'ai-agents': [
    { title: 'AI Chatbots', desc: 'Intelligent conversational agents trained on your business data to handle inquiries and qualify leads 24/7.', benefits: ['RAG Knowledge Base', 'Website Integration', 'Lead Capture', 'Multi-Language Support'], icon: 'MessageSquare' },
    { title: 'AI Voice Agents', desc: 'Natural-sounding voice assistants that handle inbound calls, schedule appointments, and process orders.', benefits: ['Natural Speech AI', 'Calendar Sync', 'Call Transcriptions', 'CRM Logging'], icon: 'PhoneCall' },
    { title: 'AI Customer Support', desc: 'Automated support agents that resolve common issues and escalate complex problems intelligently.', benefits: ['Ticket Automation', 'Knowledge Base Integration', 'Sentiment Analysis', 'Escalation Logic'], icon: 'Headphones' },
    { title: 'AI Sales Agents', desc: 'Proactive sales assistants that engage visitors, qualify leads, and nurture prospects through conversations.', benefits: ['Lead Qualification', 'Product Recommendations', 'Follow-up Automation', 'Conversion Tracking'], icon: 'TrendingUp' },
    { title: 'AI Appointment Booking', desc: 'Smart scheduling agents that integrate with calendars, handle availability, and reduce no-shows.', benefits: ['Calendar Integration', 'Automated Reminders', 'Multi-User Scheduling', 'No-Show Reduction'], icon: 'Calendar' },
    { title: 'AI WhatsApp Agents', desc: 'WhatsApp-integrated AI assistants that manage customer communication on the world\'s most popular messaging platform.', benefits: ['WhatsApp API', 'Rich Media Support', 'Template Messages', '24/7 Availability'], icon: 'MessageCircle' },
    { title: 'AI Website Assistants', desc: 'Website-embedded AI assistants that guide visitors, answer questions, and drive conversions in real-time.', benefits: ['Live Chat Integration', 'Proactive Engagement', 'Page Context Awareness', 'Analytics Dashboard'], icon: 'Globe' }
  ],
  'web-apps': [
    { title: 'SaaS Applications', desc: 'Multi-tenant SaaS platforms with subscription management, user roles, and scalable cloud infrastructure.', benefits: ['Multi-Tenant Architecture', 'Subscription Management', 'User Roles & Permissions', 'Cloud Scalability'], icon: 'Cloud' },
    { title: 'CRM Systems', desc: 'Custom CRM platforms tailored to your sales pipeline, customer journey, and team workflows.', benefits: ['Pipeline Management', 'Contact Management', 'Email Integration', 'Reporting Dashboard'], icon: 'Users' },
    { title: 'ERP Systems', desc: 'Enterprise resource planning solutions connecting inventory, finance, HR, and operations.', benefits: ['Inventory Management', 'Financial Tracking', 'HR Integration', 'Operations Dashboard'], icon: 'Database' },
    { title: 'Customer Portals', desc: 'Self-service portals where clients can track orders, manage accounts, and access resources.', benefits: ['Order Tracking', 'Account Management', 'Ticket System', 'Resource Library'], icon: 'Globe' },
    { title: 'Admin Dashboards', desc: 'Real-time analytics dashboards with customizable widgets and data visualization.', benefits: ['Real-Time Data', 'Custom Widgets', 'Data Export', 'User Management'], icon: 'BarChart3' },
    { title: 'AI Web Apps', desc: 'Intelligent web applications powered by machine learning, NLP, and predictive analytics.', benefits: ['ML Integration', 'NLP Capabilities', 'Predictive Analytics', 'Automated Insights'], icon: 'Brain' },
    { title: 'API Development', desc: 'RESTful and GraphQL APIs designed for performance, security, and seamless integrations.', benefits: ['RESTful & GraphQL', 'API Security', 'Documentation', 'Rate Limiting'], icon: 'Code2' },
    { title: 'Database Solutions', desc: 'Scalable database architecture for high-performance applications with real-time sync.', benefits: ['SQL & NoSQL', 'Real-Time Sync', 'Data Migration', 'Backup & Recovery'], icon: 'HardDrive' }
  ]
};

const getCategoryAdvantages = (title: string, category: string) => {
  if (category === 'marketing') {
    return [
      { title: 'Sub-Second Page Speed', desc: 'Accelerated loading speeds that reduce acquisition costs and boost ad quality scores.', icon: 'Zap' },
      { title: 'Data-Driven ROI Modeling', desc: 'Campaign strategies mapped directly to sales pipeline metrics, not vanity clicks.', icon: 'BarChart3' },
      { title: 'Semantic Schema Native', desc: 'Structured data layers that convey topical intent directly to search algorithms.', icon: 'Shield' },
      { title: 'High-Intent Copywriting', desc: 'Direct-response messaging designed to convert cold visitors into qualified buyers.', icon: 'TrendingUp' },
      { title: 'Real-Time ROI Reporting', desc: 'Live transparent analytics showing active rankings, lead volume, and campaign ROAS.', icon: 'Award' },
      { title: 'Dedicated Strategy Team', desc: 'Direct access to senior growth engineers with proactive campaign optimizations.', icon: 'Sparkles' }
    ];
  }
  if (category === 'optimization') {
    return [
      { title: 'Automated Operations', desc: 'Eliminate repetitive manual tasks and copy-pasting across your business stack.', icon: 'Zap' },
      { title: 'Sub-Second Core Vitals', desc: 'Pass Google Core Web Vitals checks to maintain search rankings and user trust.', icon: 'Award' },
      { title: 'Fortified Cyber Protection', desc: 'Enterprise encryption protocols, API proxies, and regular automated vulnerability scans.', icon: 'Shield' },
      { title: 'Infinite Scalability', desc: 'Architecture built to handle sudden traffic spikes and catalog growth effortlessly.', icon: 'BarChart3' },
      { title: 'Seamless CRM Integrations', desc: 'Real-time synchronization across HubSpot, Salesforce, Zoho, and custom APIs.', icon: 'Code' },
      { title: '24/7 Monitoring & Support', desc: 'Proactive uptime tracking and automated error alerts to prevent outages.', icon: 'Sparkles' }
    ];
  }
  return [
    { title: 'Sub-Second Page Loads', desc: 'We target and achieve PageSpeed scores of 95+ on mobile and desktop platforms.', icon: 'Zap' },
    { title: 'Custom Clean Code', desc: 'Zero bloated plugins or slow page builders—built on lightweight, maintainable code.', icon: 'Code' },
    { title: 'Mobile-First Responsiveness', desc: 'Flawless display and fluid touch interactions across all mobile and wide screens.', icon: 'Layout' },
    { title: 'Fortified Cyber Security', desc: 'Hardened root structures, malware protection, and automated cloud backups.', icon: 'Shield' },
    { title: 'Conversion Architecture', desc: 'Strategic layout patterns based on eye-tracking and user interaction heatmaps.', icon: 'TrendingUp' },
    { title: 'No Vendor Lock-In', desc: 'Clean, standard-compliant code so any developer can manage or scale your platform.', icon: 'Sparkles' }
  ];
};

const getCategoryFaqs = (title: string, category: string) => {
  if (category === 'marketing') {
    return [
      { q: `How quickly can we expect measurable results from ${title}?`, a: `Initial campaign setup takes 5-7 business days. Paid campaigns generate instant traffic, while organic search strategies compound exponentially over 60 to 90 days.` },
      { q: 'How do you measure and report ROI?', a: 'We set up end-to-end conversion tracking connecting ad clicks and search visits directly to your CRM leads and revenue metrics.' },
      { q: 'Will we have full ownership of our ad accounts and data?', a: 'Yes. You retain 100% ownership of all accounts, tracking pixels, search console data, and analytics assets.' },
      { q: 'What is your strategy for optimizing customer acquisition cost (CAC)?', a: 'We optimize ad quality scores, refine landing page conversion rates, and prune non-converting search terms to lower CPA systematically.' }
    ];
  }
  if (category === 'optimization') {
    return [
      { q: `Is ${title} safe for our existing website and data?`, a: 'Yes. All optimizations are deployed in a staging environment first and backed up before live push with zero downtime.' },
      { q: 'How does speed optimization impact our search rankings?', a: 'Page speed and Core Web Vitals are official Google ranking signals. Faster sites get crawled more frequently and rank higher.' },
      { q: 'Can you integrate custom APIs with our existing software?', a: 'Yes, we engineer custom Express middleware and webhook bridges connecting any software platform securely.' },
      { q: 'What happens if a third-party API changes or fails?', a: 'We implement automated fallback routines and Slack alert triggers so any connection issue is resolved immediately.' }
    ];
  }
  return [
    { q: `What is the standard timeline for a ${title} project?`, a: 'Standard builds take 3 to 6 weeks from initial wireframing to staging testing and live launch.' },
    { q: 'Will our internal team be able to update content easily?', a: 'Yes. We curate intuitive, custom block editing dashboards so non-technical staff can update pages in minutes.' },
    { q: 'Is mobile responsiveness guaranteed across all devices?', a: 'Absolutely. Every design is built following a mobile-first philosophy and tested across multiple screen resolutions.' },
    { q: 'Do you offer ongoing maintenance and support after launch?', a: 'Yes, we provide technical monitoring, security upgrades, speed maintenance, and priority developer support plans.' }
  ];
};

const buildStandardServiceBlocks = (service: any): SectionBlock[] => {
  const cat = service.category || 'development';
  const sTitle = service.title || 'Digital Service';
  const sDesc = service.description || 'Custom high-performance engineering solution built for speed, security, and conversion.';
  const sSlug = (service.slug || 'general').toLowerCase();

  const heroBlock: SectionBlock = {
    id: `${sSlug}-hero`,
    type: 'hero',
    settings: {
      headline: `${sTitle.toUpperCase()} ENGINEERED FOR MAXIMUM ROI.`,
      subheadline: sDesc,
      ctaText: 'Schedule Free Strategy Audit',
      ctaLink: '/contact',
      imageUrl: getHeroImageUrl(sSlug, cat)
    }
  };

  const rawContent = typeof service.content === 'string' ? service.content : '';
  const isJson = rawContent.trim().startsWith('[');
  const markdownText = !isJson && rawContent.trim().length > 30
    ? rawContent
    : `## High-Impact ${sTitle} Architecture\n\nIn today's competitive digital marketplace, your platform must be engineered for sub-second page loads, maximum search visibility, and frictionless conversions. At **Preet Web Vision**, we combine strategic insight with clean-code execution to deliver measurable growth.\n\n### Why Choose Our ${sTitle} Strategy:\n1. **Sub-Second Speed**: Optimized for Google's Core Web Vitals to deliver near-instant loading.\n2. **Conversion Architecture**: Strategic placement of conversion triggers and lead capture funnels.\n3. **SEO Native**: Embedded schema metadata, semantic headings, and clean URL routing.\n4. **Scalable Infrastructure**: Built on modern, secure frameworks designed to support long-term growth.`;

  const introBlock: SectionBlock = {
    id: `${sSlug}-intro`,
    type: 'markdown',
    settings: {
      textAlign: 'left',
      bodyText: markdownText
    }
  };

  const defaultFeatures = service.features && Array.isArray(service.features) && service.features.length >= 3
    ? service.features.map((f: string, i: number) => ({
        title: f,
        desc: `High-precision execution of ${f.toLowerCase()} tailored to your brand goals.`,
        icon: i === 0 ? 'Layout' : i === 1 ? 'Zap' : i === 2 ? 'Shield' : 'Sparkles'
      }))
    : [
        { title: 'Custom Architecture', desc: `Tailored ${sTitle} strategy built around your specific commercial objectives.`, icon: 'Layout' },
        { title: 'Performance Optimization', desc: 'Sub-second rendering speed that minimizes bounce rates and pleases search crawlers.', icon: 'Zap' },
        { title: 'Conversion Tracking', desc: 'Full analytics integration to monitor leads, revenue impact, and user engagement.', icon: 'BarChart3' }
      ];

  const spectrumBlock: SectionBlock = {
    id: `${sSlug}-spectrum`,
    type: 'features',
    settings: {
      title: `Our ${sTitle} Performance Spectrum`,
      description: 'Discover our core technical focus points designed to eliminate friction and maximize conversion rates.',
      featuresList: defaultFeatures
    }
  };

  const categoryAdvantages = getCategoryAdvantages(sTitle, cat);
  const whyBlock: SectionBlock = {
    id: `${sSlug}-why`,
    type: 'features',
    settings: {
      title: 'Why Growth-Driven Brands Choose Us',
      description: 'We are code-first digital architects dedicated to producing real business results, speed dominance, and organic lead volume.',
      featuresList: categoryAdvantages
    }
  };

  const testimonials = getTestimonialsForService(service.slug || 'general', 3);
  const testimonialsBlock: SectionBlock = {
    id: `${sSlug}-testimonials`,
    type: 'testimonials',
    settings: {
      title: 'Endorsed by Growth Leaders',
      testimonialsList: testimonials.map(t => ({
        name: t.name,
        text: t.content,
        position: `${t.role}, ${t.company}`,
        avatarUrl: t.img
      }))
    }
  };

  const faqs = service.faqs && Array.isArray(service.faqs) && service.faqs.length > 0
    ? service.faqs
    : getCategoryFaqs(sTitle, cat);

  const faqBlock: SectionBlock = {
    id: `${sSlug}-faq`,
    type: 'faq',
    settings: {
      title: 'Frequently Addressed Inquiries',
      faqItems: faqs
    }
  };

  const ctaBlock: SectionBlock = {
    id: `${sSlug}-cta`,
    type: 'cta',
    settings: {
      ctaTitle: `Ready to elevate your ${sTitle.toLowerCase()} performance?`,
      ctaSubtitle: 'Request a comprehensive strategy audit indicating performance bottlenecks, search gaps, and technical opportunities. 100% free.',
      ctaBtnText: 'Schedule My Free Audit',
      ctaBtnLink: '/contact',
      ctaTheme: 'dark'
    }
  };

  return [heroBlock, introBlock, spectrumBlock, whyBlock, testimonialsBlock, faqBlock, ctaBlock];
};

interface ServicePageProps {
  overrideSlug?: string;
}

export const ServicePage = ({ overrideSlug }: ServicePageProps) => {
  const { slug: routeSlug } = useParams();
  const slug = overrideSlug || routeSlug;
  const [service, setService] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [formState, setFormState] = React.useState('idle');
  const [formData, setFormData] = React.useState({ name: '', email: '', website: '' });
  const [allServicesList, setAllServicesList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchServiceAndAll = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await cmsService.getServiceBySlug(slug);
        setService(data);

        // Fetch other services to aggregate related paths dynamically
        const response = await fetch('/api/services');
        let dynamicList: any[] = [];
        if (response.ok) {
          const fetched = await response.json();
          if (Array.isArray(fetched)) {
            dynamicList = fetched;
          }
        }
        
        // Unify with presets to have a comprehensive pool (avoid duplicates)
        const existingSlugs = new Set(dynamicList.map((s: any) => s.slug));
        const filteredPresets = SERVICES.filter(
          s => !existingSlugs.has(s.slug) && s.slug !== slug
        );
        setAllServicesList([...dynamicList, ...filteredPresets]);
      } catch (e) {
        console.error("Retrieval for related services failed:", e);
        setAllServicesList(SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndAll();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-32 bg-[#080808] min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!service) return <Navigate to="/services" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      await cmsService.submitLead({
        name: formData.name,
        email: formData.email,
        website_url: formData.website,
        service_interest: service.title,
        source: 'audit_form'
      });
      setFormState('success');
    } catch (error) {
      setFormState('error');
    }
  };

  // Dynamically select 3 distinct, highly relevant related services per active service page
  const getRelevantRelatedServices = () => {
    if (!allServicesList || allServicesList.length === 0) return [];
    
    // Candidates exclude current service by slug, id, or exact title
    const candidates = allServicesList.filter(
      (s: any) => s.slug !== slug && s.id !== service?.id && s.title?.toLowerCase() !== service?.title?.toLowerCase()
    );

    if (candidates.length === 0) return [];

    const currentCat = service?.category || 'development';

    // Seeded pseudo-shuffle using slug ASCII characters so each service page gets a unique, stable list
    const slugSeed = (slug || 'default').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const sortWithSeed = (arr: any[]) => {
      return [...arr].sort((a, b) => {
        const seedA = (a.slug || a.id || '').split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
        const seedB = (b.slug || b.id || '').split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
        return ((seedA * 13 + slugSeed) % 23) - ((seedB * 13 + slugSeed) % 23);
      });
    };

    const sameCat = candidates.filter((s: any) => s.category === currentCat);
    const otherCat = candidates.filter((s: any) => s.category !== currentCat);

    const sortedSame = sortWithSeed(sameCat);
    const sortedOther = sortWithSeed(otherCat);

    const chosen: any[] = [];
    // Pick up to 2 from same category + 1 from another category for balanced related solutions
    if (sortedSame.length > 0) chosen.push(sortedSame[0]);
    if (sortedSame.length > 1) chosen.push(sortedSame[1]);
    if (sortedOther.length > 0) chosen.push(sortedOther[0]);

    // Fill up to 3 if needed from remaining candidates without duplicates
    const fallbackPool = [...sortedSame, ...sortedOther];
    for (const item of fallbackPool) {
      if (chosen.length >= 3) break;
      if (!chosen.some(c => c.slug === item.slug)) {
        chosen.push(item);
      }
    }

    return chosen.slice(0, 3);
  };

  const relatedServices = getRelevantRelatedServices();

  // Custom section copy per service category/discipline
  const getRelatedSectionMeta = () => {
    const cat = service?.category || 'development';
    const sSlug = (slug || '').toLowerCase();

    if (sSlug.includes('seo') || sSlug.includes('ads') || sSlug.includes('marketing') || cat === 'marketing') {
      return {
        badge: 'INTEGRATED MARKETING STACK',
        title: 'COMPLEMENTARY GROWTH CHANNELS',
        description: 'Amplify your ROI by pairing search engine authority, paid media campaigns, and automated lead nurturing.'
      };
    }
    if (sSlug.includes('speed') || sSlug.includes('vitals') || sSlug.includes('security') || sSlug.includes('ai') || cat === 'optimization') {
      return {
        badge: 'PERFORMANCE & AUTOMATION MATRIX',
        title: 'FULL-STACK OPTIMIZATION CAPABILITIES',
        description: 'Fortify your web infrastructure with Core Web Vitals acceleration, technical security, and AI workflow intelligence.'
      };
    }
    return {
      badge: 'CONNECTED DIGITAL ARCHITECTURES',
      title: 'ALLIED ENGINEERING BLUEPRINTS',
      description: 'Build a high-converting digital presence by connecting custom web design, speed tuning, and search engine visibility.'
    };
  };

  const relatedMeta = getRelatedSectionMeta();

  // Detect visual block structure & apply stable auto-sorting guarantees 
  let isSerializedVisual = false;
  let blocksList: SectionBlock[] = [];
  try {
    const parsed = JSON.parse(service.content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      isSerializedVisual = true;
      blocksList = [...parsed];
    }
  } catch {
    isSerializedVisual = false;
  }

  if (!isSerializedVisual || blocksList.length === 0) {
    blocksList = buildStandardServiceBlocks(service);
    isSerializedVisual = true;
  } else {
    // Guarantee missing core blocks (testimonials, faq, cta) are supplemented for complete SEO & CRO layout
    const existingTypes = new Set(blocksList.map(b => b.type));
    const sSlug = service.slug || 'general';
    const cat = service.category || 'development';
    const sTitle = service.title || 'Digital Service';

    if (!existingTypes.has('testimonials')) {
      const testimonials = getTestimonialsForService(sSlug, 3);
      blocksList.push({
        id: `${sSlug}-testimonials`,
        type: 'testimonials',
        settings: {
          title: 'Endorsed by Growth Leaders',
          testimonialsList: testimonials.map(t => ({
            name: t.name,
            text: t.content,
            position: `${t.role}, ${t.company}`,
            avatarUrl: t.img
          }))
        }
      });
    }

    if (!existingTypes.has('faq')) {
      const faqs = service.faqs && Array.isArray(service.faqs) && service.faqs.length > 0
        ? service.faqs
        : getCategoryFaqs(sTitle, cat);
      blocksList.push({
        id: `${sSlug}-faq`,
        type: 'faq',
        settings: {
          title: 'Frequently Addressed Inquiries',
          faqItems: faqs
        }
      });
    }

    if (!existingTypes.has('cta')) {
      blocksList.push({
        id: `${sSlug}-cta`,
        type: 'cta',
        settings: {
          ctaTitle: `Ready to elevate your ${sTitle.toLowerCase()} performance?`,
          ctaSubtitle: 'Request a comprehensive strategy audit indicating performance bottlenecks, search gaps, and technical opportunities. 100% free.',
          ctaBtnText: 'Schedule My Free Audit',
          ctaBtnLink: '/contact',
          ctaTheme: 'dark'
        }
      });
    }
  }

  // Stable sort order: hero -> markdown(intro) -> breakdowns -> testimonials -> faq -> cta
  blocksList = [...blocksList].sort((a, b) => {
    const wA = TYPE_WEIGHTS[a.type] !== undefined ? TYPE_WEIGHTS[a.type] : 999;
    const wB = TYPE_WEIGHTS[b.type] !== undefined ? TYPE_WEIGHTS[b.type] : 999;
    if (wA !== wB) return wA - wB;
    return 0; // keeps relative positions stable (e.g., breakdown vs choose-us features blocks)
  });

  const hasTestimonialsBlock = isSerializedVisual && blocksList.some(b => b.type === 'testimonials');

  const seoTitle = service.seo?.metaTitle || `${service.title} | Preet Web Vision`;
  const seoDesc = service.seo?.metaDescription || service.description;

  // Render Schema.org structural metadata dynamically
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": seoDesc,
    "provider": {
      "@type": "Organization",
      "name": "Preet Web Vision",
      "url": "https://preetwebvision.com"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Expert Digital Agency Capabilities",
      "itemListElement": (service.features || []).map((f: string, i: number) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": f
        }
      }))
    }
  };

  // Compile FAQ questions dynamically from standard field + visual blocks
  const faqList: { q: string; a: string }[] = [];
  if (service.faqs && Array.isArray(service.faqs)) {
    service.faqs.forEach((item: any) => {
      if (item && item.q && item.a) {
        faqList.push({ q: item.q, a: item.a });
      }
    });
  }
  if (isSerializedVisual && Array.isArray(blocksList)) {
    blocksList.forEach((block) => {
      if (block.type === 'faq' && block.settings && Array.isArray(block.settings.faqItems)) {
        block.settings.faqItems.forEach((item: any) => {
          if (item && item.q && item.a) {
            faqList.push({ q: item.q, a: item.a });
          }
        });
      }
    });
  }

  const faqSchemaJson = faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://preetwebvision.com/services/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
        {faqSchemaJson && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchemaJson)}
          </script>
        )}
      </Helmet>

      {/* Main Page Content Body split dynamically by visual blocks vs fallback markdown */}
      <div className="flex-grow">
        {isSerializedVisual ? (
          <>
            <div className="font-sans">
              <CmsBlockRenderer blocks={blocksList} />
            </div>
            
            {/* Sub-Services Section */}
            {SUB_SERVICES[slug || ''] && (
              <section className="py-28 bg-[#121212] border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[160px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.3em] block mb-3">
                      SPECIALIZED CAPABILITIES
                    </span>
                    <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
                      OUR <span className="text-gradient-orange">SUB-SERVICES</span>
                    </h2>
                    <p className="text-[#BFBFBF] text-base leading-relaxed">
                      Explore our comprehensive range of specialized solutions within {service.title}. Each service is engineered for maximum performance and results.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SUB_SERVICES[slug || ''].map((sub, idx) => {
                      const subIcon = sub.icon;
                      return (
                        <motion.div
                          key={sub.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05, duration: 0.5 }}
                          className="p-8 rounded-2xl bg-[#161616] border border-white/10 hover:border-[#FF6B00]/50 hover:shadow-2xl hover:shadow-[#FF6B00]/10 transition-all duration-300 group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center mb-6 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300">
                            <span className="text-2xl font-black">{sub.title.charAt(0)}</span>
                          </div>
                          <h3 className="font-display text-xl font-bold mb-3 tracking-tight text-white uppercase">
                            {sub.title}
                          </h3>
                          <p className="text-[#BFBFBF] mb-6 text-sm leading-relaxed">
                            {sub.desc}
                          </p>
                          <ul className="space-y-2">
                            {sub.benefits.map((benefit, bi) => (
                              <li key={bi} className="flex items-center gap-2.5 text-xs text-[#BFBFBF]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-16 text-center">
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF6B00]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      <span>Start Your Project</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <Link to="/services" className="inline-flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-widest text-[#BFBFBF] hover:text-[#FF6B00] mb-12 transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#FF6B00]" /> 
                <span>Back to Service Hub</span>
              </Link>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#121212]"
                  >
                    <img 
                      src={`https://images.unsplash.com/photo-${service.id === 'wp-dev' ? '1467232004584-a241de8bcf5d' : service.id === 'seo-gen' ? '1504868584819-f8eecf021749' : '1551434678-e076c223a692'}?auto=format&fit=crop&w=1200&q=80`} 
                      alt={service.title} 
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                       <span className="px-3 py-1 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold uppercase tracking-widest inline-block mb-3">
                         AGENCY DISCIPLINE
                       </span>
                       <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">{service.title}</h1>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="prose prose-invert max-w-none text-[#BFBFBF] leading-relaxed font-sans"
                  >
                    <div className="markdown-body">
                      <Markdown>{service.content}</Markdown>
                    </div>
                  </motion.div>

                  {service.faqs && service.faqs.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-white/10">
                      <h3 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#FFB347] mb-8">Service Deep-Dive FAQ</h3>
                      <div className="space-y-6">
                        {service.faqs.map((faq: any, i: number) => (
                          <div key={i} className="bg-[#121212] border border-white/10 p-8 rounded-3xl">
                            <p className="font-display font-extrabold text-lg mb-3 text-white">Q: {faq.q}</p>
                            <p className="text-[#BFBFBF] leading-relaxed font-normal text-sm">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5">
                  <div className="sticky top-28 space-y-8">
                    <div className="bg-[#121212] rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/10">
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] absolute top-0 left-0" />
                      <span className="px-3 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FFB347] text-[9px] font-mono font-bold uppercase tracking-wider rounded-full inline-block mb-4">
                        FREE STRATEGY AUDIT
                      </span>
                      <h4 className="font-display text-2xl font-black mb-3 uppercase tracking-tight text-white">GET FREE GROWTH AUDIT</h4>
                      <p className="text-[#BFBFBF] mb-8 font-normal text-xs leading-relaxed">We'll inspect your digital architecture, Core Web Vitals, and keyword opportunities with a zero-cost 24h turn-around.</p>
                      
                      {formState === 'success' ? (
                        <div className="text-center py-10 bg-emerald-950/40 rounded-2xl border border-emerald-500/30">
                          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <Send size={20} />
                          </div>
                          <p className="font-mono font-bold text-emerald-400 uppercase tracking-widest text-xs">Strategy Audit Requested!</p>
                          <p className="text-[11px] text-[#BFBFBF] mt-1">Our engineering team will reach out within 24 hours.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                             <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B8B8B] block mb-1.5 ml-1">Company / Brand Name</label>
                             <input 
                               required
                               type="text" 
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               placeholder="Acme Inc."
                               className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-all font-sans text-xs text-white placeholder:text-neutral-600" 
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B8B8B] block mb-1.5 ml-1">Work Email</label>
                             <input 
                               required
                               type="email" 
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               placeholder="alex@acme.com"
                               className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-all font-sans text-xs text-white placeholder:text-neutral-600" 
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B8B8B] block mb-1.5 ml-1">Website URL</label>
                             <input 
                               required
                               type="text" 
                               value={formData.website}
                               onChange={(e) => setFormData({...formData, website: e.target.value})}
                               placeholder="https://acme.com"
                               className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-all font-sans text-xs text-white placeholder:text-neutral-600" 
                             />
                          </div>
                          <button 
                            disabled={formState === 'loading'}
                            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] hover:from-[#FF9D00] hover:to-[#FF6B00] py-4 rounded-xl text-white font-mono font-bold tracking-widest text-xs uppercase shadow-xl shadow-[#FF6B00]/20 transition-transform active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
                          >
                            {formState === 'loading' ? 'Analyzing Specs...' : 'Claim Free Audit'}
                          </button>
                        </form>
                      )}
                    </div>

                    {service.features && service.features.length > 0 && (
                      <div className="bg-[#121212] p-8 rounded-3xl border border-white/10">
                        <h4 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#FFB347] mb-6">Core Deliverables Included</h4>
                        <ul className="space-y-4">
                          {service.features.map((f: string, i: number) => (
                            <li key={i} className="flex gap-3 text-xs font-bold text-[#BFBFBF] border-b border-white/5 pb-3 last:border-0 last:pb-0">
                              <span className="text-[#FF6B00] font-mono">0{(i + 1)}</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verifiable Google & Trustpilot Reviews section to boost client trust */}
      {!hasTestimonialsBlock && (
        <ReviewsSection className="py-20 bg-[#080808] text-white border-t border-white/10" slug={slug} />
      )}

      {/* Dynamic Internal Link Boost Panel: Allied Intelligence & Connected Blueprints */}
      <section className="py-24 bg-[#080808] text-white relative border-t border-white/10 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,0,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="px-4 py-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FFB347] text-xs font-mono font-bold rounded-full uppercase tracking-widest inline-block mb-4">
                {relatedMeta.badge}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight">
                {relatedMeta.title.split(' ')[0]} <br /><span className="text-[#FF6B00]">{relatedMeta.title.split(' ').slice(1).join(' ')}</span>
              </h2>
            </div>
            <p className="text-[#BFBFBF] text-sm font-normal leading-relaxed max-w-sm">
              {relatedMeta.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {relatedServices.map((rSrv, rIdx) => (
              <Link 
                key={rSrv.slug || rIdx} 
                to={`/services/${rSrv.slug}`}
                className="p-8 bg-[#121212] border border-white/10 rounded-3xl hover:border-[#FF6B00]/50 hover:bg-[#161616] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#8B8B8B] uppercase block mb-4">
                    Capability 0{rIdx + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold uppercase text-white tracking-tight mb-3 group-hover:text-[#FF6B00] transition-colors">
                    {rSrv.title}
                  </h3>
                  <p className="text-[#BFBFBF] text-xs font-normal leading-relaxed mb-6 line-clamp-3">
                    {rSrv.description}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00] inline-flex items-center gap-2 mt-4 group-hover:text-[#FF9D00] transition-colors">
                  <span>Analyze Strategy</span> 
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono font-bold text-[#8B8B8B] uppercase tracking-widest">
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/blog" className="hover:text-[#FF6B00] transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-ping" />
                <span>Read Agency Insights</span>
              </Link>
              <Link to="/contact" className="hover:text-[#FF6B00] transition-colors">
                Book Free Consultation
              </Link>
              <Link to="/portfolio" className="hover:text-[#FF6B00] transition-colors">
                Client Case Studies
              </Link>
            </div>
            <p className="text-[#8B8B8B] font-mono text-xs">
              PREET WEB VISION © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
