import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Globe, Search, Filter, Download, Upload, Users, Mail, AlertCircle, Award, CheckCircle, Tag, Plus, PlusCircle, Trash, X, Save, ShieldAlert, Award as MeterIcon } from 'lucide-react';

interface LeadsModuleProps {
  leads: any[];
  loading: boolean;
}

type PipelineStage = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'CONVERTED' | 'LOST';

const STAGE_THEMES: Record<PipelineStage, { bg: string, text: string, color: string }> = {
  NEW: { bg: 'bg-blue-50', text: 'text-blue-700', color: '#3b82f6' },
  CONTACTED: { bg: 'bg-amber-50', text: 'text-amber-700', color: '#f59e0b' },
  QUALIFIED: { bg: 'bg-purple-50', text: 'text-purple-700', color: '#a855f7' },
  PROPOSAL_SENT: { bg: 'bg-indigo-50', text: 'text-indigo-700', color: '#6366f1' },
  CONVERTED: { bg: 'bg-green-50', text: 'text-green-700', color: '#10b981' },
  LOST: { bg: 'bg-red-50', text: 'text-red-700', color: '#ef4444' }
};

export const LeadsModule: React.FC<LeadsModuleProps> = ({ leads: initialLeads, loading: initialLoading }) => {
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(initialLoading);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [stageFilter, setStageFilter] = React.useState<string>('All');
  const [minScore, setMinScore] = React.useState<number>(0);
  
  // CSV Import States
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [csvPreview, setCsvPreview] = React.useState<any[] | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);

  // Selected lead inspector side-drawer
  const [selectedLead, setSelectedLead] = React.useState<any | null>(null);
  
  // Edit states within drawer
  const [noteText, setNoteText] = React.useState('');
  const [notesList, setNotesList] = React.useState<{ text: string, date: string, author: string }[]>([]);
  const [leadTags, setLeadTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [currentStage, setCurrentStage] = React.useState<PipelineStage>('NEW');
  const [customScore, setCustomScore] = React.useState<number>(50);
  const [updating, setUpdating] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);

  React.useEffect(() => {
    // Generate scores if they don't exist
    const items = initialLeads.map((item: any) => {
      const emailDomain = item.email.split('@')[1] || '';
      const domainScore = ['gmail.com', 'yahoo.com', 'hotmail.com'].includes(emailDomain.toLowerCase()) ? 30 : 65;
      const messageLengthScore = Math.min((item.message || '').length / 5, 35);
      const computedScore = Math.round(domainScore + messageLengthScore);
      
      return {
        score: item.score || computedScore,
        tags: item.tags || [item.source === 'chat' ? 'AI Chat Lead' : 'Direct Booking'],
        notes: item.notes || [
          { text: "Lead registered in standard queue automatically.", date: item.timestamp, author: "System AI" }
        ],
        ...item
      };
    });
    setLeads(items);
    setLoading(initialLoading);
  }, [initialLeads, initialLoading]);

  // Exporter of CSV lines in pure client script
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ["Lead ID", "Name", "Email", "Phone", "Interest", "Message", "Source", "Score", "Tags", "Stage", "Timestamp"];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone || '',
      `"${l.service_interest || 'N/A'}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.source || 'direct',
      l.score,
      `"${l.tags.join(',')}"`,
      l.status,
      l.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `preet_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) {
          setImportError("CSV file must have at least a header row and one data row.");
          return;
        }

        const parseCsvLine = (line: string) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/["']/g, '').trim());
        
        const nameIdx = headers.findIndex(h => h.includes('name') || h === 'full name' || h === 'lead');
        const emailIdx = headers.findIndex(h => h.includes('email') || h === 'mail' || h === 'e-mail');
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h === 'tel' || h === 'contact' || h === 'telephone');
        const interestIdx = headers.findIndex(h => h.includes('interest') || h.includes('service') || h === 'service_interest');
        const messageIdx = headers.findIndex(h => h.includes('message') || h.includes('note') || h.includes('remark') || h === 'body');
        const websiteIdx = headers.findIndex(h => h.includes('website') || h.includes('url') || h === 'site');

        if (nameIdx === -1 || emailIdx === -1) {
          setImportError("Invalid Headers: CSV must contain 'Name' and 'Email' columns.");
          return;
        }

        const parsedLeads: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = parseCsvLine(line);
          if (cols.length < Math.max(nameIdx, emailIdx) + 1) continue;

          parsedLeads.push({
            name: cols[nameIdx]?.replace(/^"|"$/g, '') || '',
            email: cols[emailIdx]?.replace(/^"|"$/g, '') || '',
            phone: phoneIdx !== -1 ? cols[phoneIdx]?.replace(/^"|"$/g, '') : '',
            service_interest: interestIdx !== -1 ? cols[interestIdx]?.replace(/^"|"$/g, '') : 'General Consultation',
            message: messageIdx !== -1 ? cols[messageIdx]?.replace(/^"|"$/g, '') : 'Bulk Imported relative note.',
            website_url: websiteIdx !== -1 ? cols[websiteIdx]?.replace(/^"|"$/g, '') : '',
            source: 'csv_bulk_import'
          });
        }

        if (parsedLeads.length === 0) {
          setImportError("No valid rows parsed. Make sure Name and Email values are filled.");
        } else {
          setImportError(null);
          setCsvPreview(parsedLeads);
        }
      } catch (err) {
        setImportError("Failed to parse CSV file: " + String(err));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!csvPreview || csvPreview.length === 0) return;
    setImporting(true);
    setImportError(null);

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/lead/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(csvPreview)
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(prev => [...data.imported, ...prev]);
        setCsvPreview(null);
        alert(`Successfully imported ${data.imported.length} new prospective leads into CRM!`);
      } else {
        const errorOut = await response.json();
        setImportError(errorOut.error || "Failed to import bulk leads into CRM.");
      }
    } catch (err) {
      setImportError("Gateway sync error: " + String(err));
    } finally {
      setImporting(false);
    }
  };

  const openInspector = (lead: any) => {
    setSelectedLead(lead);
    setNotesList(lead.notes || []);
    setLeadTags(lead.tags || []);
    setCurrentStage(lead.status as PipelineStage || 'NEW');
    setCustomScore(lead.score || 50);
    setNoteText('');
    setTagInput('');
    setUpdateSuccess(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      text: noteText.trim(),
      date: new Date().toISOString(),
      author: "Preet (Strategy)"
    };
    setNotesList([...notesList, newNote]);
    setNoteText('');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!leadTags.includes(tagInput.trim())) {
        setLeadTags([...leadTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setLeadTags(leadTags.filter(item => item !== t));
  };

  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setUpdating(true);
    setUpdateSuccess(false);

    const token = localStorage.getItem('adminToken');
    try {
      // First update status endpoint directly if supported
      const resStatus = await fetch(`/api/lead/${selectedLead.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: currentStage })
      });

      if (resStatus.ok) {
        // Optimistically update notes, tags, score local states
        const updatedLeads = leads.map(l => {
          if (l.id === selectedLead.id) {
            return {
              ...l,
              status: currentStage,
              score: customScore,
              tags: leadTags,
              notes: notesList
            };
          }
          return l;
        });
        setLeads(updatedLeads);
        setUpdateSuccess(true);
        setTimeout(() => setSelectedLead(null), 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.phone && l.phone.includes(searchTerm)) ||
                          (l.service_interest && l.service_interest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = stageFilter === 'All' || l.status === stageFilter;
    const matchesScore = l.score >= minScore;
    return matchesSearch && matchesStage && matchesScore;
  });

  // KPI Calculations
  const averageScore = Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / (leads.length || 1));
  const estimatedPipeline = leads.filter(l => l.status !== 'LOST').length * 2500; // raw estimate of $2500 potential design worth

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Dynamic Bento KPI Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Synchronized Leads', value: leads.length, desc: "Captured organically via site nodes", icon: <Users size={18} /> },
          { label: 'Unprocessed Inbounds', value: leads.filter(l => l.status === 'NEW').length, desc: "Awaiting CRM priority callback", icon: <Clock size={18} /> },
          { label: 'Lead Scoring Quality Index', value: `${averageScore}/100`, desc: "Average lead commercial scale", icon: <Award size={18} /> },
          { label: 'Potential Pipelines Value', value: `$${estimatedPipeline.toLocaleString()}`, desc: "Unconsolidated revenue projection", icon: <CheckCircle size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0">
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

      {/* Filter and Command Section */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-white p-8 border border-slate-100 rounded-3xl shadow-sm">
         <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs font-bold focus:outline-none" 
              />
            </div>

            {/* Pipeline State Filter */}
            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 text-slate-650 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
              >
                 <option value="All">All Pipelines</option>
                 <option value="NEW">New</option>
                 <option value="CONTACTED">Contacted</option>
                 <option value="QUALIFIED">Qualified</option>
                 <option value="PROPOSAL_SENT">Proposal Sent</option>
                 <option value="CONVERTED">Converted</option>
                 <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Quality Score Slider */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
               <span className="text-[10px] uppercase font-black tracking-wider">Score &gt;=</span>
               <input 
                 type="range" 
                 min={0} 
                 max={90} 
                 value={minScore} 
                 onChange={(e) => setMinScore(Number(e.target.value))}
                 className="w-20 cursor-pointer accent-indigo-600"
               />
               <span className="font-mono">{minScore}</span>
            </div>
         </div>

         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             accept=".csv" 
             className="hidden" 
           />
           <button 
             onClick={handleCsvImportClick}
             className="border border-slate-200 hover:border-indigo-600 font-mono text-slate-800 hover:text-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all w-full justify-center bg-white cursor-pointer"
           >
             <Upload size={14} /> Import CSV List
           </button>
           <button 
             onClick={handleExportCSV}
             className="bg-slate-900 border border-slate-900 hover:border-indigo-600 font-mono hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all w-full justify-center shadow-lg cursor-pointer"
           >
             <Download size={14} /> Export CSV List
           </button>
         </div>
      </div>

      {/* Grid: Main Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Captured At</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Interest</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Score</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Pipeline Stage</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">CRM Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic">Acquiring DB logs matrix context...</td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic">No matching lead segments indexed in this scope.</td>
                </tr>
              ) : filteredLeads.map((lead) => {
                const stage = lead.status as PipelineStage || 'NEW';
                const theme = STAGE_THEMES[stage] || STAGE_THEMES.NEW;
                
                return (
                  <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        {new Date(lead.timestamp).toLocaleDateString()} <br /> 
                        {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-950 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-600 font-medium">{lead.email}</p>
                      {lead.phone && <p className="text-[10.5px] font-semibold text-slate-500 font-mono mt-0.5">{lead.phone}</p>}
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider rounded-md">
                        {lead.service_interest || 'General Consultation'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${lead.score >= 70 ? 'bg-emerald-500' : lead.score >= 45 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                          <span className="font-mono text-xs font-bold text-slate-800">{lead.score || 50}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full ${theme.bg} ${theme.text} text-[10px] font-semibold uppercase tracking-wider`}>
                        {stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button
                         onClick={() => openInspector(lead)}
                         className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors border border-slate-100 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-white"
                       >
                          Manage CRM
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide Out Custom CRM Inspector Drawer */}
      <AnimatePresence>
         {selectedLead && (
           <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
                onClick={() => setSelectedLead(null)}
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
                            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">LEAD_ID: {selectedLead.id}</span>
                            <h3 className="text-lg font-bold text-slate-900 mt-2">HubSpot Lead Inspector</h3>
                         </div>
                         <button 
                           onClick={() => setSelectedLead(null)}
                           className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                         >
                            <X size={18} />
                         </button>
                      </div>

                      {updateSuccess && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold text-xs mb-6">
                           Lead synchronized perfectly. Closing node tracker.
                        </div>
                      )}

                      {/* Info grid */}
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 flex justify-between items-center select-none">
                         <div className="space-y-1">
                            <p className="text-xs font-black text-slate-800 uppercase">Interactive Score Adjuster</p>
                            <p className="text-[10px] text-slate-400 font-medium">Calibrate this lead's value benchmark</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <input 
                              type="range" 
                              min={10} 
                              max={100}
                              value={customScore} 
                              onChange={(e) => setCustomScore(Number(e.target.value))}
                              className="w-24 cursor-pointer accent-indigo-600"
                            />
                            <span className="font-mono text-sm font-black text-slate-900">{customScore}</span>
                         </div>
                      </div>

                      <div className="space-y-6">
                         {/* Core Info */}
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Sender Identity</p>
                               <p className="text-sm font-black text-slate-950 italic leading-none">{selectedLead.name}</p>
                               <span className="text-xs text-slate-500 font-medium">{selectedLead.email}</span>
                            </div>

                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Service Request</p>
                               <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm">{selectedLead.service_interest || 'General Consultation'}</span>
                            </div>
                         </div>

                         {/* Stage selector */}
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Crm Stage Selection</p>
                            <div className="grid grid-cols-3 gap-2">
                               {(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST'] as PipelineStage[]).map((stg) => {
                                 const itemTheme = STAGE_THEMES[stg];
                                 const isSelected = currentStage === stg;
                                 return (
                                   <button
                                     key={stg}
                                     type="button"
                                     onClick={() => setCurrentStage(stg)}
                                     style={{ border: isSelected ? `2px solid ${itemTheme.color}` : '1px solid #f1f5f9' }}
                                     className={`p-2.5 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all text-center ${
                                       isSelected ? 'bg-white shadow-sm font-extrabold text-slate-900' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                     }`}
                                   >
                                      {stg.replace('_', ' ')}
                                   </button>
                                 );
                               })}
                            </div>
                         </div>

                         {/* Origin message */}
                         <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Message Context</p>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed italic">"{selectedLead.message || 'No custom message specified.'}"</p>
                         </div>

                         {/* Tagging Engine */}
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Lead Labels & Tags (Press Enter)</p>
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                               {leadTags.map(t => (
                                 <span key={t} className="bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                                    {t}
                                    <X size={10} className="cursor-pointer" onClick={() => handleRemoveTag(t)} />
                                 </span>
                               ))}
                            </div>
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                              placeholder="Add label tag and hit Enter..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold focus:bg-white focus:outline-none"
                            />
                         </div>

                         {/* Notes history tracker */}
                         <div className="space-y-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Activity Timeline History & Notes</p>
                            
                            <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 placeholder="Append audit log entry or follow-up note..." 
                                 value={noteText}
                                 onChange={(e) => setNoteText(e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-medium focus:bg-white focus:outline-none"
                               />
                               <button 
                                 type="button" 
                                 onClick={handleAddNote}
                                 className="px-4 bg-indigo-600 hover:bg-indigo-505 text-white text-[9px] rounded-xl font-black uppercase tracking-widest"
                               >
                                  Add
                               </button>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto">
                               {[...notesList].reverse().map((nt, nIdx) => (
                                 <div key={nIdx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                                    <p className="text-[11px] text-slate-700 font-medium leading-normal">{nt.text}</p>
                                    <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                       <span>Author: {nt.author}</span>
                                       <span>{new Date(nt.date).toLocaleDateString()} at {new Date(nt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Committing changes */}
                   <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-8">
                      <button 
                        type="button" 
                        onClick={() => setSelectedLead(null)}
                        className="px-6 py-3.5 bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl"
                      >
                         Discard
                      </button>
                      <button 
                        type="button" 
                        onClick={handleSaveChanges}
                        disabled={updating}
                        className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-505 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-100"
                      >
                         <Save size={14} /> {updating ? 'Saving Status...' : 'Publish CRM Updates'}
                      </button>
                   </div>
                </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>

      {/* CSV Bulk Importer Preview Modal */}
      <AnimatePresence>
        {csvPreview && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80]"
               onClick={() => setCsvPreview(null)}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[90] shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
             >
               <div className="p-8 border-b border-slate-100 flex justify-between items-center select-none">
                 <div>
                   <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">BULK IMPORT MODULE</span>
                   <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mt-1">Review Prospective Leads</h3>
                 </div>
                 <button 
                   onClick={() => setCsvPreview(null)}
                   className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-805"
                 >
                    <X size={18} />
                 </button>
               </div>

               <div className="p-8 overflow-y-auto space-y-6 flex-1">
                 <p className="text-xs text-slate-500 leading-normal font-medium">
                   The CRM system has parsed the uploaded list and mapped columns. Here is a preview of the <strong className="text-slate-800">{csvPreview.length} leads</strong> pending creation. Check and confirm below:
                 </p>

                 {importError && (
                   <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                      <AlertCircle size={14} /> {importError}
                   </div>
                 )}

                 <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                   <table className="w-full text-left border-collapse text-[11px]">
                     <thead>
                       <tr className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                         <th className="px-4 py-3">Identity Name</th>
                         <th className="px-4 py-3">Email Address</th>
                         <th className="px-4 py-3">Contact Phone</th>
                         <th className="px-4 py-3">Interest Area</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                       {csvPreview.slice(0, 10).map((p, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50">
                           <td className="px-4 py-3 font-bold text-slate-950">{p.name || <em className="text-slate-400">Missing</em>}</td>
                           <td className="px-4 py-3 text-slate-600 font-mono">{p.email || <em className="text-slate-400">Missing</em>}</td>
                           <td className="px-4 py-3 text-slate-500 font-mono">{p.phone || '-'}</td>
                           <td className="px-4 py-3 text-slate-500">{p.service_interest || '-'}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>

                 {csvPreview.length > 10 && (
                   <p className="text-[10px] text-slate-450 italic font-medium text-center">
                     ...and {(csvPreview.length - 10)} other rows not shown in the preview window.
                   </p>
                 )}
               </div>

               <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 select-none font-sans">
                 <button 
                   type="button" 
                   onClick={() => setCsvPreview(null)}
                   className="px-6 py-3.5 bg-white border border-slate-150 text-slate-500 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl"
                 >
                    Abort Import
                 </button>
                 <button 
                   type="button" 
                   onClick={handleConfirmImport}
                   disabled={importing}
                   className="px-8 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
                 >
                    {importing ? "Processing Array..." : `Confirm & Upload ${csvPreview.length} Leads`}
                 </button>
               </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
