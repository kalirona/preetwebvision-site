import fs from 'fs';
import path from 'path';

const services = [
  {
    id: "s1",
    title: "WordPress Website Design",
    slug: "wordpress-development",
    description: "Custom high-performance WordPress themes and architectures built for speed, conversion, and organic SEO authority.",
    category: "development",
    icon: "Layout",
    status: "ACTIVE",
    features: [
      "Custom Theme Engineering",
      "Core Web Vitals Optimization",
      "Advanced Dynamic Schema",
      "Tailored Gutenberg Blocks"
    ],
    faqs: [
      { q: "Do you use ready-made themes?", a: "No, we engineer custom block themes from scratch to ensure extreme speed and perfect visual control." },
      { q: "Is WordPress secure?", a: "Yes. When engineered on clean code principles, hardened with firewalls, and free of plugin bloat, WordPress is highly secure." }
    ],
    seo: {
      metaTitle: "Premier WordPress Website Design & Engineering | Preet Web Vision",
      metaDescription: "Bespoke high-performance WordPress solutions built for extreme speed, search dominance, and maximum conversion rates."
    },
    content: JSON.stringify([
      {
        id: "wp-hero",
        type: "hero",
        settings: {
          headline: "CUSTOM WORDPRESS ENGINEERING DESIGNED TO DOMINATE.",
          subheadline: "We design and engineer bespoke, high-performance WordPress solutions built for extreme speed, search dominance, and maximum conversion rates.",
          ctaText: "Schedule Free Performance Audit",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "wp-intro",
        type: "markdown",
        settings: {
          textAlign: "left",
          bodyText: "## Your Website is Your Ultimate Organic Conversion Engine\n\nIn the modern organic search era, cookie-cutter templates loaded with excessive third-party plugins are a recipe for failure. They slow your site down, trigger search penalties, and leak potential leads. At Preet Web Vision, we take a completely custom engineering approach to design.\n\nWe construct our sites using a pristine, block-based architecture tailored precisely to your brand. The result is a sub-second page rendering speed that search engines prefer and users love. We focus on creating deep business value by driving high-intent organic views and making them convert.\n\nOur code-first design philosophy ensures that your platform remains secure, highly extensible, and incredibly straightforward to manage by your internal marketing teams without requiring ongoing developer dependency."
        }
      },
      {
        id: "wp-breakdown",
        type: "features",
        settings: {
          title: "Our WordPress Performance Spectrum",
          description: "Discover our technical focus points that eliminate clutter, preserve crawl budgets, and double sales KPIs.",
          featuresList: [
            { title: "Custom Gutenberg Themes", desc: "Crafting lightweight, brand-specific block environments.", icon: "Layout" },
            { title: "Plugin Debt Reduction", desc: "Removing sluggish third-party scripts with custom PHP implementations.", icon: "Zap" },
            { title: "Unmatched Mobile Coding", desc: "Serving responsive visual patterns aligned for standard Google Mobile indexing.", icon: "Layout" }
          ]
        }
      },
      {
        id: "wp-why",
        type: "features",
        settings: {
          title: "Why High-Growth Brands Partner with Us",
          description: "We are design-obsessed engineers committed to delivering world-class search dominance and conversion metric updates.",
          featuresList: [
            { title: "Sub-Second Page Loads", desc: "We aim for and hit a PageSpeed score of 98+ on mobile and desktop platforms.", icon: "Award" },
            { title: "Fortified Cyber Security", desc: "Enterprise protection protocols, secure root structures, and regular automated scans.", icon: "Shield" },
            { title: "Semantic Schema Native", desc: "Structured dynamic rich fragments mapped to convey topical intent to crawlers.", icon: "BarChart3" },
            { title: "No Restrictive Lock-ins", desc: "Pristine core WordPress compliance so any standard engineer can collaborate.", icon: "Code" },
            { title: "Conversion Architecture", desc: "Every layout element placed according to deep behavioral heat-map research.", icon: "Sparkles" },
            { title: "Comprehensive Support", desc: "24/7 technical monitoring and automated off-site cloud server backups.", icon: "Zap" }
          ]
        }
      },
      {
        id: "wp-testimonials",
        type: "testimonials",
        settings: {
          title: "Endorsed by Growth Leaders",
          testimonialsList: [
            { name: "Sarah Miller", text: "Our previous agency site was incredibly slow and difficult to edit. Preet rebuilt our layouts on a streamlined block architecture. Our load times dropped from 4.8s to 0.9s, and high-intent leads increased by 64% in the first quarter alone.", position: "VP of Digital, Lexis Legal Solutions", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
            { name: "James Vance", text: "The team at Preet Web Vision is second to none. The Gutenberg editing dashboard they curated for us is very fast and intuitive—now our marketing team can build campaigns in minutes.", position: "Marketing Director, Apex Growth Platforms", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            { name: "Kunal Nair", text: "We migrated several high-traffic content portals to Preet Web Vision. Uptime has remained a flat 100%, and content publishing is simple. Far exceeded our expectations.", position: "Director of Systems, India B2B Hub", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
          ]
        }
      },
      {
        id: "wp-faq",
        type: "faq",
        settings: {
          title: "Frequently Addressed Inquiries",
          faqItems: [
            { q: "Is custom WordPress development better than standard themes?", a: "Yes. Standard templates carry legacy codebase structures intended to solve everyone's problems, which makes them slow. Our custom block themes are minimal, fast, and secure." },
            { q: "Will I lose my existing organic ranks during a redesign?", a: "No. We implement meticulous 301 redirect mapping, preserve heading hierarchies, and secure meta layers to protect and often boost your rankings." },
            { q: "How long does a custom WordPress build usually take?", a: "Typically a professional, custom-engineered landing platform requires between 4 to 8 weeks from design prototyping to final staging deployment." },
            { q: "Can we integrate our internal CRM and ERP tools?", a: "Yes. WordPress has an incredibly robust Rest API, enabling us to bridge user data to any sales or inventory software seamlessly." },
            { q: "Do offer maintenance after the website is delivered?", a: "Yes, we provide ongoing speed audits, major security upgrades, system monitoring, and priority technical support plans." }
          ]
        }
      },
      {
        id: "wp-cta",
        type: "cta",
        settings: {
          ctaTitle: "Ready to claim your ranking position on Google's index?",
          ctaSubtitle: "Get a comprehensive website audit indicating design speed and code optimizations. 100% free.",
          ctaBtnText: "Schedule My Free Performance Audit",
          ctaBtnLink: "/contact",
          ctaTheme: "dark"
        }
      }
    ])
  },
  {
    id: "s2",
    title: "SEO Services",
    slug: "seo-services",
    description: "Technical search engine optimization and topical authority campaigns designed to dominate Google results and drive organic leads.",
    category: "marketing",
    icon: "Search",
    status: "ACTIVE",
    features: [
      "Technical Core Crawl Audits",
      "Semantic SILO Structuring",
      "Topical Entity Optimization",
      "Organic Link PR Campaigns"
    ],
    faqs: [
      { q: "How long does it take to see results?", a: "Generally, noticeable organic traffic compounding starts within 90 to 120 days depending on keyword competition." },
      { q: "Do you guarantee first page results?", a: "We guarantee world-class SEO execution following white-hat guidelines that generate high-converting organic views." }
    ],
    seo: {
      metaTitle: "Technical SEO & Topical Authority Campaigns | Preet Web Vision",
      metaDescription: "Dominate Google search results with custom technical SEO, structured semantic schemas, and high-impact outreach strategies."
    },
    content: JSON.stringify([
      {
        id: "seo-hero",
        type: "hero",
        settings: {
          headline: "ENTERPRISE TECHNICAL SEO CONFIGURED FOR HIGHEST ROI.",
          subheadline: "We design and deploy ethical, data-backed search engine optimization strategies that secure high rank assets and reduce client acquisition costs.",
          ctaText: "Claim Free Search Audits",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1504868584819-f8eecf021749?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "seo-intro",
        type: "markdown",
        settings: {
          textAlign: "left",
          bodyText: "## Dominate Organic Search with Semantic Authority\n\nModern search engines do not look for simple keyword repetitions anymore. Today's search algorithms are driven by semantic entity associations, direct topical authority, and technical page performance.\n\nOur full-service campaigns approach organic optimization from first principles. We crawl your entire digital footprint to eliminate indexing crawl-budget leaks, craft content silos that satisfy complex user queries, and build organic trust connections designed for long-term compound growth.\n\nBy matching technical search visibility with intuitive UX patterns, we convert incoming search traffic into actual high-intent leads, securing a massive returns on investment for our clients."
        }
      },
      {
        id: "seo-breakdown",
        type: "features",
        settings: {
          title: "Our Holistic Organic SEO Architecture",
          description: "Discover the core operational layers we use to secure real business leads and dominate competitor spaces.",
          featuresList: [
            { title: "Technical Optimization", desc: "Rigorous alignment of robots, xml indices, and sub-second rendering.", icon: "Layout" },
            { title: "Semantic Topical Authority", desc: "Clustering content silos that address specific search intents comprehensively.", icon: "Zap" },
            { title: "High-Authority Partnerships", desc: "Earning secure contextual backlink placements that lift search authority.", icon: "Award" }
          ]
        }
      },
      {
        id: "seo-why",
        type: "features",
        settings: {
          title: "Why Growth Partners Trust Our Campaigns",
          description: "We are an engineering-driven agency tracking direct revenue growth and lead generations, not simple vanity rankings.",
          featuresList: [
            { title: "Data-Backed Research", desc: "Competitive intelligence and customer intent maps mapped out analytically.", icon: "BarChart3" },
            { title: "105% White-Hat Compliant", desc: "Rigorous execution of search engine guidelines to guarantee safe growth asset preservation.", icon: "Shield" },
            { title: "Real Revenue Insights", desc: "Full CRM pipeline alignments to track real business sales metrics from search clicks.", icon: "TrendingUp" },
            { title: "Crawl Budget Shielding", desc: "Eliminating server-level errors and redundant paths to let crawlers work fast.", icon: "Code" },
            { title: "Rich Schema Implementation", desc: "Deploying deep semantic markup for advanced snippets and rich results.", icon: "Sparkles" },
            { title: "Transparent Real-Time Reporting", desc: "Live SEO intelligence dashboards showing your keywords, organic traffic, and lead goals.", icon: "Layout" }
          ]
        }
      },
      {
        id: "seo-testimonials",
        type: "testimonials",
        settings: {
          title: "Validated by Market Leaders",
          testimonialsList: [
            { name: "John Davidson", text: "Preet Web Vision transformed our organic pipeline. Our search engine traffic grew by 240% over 6 months, and our customer acquisition cost dropped by almost half. A truly strategic partner.", position: "CEO, FinTech Ventures Inc.", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
            { name: "Mia Rosales", text: "Their deep competitive reports and search schema deployments are remarkable. We now hold top keywords for our cloud services globally.", position: "VP of Growth, CyberCloud Solutions", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
            { name: "Aarav Sharma", text: "We had dropped significantly after a main Google update. Preet diagnosed our crawl roadblocks in just 48 hours and restored our position in 6 weeks.", position: "Founder, Delhi Direct Consumer Brands", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
          ]
        }
      },
      {
        id: "seo-faq",
        type: "faq",
        settings: {
          title: "Frequently Addressed organic inquiries",
          faqItems: [
            { q: "What is topical authority in modern search engines?", a: "Topical authority refers to how deep and comprehensive your content is on a specific topic. Meticulously clustering pages around core subjects signals to engines that your platform is a reliable resource." },
            { q: "How do you handle links and trust assets?", a: "We focus on genuine PR outreach and relationship building with legitimate, high-trust digital publishers in your niche. We never use cheap, toxic, or artificial links." },
            { q: "What is a semantic SEO schema?", a: "Schema represents structured code scripts configured to explain your page elements directly to search bots, helping you secure rich snippet visualizations." },
            { q: "Do you rank local businesses globally?", a: "We handle hyper-local SEO maps rankings as well as massive, multi-regional enterprise rankings across distinct language patterns." },
            { q: "How often do you report keyword updates?", a: "Our clients receive a real-time portal reflecting exact positions daily, with strategic deep-dives delivered twice a month." }
          ]
        }
      },
      {
        id: "seo-cta",
        type: "cta",
        settings: {
          ctaTitle: "Ready to dominate your organic target keywords?",
          ctaSubtitle: "Request a custom competitive footprint report highlighting ranking gaps and core keyword opportunities.",
          ctaBtnText: "Schedule Free Traffic Review",
          ctaBtnLink: "/contact",
          ctaTheme: "dark"
        }
      }
    ])
  },
  {
    id: "s3",
    title: "eCommerce Website Development",
    slug: "ecommerce-development",
    description: "Custom enterprise eCommerce architectures designed to streamline user buying journeys and maximize order transaction values.",
    category: "development",
    icon: "ShoppingBag",
    status: "ACTIVE",
    features: [
      "Custom Checkout Funnels",
      "ERP / Inventory Integrations",
      "Multi-Currency Architectures",
      "Headless React Commerce"
    ],
    faqs: [
      { q: "Which eCommerce platforms do you specialize in?", a: "We specialize in Shopify Plus implementations, WooCommerce custom setups, and headless React commerce." },
      { q: "How do you protect customer data?", a: "We build fully PCI-DSS compliant environments with SSL encodings, strict access credentials, and payment gateway isolation." }
    ],
    seo: {
      metaTitle: "Custom Enterprise eCommerce Website Development | Preet Web Vision",
      metaDescription: "Scalable enterprise eCommerce platforms designed to eliminate checkout friction, enhance organic reach, and boost average order values."
    },
    content: JSON.stringify([
      {
        id: "ecom-hero",
        type: "hero",
        settings: {
          headline: "SCALABLE ENTERPRISE ECOMMERCE ENGINEERED FOR GROWTH.",
          subheadline: "We build fast, secure eCommerce platforms designed to eliminate checkout friction, enhance organic reach, and boost average order values.",
          ctaText: "Claim Commerce Audits",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "ecom-intro",
        type: "markdown",
        settings: {
          textAlign: "left",
          bodyText: "## Eliminate Friction and Optimize Your Digital Transaction Rates\n\nIn online retail, every single millisecond of delay actively drains your sales volume. Slow loading product catalogs and multi-step checkout processes cause immediate card abandonment and drive users back to competitor spaces.\n\nAt Preet Web Vision, we design high-converting checkout flows and fast product catalogs. Whether you are running on Shopify Plus or deploying a headless React frontend utilizing dynamic API endpoints, we optimize every path to ensure transactions are completed instantly.\n\nWe connect deep-layer ERP inventory platforms directly to your store, making stock management, international currencies, tax calculation, and bulk delivery scheduling a fully automated system."
        }
      },
      {
        id: "ecom-breakdown",
        type: "features",
        settings: {
          title: "Our Specialized Retail Coding Advantages",
          description: "Discover our performance-driven mechanics tailored to enhance product exploration and shopping cart checkouts.",
          featuresList: [
            { title: "Headless High Speed", desc: "Deploying reactive frontends to render store sections instantly.", icon: "Zap" },
            { title: "ERP & Inventory Syncing", desc: "Automating product SKU updates, orders, and delivery pipelines securely.", icon: "Layout" },
            { title: "Direct Checkout Improvement", desc: "Reducing form-clicks to make purchase flows smooth on mobile screens.", icon: "Code" }
          ]
        }
      },
      {
        id: "ecom-why",
        type: "features",
        settings: {
          title: "Why High-Volume Stores Partner with Us",
          description: "We merge tactical visual interfaces with database scaling security to optimize your ROI.",
          featuresList: [
            { title: "Average Order Optimization", desc: "Configuring seamless upscale and cross-sell options into pages securely.", icon: "TrendingUp" },
            { title: "Worldwide Localization", desc: "Integrated path handling for diverse payment processors, currencies, and languages.", icon: "Award" },
            { title: "Data Security Compliance", desc: "Rigorous setups built for maximum data encryption to protect customer payment nodes.", icon: "Shield" },
            { title: "Advanced Stock Sync", desc: "Instant sync with physical warehouses to prevent negative stock instances.", icon: "Zap" },
            { title: "Custom Discount Logic", desc: "Engineering complex coupon structures and dynamic loyalty triggers easily.", icon: "Sparkles" },
            { title: "Search Oriented Product Pages", desc: "Sizing dynamic schemas so product specs render proudly on search engine visual grids.", icon: "Layout" }
          ]
        }
      },
      {
        id: "ecom-testimonials",
        type: "testimonials",
        settings: {
          title: "Partner Endorsements",
          testimonialsList: [
            { name: "Robert Cheney", text: "Migrating our store to Preet's headless system was the best decision we've made. Our mobile conversion rate jumped by 38% almost overnight, and checkout dropoffs are now a thing of the past.", position: "VP of eCommerce, Core Wearables Ltd.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            { name: "Clara Peterson", text: "Their team integrated our custom ERP system flawlessly. inventory levels are in sync, and user flows are incredibly smooth. Sales have tripled.", position: "Founder, Serene Cosmetics", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
            { name: "Aman Varma", text: "Professional, fast, and technically masterclass. They built a custom multi-store system that we manage using a single database portal smoothly.", position: "CEO, Varma Retail Outlets", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
          ]
        }
      },
      {
        id: "ecom-faq",
        type: "faq",
        settings: {
          title: "Frequently Addressed Retail Inquiries",
          faqItems: [
            { q: "Is headless eCommerce suitable for my business?", a: "Headless is highly recommended if you are looking for sub-second catalog speeds, need deep visual customization, or use multiple marketing channels." },
            { q: "Can you help migrate our store data without losing history?", a: "Yes. We handle end-to-end migrations including product data mapping, customer logs, past order histories, and SEO redirections with zero downtime." },
            { q: "Do you integrate with third-party delivery options?", a: "Absolutely. We build integrations matching custom APIs for shipping aggregators, fulfillment hubs, and CRM marketing channels." },
            { q: "How do you handle multi-currency payments?", a: "We map international gateways like Stripe and Adyen to support localized pricing based on geographic IP lookups." },
            { q: "Do you configure automatic cart abandonment sequences?", a: "Yes, we integrate workflows with tools like Klaviyo and SendGrid to reclaim cold leads instantly." }
          ]
        }
      },
      {
        id: "ecom-cta",
        type: "cta",
        settings: {
          ctaTitle: "Ready to unleash automated commerce growth?",
          ctaSubtitle: "Request a custom cart review and performance bottleneck audit of your existing storefront.",
          ctaBtnText: "Initialize My Storefront Review",
          ctaBtnLink: "/contact",
          ctaTheme: "dark"
        }
      }
    ])
  },
  {
    id: "s4",
    title: "Web Design",
    slug: "web-design",
    description: "Bespoke user interface design and interaction engineering focused on converting casual visitors into legendary lifelong brand advocates.",
    category: "development",
    icon: "Layout",
    status: "ACTIVE",
    features: [
      "User Experience (UX) Engineering",
      "Interactive High-Fi Prototypes",
      "Conversion Rate Optimization",
      "Custom Graphic Systems"
    ],
    faqs: [
      { q: "What is your web design process?", a: "Our process spans 4 strategic phases: discovery research, wireframes, visual visual design prototypes, and engineering integration." },
      { q: "Do you design for mobile platforms first?", a: "Yes. Every element is modeled around mobile interaction patterns to capture the largest surfing audience with style." }
    ],
    seo: {
      metaTitle: "Bespoke Web Design & UI Engineering | Preet Web Vision",
      metaDescription: "Engaging user interfaces and conversion-driven visual experiences designed to turn casual visitors into lifelong advocates."
    },
    content: JSON.stringify([
      {
        id: "design-hero",
        type: "hero",
        settings: {
          headline: "INTERACTION ENGINEERING THAT CAPTIVATES & CONVERTS.",
          subheadline: "We design elite digital interfaces that blend artistic mastery with rigorous behavioral science to maximize click-through rates.",
          ctaText: "Begin Custom UI Blueprint",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "design-intro",
        type: "markdown",
        settings: {
          textAlign: "left",
          bodyText: "## Visual Experience is Your Brand's Ultimate Trust Asset\n\nA poorly aligned layout with generic font patterns tells customers that your operations are outdated. Within the first two seconds, visitors judge your company's scale based entirely on layout balance, typographical spacing, and color consistency.\n\nAt Preet Web Vision, we treat web design as a strict discipline rather than just decoration. We craft dynamic visual identities that reflect your unique business model, establishing immediate digital authority and building consumer confidence.\n\nWe design for human behaviors. By placing key interactive nodes in naturally accessible locations on touch screens, we decrease checkout friction and boost user sessions."
        }
      },
      {
        id: "design-breakdown",
        type: "features",
        settings: {
          title: "Our Creative Design Ecosystem",
          description: "Discover our comprehensive creative layers focused on visual clarity, speed, and corporate prestige.",
          featuresList: [
            { title: "User Behavior Mapping", desc: "Planning navigation based on actual eye-tracking and cursor heatmaps.", icon: "Layout" },
            { title: "Bespoke Graphic Systems", desc: "Developing custom vector illustrations and matching typography pairing rules.", icon: "Sparkles" },
            { title: "Conversion Optimizations", desc: "Rigorous checkout and lead-form styling configurations to secure signups.", icon: "TrendingUp" }
          ]
        }
      },
      {
        id: "design-why",
        type: "features",
        settings: {
          title: "Why Elite Brands Select Custom UI Designs",
          description: "Skip template limitations. We construct proprietary layouts built around your exact commercial goals.",
          featuresList: [
            { title: "Pixel-Perfect Layouts", desc: "Custom graphic assets mapped out on strict, modern grids.", icon: "Award" },
            { title: "Uncompromising Consistency", desc: "Perfect brand tone uniformity from core landing views to small notification bubbles.", icon: "Shield" },
            { title: "Motion Interaction Native", desc: "Using fluid micro-animations to highlight paths and guide eyes subtly.", icon: "Zap" },
            { title: "Accessible to All (WCAG)", desc: "High-contrast font ratios and screen-reader tags built into templates.", icon: "Code" },
            { title: "Brand Identity Guide", desc: "We provide complete color, button, and spacing rules for future scaling.", icon: "Sparkles" },
            { title: "Dynamic Media Delivery", desc: "Asset formats optimized to maintain crystal clear resolutions without slowing performance.", icon: "Layout" }
          ]
        }
      },
      {
        id: "design-testimonials",
        type: "testimonials",
        settings: {
          title: "Designed for High Performers",
          testimonialsList: [
            { name: "Devika Sen", text: "The artistic depth Preet's team brought to our luxury real estate portal was unbelievable. Our bounce rates slashed by half immediately, and client time-on-site grew by 180%.", position: "Chief Creative, Sen Properties", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
            { name: "Julian Mark", text: "We needed a complex dashboard styled for non-technical users. Preet created a system that is elegant, clean, and extremely intuitive to operate.", position: "VP of Product, SaaS Analytics Corp", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            { name: "Hassan Al-Saeed", text: "An exceptional design house. They listened to our strict corporate standards and translated them into a breathtaking digital homepage.", position: "Marketing Director, Gulf Capital Group", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
          ]
        }
      },
      {
        id: "design-faq",
        type: "faq",
        settings: {
          title: "Frequently Addressed Design Inquiries",
          faqItems: [
            { q: "What design software does your team use?", a: "We utilize Figma as our primary collaborative prototyping space, enabling you to inspect designs in real-time." },
            { q: "Do you provide custom vector logo creation services?", a: "Yes, we construct complete corporate branding packages including logo systems, color kits, and font assets." },
            { q: "Can we redesign a legacy platform incrementally?", a: "Certainly. We can design layout updates in phases to safeguard current users from sudden system disruptions." },
            { q: "Why is custom UI superior to ready-made templates?", a: "Custom design eliminates template bloat, ensures your site is distinct from competitors, and perfectly highlights your primary goals." },
            { q: "Do you test layouts across diverse physical devices?", a: "Yes. Every designed responsive view is checked across multiple smartphone models, tablets, and high-res wide displays." }
          ]
        }
      },
      {
        id: "design-cta",
        type: "cta",
        settings: {
          ctaTitle: "Ready to elevate your visual identity?",
          ctaSubtitle: "Connect with our lead visual designer and receive a custom UI wireframe blueprint covering your main landing page. 100% free.",
          ctaBtnText: "Launch My Creative UI Strategy",
          ctaBtnLink: "/contact",
          ctaTheme: "dark"
        }
      }
    ])
  },
  {
    id: "s5",
    title: "AI Automation",
    slug: "ai-automation",
    description: "Connect machine learning modules, custom API hooks, and intelligent chatbot systems to double your workflow efficiency.",
    category: "optimization",
    icon: "Zap",
    status: "ACTIVE",
    features: [
      "AI Chatbot Implementation",
      "Dynamic CRM CRM Webhooks",
      "Automated Sales Flow Systems",
      "Natural Language Parsing"
    ],
    faqs: [
      { q: "Can AI connect directly to our current CRM?", a: "Yes. We bridge custom API connections between systems like HubSpot, Salesforce, and modern AI modules smoothly." },
      { q: "Is customer data safe within these automated circuits?", a: "Yes. We configure encrypted proxy gateways that keep credentials and user inputs safely guarded at all times." }
    ],
    seo: {
      metaTitle: "AI Automation & Workflow Systems | Preet Web Vision",
      metaDescription: "Deploy intelligent workflows, webhook bridges, and custom AI chat modules to automate repeat business operations securely."
    },
    content: JSON.stringify([
      {
        id: "ai-hero",
        type: "hero",
        settings: {
          headline: "AUTOMATE OUTDATED BUSINESS WORKFLOWS WITH SECURE AI.",
          subheadline: "We build and deploy cost-effective custom automation chains and API pipelines that reduce manual labour costs by up to 80%.",
          ctaText: "Request Automation Blueprint",
          ctaLink: "/contact",
          imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "ai-intro",
        type: "markdown",
        settings: {
          textAlign: "left",
          bodyText: "## Eliminate Redundant Human Tasks and Scale Profit Margins\n\nHaving manual database syncs, copy-pasting customer info from emails, or answering basic repetitious support messages drains precious team cycles. These administrative burdens lock your high-value employees into robotic roles instead of focusing on actual business growth.\n\nAt Preet Web Vision, we design custom intelligent automation pipelines. By utilizing secure API webhooks, modern language processors, and optimized database triggers, we translate manual operations into automated, self-correcting micro-flows.\n\nWe construct real-time lead ingestion funnels that instantly parse queries, score the deal quality using LLMs, and route qualified opportunities to your sales agents' phones in under ten seconds."
        }
      },
      {
        id: "ai-breakdown",
        type: "features",
        settings: {
          title: "Our Robotic Automation Stack",
          description: "Discover how we deploy secure intelligent loops to free up your team and eliminate user response lag.",
          featuresList: [
            { title: "Intelligent Lead Parsing", desc: "Converting web inputs into formatted CRM database clients automatically.", icon: "Sparkles" },
            { title: "Custom Webhook Bridges", desc: "Connecting distinct software applications together with bulletproof API routers.", icon: "Zap" },
            { title: "Auto Customer Chat", desc: "Configuring multi-lingual assistant modules that resolve support queries 24/7.", icon: "User" }
          ]
        }
      },
      {
        id: "ai-why",
        type: "features",
        settings: {
          title: "Why Forward-Thinking Corporates Choose AI Workflows",
          description: "We are technical code-first system architects who avoid simple templates. We construct solid, custom API bridges.",
          featuresList: [
            { title: "80% Time Reclamation", desc: "Removing high-volume admin tasks so your staff can focus on selling.", icon: "Award" },
            { title: "Zero Error Execution", desc: "Data is validated, structured, and pushed around secure channels with zero typos.", icon: "Shield" },
            { title: "Instantly Scalable", desc: "Handling ten operations or ten thousand concurrently with flat costs.", icon: "TrendingUp" },
            { title: "Encrypted Middleware Proxy", desc: "We design custom Express relays that prevent public API key compromises.", icon: "Code" },
            { title: "CRM Sync native", desc: "Real-time updates across platforms like HubSpot, Zoho, and active databases.", icon: "Layout" },
            { title: "Voice & Speech Ready", desc: "Integration endpoints supporting dynamic audio processing and transcripts.", icon: "Sparkles" }
          ]
        }
      },
      {
        id: "ai-testimonials",
        type: "testimonials",
        settings: {
          title: "Operational Efficiency Endorsee Portfolio",
          testimonialsList: [
            { name: "Marcus Chen", text: "We used to spend hours manually entering leads and assigning them. Preet's team compiled an automated webhook array. No data leaks, no manual clicks, and response times fell to zero.", position: "VP of Operations, Global Cargo Logistics", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
            { name: "Ananya Mehta", text: "The custom AI chat routing module they built for our ecommerce brand handles 70% of inbound tickets beautifully. Our agent overhead decreased dramatically directly after deployment.", position: "Founder, Mehta Lifestyle Brands", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
            { name: "Siddharth Roy", text: "Exceptional engineering depth. They set up advanced parsing triggers that read messy emails, structure the parameters, and update our databases seamlessly.", position: "Director of Product, Roy Financial Ventures", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
          ]
        }
      },
      {
        id: "ai-faq",
        type: "faq",
        settings: {
          title: "Frequently Addressed AI Inquiries",
          faqItems: [
            { q: "Is custom AI automation expense-heavy?", a: "No. Usually, the labor savings and lead conversion speed boosts reclaim the initial configuration costs within 45 to 60 days." },
            { q: "Can you automate legacy systems with zero APIs?", a: "Yes, we construct custom web scraping or programmatic interface triggers that interact with older databases reliably." },
            { q: "How do you avoid AI hallucinations?", a: "We utilize strict RAG (Retrieval-Augmented Generation) architectures that force response engines to reference pre-approved internal sheets exclusively." },
            { q: "How long is a standard automation deployment?", a: "A tailored database webhook pipeline takes about 2 to 3 weeks while complex LLM chat portals require 5 to 7 weeks." },
            { q: "Do we receive regular monitoring of API endpoints?", a: "Yes. We configure automated error reporting notifications on Slack so we resolve any API updates immediately." }
          ]
        }
      },
      {
        id: "ai-cta",
        type: "cta",
        settings: {
          ctaTitle: "Ready to liberate your workforce?",
          ctaSubtitle: "Request a custom workflow review and receive a blueprint outlining high-potential automation channels. 100% free.",
          ctaBtnText: "Schedule My Automation Strategy Session",
          ctaBtnLink: "/contact",
          ctaTheme: "dark"
        }
      }
    ])
  }
];

const dataPath = path.join(process.cwd(), 'data', 'services.json');

try {
  // Ensure directory exists
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2), 'utf-8');
  console.log('--- Services Database Populated Successfully! ---');
  console.log(`Total services generated: ${services.length}`);
} catch (err) {
  console.error('Failed to populate services database', err);
  process.exit(1);
}
