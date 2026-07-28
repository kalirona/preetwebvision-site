import React from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Search, ArrowLeft, Clock, BookOpen, ThumbsUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BLOG_POSTS = [
  {
    id: 1,
    slug: 'wordpress-seo-2026',
    title: 'WordPress Technical SEO: Ultimate Deep-Dive Guide',
    excerpt: 'Learn the latest technical SEO and architecture guidelines to make your site rank higher and load faster in the AI search era.',
    category: 'SEO & Technical Growth',
    date: 'May 15, 2026',
    author: 'Preet',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    content: `# WordPress SEO: Ultimate Deep-Dive Guide for 2026

SEO is undergoing its most significant evolution since the introduction of mobile-first indexing. In an environment dominated by conversational AI search engines and personalized feeds, standard keyword stuffing is entirely obsolete. To secure page-one rankings, you must ensure your platform is technically flawless, lightning fast, and highly authoritative.`
  },
  {
    id: 2,
    slug: 'ai-tools-for-digital-growth',
    title: 'AI Automation Engines for Enterprise Growth',
    excerpt: 'Efficiency is the new growth lever. Discover the AI architectures that save performance agencies 20+ hours per week.',
    category: 'AI & Automation',
    date: 'May 10, 2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    content: `# AI Tools for High-Performance Growth

Integrating AI models into your marketing workflows requires secure API setups. Most teams try to run complex prompt queries directly inside browser-based chat portals. This approach is slow, hard to scale, and exposes confidential research data.`
  }
];

export const BlogHub = () => {
  const [searchParams] = useSearchParams();
  const postSlug = searchParams.get('post');
  const [posts, setPosts] = React.useState<any[]>(BLOG_POSTS);

  React.useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(() => {});
  }, []);

  const activePost = postSlug ? posts.find(p => p.slug === postSlug) : null;

  if (activePost) {
    return (
      <div className="w-full pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen overflow-x-hidden">
        <Helmet>
          <title>{activePost.title} | Preet Web Vision Growth Journal</title>
          <meta name="description" content={activePost.excerpt} />
        </Helmet>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FFB347] hover:text-[#FF6B00] mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Growth Journal
          </Link>

          <div className="mb-8">
            <span className="px-3 py-1 rounded-md bg-[#161616] border border-white/10 font-mono text-[10px] text-[#FFB347] uppercase tracking-widest inline-block mb-4">
              {activePost.category}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight mb-4">
              {activePost.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-[#8B8B8B]">
              <span>By {activePost.author}</span>
              <span>•</span>
              <span>{activePost.date}</span>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-12 bg-[#121212]">
            <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert max-w-none text-[#BFBFBF] leading-relaxed text-sm sm:text-base space-y-6">
            <ReactMarkdown>{activePost.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-32 bg-[#080808] text-white font-sans relative overflow-hidden min-h-screen">
      <Helmet>
        <title>Growth Journal & Technical SEO Insights | Preet Web Vision</title>
        <meta name="description" content="Explore thought leadership articles on web engineering, technical SEO, conversion rate optimization, and AI automation." />
        <link rel="canonical" href="https://preetwebvision.com/blog" />
        <meta property="og:title" content="Growth Journal & Technical SEO Insights | Preet Web Vision" />
        <meta property="og:description" content="Explore thought leadership articles on web engineering, technical SEO, conversion rate optimization, and AI automation." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://preetwebvision.com/blog" />
      </Helmet>

      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616] border border-[#FF6B00]/30 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span className="text-[11px] font-mono font-bold text-[#FFB347] uppercase tracking-[0.2em]">
              GROWTH JOURNAL & THOUGHT LEADERSHIP
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[1.02] mb-6">
            TECHNICAL INSIGHTS FOR <br />
            <span className="text-gradient-orange">MARKET LEADERS</span>
          </h1>

          <p className="text-[#BFBFBF] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
            In-depth guides on site performance engineering, Core Web Vitals, conversion mechanics, and AI growth workflows.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {posts.map((post) => (
            <Link 
              key={post.id || post.slug} 
              to={`/blog?post=${post.slug}`}
              className="p-8 rounded-3xl bg-[#121212] border border-white/10 hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-6 bg-[#161616]">
                  <img src={post.image} alt={post.title} width="800" height="600" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#8B8B8B] mb-3">
                  <span className="text-[#FFB347] uppercase">{post.category}</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="font-display text-2xl font-bold uppercase text-white mb-3 group-hover:text-[#FF6B00] transition-colors">
                  {post.title}
                </h2>

                <p className="text-xs text-[#BFBFBF] leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FF6B00] pt-4 border-t border-white/10">
                <span>Read Full Article</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
