import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  DollarSign, TrendingUp, Users, UserPlus, CreditCard, ChevronUp, ChevronDown, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Layers, Database, ShieldCheck, Zap
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState<'30d' | '90d' | '12m'>('30d');
  const [activeSegment, setActiveSegment] = React.useState<'all' | 'enterprise' | 'growth' | 'basic'>('all');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Simulated metrics and timeline based on active timeframe
  const mrrData = React.useMemo(() => {
    const data30d = [
      { date: 'May 10', MRR: 42000, ARR: 504000, Growth: 2.1 },
      { date: 'May 15', MRR: 43200, ARR: 518400, Growth: 2.3 },
      { date: 'May 20', MRR: 44500, ARR: 534000, Growth: 3.0 },
      { date: 'May 25', MRR: 45800, ARR: 549600, Growth: 2.9 },
      { date: 'May 30', MRR: 47100, ARR: 565200, Growth: 2.8 },
      { date: 'Jun 05', MRR: 48900, ARR: 586800, Growth: 3.8 },
      { date: 'Jun 10', MRR: 50250, ARR: 603000, Growth: 2.7 }
    ];

    const data90d = [
      { date: 'Mar 15', MRR: 35000, ARR: 420000, Growth: 1.8 },
      { date: 'Mar 30', MRR: 37500, ARR: 450000, Growth: 7.1 },
      { date: 'Apr 15', MRR: 40200, ARR: 482450, Growth: 7.2 },
      { date: 'Apr 30', MRR: 43000, ARR: 516000, Growth: 6.9 },
      { date: 'May 15', MRR: 45800, ARR: 549600, Growth: 6.5 },
      { date: 'May 30', MRR: 48100, ARR: 577200, Growth: 5.0 },
      { date: 'Jun 10', MRR: 50250, ARR: 603000, Growth: 4.4 }
    ];

    const data12m = [
      { date: 'Jun 25', MRR: 12000, ARR: 144000, Growth: 0.1 },
      { date: 'Aug 25', MRR: 18000, ARR: 216000, Growth: 50.0 },
      { date: 'Oct 25', MRR: 24500, ARR: 294000, Growth: 36.1 },
      { date: 'Dec 25', MRR: 31000, ARR: 372000, Growth: 26.5 },
      { date: 'Feb 26', MRR: 39500, ARR: 474000, Growth: 27.4 },
      { date: 'Apr 26', MRR: 46200, ARR: 554400, Growth: 16.9 },
      { date: 'Jun 26', MRR: 50250, ARR: 603000, Growth: 8.7 }
    ];

    if (timeframe === '90d') return data90d;
    if (timeframe === '12m') return data12m;
    return data30d;
  }, [timeframe]);

  // Breakdown of plan subscription counts
  const planDistribution = [
    { name: 'Enterprise Plan', value: 34, color: '#6366f1', amount: '$24,500/mo' },
    { name: 'Growth Plan', value: 112, color: '#a855f7', amount: '$18,150/mo' },
    { name: 'Basic Plan', value: 245, color: '#ec4899', amount: '$7,600/mo' }
  ];

  // Retention / Churn cohorts
  const cohortData = [
    { name: 'Cohort A', NetExpansion: 104, Churn: 1.4 },
    { name: 'Cohort B', NetExpansion: 112, Churn: 0.9 },
    { name: 'Cohort C', NetExpansion: 101, Churn: 1.8 },
    { name: 'Cohort D', NetExpansion: 118, Churn: 1.1 },
    { name: 'Cohort E', NetExpansion: 124, Churn: 0.6 }
  ];

  // Subscription transactions ledger
  const activeSubscriptionsList = [
    { id: 'SUB-1942', customer: 'Alpha Scale Inc.', plan: 'Enterprise Plan', amount: '$1,299/mo', status: 'active', renewal: 'Jul 04, 2026', speedScore: '99/100' },
    { id: 'SUB-8291', customer: 'Vortex Global Tech', plan: 'Enterprise Plan', amount: '$1,299/mo', status: 'active', renewal: 'Jun 28, 2026', speedScore: '98/100' },
    { id: 'SUB-3312', customer: 'Zenith Labs LLC', plan: 'Growth Plan', amount: '$189/mo', status: 'active', renewal: 'Jul 12, 2026', speedScore: '99/100' },
    { id: 'SUB-4402', customer: 'Nordic Digital', plan: 'Growth Plan', amount: '$189/mo', status: 'active', renewal: 'Jun 24, 2026', speedScore: '100/100' },
    { id: 'SUB-7721', customer: 'Beacon Media', plan: 'Basic Plan', amount: '$49/mo', status: 'active', renewal: 'Jul 01, 2026', speedScore: '97/100' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const filteredSubscriptions = React.useMemo(() => {
    if (activeSegment === 'all') return activeSubscriptionsList;
    return activeSubscriptionsList.filter(sub => 
      sub.plan.toLowerCase().includes(activeSegment.toLowerCase())
    );
  }, [activeSegment]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-24"
    >
      
      {/* SaaS Dashboard Title & Filter controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-indigo-500/15 border border-indigo-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-sans">
              Analytics Overview
            </span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">Dashboard</h2>
          <p className="text-xs text-slate-300 font-semibold uppercase tracking-widest leading-none mt-1">
            Real-time subscriber lifecycle and growth overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '12m', label: '12 Months' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`px-4.5 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  timeframe === t.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* CORE METRIC CARD STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { 
            label: 'Monthly Recurring (MRR)', 
            val: '$50,250', 
            change: '+12.4%', 
            isUp: true, 
            caption: 'ARR $603,000 Target', 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50',
            icon: <DollarSign size={20} />
          },
          { 
            label: 'Active Subscriptions', 
            val: '391 Users', 
            change: '+38 new', 
            isUp: true, 
            caption: '0.8% active churn rate', 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            icon: <Users size={20} />
          },
          { 
            label: 'LTV to CAC Ratio', 
            val: '5.2x Ratio', 
            change: 'Optimal', 
            isUp: true, 
            caption: 'CAC $240 / LTV $1,248', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            icon: <TrendingUp size={20} />
          },
          { 
            label: 'Conversion Rate', 
            val: '18.42%', 
            change: '+2.1%', 
            isUp: true, 
            caption: 'Lighthouse score 99/100', 
            color: 'text-amber-600', 
            bg: 'bg-amber-50',
            icon: <Zap size={20} />
          }
        ].map((met, idx) => (
          <div key={idx} className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{met.label}</span>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${met.color} ${met.bg}`}>
                {met.icon}
              </div>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{met.val}</p>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{met.caption}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-0.5">
                  <ArrowUpRight size={11} /> {met.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CORE METRICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MRR Over Time (Big Graph) */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recurring Revenue Trajectory</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Growth patterns normalized for selected timeframe</p>
            </div>
            
            <span className="text-[11px] text-indigo-600 font-semibold px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full font-sans self-start sm:self-auto">
              Net expansion: +$4,250 this month
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrData} margin={{ left: -10, right: 10, top: 15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9.5, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9.5, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '11px', backgroundColor: '#0f172a', color: '#fff' }}
                />
                <Area type="monotone" dataKey="MRR" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan subscriptions split */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Plan Distribution</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Share based on subscription volumes</p>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 850, fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-2xl font-black text-indigo-900 tracking-tight">391</span>
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Total Users</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            {planDistribution.map((plan, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: plan.color }} />
                  <span className="text-[11px] text-slate-600 font-semibold tracking-tight">{plan.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">{plan.value} subs</span>
                  <span className="text-[10px] text-slate-500 font-semibold block tracking-wide">{plan.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* COHORT EXPANSION & SUB LOGS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Retention / Cohort expansion logs */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Cohort Retention</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Net Revenue Retention (NRR) index</p>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortData} margin={{ left: -15, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9.5, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9.5, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '11px' }}
                />
                <Bar dataKey="NetExpansion" fill="#a855f7" radius={[5, 5, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Average Monthly Churn:</span>
            <span className="font-sans text-indigo-600 font-bold text-sm">1.16% Churn Rate</span>
          </div>
        </div>

        {/* Live Subscriber Records Table/Deck */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Subscribers</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">Recent customer subscriptions and status</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'enterprise', label: 'Enterprise' },
                { id: 'growth', label: 'Growth' },
                { id: 'basic', label: 'Basic' }
              ].map((subtab) => (
                <button
                  key={subtab.id}
                  onClick={() => setActiveSegment(subtab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer transition-colors ${
                    activeSegment === subtab.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {subtab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subscriptions Grid list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Subscription Plan</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Recurring Price</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Renewal Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/60 last:border-0 group">
                    <td className="py-3.5 font-mono text-xs font-semibold text-indigo-600">
                      {sub.id}
                    </td>
                    <td className="py-3.5 text-sm font-semibold text-slate-900">
                      {sub.customer}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border ${
                        sub.plan.includes('Enterprise') 
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                          : sub.plan.includes('Growth')
                          ? 'bg-purple-50 border-purple-100 text-purple-700'
                          : 'bg-pink-50 border-pink-100 text-pink-700'
                      }`}>
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-xs font-semibold text-slate-700">
                      {sub.amount}
                    </td>
                    <td className="py-3.5 text-xs text-slate-500">
                      {sub.renewal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </motion.div>
  );
};
