import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, CheckCircle, Circle, X, Save, Check, Layers, HelpCircle, FileText, ChevronRight } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface ServiceObj {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  content: string;
  category: 'development' | 'marketing' | 'optimization';
  features: string[];
  faqs: FAQItem[];
  status?: 'ACTIVE' | 'DRAFT';
}

export const ServicesModule = () => {
  const [services, setServices] = React.useState<ServiceObj[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<ServiceObj | null>(null);

  // Form states
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [category, setCategory] = React.useState<'development' | 'marketing' | 'optimization'>('development');
  const [icon, setIcon] = React.useState('Layout');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [status, setStatus] = React.useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  
  // Custom arrays
  const [features, setFeatures] = React.useState<string[]>([]);
  const [newFeature, setNewFeature] = React.useState('');
  
  const [faqs, setFaqs] = React.useState<FAQItem[]>([]);
  const [newFaqQ, setNewFaqQ] = React.useState('');
  const [newFaqA, setNewFaqA] = React.useState('');

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error retrieving services database:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const openAddEditor = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setCategory('development');
    setIcon('Layout');
    setDescription('');
    setContent('# Service Heading\nEnter your markdown document parameters here...');
    setStatus('ACTIVE');
    setFeatures([]);
    setFaqs([]);
    setError('');
    setSuccess('');
    setIsEditorOpen(true);
  };

  const openEditEditor = (s: ServiceObj) => {
    setEditingService(s);
    setTitle(s.title);
    setSlug(s.slug);
    setCategory(s.category || 'development');
    setIcon(s.icon || 'Layout');
    setDescription(s.description || '');
    setContent(s.content || '');
    setStatus(s.status || 'ACTIVE');
    setFeatures(Array.isArray(s.features) ? s.features : []);
    setFaqs(Array.isArray(s.faqs) ? s.faqs : []);
    setError('');
    setSuccess('');
    setIsEditorOpen(true);
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaqQ.trim() && newFaqA.trim()) {
      setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
      setNewFaqQ('');
      setNewFaqA('');
    }
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !slug || !description) {
      setError('Title, custom slug, and short description are essential fields.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const serviceData = {
      title,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      category,
      icon,
      description,
      content,
      status,
      features,
      faqs
    };

    try {
      let res;
      if (editingService) {
        res = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(serviceData)
        });
      } else {
        res = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(serviceData)
        });
      }

      if (res.ok) {
        setSuccess('Service details deployed successfully!');
        setTimeout(() => {
          setIsEditorOpen(false);
          fetchServices();
        }, 1000);
      } else {
        const result = await res.json();
        throw new Error(result.error || 'Request unsuccessful');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving service node.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service layer permanently from database index? This is irreversible.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSuccess('Service layer removed.');
        setTimeout(() => setSuccess(''), 3000);
        fetchServices();
      } else {
        const result = await res.json();
        alert(result.error || 'Failed to remove service');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!editingService && title) {
      setSlug(title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, editingService]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Service Architecture Deck</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Configure client-facing growth and optimization capabilities</p>
        </div>
        <button 
          onClick={openAddEditor}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md cursor-pointer font-sans"
        >
          <Plus size={16} /> Deploy New Service
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold text-xs flex items-center gap-2">
          <Check size={16} /> {success}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100">
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Service Concept Name</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Slug Target</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                 <td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-medium">Querying service configurations...</td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                 <td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-medium">No custom services currently published on database node.</td>
              </tr>
            ) : services.map((service) => (
              <tr key={service.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{service.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{service.description}</p>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs tracking-wide rounded-full">
                    {service.category}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">/services/{service.slug}</span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                     {(service.status || 'ACTIVE') === 'ACTIVE' ? (
                       <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full">ACTIVE</span>
                     ) : (
                       <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider rounded-full">DRAFT</span>
                     )}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditEditor(service)}
                      className="w-9 h-9 rounded-lg bg-slate-50 text-indigo-600 border border-slate-200 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="Edit Service Details"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="w-9 h-9 rounded-lg bg-slate-50 text-red-500 border border-slate-200 hover:bg-red-650 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="Destroy Service Node"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out service editor modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
              onClick={() => setIsEditorOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-3xl bg-white z-[90] shadow-2xl overflow-y-auto"
            >
              <div className="p-10 md:p-14 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-8 border-b border-slate-100 mb-8">
                     <div>
                       <h3 className="text-lg font-bold text-slate-900">
                         {editingService ? 'Modify Service Parameter' : 'Deploy New Service Node'}
                       </h3>
                       <p className="text-[10px] text-indigo-605 font-black uppercase tracking-widest mt-2">{editingService ? `NODE ID: ${editingService.id}` : 'Broadcasting Layer'}</p>
                     </div>
                     <button 
                       onClick={() => setIsEditorOpen(false)}
                       className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer font-bold"
                     >
                       <X size={18} />
                     </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                     {error && (
                       <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-655 font-bold text-xs">
                         {error}
                       </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Service Title</label>
                           <input 
                             type="text"
                             required
                             value={title} 
                             onChange={(e) => setTitle(e.target.value)}
                             placeholder="e.g. Conversion Optimization Audit" 
                             className="w-full bg-slate-50 border border-slate-105 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-500"
                           />
                        </div>
                        <div>
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Relative Slug URL</label>
                           <input 
                             type="text"
                             required
                             value={slug} 
                             onChange={(e) => setSlug(e.target.value)}
                             placeholder="e.g. cro-audit" 
                             className="w-full bg-slate-50 border border-slate-105 rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none focus:bg-white focus:border-indigo-500"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Core Category</label>
                           <select 
                             value={category} 
                             onChange={(e: any) => setCategory(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-105 rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:bg-white"
                           >
                             <option value="development">Website Development</option>
                             <option value="marketing">Digital Marketing</option>
                             <option value="optimization">Core Optimization</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Lucide Icon Name</label>
                           <input 
                             type="text"
                             required
                             value={icon} 
                             onChange={(e) => setIcon(e.target.value)}
                             placeholder="Layout, ShoppingBag, Search, Zap" 
                             className="w-full bg-slate-50 border border-slate-105 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-550"
                           />
                        </div>
                        <div>
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Publish Status</label>
                           <select 
                             value={status} 
                             onChange={(e: any) => setStatus(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-105 rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:bg-white"
                           >
                             <option value="ACTIVE">Active (Broadcasted)</option>
                             <option value="DRAFT">Draft</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Public Short Description</label>
                        <textarea 
                          rows={2}
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Brief summary used in catalog directory index listings..."
                          className="w-full bg-slate-50 border border-slate-105 rounded-xl p-4 text-xs font-medium focus:outline-none focus:bg-white leading-relaxed"
                        />
                     </div>

                     {/* Custom Interactive features tags input */}
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                        <div className="flex items-center gap-1.5 text-slate-705 mb-4">
                           <Layers size={14} className="text-indigo-600" />
                           <h4 className="text-[10px] font-black uppercase tracking-wider">Features list tags</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {features.map((f, i) => (
                             <span key={i} className="px-3 py-1.5 bg-white border border-slate-150 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                               {f}
                               <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-400 hover:text-red-650 cursor-pointer">
                                 <X size={10} />
                               </button>
                             </span>
                           ))}
                           {features.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic">No specific features deployed yet.</span>}
                        </div>
                        <div className="flex gap-2">
                           <input 
                             type="text"
                             value={newFeature}
                             onChange={(e) => setNewFeature(e.target.value)}
                             placeholder="Add feature capability tag..."
                             className="flex-1 bg-white border border-slate-150 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none"
                           />
                           <button 
                             type="button" 
                             onClick={handleAddFeature}
                             className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                           >
                             Add Feature
                           </button>
                        </div>
                     </div>

                     {/* Deep Dive FAQ sections */}
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                        <div className="flex items-center gap-1.5 text-slate-705 mb-4">
                           <HelpCircle size={14} className="text-indigo-650" />
                           <h4 className="text-[10px] font-black uppercase tracking-wider">Deep Dive Q&A FAQs List</h4>
                        </div>
                        <div className="space-y-4 mb-4 max-h-[220px] overflow-y-auto">
                           {faqs.map((faq, i) => (
                             <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl relative shadow-sm">
                                <button type="button" onClick={() => handleRemoveFaq(i)} className="absolute top-3 right-3 text-red-450 hover:text-red-700 cursor-pointer">
                                   <X size={12} />
                                </button>
                                <p className="font-extrabold text-xs text-slate-900 italic pr-6 flex items-center gap-1.5"><ChevronRight size={10} className="text-indigo-600" /> Q: {faq.q}</p>
                                <p className="text-[11px] text-slate-450 mt-1 font-medium pl-3 pr-6">A: {faq.a}</p>
                             </div>
                           ))}
                           {faqs.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic">No FAQ items declared.</p>}
                        </div>
                        <div className="space-y-3 pt-3 border-t border-slate-100">
                           <input 
                             type="text"
                             value={newFaqQ}
                             onChange={(e) => setNewFaqQ(e.target.value)}
                             placeholder="FAQ Question..."
                             className="w-full bg-white border border-slate-150 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none"
                           />
                           <textarea 
                             rows={2}
                             value={newFaqA}
                             onChange={(e) => setNewFaqA(e.target.value)}
                             placeholder="FAQ Answer..."
                             className="w-full bg-white border border-slate-150 rounded-lg px-4 py-3 text-xs font-semibold focus:outline-none leading-relaxed"
                           />
                           <button 
                             type="button" 
                             onClick={handleAddFaq}
                             className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                           >
                             Add Q&A Dynamic FAQ
                           </button>
                        </div>
                     </div>

                     <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Rich Markdown Content text (Page HTML body)</label>
                        <textarea 
                          rows={8}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="# Deep insights title...&#10;Add copy, examples, bullet points..."
                          className="w-full bg-slate-50 border border-slate-105 rounded-xl p-4 text-xs font-mono font-medium focus:outline-none focus:bg-white leading-relaxed"
                        />
                     </div>
                  </form>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-3 mt-10">
                   <button 
                     onClick={() => setIsEditorOpen(false)}
                     className="px-6 py-4 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-101 cursor-pointer"
                   >
                     Discard Changes
                   </button>
                   <button 
                     onClick={handleSave}
                     className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-905 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                   >
                     <Save size={14} /> Commit Changes
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
