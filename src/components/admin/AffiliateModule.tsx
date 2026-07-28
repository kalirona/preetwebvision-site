import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ExternalLink, Trash2, Edit2, X, Save, Sparkles, Folder, Link2, FileText, Image as ImageIcon } from 'lucide-react';

interface AffiliateTool {
  id?: string;
  name: string;
  category: string;
  description: string;
  link: string;
  image: string;
}

export const AffiliateModule = () => {
  const [tools, setTools] = React.useState<AffiliateTool[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTool, setEditingTool] = React.useState<AffiliateTool | null>(null);
  const [formData, setFormData] = React.useState<AffiliateTool>({
    name: '',
    category: '',
    description: '',
    link: '',
    image: ''
  });
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/affiliate');
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      }
    } catch (err) {
      console.error("Error fetching affiliate tools", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTools();
  }, []);

  const handleEdit = (tool: AffiliateTool) => {
    setEditingTool(tool);
    setFormData(tool);
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleAddNew = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      link: '',
      image: ''
    });
    setIsFormOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm("Are you sure you want to delete this affiliate tool?")) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/affiliate/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess("Affiliate tool deleted successfully.");
        fetchTools();
      } else {
        const errData = await response.json();
        setError(errData.error || "Failed to delete affiliate.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.category || !formData.link) {
      setError("Name, category, and link are strictly required.");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const isEdit = !!editingTool?.id;
      const url = isEdit ? `/api/affiliate/${editingTool.id}` : '/api/affiliate';
      const method = isEdit ? 'PUT' : 'POST';

      const toolPayload = {
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=100&q=80'
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(toolPayload)
      });

      if (response.ok) {
        setSuccess(`Affiliate tool ${isEdit ? 'updated' : 'added'} successfully.`);
        setIsFormOpen(false);
        fetchTools();
      } else {
        const errData = await response.json();
        setError(errData.error || "Failed to save affiliate tool.");
      }
    } catch (err) {
      setError("Failed to save affiliate tool due to a network or server error.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 font-sans"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Affiliate Stack</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Manage external recommendations shown on your main platform resource hub</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md cursor-pointer"
        >
          <Plus size={16} /> Add Affiliate Tool
        </button>
      </div>

      {/* Global Toast Message Feedback */}
      {(error || success) && (
        <div className="p-4 rounded-2xl border text-xs font-semibold uppercase tracking-wider flex justify-between items-center bg-white">
          <span className={error ? "text-red-650" : "text-green-600"}>
            {error || success}
          </span>
          <button onClick={() => { setError(null); setSuccess(null); }} className="text-slate-400 hover:text-slate-650">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Slide-out or Collapsible inline Form component */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white border border-slate-200/85 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-8">
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-indigo-650" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                  {editingTool ? "Modify Affiliate Node" : "Register New Affiliate Product"}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-450 hover:text-slate-900"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-500" /> Tool Title Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. WP Engine Hosting"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block flex items-center gap-1.5">
                    <Folder size={12} className="text-indigo-505" /> Market Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Scaling & Infrastructure"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block flex items-center gap-1.5">
                  <Link2 size={12} className="text-indigo-505" /> Editable Affiliate Link
                </label>
                <input
                  type="url"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://wpsite.com/?aff=yourcode"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white font-mono text-indigo-750"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-indigo-505" /> Image URL or Brand Logo
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Leave blank for high-tech digital node default or enter https://unsplash..."
                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block flex items-center gap-1.5">
                  <FileText size={12} className="text-indigo-505" /> Product Recommendation Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the unique growth resonance with specific focus highlights..."
                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl p-4 text-xs font-medium focus:outline-none transition-all focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-4 bg-slate-900 border border-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest font-sans flex items-center gap-2 hover:bg-slate-850 shadow transition-all cursor-pointer"
                >
                  <Save size={13} /> {editingTool ? "Update Link" : "Publish to Stack"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-4 bg-slate-100 border border-slate-200/60 text-slate-650 rounded-xl text-[9px] font-black uppercase tracking-widest font-sans hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader indicator state */}
      {loading ? (
        <div className="py-20 text-center text-slate-450 text-xs font-black uppercase tracking-wider animate-pulse">
          Retrieving live affiliate nodes...
        </div>
      ) : tools.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 bg-white rounded-[3rem] p-12 text-slate-450 uppercase text-xs font-black tracking-widest leading-relaxed">
          No affiliates resolved in database.<br/>
          <button onClick={handleAddNew} className="mt-4 text-[9px] bg-slate-950 text-white px-4 py-2.5 rounded-xl block mx-auto cursor-pointer">Register First Tool</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={tool.id || idx} className="bg-white p-8 border border-slate-150/70 hover:border-indigo-500/30 rounded-3xl shadow-sm relative group transition-all hover:shadow-md flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                    <img src={tool.image} alt={tool.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600">{tool.category}</p>
                       <h3 className="text-base font-bold text-slate-900 tracking-tight">{tool.name}</h3>
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 font-medium mb-8 line-clamp-3 leading-relaxed">{tool.description}</p>
               </div>
               
               <div className="flex justify-between items-center border-t border-slate-100/60 pt-4 mt-2">
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
                     Link <ExternalLink size={11} />
                  </a>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => handleEdit(tool)} 
                       className="p-1 px-2.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                       title="Edit Tool"
                     >
                        <Edit2 size={13} />
                     </button>
                     <button 
                       onClick={() => handleDelete(tool.id)} 
                       className="p-1 px-2.5 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                       title="Delete Tool"
                     >
                        <Trash2 size={13} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
