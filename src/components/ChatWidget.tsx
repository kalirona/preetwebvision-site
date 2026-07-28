import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Brain, AlertCircle } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [sessionId, setSessionId] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [registrationRequired, setRegistrationRequired] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  // Initialize/retrieve sessionId
  React.useEffect(() => {
    let sId = localStorage.getItem('pw_chat_session_id');
    if (!sId) {
      sId = `SESS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      localStorage.setItem('pw_chat_session_id', sId);
    }
    setSessionId(sId);

    const storedName = localStorage.getItem('pw_chat_user_name');
    const storedEmail = localStorage.getItem('pw_chat_user_email');
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);

    // If we have a sessionId, fetch messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?sessionId=${sId}`);
        if (res.ok) {
          const list = await res.json();
          setMessages(list);
          // If no messages exists, trigger registration form if email not stored
          if (list.length === 0 && !storedEmail) {
            setRegistrationRequired(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [sessionId]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    localStorage.setItem('pw_chat_user_name', userName.trim());
    localStorage.setItem('pw_chat_user_email', userEmail.trim());
    setRegistrationRequired(false);

    // Seed first greet message from user
    handleSendMessage(`Hello! My name is ${userName}. I want to ask about your custom WordPress architectures to boost speed.`);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !sessionId) return;
    setSending(true);

    const payload = {
      sessionId,
      message: textToSend,
      userName: userName || "Visitor",
      email: userEmail || ""
    };

    // Optimistically add client message
    const optimClientMsg = { sender: 'user', message: textToSend, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, optimClientMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const r = await res.json();
        setMessages(r.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const onSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const msg = inputValue;
    setInputValue('');
    handleSendMessage(msg);
  };

  return (
    <>
      {/* Floating Sparkle Chat Widget Bubble */}
      <div className="fixed bottom-8 right-8 z-[100] sm:bottom-12 sm:right-12">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-slate-900 border border-slate-800 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 group relative"
        >
          {isOpen ? (
            <X size={22} className="rotate-90 transition-transform duration-300" />
          ) : (
            <>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-slate-900 animate-pulse" />
              <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-28 right-8 sm:right-12 z-[100] w-[360px] h-[550px] bg-white border border-slate-200/50 shadow-2xl rounded-[2.5rem] flex flex-col justify-between overflow-hidden"
          >
             {/* Header */}
             <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black">
                    P
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-widest uppercase leading-none">Preet Vision</h4>
                    <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                      <Sparkles size={10} className="animate-pulse" /> Digital Assistant
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                   <X size={18} />
                </button>
             </div>

             {/* Main Dialogue Log */}
             <div className="flex-1 p-8 overflow-y-auto space-y-4 bg-slate-50/20">
                {registrationRequired ? (
                  // Hot Lead Contact Collection Gateway
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col justify-center items-center text-center py-6"
                  >
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <Brain size={24} className="animate-pulse" />
                     </div>
                     <h5 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2">Message Preet Web Vision</h5>
                     <p className="text-[10px] text-slate-400 font-medium max-w-[240px] leading-relaxed mb-6">
                       Please enter your details below so we can assist you with custom website speed and strategy recommendations.
                     </p>

                     <form onSubmit={handleRegister} className="w-full space-y-4 text-left">
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder="Your Name (e.g., Jane)" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-white border border-slate-100/50 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
                          />
                        </div>
                        <div>
                          <input 
                            type="email" 
                            required
                            placeholder="Business Email" 
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full bg-white border border-slate-100/50 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all"
                        >
                           Start Conversation
                        </button>
                     </form>
                  </motion.div>
                ) : (
                  <>
                    {/* Standard Message Log */}
                    {messages.length === 0 && (
                      <div className="text-center py-10 space-y-3">
                         <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                            <Brain size={16} />
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">How can we help?</p>
                         <p className="text-[10px] text-slate-400 font-medium max-w-[200px] leading-relaxed mx-auto">Ask any question about custom designs, speed audits, or SEO packages.</p>
                      </div>
                    )}
                    
                    {messages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`flex w-full ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                         <div className={`max-w-[80%] px-4 py-3.5 rounded-2xl text-[11px] font-medium leading-relaxed ${
                           m.sender === 'user' 
                             ? 'bg-slate-900 text-white rounded-tr-none' 
                             : 'bg-slate-100 text-slate-800 rounded-tl-none'
                         }`}>
                           <p>{m.message}</p>
                         </div>
                      </div>
                    ))}
                    
                    {sending && (
                      <div className="flex w-full justify-start items-center gap-2">
                        <div className="bg-slate-100 text-slate-500 px-4 py-2.5 rounded-2xl text-[10px] font-bold italic leading-none rounded-tl-none">
                          Thinking...
                        </div>
                      </div>
                    )}
                  </>
                )}
             </div>

             {/* Footer input bubble */}
             {!registrationRequired && (
               <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                  <form onSubmit={onSubmitMessage} className="relative flex items-center">
                     <input 
                       type="text" 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Ask Preet..." 
                       className="w-full bg-white border border-slate-100 rounded-xl pl-5 pr-14 py-3.5 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
                     />
                     <button 
                       type="submit"
                       className="absolute right-2.5 w-9 h-9 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-all"
                     >
                       <Send size={12} />
                     </button>
                  </form>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
