import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Send, Tag, Check, Brain, Smile, Activity, X } from 'lucide-react';

export const ChatModule = () => {
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<any | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [suggesting, setSuggesting] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');

  const fetchConversations = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await fetch('/api/chat/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSessions(data);
      if (data.length > 0 && !selectedSession) {
        setSelectedSession(data[0]);
        setHistory(data[0].messages || []);
      } else if (selectedSession) {
        const updated = data.find((s: any) => s.sessionId === selectedSession.sessionId);
        if (updated) {
          setSelectedSession(updated);
          setHistory(updated.messages || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConversations();
    // Poll every 10 seconds for real-time customer chats
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [selectedSession?.sessionId]);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyMessage.trim() || !selectedSession) return;

    const token = localStorage.getItem('adminToken');
    const conversationId = selectedSession.sessionId;
    const textToSend = replyMessage;
    // Clear field immediately
    setReplyMessage('');

    try {
      const res = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: conversationId, message: textToSend })
      });

      if (res.ok) {
        const updatedSession = await res.json();
        setHistory(updatedSession.messages);
        // Refresh session tree
        setSessions(prev => prev.map(s => s.sessionId === conversationId ? updatedSession : s));
      } else {
        setReplyMessage(textToSend); // restore
        alert('Failed to send message');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggestReply = async () => {
    if (!selectedSession) return;
    setSuggesting(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('/api/chat/suggest-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: selectedSession.sessionId })
      });

      if (res.ok) {
        const data = await res.json();
        setReplyMessage(data.suggestion);
      } else {
        alert('AI Suggestion failed. Ensure GEMINI_API_KEY is available.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSuggesting(false);
    }
  };

  const handleToggleStatus = async (newStatus: 'active' | 'resolved') => {
    if (!selectedSession) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/chat/sessions/${selectedSession.sessionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const r = await res.json();
        setSelectedSession(r);
        setSessions(prev => prev.map(s => s.sessionId === r.sessionId ? r : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTag = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && selectedSession) {
      e.preventDefault();
      const currentTags = selectedSession.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        const updatedTags = [...currentTags, tagInput.trim()];
        const token = localStorage.getItem('adminToken');
        try {
          const res = await fetch(`/api/chat/sessions/${selectedSession.sessionId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tags: updatedTags })
          });
          if (res.ok) {
            const r = await res.json();
            setSelectedSession(r);
            setSessions(prev => prev.map(s => s.sessionId === r.sessionId ? r : s));
          }
        } catch (err) {
          console.error(err);
        }
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = async (idxToRemove: number) => {
    if (!selectedSession) return;
    const currentTags = selectedSession.tags || [];
    const updatedTags = currentTags.filter((_, idx) => idx !== idxToRemove);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/chat/sessions/${selectedSession.sessionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tags: updatedTags })
      });
      if (res.ok) {
        const r = await res.json();
        setSelectedSession(r);
        setSessions(prev => prev.map(s => s.sessionId === r.sessionId ? r : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">AI Live Inbox</h2>
        <p className="text-xs text-slate-500 font-normal mt-1">SaaS Customer Live Chat and Gemini-Suggested Conversational logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">
        {/* Navigation / Session list (Left Column) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conversations</span>
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 flex items-center justify-center">{sessions.length}</span>
           </div>
           
           <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {sessions.map((sess) => (
                <button 
                  key={sess.sessionId}
                  onClick={() => { setSelectedSession(sess); setHistory(sess.messages || []); }}
                  className={`w-full text-left p-6 transition-colors flex flex-col gap-2 ${
                    selectedSession?.sessionId === sess.sessionId ? 'bg-indigo-50/40 relative' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {selectedSession?.sessionId === sess.sessionId && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-md" />
                  )}
                  <div className="flex justify-between items-start w-full">
                     <p className="font-bold text-slate-900 text-sm tracking-tight leading-none line-clamp-1">
                       {sess.userName}
                     </p>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider leading-none ${
                       sess.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-505'
                     }`}>
                       {sess.status}
                     </span>
                  </div>
                  
                  {sess.email && <p className="text-[10px] text-slate-400 font-medium leading-none">{sess.email}</p>}
                  
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-normal">
                     "{sess.lastMessage}"
                  </p>

                  {sess.tags && sess.tags.length > 0 && (
                     <div className="flex flex-wrap gap-1 mt-1">
                       {sess.tags.map((tg: string, idx: number) => (
                         <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                           {tg}
                         </span>
                       ))}
                     </div>
                  )}
                </button>
              ))}

              {sessions.length === 0 && !loading && (
                <div className="py-20 text-center text-slate-500 font-medium">
                   No sessions tracked yet.
                </div>
              )}
           </div>
        </div>

        {/* Messaging Logs Node (Right Column) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
           {selectedSession ? (
             <>
               {/* Channel Header */}
               <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-sm text-slate-900 leading-none">
                        {selectedSession.userName}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Operator Linked</span>
                      </div>
                    </div>
                    {selectedSession.email && <p className="text-[9px] text-slate-400 font-bold font-mono mt-1.5">{selectedSession.email}</p>}
                  </div>

                  <div className="flex items-center gap-4">
                     {/* Tags list */}
                     <div className="hidden sm:flex items-center gap-2 border border-slate-100 bg-white/50 px-3 py-1.5 rounded-xl">
                        <Tag size={12} className="text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Add Tag..." 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="w-16 focus:outline-none bg-transparent text-[10px] font-bold"
                        />
                     </div>

                     <div className="flex gap-2">
                        {selectedSession.status === 'active' ? (
                          <button 
                            onClick={() => handleToggleStatus('resolved')}
                            className="bg-indigo-50 border border-indigo-100 px-4 py-2 text-[9px] font-black uppercase text-indigo-700 tracking-widest hover:bg-slate-950 hover:text-white rounded-xl transition-all"
                          >
                            Mark Solved
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus('active')}
                            className="bg-slate-100 border border-slate-200 px-4 py-2 text-[9px] font-black uppercase text-slate-650 tracking-widest hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                          >
                            Re-Open
                          </button>
                        )}
                     </div>
                  </div>
               </div>

               {/* Tags Pill container */}
               {selectedSession.tags && selectedSession.tags.length > 0 && (
                 <div className="px-10 py-2 border-b border-slate-50 flex items-center flex-wrap gap-1.5">
                   <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 mr-2">Assigned Topics:</span>
                    {selectedSession.tags.map((tg: string, i: number) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                        {tg}
                        <X size={10} className="cursor-pointer hover:scale-125" onClick={() => handleRemoveTag(i)} />
                      </span>
                    ))}
                 </div>
               )}

               {/* Messages Area */}
               <div className="flex-1 p-10 overflow-y-auto space-y-6 bg-slate-50/20">
                  {history.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex w-full ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[70%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-slate-100 text-slate-800 rounded-tl-sm' 
                          : msg.isAiSuggested 
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-100 rounded-tr-sm' 
                            : 'bg-slate-900 text-white rounded-tr-sm'
                      }`}>
                         {msg.isAiSuggested && (
                           <div className="flex items-center gap-1.5 mb-2 border-b border-white/20 pb-1.5">
                              <Sparkles size={11} className="text-amber-300 animate-spin" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-100">AI Instant Reply Auto-Dispatched</span>
                           </div>
                         )}
                         <p>{msg.message}</p>
                         <p className={`text-[8px] mt-1 font-mono text-right ${
                           msg.sender === 'user' ? 'text-slate-400' : 'text-slate-300'
                         }`}>
                           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                    </div>
                  ))}
               </div>

               {/* Reply Box Footer */}
               <div className="p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
                  <div className="flex justify-between items-center mb-3">
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Type manual response or deploy assist...</p>
                     
                     {/* Gemini Smart Assist */}
                     <button 
                       onClick={handleSuggestReply}
                       disabled={suggesting}
                       className="group bg-indigo-600 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Brain size={12} className={suggesting ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
                        {suggesting ? "Analyzing History..." : "SEO Co-Pilot Suggestion"}
                     </button>
                  </div>

                  <form onSubmit={handleSendReply} className="relative flex items-center">
                     <input 
                       type="text" 
                       value={replyMessage}
                       onChange={(e) => setReplyMessage(e.target.value)}
                       placeholder="Say, 'Hi! Preet here. I can certainly assist you with building...'" 
                       className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-2xl pl-6 pr-20 py-4 text-xs font-bold focus:outline-none shadow-sm transition-all"
                     />
                     <button 
                       type="submit"
                       className="absolute right-3 w-12 h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all"
                     >
                       <Send size={16} />
                     </button>
                  </form>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-20 text-center">
                <MessageSquare size={48} className="text-slate-200 mb-6" />
                <p className="font-bold text-base text-slate-800 mb-1">Select a Conversation</p>
                <p className="text-xs font-medium max-w-sm">Choose a chat session from the navigation to begin conversation.</p>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
};
