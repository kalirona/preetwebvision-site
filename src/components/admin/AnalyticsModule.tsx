import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';

interface AnalyticsModuleProps {
  leads: any[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ leads }) => {
  // Process leads for monthly growth
  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const data = months.map(month => ({ name: month, leads: 0 }));

    leads.forEach(lead => {
      const date = new Date(lead.timestamp);
      if (date.getFullYear() === currentYear) {
        data[date.getMonth()].leads += 1;
      }
    });

    return data;
  }, [leads]);

  // Process leads for service interest
  const serviceData = React.useMemo(() => {
    const services: Record<string, number> = {};
    leads.forEach(lead => {
      const service = lead.service_interest || 'General';
      services[service] = (services[service] || 0) + 1;
    });

    return Object.entries(services).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // Process leads for source tracking
  const sourceData = React.useMemo(() => {
    const sources: Record<string, number> = {};
    leads.forEach(lead => {
      let source = 'Direct';
      if (lead.source) {
        if (lead.source.includes('google')) source = 'Google';
        else if (lead.source.includes('facebook')) source = 'Facebook';
        else if (lead.source.includes('linkedin')) source = 'LinkedIn';
        else if (lead.source.includes('twitter')) source = 'Twitter';
        else if (lead.source.length > 10) source = 'Referral';
      }
      sources[source] = (sources[source] || 0) + 1;
    });

    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Growth Velocity', value: '+24%', icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Pipeline', value: leads.length, icon: <Users size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Conversion Goal', value: '15%', icon: <Target size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'System Health', value: '99.9%', icon: <Activity size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Per Month */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-8">Inbound Velocity (Monthly)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                />
                <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Requested Services */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-8">Service Market Share</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 ml-4">
               {serviceData.map((item, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{item.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-8 border border-slate-100 rounded-3xl shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-8">Acquisition Channels</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
