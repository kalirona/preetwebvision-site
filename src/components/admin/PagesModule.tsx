import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit, Trash2, X, Save, Eye, ArrowUp, ArrowDown, Layout, 
  FileText, Sparkles, CheckCircle2, ChevronRight, Settings, 
  Layers, Heading, Type, Image, Video, HelpCircle, Phone, Award, 
  Check, Star
} from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
  route: string;
  status: 'PUBLISHED' | 'DRAFT';
  body: string; // holds raw text or serialized JSON of blocks
  updatedAt: string;
}

interface Block {
  id: string;
  type: string;
  settings: any;
}

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Section', icon: <Layers size={14} />, desc: 'Headline, subheadline, CTA and image backdrop.' },
  { type: 'markdown', label: 'Markdown Text Block', icon: <Type size={14} />, desc: 'Simple paragraphs and rich header text formatting.' },
  { type: 'heading', label: 'Centered Heading', icon: <Heading size={14} />, desc: 'Stand-alone title section for separation.' },
  { type: 'features', label: 'Why Choose Us / Features', icon: <Award size={14} />, desc: 'List of 3 unique benefits with custom icons.' },
  { type: 'services_grid', label: 'Our Digital Services Grid', icon: <Layout size={14} />, desc: 'Interactive tiles listing core agency solutions.' },
  { type: 'stats', label: 'Performance Stats Banner', icon: <Award size={14} />, desc: '4 quantitative counters showcasing commercial impact.' },
  { type: 'cta', label: 'Action CTA Block', icon: <Sparkles size={14} />, desc: 'Highlighted marketing panel to capture prospects.' },
  { type: 'testimonials', label: 'Reviews Section', icon: <Star size={14} />, desc: 'Displays social proof, Trustpilot and Google reviews.' },
  { type: 'faq', label: 'FAQ Accordion', icon: <HelpCircle size={14} />, desc: 'Expandable list of frequently asked questions.' },
  { type: 'team', label: 'Dedicated Team Section', icon: <Layout size={14} />, desc: 'Visual staff gallery showcasing team bios.' },
  { type: 'contact_form', label: 'Lead & Speed Audit Form', icon: <Phone size={14} />, desc: 'Two-column consultation request builder.' },
  { type: 'image_block', label: 'Dynamic Image Banner', icon: <Image size={14} />, desc: 'Full-width custom asset graphic.' },
  { type: 'video_block', label: 'Interactive Video Block', icon: <Video size={14} />, desc: 'Embedded stream (YouTube or direct URL).' }
];

