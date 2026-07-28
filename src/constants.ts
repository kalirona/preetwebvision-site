import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  content: string;
  category: 'development' | 'marketing' | 'optimization';
  features: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICES: Service[] = [
  // --- COLUMN 1: WEBSITE & UI/UX DESIGN ---
  {
    id: 'wp-dev',
    title: 'WordPress & Web Design',
    slug: 'web-design',
    icon: 'Layout',
    category: 'development',
    description: 'Custom high-performance WordPress themes and bespoke web platforms built for speed, security, and conversion.',
    features: ['Custom Theme Design', 'Advanced Security', 'LMS & Portal Integration', 'Gutenberg & React Optimization'],
    content: `
# Premier Web Design & Custom Engineering

In the digital marketplace, your website isn't just a brochure—it's a high-performance business asset. At **Preet Web Vision**, we specialize in designing and developing custom web solutions that don't just look stunning but are engineered for extreme speed, search dominance, and maximum conversion rates.

## Why Custom Web Design Matters for Your Growth
Most agencies use bloated, off-the-shelf templates that slow down your site and kill your SEO. We take a different approach. We build every site from the ground up using **clean code principles** and lightweight architectures.

### Our Web Design Philosophy:
1. **Speed First**: Sub-1s load times across all devices.
2. **UX Clarity**: Intuitive user paths leading directly to primary CTAs.
3. **SEO Native**: Technical SEO (Schema, Semantic HTML) integrated into the core build.
4. **Security Hardened**: Enterprise-grade firewalls and malware protection.

## The PV Engineering Framework
We utilize modern workflows including custom Gutenberg blocks, headless architectures, and server-side performance tuning.

### 1. Data-Driven UX Discovery
We analyze user behavior, heatmaps, and drop-off points to design layouts that mirror customer intent.

### 2. High-Fidelity Prototyping
Pixel-perfect mockups engineered for responsive perfection before code deployment.

### 3. Performance Tuning (90+ PageSpeed)
We aim for a perfect 100 on mobile and desktop through image optimization, script deferral, and edge caching.
`,
    faqs: [
      { q: 'Is it mobile friendly?', a: 'Every site follows a mobile-first philosophy ensuring seamless performance across all screen sizes.' },
      { q: 'Do you provide hosting setup?', a: 'Yes, we configure high-performance cloud hosting optimized for speed and security.' }
    ]
  },
  {
    id: 'biz-website',
    title: 'Business Website Design',
    slug: 'business-website',
    icon: 'Monitor',
    category: 'development',
    description: 'Corporate and business websites engineered to project authority, generate leads, and dominate local search.',
    features: ['Custom CMS Integration', 'Lead Capture Funnels', 'Brand Alignment', 'SEO Foundation'],
    content: `
# Corporate & Business Website Design

Your corporate website is the central hub of your brand identity. We craft tailored business sites that communicate trust, establish market leadership, and generate high-intent inquiries.

## What Sets Our Business Web Engineering Apart
1. **Brand Authority**: Clean, professional visual aesthetics tailored to your corporate positioning.
2. **Lead Generation Architecture**: Strategically placed conversion forms and booking widgets.
3. **Sub-Second Page Load**: Fast-rendering code that delights visitors and impresses search bots.
4. **Mobile Responsiveness**: Flawless display across mobile phones, tablets, and wide desktop displays.
`,
    faqs: [
      { q: 'How long does a corporate website design take?', a: 'Standard corporate sites take 3-5 weeks depending on custom feature requirements.' },
      { q: 'Can our internal team update content easily?', a: 'Yes, we provide custom block dashboards and easy content editing workflows.' }
    ]
  },
  {
    id: 'shopify-dev',
    title: 'Shopify & E-commerce',
    slug: 'ecommerce-development',
    icon: 'ShoppingBag',
    category: 'development',
    description: 'Scalable E-commerce stores designed to maximize Average Order Value (AOV) and conversion.',
    features: ['Custom Liquid & React Coding', 'ERP/CRM Sync', 'App Optimization', 'Checkout CRO'],
    content: `
# Professional E-commerce & Shopify Development

E-commerce requires speed, security, and effortless user experience. **Preet Web Vision** builds revenue-generating online stores designed to scale effortlessly.

## High-Converting Online Store Features
- **Streamlined Checkout**: Eliminating friction to reduce cart abandonment.
- **Speed Optimization**: Custom lightweight themes built without heavy app bloat.
- **Inventory & ERP Sync**: Connecting warehouse management and CRM pipelines smoothly.
- **Product Schema Markup**: Ensuring your product ratings and prices display directly in search results.
`,
    faqs: [
      { q: 'Do you build custom apps?', a: 'Yes, we create custom integrations and app logic tailored to your catalog.' },
      { q: 'Can you migrate our store from WooCommerce or Magento?', a: 'Yes, we migrate products, customer accounts, and order histories without losing SEO rank.' }
    ]
  },
  {
    id: 'landing-page',
    title: 'Landing Page Design',
    slug: 'landing-page-design',
    icon: 'MousePointer2',
    category: 'development',
    description: 'High-converting landing pages engineered to turn clicks into customers with surgical precision.',
    features: ['A/B Testing Integration', 'Direct Response Copywriting', 'Speed-Optimized Layouts', 'Clear CTAs'],
    content: `
# High-Conversion Landing Page Design

Stop wasting ad spend on pages that don't convert. We design "Surgical Landing Pages" built specifically to convert paid ad traffic into paying customers.

## Our Landing Page CRO Framework
1. **Single Focus Path**: Clear value proposition above the fold with zero navigation distractions.
2. **Social Proof Placement**: Strategic testimonial quotes, trust badges, and media mentions.
3. **Micro-Interaction Feedback**: Smooth form submissions and mobile-friendly tap targets.
`,
    faqs: [
      { q: 'Can you integrate landing pages with our CRM?', a: 'Yes, leads sync instantly with HubSpot, Salesforce, Zoho, or email providers.' },
      { q: 'How fast do these landing pages load?', a: 'We guarantee sub-second page rendering for ad campaigns.' }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI / UX Design',
    slug: 'ui-ux-design',
    icon: 'Figma',
    category: 'development',
    description: 'User-centered visual interface design that delights users and streamlines digital product interaction.',
    features: ['User Journey Mapping', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing'],
    content: `
# User Experience & Interface Design

Intuitive, aesthetically superior UI/UX design that reduces friction and boosts user retention across web and mobile platforms.

## Design Systems & Product Aesthetics
- **Interactive Figma Prototypes**: Clickable wireframes to validate user flows before coding.
- **Design Token Scalability**: Comprehensive color, typography, and spacing systems.
- **Accessibility Standards**: WCAG 2.1 AA compliant color contrast and screen-reader accessibility.
`,
    faqs: [
      { q: 'Do you deliver Figma design source files?', a: 'Yes, complete Figma design systems with organized components and style guides are delivered.' },
      { q: 'Can you work with our in-house engineering team?', a: 'Absolutely, we provide complete design handoff specs and asset exports.' }
    ]
  },

  // --- COLUMN 2: SEO SERVICES ---
  {
    id: 'seo-gen',
    title: 'SEO Services & Search Dominance',
    slug: 'seo',
    icon: 'Search',
    category: 'marketing',
    description: 'Data-driven SEO strategies to rank on Google search results and reduce customer acquisition costs.',
    features: ['Technical Audit', 'Keyword Strategy', 'On-Page Optimization', 'Competitor Intelligence'],
    content: `
# Authority-Driven SEO Services: Dominate Your Market

Search Engine Optimization (SEO) has evolved. In 2026, it is about **Expertise, Topic Clarity, and User Helpfulness.** **Preet Web Vision** provides high-level SEO strategy and execution that drives real business revenue.

## Our 4-Pillar Mastery Framework:
1. **Technical SEO Excellence**: Clean crawling, fast indexing, structured Schema data.
2. **Topical Authority**: Grouping content into logical, comprehensive topic clusters.
3. **Ethical High-Impact Link Building**: Earning authority placements on respected niche publications.
4. **AI & Voice Search Readiness**: Optimizing for conversational queries and Google SGE summaries.
`,
    faqs: []
  },
  {
    id: 'local-seo',
    title: 'Local SEO',
    slug: 'local-seo',
    icon: 'MapPin',
    category: 'marketing',
    description: 'Dominate your local market and drive foot traffic with hyper-targeted location-based SEO.',
    features: ['Google Business Profile', 'Citation Building', 'Local Keyword Targets', 'Review Management'],
    content: `
# Local SEO: Dominate Your Service Area

If you're a local business, your Google Maps listing is your lifeline. We help you dominate local pack search results so your phone never stops ringing.
`,
    faqs: []
  },
  {
    id: 'technical-seo',
    title: 'Technical SEO',
    slug: 'technical-seo',
    icon: 'Cpu',
    category: 'marketing',
    description: 'Fix hidden technical issues preventing your website from ranking and scaling.',
    features: ['Search Index Tuning', 'Core Web Vitals', 'Schema Deployment', 'Site Architecture Fixes'],
    content: `
# Advanced Technical SEO & Infrastructure Optimization

Technical SEO is the foundation of digital growth. We fix complex crawl errors, duplicate content, and script bottlenecks that hamper organic growth.
`,
    faqs: []
  },
  {
    id: 'ecommerce-seo',
    title: 'Ecommerce SEO',
    slug: 'ecommerce-seo',
    icon: 'ShoppingBasket',
    category: 'marketing',
    description: 'Rank product catalogs and category pages on high-intent commercial keywords.',
    features: ['Product Schema', 'Faceted Navigation SEO', 'Category Clustering', 'Review Optimization'],
    content: `
# High-Intent Ecommerce SEO

Drive organic buyer traffic directly to your product and category pages with specialized e-commerce search strategies.
`,
    faqs: []
  },
  {
    id: 'enterprise-seo',
    title: 'Enterprise SEO',
    slug: 'enterprise-seo',
    icon: 'Globe',
    category: 'marketing',
    description: 'Scalable SEO operations for large-scale websites, multi-location brands, and international enterprises.',
    features: ['Internationalization (hreflang)', 'Massive Page Audits', 'Log File Analysis', 'Custom Reporting'],
    content: `
# Enterprise SEO Architecture

Large websites require dedicated strategies. We optimize multi-million-page architectures for fast crawl budgets and high authority.
`,
    faqs: []
  },
  {
    id: 'seo-audit',
    title: 'SEO Audit',
    slug: 'seo-audit',
    icon: 'CheckSquare',
    category: 'marketing',
    description: 'In-depth 100+ point technical, content, and backlink audit with actionable growth roadmaps.',
    features: ['100+ Diagnostic Points', 'Competitor Gap Analysis', 'Action Plan', 'Executive Briefing'],
    content: `
# Comprehensive 100+ Point SEO Audit

Uncover the exact technical roadblocks and content gaps holding your website back from Page 1 rankings.
`,
    faqs: []
  },

  // --- COLUMN 3: PAID ADVERTISING ---
  {
    id: 'google-ads',
    title: 'Google Ads Management',
    slug: 'google-ads',
    icon: 'Target',
    category: 'marketing',
    description: 'High-ROAS Google Search, Performance Max, and Shopping ad campaigns optimized for profit.',
    features: ['Search & PMax Campaigns', 'Negative Keyword Lists', 'Conversion Tracking', 'Landing Page Pairing'],
    content: `
# High-Performance Google Ads Campaign Management

Capture high-intent buyers the moment they search for your products or services. We engineer Google Ads campaigns focused strictly on return on ad spend (ROAS).
`,
    faqs: []
  },
  {
    id: 'meta-ads',
    title: 'Meta Ads (Facebook & Instagram)',
    slug: 'meta-ads',
    icon: 'Share2',
    category: 'marketing',
    description: 'Hyper-targeted Meta ad campaigns featuring dynamic creative testing and custom audiences.',
    features: ['Creative Strategy', 'Lookalike Audiences', 'Retargeting Funnels', 'A/B Ad Testing'],
    content: `
# Meta Ads (Facebook & Instagram) Growth Engine

Drive brand awareness and direct conversions with compelling visual creatives and high-precision audience targeting.
`,
    faqs: []
  },
  {
    id: 'linkedin-ads',
    title: 'LinkedIn Ads',
    slug: 'linkedin-ads',
    icon: 'Briefcase',
    category: 'marketing',
    description: 'B2B lead generation targeting key decision-makers, executives, and job titles directly.',
    features: ['Account-Based Marketing', 'Lead Gen Forms', 'InMail Campaigns', 'Decision-Maker Targeting'],
    content: `
# B2B LinkedIn Advertising

Reach job titles, industry leaders, and target accounts with high-ticket B2B advertising campaigns.
`,
    faqs: []
  },
  {
    id: 'youtube-ads',
    title: 'YouTube Ads',
    slug: 'youtube-ads',
    icon: 'Youtube',
    category: 'marketing',
    description: 'High-impact video ad campaigns that engage viewers and capture high-intent buyers.',
    features: ['In-Stream Video Ads', 'Targeted Bumper Ads', 'Custom Audience Intent', 'Video Production Guidance'],
    content: `
# YouTube Video Advertising

Leverage the power of video search to build massive brand awareness and trigger immediate online conversions.
`,
    faqs: []
  },
  {
    id: 'tiktok-ads',
    title: 'TikTok Ads',
    slug: 'tiktok-ads',
    icon: 'Video',
    category: 'marketing',
    description: 'Native short-form video ads engineered to capture Gen Z and millennial consumer attention.',
    features: ['Spark Ads', 'User-Generated Content (UGC)', 'Viral Trends', 'Pixel Conversion Tracking'],
    content: `
# TikTok Ads & Short-Form Video Campaigns

Engage modern consumers with authentic short-form video creative that drives viral engagement and product sales.
`,
    faqs: []
  },

  // --- COLUMN 4: SOCIAL MEDIA ---
  {
    id: 'social-media',
    title: 'Social Media Management',
    slug: 'social-media',
    icon: 'Share2',
    category: 'marketing',
    description: 'Comprehensive social channel growth, content creation, and active community engagement.',
    features: ['Content Calendars', 'Graphic & Video Production', 'Community Moderation', 'Analytics Audits'],
    content: `
# Social Media Marketing & Brand Building

Turn followers into loyal brand advocates. We manage content strategy, visual production, and active community building across Meta, LinkedIn, TikTok, and X.
`,
    faqs: []
  },
  {
    id: 'community-mgmt',
    title: 'Community Management',
    slug: 'community-management',
    icon: 'Users',
    category: 'marketing',
    description: 'Real-time response, comment moderation, and active customer relationship building on social channels.',
    features: ['24/7 Response SLA', 'Brand Voice Guidelines', 'Crisis Prevention', 'Customer Support Sync'],
    content: `
# Active Social Community Management

Protect brand reputation and nurture customer trust with proactive social media monitoring and human engagement.
`,
    faqs: []
  },

  // --- COLUMN 5: AI AUTOMATION ---
  {
    id: 'ai-automation',
    title: 'AI Automation & Agents',
    slug: 'ai-automation',
    icon: 'Bot',
    category: 'optimization',
    description: 'Deploy custom AI chatbots, automated workflows, and CRM integrations to eliminate manual work.',
    features: ['Custom AI Chatbots', 'Voice Agents', 'CRM Workflows', '24/7 Lead Qualification'],
    content: `
# AI Automation & Business Process Intelligence

Scale operations without growing overhead. We design and deploy intelligent AI agents, automated CRM pipelines, and custom chatbots that handle lead qualification, customer support, and repetitive data entry.

## AI Capabilities:
1. **24/7 Lead Qualifiers**: Interactive AI assistants that capture and score leads instantly.
2. **Workflow Automation**: Connecting Zapier, Make, and custom APIs to synchronize databases.
3. **Voice & Text Agents**: Natural conversational agents trained specifically on your company Knowledge Base.
`,
    faqs: []
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    slug: 'ai-chatbots',
    icon: 'MessageSquare',
    category: 'optimization',
    description: 'Smart AI assistants trained on your internal documentation to answer queries and capture leads.',
    features: ['RAG Knowledge Base', 'Website Integration', 'Lead Capture', 'Multi-Language Support'],
    content: `
# Custom Trained AI Chatbots

Convert website visitors 24/7 with an AI assistant trained on your exact business knowledge base.
`,
    faqs: []
  },
  {
    id: 'ai-voice-agents',
    title: 'AI Voice Agents',
    slug: 'ai-voice-agents',
    icon: 'PhoneCall',
    category: 'optimization',
    description: 'Autonomous voice agents that handle inbound inquiries and schedule appointments over the phone.',
    features: ['Natural Speech Synthetic AI', 'Calendar Sync', 'Call Transcriptions', 'CRM Logging'],
    content: `
# AI Voice Agents for Inbound & Outbound

Automate phone inquiries and booking appointments with realistic, human-sounding AI voice assistants.
`,
    faqs: []
  },

  // --- COLUMN 6: EMAIL MARKETING ---
  {
    id: 'email-marketing',
    title: 'Email Marketing & Automation',
    slug: 'email-marketing',
    icon: 'Mail',
    category: 'marketing',
    description: 'Automated email flows, high-converting newsletters, and lead nurturing sequences that print revenue.',
    features: ['Welcome Sequences', 'Abandoned Cart Flows', 'List Segmentation', 'Custom HTML Design'],
    content: `
# Revenue-Focused Email Marketing & Automation

Email marketing remains the highest-ROI digital channel ($36-$42 return per $1 spent). We build automated email funnels and newsletters that keep customers coming back.

## Key Sequences We Build:
- **Welcome Series**: Indoctrinate new leads and make a powerful first impression.
- **Cart Abandonment**: Reclaim lost sales automatically.
- **Post-Purchase Nurture**: Increase lifetime customer value (LTV).
- **Weekly Newsletters**: Deliver ongoing value that keeps your brand top of mind.
`,
    faqs: []
  },

  // --- COLUMN 7: BRANDING ---
  {
    id: 'branding',
    title: 'Branding & Brand Identity',
    slug: 'branding',
    icon: 'Sparkles',
    category: 'development',
    description: 'Logo design, brand identity systems, style guides, and graphic design that set you apart.',
    features: ['Logo Creation', 'Brand Style Guides', 'Typography & Palette', 'Marketing Collateral'],
    content: `
# Strategic Brand Identity & Visual Design

Build a memorable brand image that commands premium pricing. From logo design to comprehensive brand guidelines, we give your business a distinct market voice.
`,
    faqs: []
  },

  // --- PERFORMANCE & OPTIMIZATION ---
  {
    id: 'speed-opt',
    title: 'Website Speed Optimization',
    slug: 'speed-optimization',
    icon: 'Zap',
    category: 'optimization',
    description: 'Slash load times and bounce rates with advanced server and code-level speed tuning.',
    features: ['Server Response Tuning', 'LCP/INP Fixes', 'Image Compression', 'CDN Setup'],
    content: `
# Website Speed Optimization: The Feature of Growth

In 2026, speed is a requirement. A fast website leads to higher rankings, more traffic, and significantly higher conversion rates.
`,
    faqs: []
  },
  {
    id: 'cwv-opt',
    title: 'Core Web Vitals Optimization',
    slug: 'core-web-vitals',
    icon: 'BarChart',
    category: 'optimization',
    description: 'Pass Google\'s Core Web Vitals assessment to maintain rankings and user trust.',
    features: ['CLS Stability', 'FID/INP Reduction', 'FCP Acceleration', 'Audit Reports'],
    content: `
# Core Web Vitals Optimization

Pass Google's CWV tests with flying colors to protect rankings and deliver flawless mobile interactions.
`,
    faqs: []
  },
  {
    id: 'security',
    title: 'Security Optimization',
    slug: 'security-optimization',
    icon: 'Lock',
    category: 'optimization',
    description: 'Fortify your website against cyber threats, malware, and brute force attacks.',
    features: ['Malware Scanning', 'WAF Setup', 'SSL Management', 'DDoS Protection'],
    content: `
# Enterprise-Grade Website Security

Protect your brand reputation and customer data with 24/7 web application firewall and malware defense.
`,
    faqs: []
  },
  // --- NEW: AI AGENTS ---
  {
    id: 'ai-agents',
    title: 'AI Agents for Businesses',
    slug: 'ai-agents',
    icon: 'Bot',
    category: 'optimization',
    description: 'Custom AI chatbots, voice agents, customer support automation, and AI sales assistants trained on your business data.',
    features: ['AI Chatbots', 'Voice Agents', 'Customer Support Automation', 'Sales Assistants', 'Appointment Booking', 'WhatsApp Integration'],
    content: `
# AI Agents for Business: Automate, Engage, Convert

AI agents are transforming how businesses interact with customers. At Preet Web Vision, we build custom AI agents that handle inquiries, qualify leads, book appointments, and provide 24/7 customer support—all trained on your specific business knowledge.

## Our AI Agent Solutions:

### AI Chatbots
Intelligent conversational agents that handle customer queries, qualify leads, and provide instant support around the clock. Trained on your documentation, FAQs, and product catalogs.

### AI Voice Agents
Natural-sounding voice assistants that handle inbound calls, schedule appointments, and process orders. Perfect for service businesses, healthcare, and real estate.

### AI Customer Support
Automated support agents that resolve common issues, escalate complex problems, and maintain customer satisfaction without increasing headcount.

### AI Sales Agents
Proactive sales assistants that engage website visitors, qualify leads, and nurture prospects through personalized conversations.

### AI Appointment Booking
Smart scheduling agents that integrate with your calendar system, handle availability, send reminders, and reduce no-shows.

### AI WhatsApp Agents
WhatsApp-integrated AI assistants that manage customer communication on the world's most popular messaging platform.
`,
    faqs: [
      { q: 'How are your AI agents trained on my business data?', a: 'We use RAG (Retrieval Augmented Generation) to train agents on your documents, FAQs, product catalogs, and website content. No coding required from your end.' },
      { q: 'Can AI agents integrate with my existing CRM?', a: 'Yes, our agents integrate seamlessly with HubSpot, Salesforce, Zoho, and custom CRM systems via API.' },
      { q: 'How natural do the voice agents sound?', a: 'Our voice agents use advanced neural TTS technology that delivers natural, human-like conversations with context awareness.' }
    ]
  },
  // --- NEW: WEB APPLICATION DEVELOPMENT ---
  {
    id: 'web-apps',
    title: 'Web Application Development',
    slug: 'web-apps',
    icon: 'Code2',
    category: 'development',
    description: 'Custom SaaS platforms, CRM systems, admin dashboards, and AI-powered web applications built with modern frameworks.',
    features: ['SaaS Development', 'CRM Systems', 'ERP Systems', 'Customer Portals', 'Admin Dashboards', 'AI Web Apps', 'API Development', 'Database Solutions'],
    content: `
# Custom Web Application Development

Transform your business operations with custom web applications designed for scale, security, and seamless user experience. At Preet Web Vision, we build enterprise-grade web applications that automate workflows, manage data, and drive business growth.

## Our Web Application Expertise:

### SaaS Applications
Multi-tenant SaaS platforms built with React, Node.js, and cloud infrastructure. Subscription management, user roles, and scalable architecture included.

### CRM Systems
Custom CRM platforms tailored to your sales pipeline, customer journey, and team workflows. Integrated with email, calendar, and communication tools.

### ERP Systems
Enterprise resource planning solutions that connect inventory, finance, HR, and operations into a single unified dashboard.

### Customer Portals
Self-service portals where clients can track orders, manage accounts, submit tickets, and access resources—reducing support load.

### Admin Dashboards
Real-time analytics dashboards with customizable widgets, data visualization, and export capabilities for data-driven decision making.

### AI Web Apps
Intelligent web applications powered by machine learning models, natural language processing, and predictive analytics.

### API Development
RESTful and GraphQL APIs designed for performance, security, and seamless third-party integrations.

### Database Solutions
Scalable database architecture including SQL, NoSQL, and real-time data synchronization for high-performance applications.
`,
    faqs: [
      { q: 'What tech stack do you use for web applications?', a: 'We use React/Next.js for frontend, Node.js/Python for backend, PostgreSQL/MongoDB for databases, and AWS/GCP for cloud infrastructure.' },
      { q: 'How long does it take to build a custom web application?', a: 'Timelines vary based on complexity. A standard CRM or dashboard takes 4-8 weeks, while complex SaaS platforms may take 8-16 weeks.' },
      { q: 'Do you provide ongoing maintenance and support?', a: 'Yes, we offer comprehensive maintenance plans including security updates, performance monitoring, feature enhancements, and 24/7 support SLA.' }
    ]
  },
  // --- NEW: E-COMMERCE ---
  {
    id: 'ecommerce-dev',
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-development',
    icon: 'ShoppingBag',
    category: 'development',
    description: 'Shopify, WooCommerce, and custom e-commerce platforms designed to maximize AOV, reduce cart abandonment, and scale revenue.',
    features: ['Shopify Development', 'WooCommerce Development', 'Wix Ecommerce', 'Custom Ecommerce', 'Store Migration', 'Payment Integration', 'Ecommerce SEO'],
    content: `
# Professional E-Commerce Solutions

Your e-commerce store is your 24/7 revenue engine. At Preet Web Vision, we build high-performance online stores that load instantly, convert visitors into buyers, and scale effortlessly as your business grows.

## Our E-Commerce Expertise:

### Shopify Development
Custom Shopify Plus stores with bespoke themes, optimized checkout flows, and seamless app integrations. Sub-second load times guaranteed.

### WooCommerce Development
High-performance WooCommerce stores on WordPress with custom product configurations, subscription models, and membership features.

### Wix Ecommerce
Professional Wix stores with custom designs, inventory management, and integrated marketing tools for small to medium businesses.

### Custom Ecommerce Platforms
Bespoke e-commerce solutions built from the ground up for unique business models, complex catalogs, and specific integration requirements.

### Store Migration
Seamless migration from Magento, WooCommerce, BigCommerce, or custom platforms to Shopify or other modern solutions without SEO loss.

### Payment Integration
Multi-currency payment gateways including Stripe, PayPal, Razorpay, and regional providers with PCI-compliant security.

### Ecommerce SEO
Technical SEO for product pages, category optimization, faceted navigation, and product schema markup for maximum search visibility.
`,
    faqs: [
      { q: 'Which e-commerce platform do you recommend?', a: 'For most businesses, we recommend Shopify for its speed, security, and scalability. For complex requirements, we evaluate WooCommerce, BigCommerce, or custom solutions.' },
      { q: 'Can you migrate my existing store without losing SEO rankings?', a: 'Yes, we follow a meticulous migration process that preserves URL structures, redirects, meta data, and search rankings throughout the transition.' },
      { q: 'Do you provide post-launch support?', a: 'Yes, we offer ongoing maintenance, security updates, performance monitoring, and feature enhancements for all e-commerce stores.' }
    ]
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: 'WordPress SEO: Ultimate Guide for 2026',
    excerpt: 'Learn the latest technical SEO strategies to make your WordPress site rank higher and load faster in the AI-search era.',
    category: 'WordPress Tutorials',
    date: 'May 15, 2026',
    author: 'Preet',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  }
];
