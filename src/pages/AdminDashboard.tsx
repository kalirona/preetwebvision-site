import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, Users, Globe, LogOut, Search, Filter, Shield, Lock, Settings, Share2, BarChart3, Menu, X, Calendar, Inbox, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

import { LeadsModule } from '../components/admin/LeadsModule';
import { SEOModule } from '../components/admin/SEOModule';
import { AffiliateModule } from '../components/admin/AffiliateModule';
import { SettingsModule } from '../components/admin/SettingsModule';
import { SecurityModule } from '../components/admin/SecurityModule';
import { DashboardModule } from '../components/admin/DashboardModule';
import { FormSubmissionsModule } from '../components/admin/FormSubmissionsModule';

type AdminTab = 'dashboard' | 'leads' | 'submissions' | 'seo' | 'affiliates' | 'settings' | 'security';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('dashboard');
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/lead', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Unauthenticated');
      }

      const data = await response.json();
      setLeads(data);
    } catch (err) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  interface NavItem {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
  }

  interface NavGroup {
    category: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      category: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
      ]
    },
    {
      category: 'Customers & CRM',
      items: [
        { id: 'leads', label: 'Leads', icon: <LayoutDashboard size={16} /> },
        { id: 'submissions', label: 'Submissions', icon: <Inbox size={16} /> },
      ]
    },
    {
      category: 'Marketing & Tools',
      items: [
        { id: 'seo', label: 'SEO Settings', icon: <Search size={16} /> },
        { id: 'affiliates', label: 'Affiliates', icon: <Share2 size={16} /> },
      ]
    },
    {
      category: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
        { id: 'security', label: 'Security', icon: <Lock size={16} /> },
      ]
    }
  ];

  const navItems = React.useMemo<NavItem[]>(() => {
    return navGroups.flatMap(group => group.items);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardModule />;
      case 'leads': return <LeadsModule leads={leads} loading={loading} />;
      case 'submissions': return <FormSubmissionsModule />;
      case 'seo': return <SEOModule />;
      case 'affiliates': return <AffiliateModule />;
      case 'settings': return <SettingsModule />;
      case 'security': return <SecurityModule />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col lg:flex-row font-sans">
      <Helmet>
        <title>Dashboard | Preet Web Vision</title>
      </Helmet>
      
      {/* DESKTOP SIDEBAR MENU */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-[#121212] border-r border-white/10 flex-col z-[75] text-white p-5 shadow-2xl overflow-y-auto">
        {/* Branding */}
        <div className="mb-8 group cursor-pointer px-2" onClick={() => navigate('/')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF9D00] rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-[#FF6B00]/20 font-display">P</div>
            <div>
              <p className="text-xs font-mono font-bold tracking-tight text-white uppercase">Control Deck</p>
              <p className="text-[10px] text-[#FFB347] font-mono tracking-wider uppercase">Preet Web Vision</p>
            </div>
          </div>
        </div>

        {/* Vertical Grouped Nav List */}
        <nav className="flex-grow space-y-6">
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#8B8B8B] block mb-2">
                {group.category}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={cn(
                        "w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 text-left cursor-pointer border border-transparent",
                        isActive 
                          ? "bg-[#161616] text-[#FFB347] border-[#FF6B00]/30 shadow-lg shadow-[#FF6B00]/5" 
                          : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#FF6B00] rounded-r" />
                      )}
                      <span className={cn("transition-colors", isActive ? "text-[#FF6B00]" : "text-[#8B8B8B] group-hover:text-white")}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-5 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 bg-[#161616] px-3.5 py-2.5 rounded-xl border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping" />
            <span className="text-[10px] font-mono text-[#BFBFBF] uppercase">System Online</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 p-3 text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE COMMAND HEADER BAR */}
      <div className="bg-[#121212] text-white fixed top-0 left-0 right-0 z-[70] border-b border-white/10 lg:hidden">
        <div className="px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center font-black text-xs text-white font-display">P</div>
             <div>
               <p className="text-xs font-mono font-bold leading-none uppercase">Dashboard</p>
               <p className="text-[9px] text-[#FFB347] font-mono tracking-wider mt-0.5 uppercase">Preet Web Vision</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
             >
               {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Admin Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#121212] border-r border-white/10 z-[90] p-6 flex flex-col shadow-2xl lg:hidden overflow-y-auto"
            >
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FF6B00] rounded-lg flex items-center justify-center font-black text-sm text-white font-display">P</div>
                    <div>
                        <p className="text-xs font-mono font-bold text-white uppercase">Control Deck</p>
                        <p className="text-[9px] text-[#FFB347] font-mono tracking-wider uppercase">Preet Web Vision</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="text-[#8B8B8B] hover:text-white transition-colors cursor-pointer">
                     <X size={20} />
                  </button>
               </div>
               
               <nav className="space-y-5 flex-grow">
                  {navGroups.map((group) => (
                    <div key={group.category} className="space-y-1">
                      <span className="px-2 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8B8B8B] block mb-1">
                        {group.category}
                      </span>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = activeTab === item.id;
                          return (
                            <button 
                              key={item.id}
                              onClick={() => { setActiveTab(item.id as AdminTab); setIsMenuOpen(false); }}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all border border-transparent",
                                isActive 
                                  ? "bg-[#161616] text-[#FFB347] border-[#FF6B00]/30 shadow-lg" 
                                  : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                              )}
                            >
                              <span className={isActive ? "text-[#FF6B00]" : "text-[#8B8B8B]"}>{item.icon}</span>
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
               </nav>

               <div className="mt-8 pt-5 border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2.5 p-3 text-red-400 text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <div className="flex-1 lg:pl-72 bg-[#080808] min-h-screen relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF6B00]/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="container mx-auto px-6 pt-24 lg:pt-12 pb-20 max-w-7xl relative z-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#161616] border border-[#FF6B00]/30 text-[#FFB347] text-[10px] font-mono font-bold rounded-full uppercase tracking-widest">
                  LIVE CONTROL SESSION
                </span>
                <span className="w-2 h-2 bg-[#FF6B00] rounded-full animate-ping" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
               <button className="p-3 bg-[#121212] border border-white/10 hover:border-[#FF6B00]/40 text-[#BFBFBF] hover:text-white rounded-xl transition-all flex items-center justify-center cursor-pointer">
                 <Filter size={18} />
               </button>
               <button className="px-5 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#FF6B00]/20 cursor-pointer">
                 Save System State
               </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};