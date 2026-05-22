import React, { useState } from 'react';
import { Search, MapPin, User, Phone, Calendar, Clock, Plus, MoreVertical, Filter, TrendingUp, Users, Target, CheckCircle2, AlertCircle, MessageSquare, Map, FileText, ChevronRight, BadgeCheck, IndianRupee, ArrowUpRight, ArrowDownRight, Globe, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useERPData } from '../hooks/useERPData';
import { cn } from '../lib/utils';

const LEAD_STAGES = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'QUOTATION_SENT',
  'NEGOTIATION',
  'ORDER_RECEIVED',
  'CONVERTED'
];

const STAGE_COLORS: Record<string, string> = {
  NEW: 'bg-slate-100 text-slate-600',
  CONTACTED: 'bg-blue-100 text-blue-600',
  INTERESTED: 'bg-amber-100 text-amber-600',
  QUOTATION_SENT: 'bg-purple-100 text-purple-600',
  NEGOTIATION: 'bg-accent-100 text-accent-600',
  ORDER_RECEIVED: 'bg-accent-100 text-accent-600',
  CONVERTED: 'bg-primary-100 text-primary-600',
};

export const CRM: React.FC = () => {
  const { data, loading, refetch } = useERPData();
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'dealers' | 'performance'>('leads');
  const [showAdd, setShowAdd] = useState(false);
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStage, setActiveStage] = useState<string | 'ALL'>('ALL');

  const [isSyncing, setIsSyncing] = useState(false);

  const handleAction = (actionName: string, callback: () => void | Promise<void>) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(async () => {
      await callback();
      setIsSyncing(false);
    }, 100);
  };
  
  const [dealerForm, setDealerForm] = useState({
     company: '', category: 'Tier 1 Dealer', gstin: '', phone: '', email: '', 
     location: '', contactPerson: '', bankDetails: '', status: 'ACTIVE'
  });

  const [form, setForm] = useState({ 
    company: '', 
    category: 'Dealer', 
    location: '', 
    contactPerson: '', 
    phone: '', 
    followUpDate: new Date().toISOString().split('T')[0],
    followUpTime: '10:00',
    requirement: '',
    leadSource: 'Website',
    notes: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setShowAdd(false);
    setForm({ 
      company: '', category: 'Dealer', location: '', contactPerson: '', 
      phone: '', followUpDate: new Date().toISOString().split('T')[0],
      followUpTime: '10:00', requirement: '', leadSource: 'Website', notes: ''
    });
    refetch();
  };

  const handleAddDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/dealers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealerForm)
    });
    setShowAddDealer(false);
    setDealerForm({ 
      company: '', category: 'Tier 1 Dealer', gstin: '', phone: '', 
      email: '', location: '', contactPerson: '', bankDetails: '', status: 'ACTIVE'
    });
    refetch();
  };

  const handleUpdateStatus = async (id: string, stage: string) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: stage })
    });
    refetch();
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    refetch();
  };

  const handleDeleteDealer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return;
    await fetch(`/api/dealers/${id}`, { method: 'DELETE' });
    refetch();
  };

  const handleConvertLead = async (id: string) => {
    if (!confirm('Convert this lead into a certified dealer?')) return;
    await fetch(`/api/leads/convert/${id}`, { method: 'POST' });
    setActiveSubTab('dealers');
    refetch();
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
       <div className="relative">
          <div className="absolute inset-0 bg-primary-600/20 blur-3xl rounded-full animate-pulse"></div>
          <Users size={60} className="text-primary-600 animate-bounce relative z-10" />
       </div>
       <h3 className="mt-10 text-lg font-black italic uppercase tracking-tighter text-slate-900">
          Accessing Lead Database...
       </h3>
       <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 animate-pulse">
          Establishing Secure Node Pipeline
       </p>
    </div>
  );

  const filteredDealers = data?.dealers?.filter((d: any) => 
    d.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = data?.leads.filter((l: any) => {
    const matchesSearch = l.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         l.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = activeStage === 'ALL' || l.status === activeStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className={cn("space-y-6 transition-opacity duration-300", isSyncing && "opacity-50 pointer-events-none")}>
      {isSyncing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
          <div className="bg-primary-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in zoom-in-95">
            <Zap size={20} className="text-accent-400 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Syncing Network Intelligence...</span>
          </div>
        </div>
      )}
      {/* Header & Internal Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mb-4 border border-slate-200 relative z-10 backdrop-blur-sm">
              <button 
                onClick={() => handleAction("View Pipeline", () => setActiveSubTab('leads'))}
                className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95", activeSubTab === 'leads' ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20" : "text-slate-500 hover:text-slate-900")}
              >
                Lead Pipeline
              </button>
              <button 
                onClick={() => handleAction("View Dealers", () => setActiveSubTab('dealers'))}
                className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95", activeSubTab === 'dealers' ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20" : "text-slate-500 hover:text-slate-900")}
              >
                Dealer Registry
              </button>
              <button 
                onClick={() => handleAction("View Analytics", () => setActiveSubTab('performance'))}
                className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95", activeSubTab === 'performance' ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20" : "text-slate-500 hover:text-slate-900")}
              >
                Dealer Performance
              </button>
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
             {activeSubTab === 'leads' ? 'Lead & Opportunity Pipeline' : 
              activeSubTab === 'dealers' ? 'Certified Dealer & Partner Registry' : 
              'Network Intelligence & Performance'}
           </h2>
        </div>
        <div>
            {activeSubTab === 'leads' ? (
              <button onClick={() => handleAction("Add Inquiry", () => setShowAdd(true))} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 flex items-center hover:bg-black transition-all border border-transparent active:scale-95">
                <Plus size={16} className="mr-2 text-primary-400" /> New Inquiry
              </button>
           ) : activeSubTab === 'dealers' ? (
              <button onClick={() => handleAction("Add Partner", () => setShowAddDealer(true))} className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/20 flex items-center hover:bg-primary-700 transition-all border border-transparent active:scale-95">
                <Plus size={16} className="mr-2 text-white/40" /> Register Partner
              </button>
           ) : (
              <div className="flex space-x-3">
                 <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-slate-50 transition-all shadow-sm">
                   <Filter size={16} className="mr-2 text-slate-400" /> Filter Analysis
                 </button>
                 <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 flex items-center hover:bg-black transition-all border border-transparent">
                   <FileText size={16} className="mr-2 text-primary-400" /> Export PDF Report
                 </button>
              </div>
           )}
        </div>
      </div>

      {activeSubTab === 'leads' ? (
        <>
          {/* CRM Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border-slate-100 bg-white border shadow-xl shadow-slate-200/40 transition-all hover:scale-[1.02] cursor-default group">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400 group-hover:text-primary-600 transition-colors">Verified Leads</p>
              <Users size={16} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
           </div>
           <p className="text-3xl font-black text-slate-900">{data?.leads.length || 0}</p>
           <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 w-1/2"></div>
           </div>
        </div>

        <div className="p-5 rounded-xl border-slate-100 bg-white border shadow-xl shadow-slate-200/40 transition-all hover:border-primary-200 hover:scale-[1.02] cursor-default">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiries</p>
              <MessageSquare size={16} className="text-primary-500 opacity-40" />
           </div>
           <p className="text-3xl font-black text-primary-600">
              {data?.leads.filter((l: any) => l.status === 'NEW').length || 0}
           </p>
           <p className="text-[10px] mt-1 font-bold text-slate-400">Awaiting response</p>
        </div>

        <div className="p-5 rounded-xl border-white bg-white border shadow-xl shadow-slate-100 transition-all hover:border-slate-200 hover:scale-[1.02] cursor-default">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Follow-ups</p>
              <Clock size={16} className="text-amber-500 opacity-40" />
           </div>
           <p className="text-3xl font-black text-slate-900">03 <span className="text-sm font-black text-slate-400">TODAY</span></p>
           <p className="text-[10px] mt-1 font-bold text-primary-600">Priority reminders</p>
        </div>

        <div className="p-5 rounded-xl border-white bg-white border shadow-xl shadow-slate-100 transition-all hover:border-primary-200 hover:scale-[1.02] cursor-default">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Win Rate</p>
              <Target size={16} className="text-primary-500 opacity-40" />
           </div>
           <p className="text-3xl font-black text-primary-600">32%</p>
           <p className="text-[10px] mt-1 font-bold text-slate-400">↑ 4% vs Last Month</p>
        </div>

        <div className="p-5 rounded-xl border-none bg-primary-600 text-white shadow-2xl shadow-primary-500/10 transition-all hover:scale-[1.02] cursor-default hidden lg:block">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Dealers</p>
              <BadgeCheck size={16} className="opacity-40" />
           </div>
           <p className="text-3xl font-black">
              {data?.leads.filter((l: any) => l.status === 'CONVERTED').length || 0}
           </p>
           <p className="text-[10px] mt-1 font-bold opacity-80 uppercase tracking-widest">Converted Partners</p>
        </div>
      </div>

      {/* Lead Stage Flow Visualization */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onClick={() => setActiveStage('ALL')}
          className={cn(
            "flex-none px-4 py-2 rounded-xl border text-xs font-bold transition-all",
            activeStage === 'ALL' ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          )}
        >
          All Stages ({data?.leads.length})
        </button>
        {LEAD_STAGES.map((stage) => {
          const count = data?.leads.filter((l:any) => l.status === stage).length || 0;
          return (
            <button 
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={cn(
                "flex-none px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                activeStage === stage ? STAGE_COLORS[stage] + " ring-1 ring-primary-200" : "bg-white text-slate-500 border-slate-200"
              )}
            >
              {stage.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Lead Search & Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center space-x-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by company, person or location..." 
               className="input-field pl-10 h-10 py-0" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Lead / Company Info</th>
                <th className="px-6 py-4">Location & Source</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4">Next Follow-up</th>
                <th className="px-6 py-4">Current Stage</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads?.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-sm mr-3">
                          {lead.company[0]}
                       </div>
                       <div>
                          <p className="font-bold text-sm text-slate-900">{lead.company}</p>
                          <div className="flex items-center text-[10px] text-slate-500 mt-0.5">
                             <User size={10} className="mr-1" /> {lead.contactPerson} | <Phone size={10} className="mx-1" /> {lead.phone}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="flex items-center text-xs text-slate-600">
                           <MapPin size={10} className="mr-1 text-slate-400" /> {lead.location}
                        </span>
                        <span className="text-[10px] font-bold text-primary-600 mt-1 uppercase">{lead.leadSource} / {lead.category}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-xs text-slate-600 line-clamp-1 italic">{lead.requirement || 'No specific requirements noted.'}</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <div className="flex items-center text-xs font-bold text-amber-600">
                           <Calendar size={12} className="mr-1" /> {lead.followUpDate}
                        </div>
                        <div className="flex items-center text-[10px] text-slate-400">
                           <Clock size={10} className="mr-1" /> {lead.followUpTime}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <select 
                       className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer", STAGE_COLORS[lead.status])}
                       value={lead.status}
                       onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                     >
                        {LEAD_STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                     </select>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                          title="WhatsApp/Message" 
                          className="p-1.5 text-slate-400 hover:text-accent-600 bg-white border border-slate-100 rounded-lg transition-all shadow-sm"
                        >
                           <MessageSquare size={14} />
                        </button>
                        <button 
                           onClick={() => handleConvertLead(lead.id)}
                           title="Convert to Dealer" 
                           className={cn("p-1.5 text-slate-400 hover:text-accent-600 bg-white border border-slate-100 rounded-lg transition-all shadow-sm", lead.status === 'CONVERTED' ? 'hidden' : '')}
                        >
                           <BadgeCheck size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead.id)}
                          title="Delete Lead" 
                          className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-lg transition-all shadow-sm"
                        >
                           <AlertCircle size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredLeads?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No leads found in this stage.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      ) : activeSubTab === 'dealers' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
           {/* Dealer Search & Table */}
           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 border-b flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search dealers by name, person or GSTIN..." 
                    className="input-field pl-10 h-10 py-0" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Dealer / Business Info</th>
                     <th className="px-6 py-4">Contact & Location</th>
                     <th className="px-6 py-4">Business Details (GSTIN)</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredDealers?.map((dealer: any) => (
                     <tr key={dealer.id} className="hover:bg-slate-50 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center font-bold text-sm mr-3">
                               {dealer.company[0]}
                            </div>
                            <div>
                               <p className="font-bold text-sm text-slate-900">{dealer.company}</p>
                               <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{dealer.category}</span>
                            </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-900">{dealer.contactPerson}</span>
                             <span className="text-[10px] text-slate-500 mt-0.5">{dealer.phone} • {dealer.email}</span>
                             <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase truncate max-w-[200px]">{dealer.location}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-900 font-mono">GST: {dealer.gstin}</span>
                             <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">A/C: {dealer.bankDetails || 'Not Provided'}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={cn(
                             "text-[10px] font-black uppercase px-3 py-1 rounded-full",
                             dealer.status === 'ACTIVE' ? "bg-accent-50 text-accent-700" : "bg-slate-100 text-slate-500"
                          )}>
                             {dealer.status}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                             <button 
                               onClick={() => alert(`Banking Details for ${dealer.company}:\n${dealer.bankDetails}`)}
                               className="p-2 text-slate-400 hover:text-accent-600 transition-colors bg-white border border-slate-100 rounded-lg"
                             >
                                <FileText size={16} />
                             </button>
                             <button 
                               onClick={() => handleDeleteDealer(dealer.id)}
                               className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-100 rounded-lg"
                             >
                                <AlertCircle size={16} />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* PERFORMANCE DASHBOARD */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'AVG Dealer Score', value: '88/100', trend: '+2 vs last period', icon: Target, trendUp: true },
                { label: 'Active Network', value: data?.dealers?.length || 242, trend: '+12 vs last period', icon: Globe, trendUp: true },
                { label: 'Total Sales Value', value: '₹2.2Cr', trend: '+18% vs last period', icon: IndianRupee, trendUp: true },
                { label: 'Return Ratio', value: '0.4%', trend: '-0.1% vs last period', icon: TrendingUp, trendUp: false }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/40 group hover:border-accent-400/30 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-primary-950 group-hover:text-accent-400 transition-colors">
                         <stat.icon size={18} />
                      </div>
                   </div>
                   <p className="text-4xl font-black text-[#111827] tracking-tight italic">{stat.value}</p>
                   <p className={cn(
                     "text-[10px] mt-4 font-black flex items-center uppercase tracking-widest",
                     stat.trendUp ? "text-accent-600" : "text-amber-500"
                   )}>
                      {stat.trendUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                      {stat.trend}
                   </p>
                </div>
              ))}
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-xl font-black text-[#111827] tracking-tight italic uppercase">Top Dealer Sales Distribution</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational intelligence across primary hubs</p>
                 </div>
                 <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {['7D', '30D', '90D', '1Y'].map(d => (
                       <button key={d} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black transition-all", d === '30D' ? "bg-primary-950 text-white" : "text-slate-400 hover:text-slate-900")}>
                          {d}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                       { name: 'AutoPower', value: 4500000 },
                       { name: 'Bright Bat', value: 1200000 },
                       { name: 'Industrial', value: 2800000 },
                       { name: 'Energy Sol', value: 3100000 },
                       { name: 'Apex Grid', value: 1800000 }
                    ]}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                         tickFormatter={(v) => `₹${v/100000}L`}
                       />
                       <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                       />
                       <Bar 
                         dataKey="value" 
                         fill="#db2777" 
                         radius={[8, 8, 0, 0]} 
                         barSize={60}
                       />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                 <h3 className="text-sm font-black text-[#111827] tracking-widest uppercase mb-6 flex items-center">
                    <BadgeCheck size={16} className="mr-2 text-accent-500" /> Critical Network Alerts
                 </h3>
                 <div className="space-y-4">
                    {[
                       { dealer: 'AutoPower Solutions', alert: 'Low inventory sync lag (4h+)', priority: 'HIGH' },
                       { dealer: 'Bright Bat Systems', alert: 'Warranty claim spike detected', priority: 'MEDIUM' },
                       { dealer: 'Energy Sol Hub', alert: 'Payment reconciliation pending', priority: 'LOW' }
                    ].map((alert, i) => (
                       <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-accent-200 transition-all">
                          <div>
                             <p className="text-xs font-black text-slate-900">{alert.dealer}</p>
                             <p className="text-[10px] font-bold text-slate-500 italic mt-0.5">{alert.alert}</p>
                          </div>
                          <span className={cn(
                             "text-[8px] font-black px-2 py-1 rounded-lg border",
                             alert.priority === 'HIGH' ? "text-red-500 border-red-100 bg-red-50" : "text-amber-500 border-amber-100 bg-amber-50"
                          )}>
                             {alert.priority}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group hover:border-primary-200 transition-all">
                 <div className="absolute top-0 right-0 p-12 text-primary-50 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <TrendingUp size={240} />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-sm font-black text-primary-600 tracking-widest uppercase mb-6 flex items-center">
                       <Zap size={16} className="mr-2" /> Strategic Insight
                    </h3>
                    <p className="text-2xl font-black italic leading-tight tracking-tight max-w-md text-slate-900">
                       Your Tier-1 network has shown <span className="text-primary-600 underline decoration-primary-600/20 underline-offset-4">24% growth</span> in the North-Indian territory. 
                    </p>
                    <p className="text-sm font-bold text-slate-500 mt-4 leading-relaxed text-slate-400">
                       Recommend prioritizing stock allocation for 'SuperFlow' series to AutoPower & Energy Sol as they approach peak sell-through capacity.
                    </p>
                    <button className="mt-8 px-8 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all">
                       Review Territory Map
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Lead Sidebar Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-400/40 backdrop-blur-sm flex justify-end z-50 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
              {/* ... existing lead form ... */}
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">New lead Inquiry</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Capture initial requirement and follow-up plan.</p>
                 </div>
                 <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <AlertCircle size={20} className="text-slate-400" />
                 </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAction("Saving Inquiry", () => handleAdd(e)); }} className="p-6 space-y-6">
                 {/* Lead form contents */}
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Lead Information</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company / Entity Name</label>
                          <input required className="input-field rounded-xl font-bold text-[#111827]" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g. Modern EV Solutions" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entity Category</label>
                          <select className="input-field rounded-xl font-bold text-[#111827]" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                             <option>Dealer</option>
                             <option>Distributor</option>
                             <option>OEM</option>
                             <option>Retail</option>
                             <option>Sub Dealer</option>
                             <option>Other</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Source</label>
                          <select className="input-field rounded-xl font-bold text-[#111827]" value={form.leadSource} onChange={e => setForm({...form, leadSource: e.target.value})}>
                             <option>Website</option>
                             <option>Exhibition</option>
                             <option>Cold Call</option>
                             <option>Referral</option>
                             <option>Indiamart / B2B</option>
                             <option>Social Media</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Primary Contact</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Person</label>
                          <input required className="input-field rounded-xl font-bold text-[#111827]" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} placeholder="Full Name" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile / WhatsApp</label>
                          <input required className="input-field rounded-xl font-bold text-[#111827]" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 XXXX" />
                       </div>
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location / Territory</label>
                          <input required className="input-field rounded-xl font-bold text-[#111827]" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, State" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Follow-up Automation</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Follow-up Date</label>
                          <input required type="date" className="input-field rounded-xl font-bold" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Follow-up Time</label>
                          <input required type="time" className="input-field rounded-xl font-bold" value={form.followUpTime} onChange={e => setForm({...form, followUpTime: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Specific Requirement</label>
                          <textarea className="input-field rounded-xl h-20 py-3 font-medium text-[#111827]" value={form.requirement} onChange={e => setForm({...form, requirement: e.target.value})} placeholder="e.g. Needs 100Ah battery for 2-wheelers..." />
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 sticky bottom-0 bg-white pb-6">
                    <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all">
                       Create Inquiry & Set Reminder
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Add Dealer Sidebar Modal */}
      {showAddDealer && (
        <div className="fixed inset-0 bg-slate-900/60 flex justify-end z-50 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-[#111827] tracking-tight italic">Register Certified Dealer</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Business & Compliance Records</p>
                 </div>
                 <button onClick={() => setShowAddDealer(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <AlertCircle size={20} className="text-slate-400" />
                 </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAction("Saving Partner", () => handleAddDealer(e)); }} className="p-6 space-y-6">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Business Identity</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business / Dealer Name</label>
                          <input required className="input-field rounded-xl font-bold" value={dealerForm.company} onChange={e => setDealerForm({...dealerForm, company: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business Category</label>
                          <select className="input-field rounded-xl font-bold" value={dealerForm.category} onChange={e => setDealerForm({...dealerForm, category: e.target.value})}>
                             <option>Tier 1 Dealer</option>
                             <option>Tier 2 Dealer</option>
                             <option>Sub-Dealer</option>
                             <option>Certified Service Center</option>
                             <option>Exclusive Showroom</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GSTIN (Compliance)</label>
                          <input required className="input-field rounded-xl font-mono uppercase font-bold" value={dealerForm.gstin} onChange={e => setDealerForm({...dealerForm, gstin: e.target.value})} placeholder="24AAAAA0000A1Z5" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Contact & Logistical Info</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Contact</label>
                          <input required className="input-field rounded-xl font-bold" value={dealerForm.contactPerson} onChange={e => setDealerForm({...dealerForm, contactPerson: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                          <input required className="input-field rounded-xl font-bold" value={dealerForm.phone} onChange={e => setDealerForm({...dealerForm, phone: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                          <input required type="email" className="input-field rounded-xl font-bold" value={dealerForm.email} onChange={e => setDealerForm({...dealerForm, email: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Business Address</label>
                          <textarea required className="input-field rounded-xl h-20 font-medium" value={dealerForm.location} onChange={e => setDealerForm({...dealerForm, location: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest border-l-4 border-primary-600 pl-3">Banking & Credits</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Account & IFSC</label>
                          <input className="input-field rounded-xl font-bold" value={dealerForm.bankDetails} onChange={e => setDealerForm({...dealerForm, bankDetails: e.target.value})} placeholder="HDFC Bank... A/C: ..." />
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 sticky bottom-0 bg-white pb-6">
                    <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-700 transition-all">
                       Complete Dealer Registration
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
