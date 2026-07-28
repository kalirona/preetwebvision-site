import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Filter, CheckCircle, AlertTriangle, XCircle, Search, HelpCircle, User, Plus, Edit2, Link, Save, X, Phone, Mail } from 'lucide-react';

interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service_type: string;
  status: string;
  message: string;
  google_link?: string;
}

export const BookingsModule = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);
  const [formData, setFormData] = React.useState<Booking>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service_type: 'discovery-call',
    status: 'PENDING',
    message: '',
    google_link: ''
  });
  
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const fetchBookings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setBookings(prev => prev.map(bk => bk.id === id ? { ...bk, status: newStatus } : bk));
        setActionSuccess("Status updated successfully.");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setEditingBooking(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service_type: 'discovery-call',
      status: 'PENDING',
      message: '',
      google_link: ''
    });
    setIsFormOpen(true);
    setActionError(null);
  };

  const handleEdit = (bk: Booking) => {
    setEditingBooking(bk);
    setFormData(bk);
    setIsFormOpen(true);
    setActionError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const token = localStorage.getItem('adminToken');
    try {
      const isEdit = !!editingBooking?.id;
      const url = isEdit ? `/api/bookings/${editingBooking.id}` : '/api/bookings';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setActionSuccess(`Booking scheduled and ${isEdit ? 'updated' : 'inserted'} successfully.`);
        setIsFormOpen(false);
        fetchBookings();
      } else {
        const data = await response.json();
        setActionError(data.error || "Failed to commit appointment slot.");
      }
    } catch (err) {
      setActionError("Unexpected networking issue occurred.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'COMPLETED': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 hover:bg-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredBookings = bookings.filter(bk => {
    const query = search.toLowerCase();
    const nameMatch = bk.name?.toLowerCase().includes(query) || false;
    const emailMatch = bk.email?.toLowerCase().includes(query) || false;
    const idMatch = bk.id?.toLowerCase().includes(query) || false;
    const matchesSearch = nameMatch || emailMatch || idMatch;
    const matchesFilter = statusFilter === 'ALL' || bk.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 font-sans"
    >
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Schedule', value: bookings.length, icon: <Calendar size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Slots', value: bookings.filter(b => b.status === 'PENDING').length, icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Confirmed Audits', value: bookings.filter(b => b.status === 'CONFIRMED').length, icon: <CheckCircle size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Attached Google Calendar', value: bookings.filter(b => b.google_link).length, icon: <Link size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Appointments Register</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">Manage booked digital consultations, Google Meets & design audits</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md active:scale-95 cursor-pointer font-sans"
        >
          <Plus size={16} /> Add Appointment Slot
        </button>
      </div>

      {/* Global Action Messages */}
      {(actionError || actionSuccess) && (
        <div className="p-4 rounded-2xl border text-xs font-semibold uppercase tracking-wider flex justify-between items-center bg-white">
          <span className={actionError ? "text-red-650" : "text-green-600"}>
            {actionError || actionSuccess}
          </span>
          <button onClick={() => { setActionError(null); setActionSuccess(null); }} className="text-slate-450 hover:text-slate-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Slide-out/Toggleable Inline Form to Add & Edit Booking */}
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
                <Calendar size={16} className="text-indigo-650" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 font-sans">
                  {editingBooking ? `Edit Slot Details: ${editingBooking.id}` : "Schedule a Client Appointment"}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Client Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sandra Bullock"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Client Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sandra@hollywood.com"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2 block">Client Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 555-0140"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white text-indigo-700"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block">Appointment Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block">Audited Service Type</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-[11px] font-black uppercase focus:outline-none focus:bg-white text-slate-700"
                  >
                    <option value="discovery-call">Discovery Web Call</option>
                    <option value="wordpress-design">WordPress Engineering Audit</option>
                    <option value="shopify-development">Shopify Store Optimization</option>
                    <option value="enterprise-ecommerce">Enterprise eCommerce Migration</option>
                    <option value="lead-generation">Lead Pipeline Setup</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block">Current Node Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-[11px] font-black uppercase focus:outline-none focus:bg-white text-slate-700"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block flex items-center gap-1.5">
                  <Link size={12} className="text-indigo-505" /> Google Calendar External joining Link (Meet / Share invite)
                </label>
                <input
                  type="url"
                  value={formData.google_link || ''}
                  onChange={(e) => setFormData({ ...formData, google_link: e.target.value })}
                  placeholder="https://meet.google.com/abc-defg-hij  or https://calendar.google.com/calendar/event?eid=..."
                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all focus:bg-white font-mono text-indigo-700"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-440 mb-2 block mb-2 font-black uppercase text-slate-400">Brief Message Notes</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Paste details of target growth outline requirements or comments copy..."
                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-505 rounded-xl p-4 text-xs font-semibold focus:outline-none transition-all focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-850 shadow transition-all cursor-pointer"
                >
                  <Save size={14} /> Schedule Booking
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-4 bg-slate-100 border border-slate-205 text-slate-705 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-450">Active Appointments</h3>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={16} />
            <input 
              type="text" 
              placeholder="Filter clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-xs font-bold focus:outline-none focus:border-indigo-500 w-full md:w-64" 
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-100 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-600 focus:outline-none focus:border-indigo-505"
          >
            <option value="ALL">All States</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100">
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date/Time</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Identity</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Brief Message & Integrations</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                 <td colSpan={6} className="px-8 py-16 text-center text-slate-500 font-medium">Refreshing scheduling register...</td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                 <td colSpan={6} className="px-8 py-16 text-center text-slate-500 font-medium">No bookings registered in database.</td>
              </tr>
            ) : filteredBookings.map((bk) => (
              <tr key={bk.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4 font-mono text-xs font-semibold text-indigo-600">{bk.id}</td>
                <td className="px-8 py-4">
                  <div className="text-xs font-semibold text-slate-900 mb-1">{bk.date}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium"><Clock size={12} className="text-slate-400" /> {bk.time}</div>
                </td>
                <td className="px-8 py-4">
                  <p className="font-bold text-slate-900 text-sm">{bk.name}</p>
                  <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-500">
                    <span className="hover:text-indigo-600 flex items-center gap-1"><Mail size={11} /> {bk.email}</span>
                    {bk.phone && <span className="flex items-center gap-1"><Phone size={11} /> {bk.phone}</span>}
                  </div>
                </td>
                <td className="px-8 py-4">
                   <p className="text-xs text-slate-600 max-w-sm line-clamp-2 leading-relaxed mb-2">
                     "{bk.message || 'No additional project requirements listed.'}"
                   </p>
                   {/* Google Attachment Indicator block */}
                   {bk.google_link ? (
                     <a 
                       href={bk.google_link} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-55 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[11px] font-medium"
                     >
                       <Clock size={10} /> Connected Google Calendar / Meet Link
                     </a>
                   ) : (
                     <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Google Calendar link not attached</span>
                   )}
                </td>
                <td className="px-8 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full leading-none transition-all ${getStatusStyle(bk.status)}`}>
                    {bk.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                   <div className="flex items-center gap-3">
                     <select 
                       value={bk.status}
                       onChange={(e) => handleUpdateStatus(bk.id!, e.target.value)}
                       className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                     >
                       <option value="PENDING">PENDING</option>
                       <option value="CONFIRMED">CONFIRMED</option>
                       <option value="COMPLETED">COMPLETED</option>
                       <option value="CANCELLED">CANCELLED</option>
                     </select>
                     <button
                       onClick={() => handleEdit(bk)}
                       className="p-2 border border-slate-150 hover:border-indigo-500 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer bg-white"
                       title="Edit / Attach Google Link"
                     >
                       <Edit2 size={12} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
