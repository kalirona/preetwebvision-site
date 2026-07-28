import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, RotateCcw, AlertTriangle, Eye, EyeOff, Search, FileJson, CheckCircle2, XCircle, HardDrive, RefreshCw } from 'lucide-react';

interface AILog {
  id: string;
  timestamp: string;
  provider: 'gemini' | 'openai';
  modelName: string;
  systemInstruction?: string;
  prompt: string;
  response: string;
  tokenCount: number;
  creditSpent: number;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
}

export const AILogsModule = () => {
  const [logs, setLogs] = React.useState<AILog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedLog, setSelectedLog] = React.useState<AILog | null>(null);
  const [regeneratingId, setRegeneratingId] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/chat/ai-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to load AI logs", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const handleRegenerate = async (logId: string) => {
    setRegeneratingId(logId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // Mock retry endpoint action on the log id
      const token = localStorage.getItem('adminToken');
      // In custom setup, we can request a retry or let the server regenerate the task
      const log = logs.find(l => l.id === logId);
      if (!log) return;

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: 'sess-regenerate',
          message: `${log.prompt} (Regenerate Request)`,
          userName: 'System Auditor',
          email: 'audit@preetwebvision.com'
        })
      });

      if (response.ok) {
        setSuccessMsg(`Successfully executed regeneration batch for log: ${logId}!`);
        fetchLogs();
      } else {
        throw new Error("Regeneration endpoint reported error status");
      }
    } catch (err: any) {
      setErrorMsg(`Failed to invoke regeneration: ${err.message || String(err)}`);
    } finally {
      setRegeneratingId(null);
    }
  };

  const filteredLogs = logs.filter(log => {
    const sc = search.toLowerCase();
    return (
      log.prompt.toLowerCase().includes(sc) ||
      (log.response && log.response.toLowerCase().includes(sc)) ||
      log.modelName.toLowerCase().includes(sc) ||
      log.id.toLowerCase().includes(sc)
    );
  });

  // Calculate stats
  const totalTokens = logs.reduce((sum, current) => sum + (current.tokenCount || 0), 0);
  const totalCredits = logs.reduce((sum, current) => sum + (current.creditSpent || 0), 0);
  const successRate = logs.length > 0
    ? Math.round((logs.filter(l => l.status === 'SUCCESS').length / logs.length) * 100)
    : 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 font-sans text-slate-800"
    >
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">AI Audit Control</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Centrally audit search console requests, content writers, and AI token usages
          </p>
        </div>
        
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-3 bg-white border border-slate-200 hover:border-indigo-600 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Total Token Footprint</p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{totalTokens.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <HardDrive size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Credits Consumed</p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{totalCredits} CR</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">AI Success Velocity</p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{successRate}%</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-900 select-none">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-900 select-none">
          {errorMsg}
        </div>
      )}

      {/* Main logs ledger panel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter prompt content, model, log ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-2xl focus:outline-none transition-all font-semibold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] font-black uppercase tracking-widest text-slate-400 select-none">
                <th className="px-6 py-4">ID / Timestamp</th>
                <th className="px-6 py-4">Model & Provider</th>
                <th className="px-6 py-4">Tokens & Credits</th>
                <th className="px-6 py-4">Original Prompt Snippet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-405 font-bold italic">
                    Reading central AI usage ledgers...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 font-semibold text-xs py-20">
                    No matching AI service execution logs registered under Postgres app_data.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 block">{log.id}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1.5 bg-slate-100 text-slate-700 font-mono text-[9px] font-black uppercase rounded-lg">
                        {log.provider}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-2 font-semibold">
                        {log.modelName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span className="text-slate-900 font-bold block">{log.tokenCount} tokens</span>
                      <span className="text-[10px] text-amber-600 font-bold block mt-1">
                        -{log.creditSpent} credits
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-550 select-none">
                      {log.prompt}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        log.status === 'SUCCESS' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {log.status === 'SUCCESS' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2.5 border border-slate-100 hover:border-indigo-600 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
                          title="Deep Inspection"
                        >
                          <Eye size={12} />
                        </button>
                        
                        <button
                          onClick={() => handleRegenerate(log.id)}
                          disabled={regeneratingId === log.id}
                          className="p-2.5 border border-slate-100 hover:border-amber-600 rounded-lg hover:bg-white text-slate-500 hover:text-amber-600 transition-all cursor-pointer disabled:opacity-50"
                          title="Regenerate Content"
                        >
                          <RotateCcw size={12} className={regeneratingId === log.id ? "animate-spin" : ""} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP FOR DEEP AUDIT INSPECTION (RAW ORIGINAL AND GENERATED TEXT) */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-[200]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h3 className="text-md font-black text-slate-900 uppercase italic">Central AI Operational Node Audit</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Log token id: {selectedLog.id}</p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-9 h-9 border border-slate-100 hover:border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {selectedLog.systemInstruction && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">System Prompt Instructions</p>
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-mono text-slate-650 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {selectedLog.systemInstruction}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT: Prompt */}
                  <div className="space-y-2 flex flex-col">
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest font-mono">Original Form Content (Prompt)</p>
                    <div className="flex-1 bg-indigo-50/20 p-5 border border-indigo-100/35 rounded-2xl text-xs text-slate-700 font-semibold leading-relaxed overflow-y-auto min-h-[220px] whitespace-pre-wrap">
                      {selectedLog.prompt}
                    </div>
                  </div>

                  {/* RIGHT: Generated Response */}
                  <div className="space-y-2 flex flex-col">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono font-bold">Generated Output (Resolution)</p>
                    <div className={`flex-1 p-5 rounded-2xl text-xs leading-relaxed overflow-y-auto min-h-[220px] whitespace-pre-wrap border ${
                      selectedLog.status === 'SUCCESS'
                        ? 'bg-emerald-50/25 border-emerald-100/40 text-slate-850 font-medium'
                        : 'bg-red-50/10 border-red-105 text-red-900 font-mono'
                    }`}>
                      {selectedLog.status === 'SUCCESS' ? selectedLog.response : (selectedLog.error || "Execution broken.")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Dismiss Audit Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
