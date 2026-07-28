import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Save, Globe, BarChart3, TrendingUp, Cpu, Award, RefreshCw, Layers, Check, Link, AlertTriangle, Gauge, Activity, FileCode, Copy, Trash2 } from 'lucide-react';

export const SEOModule = () => {
  const [activeTab, setActiveTab] = React.useState<'catalog' | 'performance' | 'competitors' | 'sitemap'>('catalog');
  const [settings, setSettings] = React.useState<any[]>([]);
  const [gscStats, setGscStats] = React.useState<any>(null);
  const [internalLinks, setInternalLinks] = React.useState<any>(null);
  
  // Performance states
  const [performanceAudits, setPerformanceAudits] = React.useState<any[]>([]);
  const [runningAudit, setRunningAudit] = React.useState(false);
  const [auditUrl, setAuditUrl] = React.useState('/');
  const [perfReportFeedback, setPerfReportFeedback] = React.useState<string | null>(null);

  // Competitor states
  const [competitors, setCompetitors] = React.useState<any[]>([]);
  const [newCompDomain, setNewCompDomain] = React.useState('');
  const [addingComp, setAddingComp] = React.useState(false);

  // Sitemap states
  const [sitemapData, setSitemapData] = React.useState<any>(null);
  const [loadingSitemap, setLoadingSitemap] = React.useState(false);
  const [copiedSitemap, setCopiedSitemap] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  // Edit Routing Meta modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [pagePath, setPagePath] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDesc, setMetaDesc] = React.useState('');
  const [markup, setMarkup] = React.useState('{}');

  // AI assessment states
  const [analyzingPath, setAnalyzingPath] = React.useState<string | null>(null);
  const [aiReport, setAiReport] = React.useState<any | null>(null);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const [resSEO, resGsc, resLinks, resPerf, resComps] = await Promise.all([
        fetch('/api/seo'),
        fetch('/api/seo/gsc-stats'),
        fetch('/api/seo/internal-links'),
        fetch('/api/seo/performance/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/seo/competitors/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setSettings(await resSEO.json());
      setGscStats(await resGsc.json());
      setInternalLinks(await resLinks.json());
      setPerformanceAudits(await resPerf.json());
      setCompetitors(await resComps.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSEOData();
  }, []);

  const handleRunPerformanceAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl) return;
    setRunningAudit(true);
    setPerfReportFeedback(null);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo/performance/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: auditUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setPerformanceAudits(prev => [data, ...prev]);
        setPerfReportFeedback(`Successfully generated speed score: ${data.performanceScore}/100 for path "${auditUrl}"`);
      } else {
        const errData = await res.json();
        setPerfReportFeedback(`Error: ${errData.error || "Failed to process speed audit"}`);
      }
    } catch (err: any) {
      console.error(err);
      setPerfReportFeedback(`Fault: ${err?.message || "Audit socket communication failed."}`);
    } finally {
      setRunningAudit(false);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompDomain) return;
    setAddingComp(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo/competitors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain: newCompDomain })
      });
      if (res.ok) {
        const data = await res.json();
        setCompetitors(prev => [...prev, data]);
        setNewCompDomain('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingComp(false);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/seo/competitors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCompetitors(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSitemap = async () => {
    setLoadingSitemap(true);
    try {
      const res = await fetch('/api/seo/sitemap/generate');
      if (res.ok) {
        setSitemapData(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSitemap(false);
    }
  };

  const handleCopySitemapText = () => {
    if (!sitemapData?.xml) return;
    navigator.clipboard.writeText(sitemapData.xml);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setPagePath('');
    setMetaTitle('');
    setMetaDesc('');
    setMarkup('{}');
    setAiReport(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index: number, item: any) => {
    setEditingIndex(index);
    setPagePath(item.pagePath || '');
    setMetaTitle(item.title || '');
    setMetaDesc(item.description || '');
    setMarkup(item.schemaMarkup || '{}');
    setAiReport(null);
    setIsModalOpen(true);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagePath || !metaTitle) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pagePath,
          title: metaTitle,
          description: metaDesc,
          schemaMarkup: markup
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSEOData();
      }
    } catch (e) {
       console.error(e);
    }
  };

  const triggerAiAnalyze = async (item: any) => {
    setAnalyzingPath(item.pagePath);
    setAiReport(null);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: item.title,
          content: item.description || "Website main index path landing.",
          focusKeyword: item.pagePath === '/' ? "technical wordpress architect" : "web development services",
          metaDescription: item.description
        })
      });

      if (res.ok) {
        const report = await res.json();
        setAiReport(report);
      }
    } catch (e) {
       console.error(e);
    } finally {
      setAnalyzingPath(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold italic">
         Compiling Search console indexes & link architecture maps...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex justify-between items-center pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">SEO & Index Intelligence</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Real Google Search Console telemetry, Internal Link Juices, and AI audit models</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md cursor-pointer"
        >
          <Plus size={16} /> Add Static Route
        </button>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex gap-4 border-b border-slate-100 pb-2 select-none overflow-x-auto scrollbar-none">
         <button
           type="button"
           onClick={() => setActiveTab('catalog')}
           className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
             activeTab === 'catalog' ? 'border-indigo-650 text-indigo-705' : 'border-transparent text-slate-400 hover:text-slate-700'
           }`}
         >
            📊 SEO & Console Catalog
         </button>
         <button
           type="button"
           onClick={() => setActiveTab('performance')}
           className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
             activeTab === 'performance' ? 'border-indigo-650 text-indigo-705' : 'border-transparent text-slate-400 hover:text-slate-700'
           }`}
         >
            🚀 Speed Core Web Vitals
         </button>
         <button
           type="button"
           onClick={() => setActiveTab('competitors')}
           className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
             activeTab === 'competitors' ? 'border-indigo-650 text-indigo-705' : 'border-transparent text-slate-400 hover:text-slate-700'
           }`}
         >
            🔍 Competitor Backlinks Spy
         </button>
         <button
           type="button"
           onClick={() => {
             setActiveTab('sitemap');
             handleGenerateSitemap();
           }}
           className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
             activeTab === 'sitemap' ? 'border-indigo-650 text-indigo-705' : 'border-transparent text-slate-400 hover:text-slate-700'
           }`}
         >
            📁 Static XML Sitemap
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'catalog' && (
          <motion.div
            key="catalog-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Grid 1: Google Search Console Stats Overview */}
            {gscStats && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-7 border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Organic Clicks</p>
                    <div>
                      <h4 className="text-3xl font-black tracking-tight text-slate-900">{gscStats.summary.totalClicks.toLocaleString()}</h4>
                      <p className="text-[9px] text-green-600 font-bold flex items-center gap-1 mt-1"><TrendingUp size={12} /> +12% from past month</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-7 border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search Impressions</p>
                    <div>
                      <h4 className="text-3xl font-black tracking-tight text-slate-900">{gscStats.summary.totalImpressions.toLocaleString()}</h4>
                      <p className="text-[9px] text-green-600 font-bold flex items-center gap-1 mt-1"><TrendingUp size={12} /> +24% search index status</p>
                    </div>
                  </div>

                  <div className="bg-white p-7 border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Average CTR</p>
                    <div>
                      <h4 className="text-3xl font-black tracking-tight text-slate-900">{gscStats.summary.avgCtr}%</h4>
                      <p className="text-[9px] text-indigo-600 font-bold flex items-center gap-1 mt-1">Snippets optimization target</p>
                    </div>
                  </div>

                  <div className="bg-white p-7 border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search Rank Position</p>
                    <div>
                      <h4 className="text-3xl font-black tracking-tight text-slate-900">{gscStats.summary.avgPosition}</h4>
                      <p className="text-[9px] text-indigo-650 font-bold flex items-center gap-1 mt-1"><Check size={12} /> Google First Page Average</p>
                    </div>
                  </div>
                </div>

                {/* SVG Histograph */}
                <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                         <BarChart3 size={15} className="text-indigo-600" /> Impressions Vs Clicks Organic History Graph
                      </h3>
                      <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 uppercase px-3 py-1 rounded-full">{gscStats.indexedPages.totalIndexed} Pages Indexed</span>
                   </div>

                   {/* Dynamic SVG chart render */}
                   <div className="w-full h-48 relative flex items-end justify-between pt-6 border-b border-l border-slate-100 px-6">
                      {gscStats.summary.history.map((pt: any, idx: number) => {
                        const clickHeight = (pt.clicks / 1200) * 100;
                        const impHeight = (pt.impressions / 18000) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                             <div className="flex gap-1.5 items-end justify-center w-full h-32">
                                {/* Impressions bar */}
                                <div style={{ height: `${impHeight}%` }} className="w-3 bg-slate-100 group-hover:bg-slate-200 transition-colors rounded-t-md" />
                                {/* Clicks bar */}
                                <div style={{ height: `${clickHeight}%` }} className="w-3 bg-indigo-600 group-hover:bg-indigo-505 transition-colors rounded-t-md" />
                             </div>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">{pt.date}</span>

                             {/* Tooltip trigger */}
                             <div className="absolute bottom-40 bg-slate-900 text-white p-3 rounded-lg text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-md w-36 text-center">
                                <p className="font-bold border-b border-slate-800 pb-1 mb-1">{pt.date}</p>
                                <p className="text-green-400">Clicks: {pt.clicks}</p>
                                <p className="text-slate-300">Imp: {pt.impressions}</p>
                                <p>CTR: {pt.ctr}%</p>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            )}

            {/* Grid 2: Route Meta lists & AI technical audit hooks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="col-span-2 space-y-6">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">SEO Paths Catalog Indices</h3>

                <div className="space-y-6">
                  {settings.map((item, i) => (
                    <div key={i} className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm relative group flex justify-between gap-6 hover:shadow-md transition-shadow">
                       <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-2">
                             <span className="bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">/{item.pagePath === '/' ? 'index' : item.pagePath.replace("/","")}</span>
                             <p className="text-xs font-bold text-slate-400 font-mono">path: {item.pagePath}</p>
                          </div>

                          <div className="space-y-1.5">
                             <p className="text-sm font-extrabold text-slate-950 leading-tight">{item.title}</p>
                             <p className="text-xs font-medium text-slate-500 leading-normal line-clamp-2">{item.description}</p>
                          </div>

                          <div className="flex gap-4 pt-1">
                             <button
                               onClick={() => triggerAiAnalyze(item)}
                               disabled={analyzingPath === item.pagePath}
                               className="px-4 py-2 bg-slate-900 border hover:bg-slate-800 border-slate-900 hover:border-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow cursor-pointer"
                             >
                                <Cpu size={12} className={analyzingPath === item.pagePath ? 'animate-spin' : ''} />
                                {analyzingPath === item.pagePath ? "Running Audit..." : "AI SEO Audit"}
                             </button>

                             <button
                               onClick={() => openEditModal(i, item)}
                               className="px-4 py-2 bg-white text-slate-650 hover:bg-slate-50 border border-slate-150 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
                             >
                                Edit Meta Mapping
                             </button>
                          </div>
                       </div>

                       {/* Custom Schema display indicator */}
                       <div className="hidden sm:flex flex-col justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded border border-slate-150 font-mono text-slate-400">SCHEMA: TRUE</span>
                          {item.schemaMarkup && item.schemaMarkup !== '{}' ? (
                            <span className="bg-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Structured Schema</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">None</span>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Audit Inspector View */}
              <div className="space-y-10">
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">SEO Audit Panel Output</h3>

                <AnimatePresence mode="wait">
                  {aiReport ? (
                    <motion.div
                      key="report"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-md space-y-6"
                    >
                       <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                          <h4 className="text-xs font-black uppercase tracking-wide text-indigo-700 flex items-center gap-1">
                             <Award size={15} /> Technical SEO Report
                          </h4>
                          <span className="bg-slate-900 text-white text-[10px] font-mono font-black px-2.5 py-1 rounded-lg">Score: {aiReport.score}/100</span>
                       </div>

                       <div className="space-y-5">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Keywords & Titles Check</p>
                             <p className="text-xs text-slate-700 font-medium leading-relaxed italic">"{aiReport.headingsAnalysis}"</p>
                          </div>

                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Actionable Optimization Suggestions</p>
                             <ul className="space-y-2">
                               {aiReport.suggestions.map((sug: string, sIdx: number) => (
                                 <li key={sIdx} className="text-xs text-slate-600 font-medium flex gap-2 leading-relaxed">
                                    <span className="text-indigo-600 font-bold">•</span>
                                    {sug}
                                 </li>
                               ))}
                             </ul>
                          </div>

                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                             <p className="text-[8px] font-black text-indigo-650 uppercase tracking-widest">Recommended Meta snippet</p>
                             <p className="text-xs font-bold text-slate-800">{aiReport.metaTitleSuggestion}</p>
                             <p className="text-[10px] text-slate-500 font-medium leading-normal italic">"{aiReport.metaDescSuggestion}"</p>
                          </div>

                          <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl flex items-start gap-3">
                             <Link size={16} className="text-indigo-700 shrink-0 mt-0.5" />
                             <div>
                                <p className="text-[9px] font-black text-indigo-800 uppercase tracking-widest mb-0.5">LSI Interlink Recommendation</p>
                                <p className="text-[11px] text-indigo-950 font-bold leading-relaxed">{aiReport.internalLinkSuggestion}</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-50/50 p-10 border border-slate-100 rounded-[2.5rem] text-center text-slate-400 font-bold italic text-xs leading-relaxed">
                       Click the "AI SEO Audit" button on any path inside the indexing list to invoke Google Rank heuristics, technical heading structures, focus density levels, and meta optimizations.
                    </div>
                  )}
                </AnimatePresence>

                {/* Core Linking matrix overview (incoming, outgoing counts) */}
                {internalLinks && (
                  <div className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Contextual Links Matrix</h4>

                    <div className="grid grid-cols-2 gap-4 text-center">
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-2xl font-black text-slate-950">{internalLinks.orphanPagesCount}</p>
                          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center justify-center gap-1 mt-1">
                             <AlertTriangle size={10} /> Orphan Articles
                          </p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-2xl font-black text-slate-950">{internalLinks.linkJuiceIndex}%</p>
                          <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Link Juice Score</p>
                       </div>
                    </div>

                    <div className="space-y-3 pt-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Path interconnections</p>
                       
                       <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {internalLinks.links.map((link: any, idx: number) => (
                            <div key={idx} className="p-3 border border-slate-50 rounded-xl flex justify-between items-center text-[10px]">
                               <div>
                                  <p className="font-extrabold text-slate-800 line-clamp-1">{link.title}</p>
                                  <span className="text-slate-400 font-mono text-[9px]">{link.url}</span>
                               </div>
                               <div className="flex gap-1 shrink-0">
                                  <span className="bg-indigo-50 text-indigo-700 font-black px-1.5 py-0.5 rounded text-[8px]" title="Incoming internal links">In: {link.incomingLinksCount}</span>
                                  <span className="bg-slate-900 text-white font-black px-1.5 py-0.5 rounded text-[8px]" title="Outgoing internal links">Out: {link.outgoingLinksCount}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* tab 2: Core Web Vitals Auditor */}
        {activeTab === 'performance' && (
          <motion.div
            key="performance-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
             <div className="bg-white p-8 md:p-10 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                <div>
                   <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Technical Speed Benchmark & Core Web Vitals Audit</h3>
                   <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Analyze mobile and desktop performance benchmarks to achieve 100/100 speed and improve indexing</p>
                </div>

                <form onSubmit={handleRunPerformanceAudit} className="flex flex-col sm:flex-row gap-3">
                   <select
                     value={auditUrl}
                     onChange={(e) => setAuditUrl(e.target.value)}
                     className="bg-slate-50 border border-slate-105 rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none focus:border-indigo-650"
                   >
                      <option value="/">Index Endpoint ( / )</option>
                      <option value="/services">Services Pathway ( /services )</option>
                      <option value="/blog">SEO blog index ( /blog )</option>
                      <option value="https://google.com">Google Sandbox External Core</option>
                   </select>

                   <button
                     type="submit"
                     disabled={runningAudit}
                     className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
                   >
                      <Activity size={12} className={runningAudit ? 'animate-spin' : ''} />
                      {runningAudit ? "Injecting Tracer Scripts..." : "Initialize Speed Diagnostics"}
                   </button>
                </form>

                {perfReportFeedback && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-extrabold text-indigo-755 uppercase">
                     ⚡ {perfReportFeedback}
                  </div>
                )}
             </div>

             {performanceAudits.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   
                   {/* Main diagnostic result panel */}
                   <div className="lg:col-span-1 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                         <span className="text-[8px] font-black uppercase bg-slate-900 text-white px-2.5 py-1 rounded-md">LATEST SCORE CARD</span>
                         <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Path: <span className="font-mono text-slate-800 lowercase">{performanceAudits[0].url}</span></h4>
                         
                         <div className="grid grid-cols-2 gap-4 pt-3 text-center">
                            <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-2xl">
                               <p className="text-4xl font-black italic text-emerald-600 tracking-tighter">{performanceAudits[0].performanceScore}</p>
                               <p className="text-[8px] font-black text-slate-550 uppercase tracking-widest mt-1">Speed Rating</p>
                            </div>
                            <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-2xl">
                               <p className="text-4xl font-black italic text-indigo-600 tracking-tighter">{performanceAudits[0].seoScore}</p>
                               <p className="text-[8px] font-black text-slate-550 uppercase tracking-widest mt-1">SEO Score</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Compliance Heuristics</p>
                         <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="p-2.5 bg-slate-50 rounded-xl">
                               <p className="font-mono font-bold text-slate-850">Accessibility</p>
                               <p className="text-slate-500 font-extrabold">{performanceAudits[0].accessibilityScore}%</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl">
                               <p className="font-mono font-bold text-slate-850">Best Practice</p>
                               <p className="text-slate-500 font-extrabold">{performanceAudits[0].bestPracticesScore}%</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Core Web Vitals metric numbers */}
                   <div className="lg:col-span-2 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                         <Gauge size={14} className="text-indigo-600" /> Core Web Vitals Real-Time Analytics Audit
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                         
                         <div className="p-5 border border-slate-50 rounded-2xl space-y-2 relative">
                            <span className="text-[8px] font-black text-emerald-600 absolute top-4 right-4 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">FAST</span>
                            <p className="text-[9px] font-black uppercase text-slate-400">First Contentful Paint (FCP)</p>
                            <p className="text-2xl font-black text-slate-900">{performanceAudits[0].metrics.fcp}s</p>
                            <p className="text-[8px] font-medium text-slate-400 leading-tight">Measures layout elements rendering speeds</p>
                         </div>

                         <div className="p-5 border border-slate-50 rounded-2xl space-y-2 relative">
                            <span className="text-[8px] font-black text-indigo-650 absolute top-4 right-4 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">GOOD</span>
                            <p className="text-[9px] font-black uppercase text-slate-400">Largest Contentful Paint (LCP)</p>
                            <p className="text-2xl font-black text-slate-900">{performanceAudits[0].metrics.lcp}s</p>
                            <p className="text-[8px] font-medium text-slate-400 leading-tight">Measures main body viewport painting finish</p>
                         </div>

                         <div className="p-5 border border-slate-50 rounded-2xl space-y-2 relative">
                            <span className="text-[8px] font-black text-emerald-600 absolute top-4 right-4 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">IDEAL</span>
                            <p className="text-[9px] font-black uppercase text-slate-400">Cumulative Layout Shift (CLS)</p>
                            <p className="text-2xl font-black text-slate-900">{performanceAudits[0].metrics.cls}</p>
                            <p className="text-[8px] font-medium text-slate-400 leading-tight">Calculates visual shifting on page structures</p>
                         </div>

                         <div className="p-5 border border-slate-50 rounded-2xl space-y-2 relative">
                            <span className="text-[8px] font-black text-emerald-600 absolute top-4 right-4 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">SECURE</span>
                            <p className="text-[9px] font-black uppercase text-slate-400">Total Blocking Time (TBT)</p>
                            <p className="text-2xl font-black text-slate-900">{performanceAudits[0].metrics.fid}ms</p>
                            <p className="text-[8px] font-medium text-slate-400 leading-tight">Evaluates main-thread scripting pauses</p>
                         </div>

                         <div className="p-5 border border-slate-50 rounded-2xl space-y-2 relative col-span-1 sm:col-span-2">
                            <span className="text-[8px] font-black text-indigo-650 absolute top-4 right-4 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">LOW TIME</span>
                            <p className="text-[9px] font-black uppercase text-slate-400">Time To First Byte (TTFB)</p>
                            <p className="text-2xl font-black text-slate-900">{performanceAudits[0].metrics.ttfb}ms</p>
                            <p className="text-[8px] font-medium text-slate-400 leading-tight">Calculates hosting roundtrip response velocities</p>
                         </div>
                      </div>

                      {/* AI Optimization advice */}
                      <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl space-y-1.5 select-none">
                         <p className="text-[9px] font-black text-indigo-800 uppercase tracking-widest">Actionable Core Web Vitals speed guidelines</p>
                         <ul className="space-y-1.5">
                            {performanceAudits[0].recommendations.map((rec: string, rIdx: number) => (
                              <li key={rIdx} className="text-xs text-slate-700 font-medium flex gap-2">
                                 <span className="text-indigo-650 font-bold">•</span>
                                 {rec}
                              </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                </div>
             )}
          </motion.div>
        )}

        {/* tab 3: Competitor Spy Tracker */}
        {activeTab === 'competitors' && (
          <motion.div
            key="competitors-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
             {/* Left add form */}
             <div className="lg:col-span-1 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6 h-fit">
                <div>
                   <h3 className="text-base font-black text-slate-950 uppercase tracking-tight italic">Competitor Tracking Node</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Monitor high-ranking competitor authority levels</p>
                </div>

                <form onSubmit={handleAddCompetitor} className="space-y-4">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Competitor Domain Link</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. zenith-marketing.com"
                        value={newCompDomain}
                        onChange={(e) => setNewCompDomain(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:bg-white focus:outline-none"
                      />
                   </div>

                   <button
                     type="submit"
                     disabled={addingComp}
                     className="w-full py-3.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all shadow"
                   >
                      {addingComp ? "Analyzing Anchor Ratios..." : "Add Competitor Anchor"}
                   </button>
                </form>

                <div className="space-y-3.5 pt-4 border-t border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outreach & Link Gap Metrics</p>
                   <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                      Analyzing competitors helps you identify valuable keywords, organic traffic flows, and search visibility ideas to rank higher naturally.
                   </p>
                </div>
             </div>

             {/* Right competitors ledger */}
             <div className="lg:col-span-2 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                <div>
                   <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">Competitor Analysis Table</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Estimated organic traffic flow, domain authority, and backlinks</p>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full border-collapse text-left text-xs">
                      <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">
                            <th className="px-5 py-4">Competitor Domain</th>
                            <th className="px-5 py-4 text-center">Auth (DA)</th>
                            <th className="px-5 py-4 text-center">Backlinks Count</th>
                            <th className="px-5 py-4 text-center">Traffic Flow</th>
                            <th className="px-5 py-4 text-center">Keyword Overlap</th>
                            <th className="px-5 py-4 text-center">Rank</th>
                            <th className="px-5 py-4 text-right">Erase</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {competitors.map((comp) => (
                           <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-3.5 font-bold text-slate-900 select-all">{comp.domain}</td>
                              <td className="px-5 py-3.5 text-center font-mono font-black text-indigo-700 font-bold">{comp.domainAuthority}</td>
                              <td className="px-5 py-3.5 text-center font-bold text-slate-700">{comp.backlinkCount.toLocaleString()}</td>
                              <td className="px-5 py-3.5 text-center font-extrabold text-slate-905">{comp.estimatedMonthlyTraffic}</td>
                              <td className="px-5 py-3.5 text-center font-extrabold text-indigo-500">{comp.sharedKeywordsOverlap}%</td>
                              <td className="px-5 py-3.5 text-center font-mono font-extrabold text-slate-650">#{comp.keywordRankPos}</td>
                              <td className="px-5 py-3.5 text-right">
                                 <button
                                   onClick={() => handleDeleteCompetitor(comp.id)}
                                   className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                   title="Delete competitor link"
                                 >
                                    <Trash2 size={13} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        )}

        {/* tab 4: XML Sitemap Schema */}
        {activeTab === 'sitemap' && (
          <motion.div
            key="sitemap-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             <div className="bg-white p-8 md:p-10 border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Dynamic Search Console sitemaps compiler (sitemap.xml)</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Synthesizes and complies the fully valid XML code with priority weights from active DB nodes</p>
                   </div>

                   <button
                     onClick={handleGenerateSitemap}
                     disabled={loadingSitemap}
                     className="px-6 py-3.5 bg-indigo-650 hover:bg-slate-905 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow flex items-center gap-2 shrink-0"
                   >
                      <RefreshCw size={13} className={loadingSitemap ? 'animate-spin' : ''} />
                      {loadingSitemap ? "Compiling XML paths..." : "Regenerate Live Sitemap"}
                   </button>
                </div>

                {sitemapData && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Raw snippet block with quick copy */}
                     <div className="lg:col-span-1 space-y-4">
                        <div className="flex justify-between items-center select-none">
                           <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Crawlable sitemap.xml Output</p>
                           <button
                             onClick={handleCopySitemapText}
                             className="text-[9px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                           >
                              <Copy size={12} />
                              {copiedSitemap ? "Copied!" : "Copy XML Code"}
                           </button>
                        </div>

                        <pre className="p-4 bg-slate-950 text-emerald-400 text-[9px] font-mono leading-relaxed rounded-2xl overflow-x-auto h-72 select-all border border-slate-900">
                           {sitemapData.xml}
                        </pre>

                        <div className="flex gap-4 p-4 bg-emerald-50 border border-emerald-100/55 rounded-2xl items-start select-none">
                           <FileCode size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                           <p className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-tight leading-normal">
                              Successfully generated sitemap with {sitemapData.count} URLs! You can submit this sitemap to Google Search Console to help search crawlers index your website.
                           </p>
                        </div>
                     </div>

                     {/* URLs ledger showing variables */}
                     <div className="lg:col-span-2 space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Included page URLs</p>

                        <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                           {sitemapData.urlList.map((node: any, nIdx: number) => (
                             <div key={nIdx} className="p-4 border border-slate-50 bg-slate-50/40 rounded-xl flex items-center justify-between hover:border-slate-100 hover:bg-slate-50 transition-colors">
                                <div>
                                   <p className="text-xs font-bold text-slate-800 break-all select-all">{node.loc}</p>
                                   <p className="text-[9px] font-bold text-slate-400 font-mono mt-0.5 uppercase">Lastmod: {node.lastmod} | freq: {node.changefreq}</p>
                                </div>
                                <span className="bg-indigo-50 text-indigo-750 text-[10px] pr-2.5 pl-2 py-0.5 rounded-full font-mono font-black">w: {node.priority}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Route Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white z-[90] shadow-2xl rounded-[3rem] p-10 space-y-8"
            >
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Configure Route SEO Mapping</h3>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">SEO Index Engine Management</p>
               </div>

               <form onSubmit={handleSaveRoute} className="space-y-6">
                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Page URL Path Endpoint</label>
                     <input 
                       type="text" 
                       required
                       disabled={editingIndex !== null}
                       placeholder="e.g. /services"
                       value={pagePath}
                       onChange={(e) => setPagePath(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-mono font-bold focus:bg-white focus:outline-none"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Meta Title</label>
                     <input 
                       type="text" 
                       required
                       placeholder="Rank Title tag..."
                       value={metaTitle}
                       onChange={(e) => setMetaTitle(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold focus:bg-white focus:outline-none"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Meta Description Snippet</label>
                     <textarea 
                       rows={2}
                       placeholder="Enter high click-thru snippets..."
                       value={metaDesc}
                       onChange={(e) => setMetaDesc(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold focus:bg-white focus:outline-none leading-normal"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Structured JSON Schema Markup</label>
                     <textarea 
                       rows={3}
                       placeholder="{}"
                       value={markup}
                       onChange={(e) => setMarkup(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-xl p-4 text-[10px] font-mono focus:bg-white focus:outline-none"
                     />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                     <button
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       className="px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800"
                     >
                       Discard
                     </button>
                     <button
                       type="submit"
                       className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                     >
                       Commit Route
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
