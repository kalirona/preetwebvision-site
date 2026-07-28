import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Search, Trash2, CheckCircle, Clock, X, ExternalLink, Download, Inbox, User, Building, Landmark, ChevronRight } from 'lucide-react';

export const FormSubmissionsModule = () => {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  
  // Selected submission inspector
  const [selectedSub, setSelectedSub] = React.useState<any | null>(null);
  const [updating, setUpdating] = React.useState(false);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await fetch('/api/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      setUpdating(true);
      const response = await fetch(`/api/contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub));
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert('Failed to update submission status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this contact form submission record permanently?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        setSelectedSub(null);
      } else {
        alert('Failed to delete submission');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    
    const headers = ["Submission ID", "Name", "Email", "Phone", "Subject", "Message", "Budget", "Company", "Status", "Timestamp"];
    const rows = submissions.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.phone || '',
      `"${(s.subject || '').replace(/"/g, '""')}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
      `"${(s.budget || '').replace(/"/g, '""')}"`,
      `"${(s.company || '').replace(/"/g, '""')}"`,
      s.status,
      s.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `preet_web_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      sub.name.toLowerCase().includes(q) || 
      sub.email.toLowerCase().includes(q) || 
      sub.subject.toLowerCase().includes(q) || 
      (sub.message && sub.message.toLowerCase().includes(q));
    
    const matchesFilter = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 font-sans"
    >
      {/* Submissions KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Form Queries', value: submissions.length, icon: <Inbox size={18} className="text-indigo-600" />, desc: "All-time contact list entries" },
          { label: 'Awaiting Response', value: submissions.filter(s => s.status === 'NEW').length, icon: <Clock size={18} className="text-amber-600" />, desc: "Pending immediate attention" },
          { label: 'Processed Forms', value: submissions.filter(s => s.status === 'REVIEWED').length, icon: <CheckCircle size={18} className="text-green-600" />, desc: "Acknowledged & resolved" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-white p-8 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Query Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter submissions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all font-sans" 
            />
          </div>

          {/* Status filter selection */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 text-slate-650 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer font-sans h-10"
          >
            <option value="ALL">All States</option>
            <option value="NEW">NEW/UNREAD</option>
            <option value="REVIEWED">REVIEWED/RESOLVED</option>
          </select>
        </div>

        <button 
          onClick={handleExportCSV}
          className="bg-slate-900 border border-slate-900 hover:border-indigo-600 font-mono hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all w-full sm:w-auto justify-center shadow-lg cursor-pointer"
        >
          <Download size={14} /> Export CSV List
        </button>
      </div>

      {/* Main Table Structure */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Sender</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Project Budget</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic">Loading submissions...</td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-semibold font-sans text-xs text-slate-500">No submissions found.</td>
                </tr>
              ) : filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-bold text-slate-400 font-mono">
                      {new Date(sub.timestamp).toLocaleDateString()} <br /> 
                      {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-semibold text-slate-900 text-sm">{sub.name}</p>
                    <p className="text-xs text-slate-455 font-medium">{sub.email}</p>
                    {sub.phone && <p className="text-[9px] font-mono text-slate-400 mt-1">{sub.phone}</p>}
                  </td>
                  <td className="px-8 py-6 font-sans">
                    <p className="font-extrabold text-slate-800 text-xs truncate max-w-[180px]">{sub.subject}</p>
                    {sub.company && <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">{sub.company}</p>}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-wider rounded-md">
                      {sub.budget || 'Not specified'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-widest ${
                      sub.status === 'NEW' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {sub.status || 'NEW'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors border border-slate-100 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-white cursor-pointer"
                    >
                      Inquire Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Inspector Slide Out Drawer */}
      <AnimatePresence>
        {selectedSub && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
              onClick={() => setSelectedSub(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white z-[90] shadow-2xl overflow-y-auto"
            >
              <div className="p-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-8">
                     <div>
                        <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">ID: {selectedSub.id}</span>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-2">Form Submission Inspector</h3>
                     </div>
                     <button 
                       onClick={() => setSelectedSub(null)}
                       className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Sender Identity</p>
                        <p className="text-sm font-bold text-slate-900 leading-none">{selectedSub.name}</p>
                        <span className="text-xs text-slate-500 font-medium">{selectedSub.email}</span>
                        {selectedSub.phone && <p className="text-[10px] text-slate-400 font-bold mt-1 font-mono">{selectedSub.phone}</p>}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Project Budget Scale</p>
                        <span className="bg-indigo-650 text-white text-[9.5px] font-black uppercase tracking-wider px-3 py-1.5 rounded">{selectedSub.budget || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Subject Theme</p>
                        <p className="text-xs font-black text-slate-800">{selectedSub.subject}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Company/Agency</p>
                        <p className="text-xs font-black text-slate-800">{selectedSub.company || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">MESSAGE CONTENT BODY</p>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line italic">
                        "{selectedSub.message || 'No additional project specifications included.'}"
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Set Status State</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedSub.id, 'NEW')}
                          className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedSub.status === 'NEW' 
                              ? 'bg-amber-150 border border-amber-300 text-amber-800 font-extrabold' 
                              : 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'
                          } cursor-pointer`}
                        >
                          Mark Unread / New
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedSub.id, 'REVIEWED')}
                          className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedSub.status === 'REVIEWED' 
                              ? 'bg-green-105 border border-green-300 text-green-800 font-extrabold' 
                              : 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'
                          } cursor-pointer`}
                        >
                          Mark Checked / Reviewed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center mt-8">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedSub.id)}
                    className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Evict Record
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedSub(null)}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-850 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                     Close Inspector
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