const DEFAULT_BLOCK_SETTINGS: Record<string, any> = {
  hero: {
    headline: 'HANDCRAFTING BEAUTIFUL, HIGH-CONVERTING WEBSITES.',
    subheadline: 'Custom WordPress themes, Shopify online stores, and organic SEO results built to grow your business.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Request Free Roadmap',
    ctaLink: '/contact'
  },
  markdown: {
    bodyText: '## Section Subheader\nThis is a standard text block. You can write your custom content paragraphs here.\n\n## Growth Engineering\nWe believe in measuring results. Every page speed improvement, image compression, and schema tag works together to capture organic rankings.',
    textAlign: 'left'
  },
  heading: {
    text: 'Core Business Blueprints',
    level: 'h2'
  },
  features: {
    title: 'Engineered For Extreme Search Performance',
    description: 'We do not build typical generic websites. We deliver fast, clean, custom architectures developed to reduce customer acquisition costs.',
    featuresList: [
      { title: 'Extreme Visual Speeds', desc: 'Optimized files and lightweight codes ensuring load times under 1 second.', icon: 'Zap' },
      { title: 'Tailored UX Design', desc: 'Interactive pages built specifically to trigger customer conversions.', icon: 'Layout' },
      { title: 'Built-in Search Engine SEO', desc: 'Clean header hierarchies and modern schema configurations optimized for organic ranking.', icon: 'Sparkles' }
    ]
  },
  services_grid: {
    title: 'Our Digital Services',
    subtitle: 'Choose custom solutions designed of high quality to expand your business and reach more clients.'
  },
  stats: {
    title: 'PROVEN COMMERCIAL IMPACT',
    statsList: [
      { value: '380%', label: 'Organic Traffic Growth', desc: 'Average increase from organic design updates.' },
      { value: '100%', label: 'Dedicated Support Response', desc: 'Support on real-world projects.' },
      { value: '98%', label: 'SEO Friendly Layout Score', desc: 'Clean structuring recommended by Google.' },
      { value: '120+', label: 'Successful Web Launches', desc: 'Completed for our global B2B & local clients.' }
    ]
  },
  cta: {
    ctaTitle: 'Ready to improve your website rankings and speed?',
    ctaSubtitle: 'Request a friendly, detailed review of your website speed, design flaws, and easy solutions.',
    ctaBtnText: 'Initialize Free Consultation',
    ctaBtnLink: '/contact',
    ctaTheme: 'dark'
  },
  testimonials: {
    title: 'CLIENT DEEP DIVE REVIEW',
    subtitle: 'See what verified enterprise stakeholders and small business owners say about our custom development pipeline.'
  },
  faq: {
    title: 'Frequently Asked Questions',
    faqItems: [
      { q: 'How long does a custom web optimization audit take?', a: 'We typically complete a fully comprehensive design and performance roadmap within 48 business hours, indicating all visual flaws and critical speed issues.' },
      { q: 'Will my search rankings decrease during a site migration?', a: 'No. By executing stable 301 redirects, preserving exact URL paths, and deploying fresh structured schemas, we consistently protect or increase search engine visibility.' }
    ]
  },
  team: {
    title: 'Meet Our Dedicated Team',
    subtitle: 'A small, focused team dedicated to building beautiful websites and organic search results.'
  },
  contact_form: {
    formTitle: 'Request a Website Speed and Design Audit',
    formSubtitle: 'Get a friendly, detailed review of your website speed, design flaws, and easy solutions.',
    submitBtnText: 'Submit Consultation Request'
  },
  image_block: {
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Performance analytics showing daily click rates',
    rounded: true
  },
  video_block: {
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Optimization Overview Video'
  }
};

