import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { CmsBlockRenderer, SectionBlock } from '../components/CmsBlockRenderer';
import { CmsPage } from '../types';

export const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = React.useState<CmsPage | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/pages/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPage(data);
        }
      } catch (err) {
        console.error("Could not fetch dynamic page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-32 min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page || page.status !== 'PUBLISHED') {
    return <Navigate to="/" />;
  }

  // Detect visual block structure or markdown content
  let isSerializedVisual = false;
  let blocksList: SectionBlock[] = [];
  try {
    const parsed = JSON.parse(page.body);
    if (Array.isArray(parsed)) {
      isSerializedVisual = true;
      blocksList = parsed;
    }
  } catch {
    isSerializedVisual = false;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white font-sans relative overflow-hidden">
      <Helmet>
        <title>{page.title} | Preet Web Vision</title>
        <meta name="description" content={isSerializedVisual ? `Dynamic custom page for ${page.title}` : page.body.substring(0, 160)} />
      </Helmet>

      {/* Abstract Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />

      {isSerializedVisual ? (
        <div className="flex-grow pt-28">
          <CmsBlockRenderer blocks={blocksList} />
        </div>
      ) : (
        <div className="flex-grow pt-36 pb-32 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#FFB347] hover:text-[#FF6B00] mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="bg-[#121212] border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8">
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight border-b border-white/10 pb-6">
                {page.title}
              </h1>
              
              <div className="prose prose-invert max-w-none text-[#BFBFBF] leading-relaxed text-sm sm:text-base">
                <div className="markdown-body">
                  <Markdown>{page.body}</Markdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