export const PagesModule = () => {
  const [pages, setPages] = React.useState<Page[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Dialog & Edit states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<Page | null>(null);
  const [formData, setFormData] = React.useState<Omit<Page, 'id' | 'updatedAt'>>({
    slug: '',
    title: '',
    route: '',
    status: 'DRAFT',
    body: ''
  });
  
  // Section Builder block layout states
  const [isBuilderMode, setIsBuilderMode] = React.useState(false);
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [selectedBlockIdx, setSelectedBlockIdx] = React.useState<number | null>(null);
  
  // Notification States
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (err) {
      console.error('Error fetching CMS pages:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPages();
  }, []);

  const handleAddNewPage = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      route: '',
      status: 'DRAFT',
      body: ''
    });
    setBlocks([]);
    setIsBuilderMode(false);
    setSelectedBlockIdx(null);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      route: page.route,
      status: page.status,
      body: page.body
    });
    
    // Attempt to parse dynamic visual sections block schema
    try {
      const parsed = JSON.parse(page.body);
      if (Array.isArray(parsed)) {
        setBlocks(parsed);
        setIsBuilderMode(true);
      } else {
        setBlocks([]);
        setIsBuilderMode(false);
      }
    } catch {
      setBlocks([]);
      setIsBuilderMode(false);
    }
    
    setSelectedBlockIdx(null);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete page: ${id}?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Page deleted successfully.');
        fetchPages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete page.');
      }
    } catch {
      setError('Network communication failed during deletion.');
    }
  };

  // Section builder operations
  const handleAddBlock = (type: string) => {
    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      settings: JSON.parse(JSON.stringify(DEFAULT_BLOCK_SETTINGS[type] || {}))
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    setSelectedBlockIdx(updated.length - 1);
  };

  const handleRemoveBlock = (idx: number) => {
    const updated = blocks.filter((_, i) => i !== idx);
    setBlocks(updated);
    if (selectedBlockIdx === idx) {
      setSelectedBlockIdx(null);
    } else if (selectedBlockIdx !== null && selectedBlockIdx > idx) {
      setSelectedBlockIdx(selectedBlockIdx - 1);
    }
  };

  const handleMoveBlock = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === blocks.length - 1) return;
    
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...blocks];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    setBlocks(updated);
    if (selectedBlockIdx === idx) {
      setSelectedBlockIdx(targetIdx);
    } else if (selectedBlockIdx === targetIdx) {
      setSelectedBlockIdx(idx);
    }
  };

  const handleUpdateBlockSetting = (field: string, value: any) => {
    if (selectedBlockIdx === null) return;
    const updated = [...blocks];
    updated[selectedBlockIdx] = {
      ...updated[selectedBlockIdx],
      settings: {
        ...updated[selectedBlockIdx].settings,
        [field]: value
      }
    };
    setBlocks(updated);
  };

  const handleUpdateSublistSetting = (listField: string, itemIdx: number, field: string, value: any) => {
    if (selectedBlockIdx === null) return;
    const updated = [...blocks];
    const targetList = [...(updated[selectedBlockIdx].settings[listField] || [])];
    targetList[itemIdx] = {
      ...targetList[itemIdx],
      [field]: value
    };
    
    updated[selectedBlockIdx] = {
      ...updated[selectedBlockIdx],
      settings: {
        ...updated[selectedBlockIdx].settings,
        [listField]: targetList
      }
    };
    setBlocks(updated);
  };

  const handleAddSublistItem = (listField: string, template: any) => {
    if (selectedBlockIdx === null) return;
    const updated = [...blocks];
    const targetList = [...(updated[selectedBlockIdx].settings[listField] || [])];
    targetList.push(JSON.parse(JSON.stringify(template)));
    
    updated[selectedBlockIdx] = {
      ...updated[selectedBlockIdx],
      settings: {
        ...updated[selectedBlockIdx].settings,
        [listField]: targetList
      }
    };
    setBlocks(updated);
  };

  const handleRemoveSublistItem = (listField: string, itemIdx: number) => {
    if (selectedBlockIdx === null) return;
    const updated = [...blocks];
    const targetList = (updated[selectedBlockIdx].settings[listField] || []).filter((_: any, i: number) => i !== itemIdx);
    
    updated[selectedBlockIdx] = {
      ...updated[selectedBlockIdx],
      settings: {
        ...updated[selectedBlockIdx].settings,
        [listField]: targetList
      }
    };
    setBlocks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!formData.slug || !formData.title) {
      setError('Slug and Title are required details.');
      setSaving(false);
      return;
    }

    // Standardize route path
    let formattedRoute = formData.route.trim();
    if (formattedRoute && !formattedRoute.startsWith('/')) {
      formattedRoute = `/${formattedRoute}`;
    }

    // Save visual builder blocks as serialized JSON if enabled
    const finalBody = isBuilderMode ? JSON.stringify(blocks) : formData.body;

    const payload = {
      ...formData,
      route: formattedRoute || `/${formData.slug}`,
      body: finalBody
    };

    try {
      const token = localStorage.getItem('adminToken');
      const isEdit = !!editingPage;
      const url = isEdit ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess(`Page ${isEdit ? 'updated' : 'created'} successfully!`);
        setIsFormOpen(false);
        fetchPages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to persist CMS changes.');
      }
    } catch {
      setError('Failed to reach backend server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 font-sans text-slate-800">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Dynamic CMS Pages</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Design handcrafted landings and SEO paths with our high-fidelity visual layout engine.</p>
        </div>
        <button 
          onClick={handleAddNewPage}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow shadow-indigo-100"
        >
          <Plus size={14} /> Create Dynamic Page
        </button>
      </div>

      {success && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* Pages list grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-4">Retreiving dynamic pages...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-black italic uppercase text-slate-900 tracking-tight">No Dynamic Pages Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">Build your very first custom route or landing page. It will instantly connect with Preet Web Vision routing.</p>
          <button onClick={handleAddNewPage} className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition">
            Initialize CMS Blueprint
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white border border-slate-150/80 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-indigo-400 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-md ${
                    page.status === 'PUBLISHED' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {page.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-base font-black uppercase italic tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {page.title}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium font-mono mt-1 select-all flex items-center gap-1 bg-slate-50/50 p-1 px-2 rounded-lg border border-slate-100 inline-block">
                    Route: <span className="text-slate-800 font-bold">{page.route}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                  {page.body.startsWith('[') ? '⚡ Custom Visual Block Layout built with the high-fidelity section builder.' : page.body}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <a 
                  href={page.route} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={12} /> Live Preview
                </a>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleEditPage(page)}
                    className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg border border-slate-150/40 transition"
                    title="Customize dynamic layouts"
                  >
                    <Edit size={13} />
                  </button>
                  <button 
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-150/40 transition"
                    title="Delete custom route"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED DIALOG EDITOR / SECTION BUILDER DRAWER */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-slate-50 h-screen shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 md:p-8 bg-white border-b border-slate-150 flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-slate-900">
                    {editingPage ? 'Edit Custom Landing Page' : 'New Dynamic CMS Route'}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-1">Configure layout, slugs, routing, and serialized visual elements.</p>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable form content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                
                {/* Meta Configuration Card */}
                <div className="bg-white p-6 md:p-8 border border-slate-150 rounded-[2rem] shadow-sm space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Settings size={14} className="text-indigo-600" />
                    <span>Metadata & Route Configurations</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Page Name / Title *</label>
                      <input 
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-4 py-3.5 text-xs font-bold"
                        placeholder="e.g., Organic Commerce Solutions"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">SEO URL Slug *</label>
                      <input 
                        type="text"
                        required
                        disabled={!!editingPage}
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-4 py-3.5 text-xs font-bold disabled:opacity-50"
                        placeholder="e.g., ecom-optimization"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Custom Path Route</label>
                      <input 
                        type="text"
                        value={formData.route}
                        onChange={(e) => setFormData({...formData, route: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-4 py-3.5 text-xs font-bold"
                        placeholder="e.g., /services/ecom-optimization (or blank to auto-slug)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'PUBLISHED' | 'DRAFT'})}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-4 py-3.5 text-xs font-bold cursor-pointer"
                      >
                        <option value="DRAFT">DRAFT (Hidden from visitors)</option>
                        <option value="PUBLISHED">PUBLISHED (Live on site)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content Editor Tab selector */}
                <div className="space-y-4">
                  <div className="flex border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsBuilderMode(true)}
                      className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
                        isBuilderMode 
                          ? 'border-indigo-600 text-indigo-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Sparkles size={14} /> High-Fidelity Visual Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBuilderMode(false)}
                      className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition flex items-center gap-2 ${
                        !isBuilderMode 
                          ? 'border-indigo-600 text-indigo-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FileText size={14} /> Rich Markdown/Raw Text
                    </button>
                  </div>

                  {/* VISUAL LAYOUT BUILDER CONTAINER */}
                  {isBuilderMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Current Block Stack */}
                      <div className="lg:col-span-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layout Sequence</span>
                          <span className="text-[10px] font-bold text-slate-500">{blocks.length} sections registered</span>
                        </div>

                        {blocks.length === 0 ? (
                          <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center bg-white space-y-3">
                            <Layers className="mx-auto text-slate-300" size={28} />
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Canvas is Empty</p>
                            <p className="text-[10px] text-slate-400 font-normal leading-relaxed">Select block templates on the right to start assembling your custom landing page layout.</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {blocks.map((block, idx) => {
                              const isSelected = selectedBlockIdx === idx;
                              return (
                                <div 
                                  key={block.id}
                                  onClick={() => setSelectedBlockIdx(idx)}
                                  className={`p-4 bg-white border rounded-2xl cursor-pointer transition flex items-center justify-between group ${
                                    isSelected 
                                      ? 'border-indigo-600 ring-2 ring-indigo-500/10 shadow-md bg-indigo-50/5' 
                                      : 'border-slate-150 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center font-mono text-[9px] font-extrabold text-slate-400">
                                      {idx + 1}
                                    </span>
                                    <div>
                                      <p className="text-xs font-black uppercase tracking-wide text-slate-800">
                                        {BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type.toUpperCase()}
                                      </p>
                                      <p className="text-[9px] text-slate-400 font-semibold uppercase font-mono mt-0.5">TYPE: {block.type}</p>
                                    </div>
                                  </div>

                                  {/* Section controls */}
                                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveBlock(idx, 'up')}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button 
                                      type="button"
                                      disabled={idx === blocks.length - 1}
                                      onClick={() => handleMoveBlock(idx, 'down')}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleRemoveBlock(idx)}
                                      className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right: Available Templates Picker & Active Settings */}
                      <div className="lg:col-span-6 space-y-6">
                        {selectedBlockIdx !== null && blocks[selectedBlockIdx] ? (
                          /* Render Settings form for selected block */
                          <div className="bg-white p-6 border border-slate-150 rounded-[2rem] shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600 font-mono">SECT-{selectedBlockIdx+1} SETTINGS</span>
                                <h5 className="text-xs font-black uppercase text-slate-800">
                                  Configure {BLOCK_TYPES.find(b => b.type === blocks[selectedBlockIdx].type)?.label}
                                </h5>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setSelectedBlockIdx(null)}
                                className="text-[9.5px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest"
                              >
                                Select templates
                              </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                              
                              {/* HERO BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'hero' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Headline Title</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.headline || ''}
                                      onChange={(e) => handleUpdateBlockSetting('headline', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Subheadline Description</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.subheadline || ''}
                                      onChange={(e) => handleUpdateBlockSetting('subheadline', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">CTA Button Label</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.ctaText || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaText', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">CTA Destination URL</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.ctaLink || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaLink', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Backdrop Image URL</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.imageUrl || ''}
                                      onChange={(e) => handleUpdateBlockSetting('imageUrl', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                </>
                              )}

                              {/* MARKDOWN BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'markdown' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Body Content Paragraphs (Supports # Headers)</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.bodyText || ''}
                                      onChange={(e) => handleUpdateBlockSetting('bodyText', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono font-bold"
                                      rows={8}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Alignment</label>
                                    <select 
                                      value={blocks[selectedBlockIdx].settings.textAlign || 'left'}
                                      onChange={(e) => handleUpdateBlockSetting('textAlign', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    >
                                      <option value="left">Left-aligned</option>
                                      <option value="center">Centered</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* HEADING BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'heading' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Heading Title Text</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.text || ''}
                                      onChange={(e) => handleUpdateBlockSetting('text', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Heading Style Level</label>
                                    <select 
                                      value={blocks[selectedBlockIdx].settings.level || 'h2'}
                                      onChange={(e) => handleUpdateBlockSetting('level', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    >
                                      <option value="h1">Large H1 Display title</option>
                                      <option value="h2">Standard H2 Section header</option>
                                      <option value="h3">Small H3 Subset heading</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* FEATURES BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'features' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Features Main Title</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Description Copy</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.description || ''}
                                      onChange={(e) => handleUpdateBlockSetting('description', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                  
                                  {/* Sublist mapping */}
                                  <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Features Checklist</span>
                                      <button 
                                        type="button"
                                        onClick={() => handleAddSublistItem('featuresList', { title: 'New Advantage', desc: 'Advantage detail text.', icon: 'Zap' })}
                                        className="text-[9px] text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest"
                                      >
                                        + Add Advantage
                                      </button>
                                    </div>

                                    {(blocks[selectedBlockIdx].settings.featuresList || []).map((feat: any, fIdx: number) => (
                                      <div key={fIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[8.5px] font-bold uppercase text-slate-400">Benefit #{fIdx+1}</span>
                                          <button 
                                            type="button"
                                            onClick={() => handleRemoveSublistItem('featuresList', fIdx)}
                                            className="text-[8.5px] text-red-500 hover:text-red-600 uppercase font-black tracking-widest"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                        <input 
                                          type="text"
                                          placeholder="Benefit Title"
                                          value={feat.title || ''}
                                          onChange={(e) => handleUpdateSublistSetting('featuresList', fIdx, 'title', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                        />
                                        <textarea 
                                          placeholder="Benefit Description"
                                          value={feat.desc || ''}
                                          onChange={(e) => handleUpdateSublistSetting('featuresList', fIdx, 'desc', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-medium"
                                          rows={2}
                                        />
                                        <select
                                          value={feat.icon || 'Zap'}
                                          onChange={(e) => handleUpdateSublistSetting('featuresList', fIdx, 'icon', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                        >
                                          <option value="Zap">Zap icon (Speed)</option>
                                          <option value="Layout">Layout icon (Design)</option>
                                          <option value="Sparkles">Sparkles icon (SEO)</option>
                                          <option value="Star">Star icon (Authority)</option>
                                          <option value="User">User icon (Individual)</option>
                                        </select>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {/* SERVICES GRID BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'services_grid' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Services Main Title</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Services Subtitle</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.subtitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('subtitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                </>
                              )}

                              {/* STATS BANNER BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'stats' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Header Title Accent</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>

                                  <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Counters list (4 recommended)</span>
                                    {(blocks[selectedBlockIdx].settings.statsList || []).map((stat: any, sIdx: number) => (
                                      <div key={sIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                                        <p className="text-[8.5px] font-bold text-slate-400">Counter #{sIdx+1}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          <input 
                                            type="text"
                                            placeholder="Value (e.g. 98%)"
                                            value={stat.value || ''}
                                            onChange={(e) => handleUpdateSublistSetting('statsList', sIdx, 'value', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                          />
                                          <input 
                                            type="text"
                                            placeholder="Label (e.g. Speed)"
                                            value={stat.label || ''}
                                            onChange={(e) => handleUpdateSublistSetting('statsList', sIdx, 'label', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                          />
                                        </div>
                                        <input 
                                          type="text"
                                          placeholder="Mini Description"
                                          value={stat.desc || ''}
                                          onChange={(e) => handleUpdateSublistSetting('statsList', sIdx, 'desc', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-medium"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {/* CTA BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'cta' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">CTA Title</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.ctaTitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaTitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">CTA Subtitle</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.ctaSubtitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaSubtitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Button Text</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.ctaBtnText || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaBtnText', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Button Action URL</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.ctaBtnLink || ''}
                                      onChange={(e) => handleUpdateBlockSetting('ctaBtnLink', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Visual Theme</label>
                                    <select 
                                      value={blocks[selectedBlockIdx].settings.ctaTheme || 'dark'}
                                      onChange={(e) => handleUpdateBlockSetting('ctaTheme', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    >
                                      <option value="dark">Cosmic Slate Dark theme</option>
                                      <option value="indigo">High-Contrast Indigo theme</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* TESTIMONIALS BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'testimonials' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Reviews Heading</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Reviews Subtitle</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.subtitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('subtitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                </>
                              )}

                              {/* FAQ ACCORDION BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'faq' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">FAQ Section Header</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>

                                  <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Questions Accordion</span>
                                      <button 
                                        type="button"
                                        onClick={() => handleAddSublistItem('faqItems', { q: 'New Question?', a: 'Detailed answer response.' })}
                                        className="text-[9px] text-indigo-600 hover:text-indigo-500 font-black uppercase tracking-widest"
                                      >
                                        + Add Item
                                      </button>
                                    </div>

                                    {(blocks[selectedBlockIdx].settings.faqItems || []).map((faq: any, fIdx: number) => (
                                      <div key={fIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[8.5px] font-bold uppercase text-slate-400">Question #{fIdx+1}</span>
                                          <button 
                                            type="button"
                                            onClick={() => handleRemoveSublistItem('faqItems', fIdx)}
                                            className="text-[8.5px] text-red-500 hover:text-red-600 uppercase font-black tracking-widest"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                        <input 
                                          type="text"
                                          placeholder="Question"
                                          value={faq.q || ''}
                                          onChange={(e) => handleUpdateSublistSetting('faqItems', fIdx, 'q', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                        />
                                        <textarea 
                                          placeholder="Answer Details"
                                          value={faq.a || ''}
                                          onChange={(e) => handleUpdateSublistSetting('faqItems', fIdx, 'a', e.target.value)}
                                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-lg p-2 text-xs font-medium"
                                          rows={3}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {/* TEAM SECTION CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'team' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Team Section Header</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Subtitle Bio Summary</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.subtitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('subtitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                </>
                              )}

                              {/* AUDIT / CONTACT FORM BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'contact_form' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Form Headline Title</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.formTitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('formTitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Form Subtitle Guidelines</label>
                                    <textarea 
                                      value={blocks[selectedBlockIdx].settings.formSubtitle || ''}
                                      onChange={(e) => handleUpdateBlockSetting('formSubtitle', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                      rows={2}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Submit Button Text</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.submitBtnText || ''}
                                      onChange={(e) => handleUpdateBlockSetting('submitBtnText', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                </>
                              )}

                              {/* DYNAMIC IMAGE BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'image_block' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Image Asset URL</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.imageUrl || ''}
                                      onChange={(e) => handleUpdateBlockSetting('imageUrl', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Caption Title</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.caption || ''}
                                      onChange={(e) => handleUpdateBlockSetting('caption', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-2">
                                    <input 
                                      type="checkbox"
                                      id="img-rounded"
                                      checked={!!blocks[selectedBlockIdx].settings.rounded}
                                      onChange={(e) => handleUpdateBlockSetting('rounded', e.target.checked)}
                                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <label htmlFor="img-rounded" className="text-xs font-bold text-slate-700">Rounded container borders</label>
                                  </div>
                                </>
                              )}

                              {/* VIDEO BLOCK CONTROLS */}
                              {blocks[selectedBlockIdx].type === 'video_block' && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Video Embed URL (Supports YouTube / Vimeo)</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.videoUrl || ''}
                                      onChange={(e) => handleUpdateBlockSetting('videoUrl', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[9.5px] font-extrabold uppercase text-slate-500">Video Accessibility Title</label>
                                    <input 
                                      type="text"
                                      value={blocks[selectedBlockIdx].settings.title || ''}
                                      onChange={(e) => handleUpdateBlockSetting('title', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold"
                                    />
                                  </div>
                                </>
                              )}

                            </div>
                          </div>
                        ) : (
                          /* Render available block templates chooser */
                          <div className="bg-white p-6 border border-slate-150 rounded-[2rem] shadow-sm space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Available UI Layout Presets</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                              {BLOCK_TYPES.map((tmpl) => (
                                <button
                                  key={tmpl.type}
                                  type="button"
                                  onClick={() => handleAddBlock(tmpl.type)}
                                  className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-150/70 hover:border-indigo-300 rounded-xl text-left transition flex items-start gap-3 group"
                                >
                                  <div className="p-2 bg-white rounded-lg border border-slate-150 group-hover:border-indigo-200 text-slate-400 group-hover:text-indigo-600 shrink-0">
                                    {tmpl.icon}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-black uppercase text-slate-800">{tmpl.label}</p>
                                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5 font-medium">{tmpl.desc}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* RAW TEXT / MARKDOWN EDITOR */
                    <div className="bg-white p-6 md:p-8 border border-slate-150 rounded-[2rem] shadow-sm space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Page Raw Content (Supports Standard Markdown & HTML tags)</label>
                        <textarea 
                          rows={14}
                          value={formData.body}
                          onChange={(e) => setFormData({...formData, body: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:outline-none rounded-2xl px-5 py-4 text-xs font-mono font-semibold text-slate-800 leading-relaxed"
                          placeholder="# Write your markdown title here..."
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer actions */}
              <div className="p-6 bg-white border-t border-slate-150 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl transition"
                >
                  Cancel
                </button>
                
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'Persisting changes...' : 'Publish CMS Page'}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
