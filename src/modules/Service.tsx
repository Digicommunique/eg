import React, { useState } from 'react';
import { 
  Wrench, AlertCircle, Clock, CheckCircle2, ChevronRight, Search, 
  Filter, User, FileText, ClipboardList, Package, Activity, 
  MoreVertical, ArrowLeft, PenTool as Tool, Play, CheckCircle, Zap,
  ShieldCheck, ShieldAlert, BarChart3, Star, TrendingUp, Users,
  Microscope, Settings, HelpCircle, HardDrive, Cpu, Droplets, ZapOff
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export const Service: React.FC = () => {
  const { data, loading, refetch } = useERPData();
  const [view, setView] = useState<'dashboard' | 'detail' | 'analytics'>('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [updateForm, setUpdateForm] = useState({ stage: '', rootCause: '', notes: '', engineer: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAction = (actionName: string, callback: () => void | Promise<void>) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(async () => {
      await callback();
      setIsSyncing(false);
    }, 100);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Wrench className="animate-spin text-primary-600 mb-6" size={48} />
      <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Initializing Service Intelligence Node...</span>
    </div>
  );

  const complaints = data?.complaints || [];
  const engineers = data?.engineers || [];
  const failureCats = data?.failureCategories || [];

  // KPI Calculations
  const openComplaints = complaints.filter((c: any) => c.status === 'OPEN').length;
  const pendingRepairs = complaints.filter((c: any) => ['REGISTERED', 'RECEIVED', 'UNDER_INSPECTION', 'REPAIR_STARTED'].includes(c.stage)).length;
  const readyDispatch = complaints.filter((c: any) => c.stage === 'READY_FOR_DISPATCH' || c.stage === 'QC_PASSED').length;
  const closedCases = complaints.filter((c: any) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  
  // Failure Analytics Data
  const failureData = failureCats.map(cat => ({
     name: cat,
     value: complaints.filter(c => c.rootCause === cat).length
  })).filter(d => d.value > 0);

  const COLORS = ['#0891b2', '#0284c7', '#d97706', '#dc2626', '#7c3aed'];

  const handleUpdate = async () => {
    if (!selectedComplaint) return;
    await fetch(`/api/complaints/${selectedComplaint.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          ...updateForm,
          status: (updateForm.stage === 'CLOSED' || updateForm.stage === 'DELIVERED') ? 'RESOLVED' : 'OPEN',
          resolvedDate: (updateForm.stage === 'CLOSED' || updateForm.stage === 'DELIVERED') ? new Date().toISOString().split('T')[0] : selectedComplaint.resolvedDate
      })
    });
    setView('dashboard');
    refetch();
  };

  return (
    <div className={cn("space-y-12 pb-20 transition-all duration-500", isSyncing && "opacity-50 blur-[1px]")}>
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Service Operations</h2>
          <div className="flex items-center mt-2 space-x-4">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <Tool size={14} className="mr-2 text-primary-600" /> LifeCycle Maintenance Node
             </p>
             <span className="h-1 w-1 rounded-full bg-slate-300"></span>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Open Tickets: {openComplaints}
             </p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200 backdrop-blur-md">
            {[
              { id: 'dashboard', label: 'Monitor', icon: Activity },
              { id: 'analytics', label: 'Failure Analysis', icon: Microscope },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleAction(`Switch to ${tab.label}`, () => setView(tab.id as any))}
                className={cn(
                  "flex items-center px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  view === tab.id ? "bg-primary-600 text-white shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-400"
                )}
              >
                <tab.icon size={14} className="mr-2" />
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {view === 'dashboard' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            {/* KPI Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: 'Open Complaints', value: openComplaints, icon: AlertCircle, color: 'text-amber-600', note: 'Priority Grid' },
                 { label: 'Pending Repairs', value: pendingRepairs, icon: Tool, color: 'text-blue-600', note: 'In-Circuit' },
                 { label: 'Dispatch Ready', value: readyDispatch, icon: Package, color: 'text-emerald-600', note: 'QC Passed' },
                 { label: 'Closed Ledger', value: closedCases, icon: CheckCircle2, color: 'text-primary-600', note: 'Finalized' }
               ].map((kpi, i) => (
                 <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer shadow-xl shadow-slate-200/50">
                    <div className={cn("absolute -right-4 -top-4 opacity-[0.05] group-hover:opacity-10 transition-all", kpi.color)}>
                       <kpi.icon size={120} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                    <p className="text-5xl font-black text-slate-900 italic tracking-tighter mb-4">{kpi.value}</p>
                    <span className={cn("px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest", kpi.color, "bg-slate-50 border border-slate-100")}>
                       {kpi.note}
                    </span>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Left: Complaints List */}
               <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-2xl flex flex-col min-h-[600px] shadow-slate-200/50">
                  <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Live Service Pool</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic decoration-primary-500 decoration-2 underline underline-offset-4">RMA Processing Nodes</p>
                     </div>
                     <div className="bg-slate-100 p-2 rounded-2xl flex items-center border border-slate-200">
                        <Search size={18} className="text-slate-400 ml-2" />
                        <input className="bg-transparent border-none text-[10px] font-black text-slate-900 placeholder-slate-400 outline-none w-40 uppercase tracking-widest px-4" placeholder="SCRUTINY FILTER..." />
                     </div>
                  </div>
                  <div className="overflow-x-auto flex-1 font-mono">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                           <tr>
                              <th className="px-10 py-6">Complaint Node</th>
                              <th className="px-10 py-6">Serial / Axis</th>
                              <th className="px-10 py-6">Stage</th>
                              <th className="px-10 py-6 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {complaints.slice().reverse().map((c: any) => (
                              <tr key={c.id} className="hover:bg-slate-50 transition-all group duration-300">
                                 <td className="px-10 py-8">
                                    <p className="text-[14px] font-black text-slate-900 uppercase tracking-widest leading-none group-hover:text-primary-600 transition-colors">{c.id}</p>
                                    <p className="text-[9px] text-slate-400 font-black uppercase mt-3 tracking-widest flex items-center">
                                       <Clock size={12} className="mr-1.5" /> {c.date}
                                    </p>
                                 </td>
                                 <td className="px-10 py-8">
                                    <p className="text-[11px] font-black text-slate-700 tracking-[0.2em] mb-1.5">{c.serial}</p>
                                    <div className="flex items-center space-x-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.type}</span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <span className={cn(
                                       "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center w-fit",
                                       c.status === 'RESOLVED' || c.status === 'CLOSED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                    )}>
                                       {c.stage.replace('_', ' ')}
                                    </span>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <button 
                                      onClick={() => { setSelectedComplaint(c); setUpdateForm({ stage: c.stage, rootCause: c.rootCause || '', notes: c.notes, engineer: c.engineer }); setView('detail'); }}
                                      className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary-600 hover:bg-primary-50 transition-all active:scale-90 border border-slate-100"
                                    >
                                       <ChevronRight size={20} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Right: Engineer Matrix */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none"></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic flex items-center uppercase tracking-tight mb-10">
                       <Users className="mr-3 text-primary-600" /> Technician Efficiency
                    </h3>
                    <div className="space-y-6">
                       {engineers.map((e: any) => (
                          <div key={e.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-primary-100 transition-all">
                             <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center font-black text-primary-600 border border-slate-100">{e.name[0]}</div>
                                <div>
                                   <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{e.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">TAT: {e.avgTat} Days</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-xl font-black text-slate-900 italic tracking-tighter">{e.casesSolved}</p>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">SOLVED</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                  <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Unit Recovery KPI</p>
                     <p className="text-5xl font-black text-slate-900 tracking-tighter italic underline decoration-primary-500 decoration-4">98.4%</p>
                  </div>
               </div>
            </div>
        </div>
      ) : view === 'analytics' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden relative shadow-slate-200/50">
                 <h3 className="text-2xl font-black text-slate-900 italic flex items-center uppercase tracking-tight mb-12">
                    <Microscope size={24} className="mr-4 text-primary-600" /> Root Cause Breakdown
                 </h3>
                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={failureData}
                            cx="50%"
                            cy="50%"
                            innerRadius={100}
                            outerRadius={140}
                            paddingAngle={8}
                            dataKey="value"
                          >
                             {failureData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', fontWeight: 900, color: '#0f172a' }}
                          />
                          <Legend />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 italic">Failure Categorization Matrix</h4>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { id: 'cell', label: 'Cell Failure', icon: Cpu, color: 'text-red-600', bColor: 'bg-red-50' },
                         { id: 'bms', label: 'BMS Failure', icon: Zap, color: 'text-amber-600', bColor: 'bg-amber-50' },
                         { id: 'charger', label: 'Charger Node Fault', icon: Settings, color: 'text-blue-600', bColor: 'bg-blue-50' },
                         { id: 'water', label: 'External Water Damage', icon: Droplets, color: 'text-cyan-600', bColor: 'bg-cyan-50' },
                         { id: 'drop', label: 'Voltage Drop Delta', icon: ZapOff, color: 'text-purple-600', bColor: 'bg-purple-50' }
                       ].map((cat) => {
                          const count = complaints.filter(c => c.rootCause === cat.label).length;
                          return (
                             <div key={cat.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-all">
                                <div className="flex items-center space-x-6">
                                   <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border", cat.color, cat.bColor, "border-slate-100 group-hover:scale-110 transition-transform duration-500")}>
                                      <cat.icon size={22} />
                                   </div>
                                   <div>
                                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest">{cat.label}</p>
                                      <div className="w-32 h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                         <div className={cn("h-full", cat.color.replace('text', 'bg'))} style={{ width: `${(count / complaints.length) * 100}%` }}></div>
                                      </div>
                                   </div>
                                </div>
                                <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{count}</p>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-500 space-y-12">
            <button 
              onClick={() => handleAction("Return to Monitor", () => setView('dashboard'))} 
              className="flex items-center text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] transition-all bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-100"
            >
               <ArrowLeft size={16} className="mr-2" /> DISCARD DIAGNOSTIC VIEW
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-8">
                  {/* Service Ticket Detail */}
                  <div className="bg-white rounded-[4rem] p-12 border border-slate-100 relative overflow-hidden shadow-4xl shadow-slate-200/50 group">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000 text-slate-900">
                        <Wrench size={240} />
                     </div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-16">
                           <div>
                              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic block mb-3">Diagnostic Artifact Control Unit</span>
                              <h3 className="text-6xl font-black text-slate-900 italic tracking-tighter leading-none">{selectedComplaint.id}</h3>
                              <div className="flex items-center mt-6 space-x-6">
                                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">SER_REF: {selectedComplaint.serial}</p>
                                 <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                 <p className="text-[12px] font-black text-primary-600 uppercase tracking-[0.2em] italic">{selectedComplaint.type}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Registration Dt.</p>
                              <p className="text-2xl font-black text-slate-900 italic underline decoration-primary-500 decoration-2 underline-offset-8">{selectedComplaint.date}</p>
                           </div>
                        </div>

                        {/* Visual Stage Roadmap */}
                        <div className="flex items-center justify-between relative px-2 mb-12">
                           <div className="absolute h-0.5 w-full bg-slate-100 top-6 left-0"></div>
                           {data.serviceStages.map((stage: string, idx: number) => {
                              const currentIdx = data.serviceStages.indexOf(selectedComplaint.stage);
                              const isCompleted = idx <= currentIdx;
                              const isCurrent = idx === currentIdx;
                              return (
                                 <div key={stage} className="relative z-10 flex flex-col items-center group/stage">
                                    <div className={cn(
                                       "h-12 w-12 rounded-[1.25rem] border-2 flex items-center justify-center transition-all duration-700 font-black text-[10px]",
                                       isCurrent ? "bg-primary-600 border-primary-400 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] scale-110" :
                                       isCompleted ? "bg-primary-50 border-primary-200 text-primary-600" : "bg-white border-slate-100 text-slate-200"
                                    )}>
                                       {isCompleted && !isCurrent ? <CheckCircle size={18} /> : (idx + 1)}
                                    </div>
                                    <p className={cn(
                                       "absolute top-16 text-[7px] font-black uppercase tracking-tighter whitespace-nowrap transition-all",
                                       isCurrent ? "text-slate-900 opacity-100" : "text-slate-300 opacity-40 group-hover/stage:opacity-100"
                                    )}>
                                       {stage.replace('_', ' ')}
                                    </p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Technical Analysis Data */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-white p-10 rounded-[3rem] border border-slate-100 border-dashed group shadow-lg shadow-slate-200/50">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center">
                           <HelpCircle size={14} className="mr-2" /> Symptom Description
                        </h4>
                        <p className="text-sm font-black text-slate-900 leading-relaxed italic group-hover:text-primary-600 transition-colors">"{selectedComplaint.notes}"</p>
                     </div>
                     <div className="bg-primary-50/30 p-10 rounded-[3rem] border border-primary-100 border-dashed group shadow-lg shadow-slate-200/50">
                        <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-6 flex items-center">
                           <Settings size={14} className="mr-2" /> Engineering Observations
                        </h4>
                        <p className="text-sm font-black text-slate-900 leading-relaxed italic">Technician {selectedComplaint.engineer} is actively scrutinizing the circuit matrix and cell chemistry for potential delta drift.</p>
                     </div>
                  </div>
               </div>

               {/* Command Sidebar */}
               <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-8">
                     <h3 className="text-xl font-black text-slate-900 italic uppercase mb-10 tracking-tight">Diagnostic Command</h3>
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Stage</label>
                           <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 italic uppercase focus:ring-1 focus:ring-primary-500 outline-none transition-all cursor-pointer"
                              value={updateForm.stage}
                              onChange={e => setUpdateForm({ ...updateForm, stage: e.target.value })}
                           >
                              {data.serviceStages.map((s: string) => <option key={s} value={s} className="bg-white">{s.replace('_', ' ')}</option>)}
                           </select>
                        </div>

                        <div className="space-y-3 pb-8 border-b border-slate-100">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Root Cause Matrix (RCA)</label>
                           <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 italic uppercase focus:ring-1 focus:ring-primary-500 outline-none transition-all cursor-pointer"
                              value={updateForm.rootCause}
                              onChange={e => setUpdateForm({ ...updateForm, rootCause: e.target.value })}
                           >
                              <option value="" className="bg-white">PENDING SCRUTINY</option>
                              {failureCats.map((f: string) => <option key={f} value={f} className="bg-white">{f}</option>)}
                           </select>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Field Notes</label>
                           <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-xs font-black text-slate-900 italic focus:ring-1 focus:ring-primary-500 outline-none transition-all h-32 resize-none placeholder:text-slate-300" 
                              placeholder="Commit diagnostic observations..."
                              value={updateForm.notes}
                              onChange={e => setUpdateForm({ ...updateForm, notes: e.target.value })}
                           />
                        </div>

                        <button 
                           onClick={handleUpdate}
                           className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center font-bold"
                        >
                           Update Node State <ChevronRight size={18} className="ml-2" />
                        </button>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center group hover:bg-slate-50 transition-all cursor-crosshair shadow-lg shadow-slate-200/50">
                     <div className="h-14 w-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 mr-6 shadow-xl shadow-primary-500/5 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={32} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Integrity Lock</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Standardized RMA Protocol Active</p>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};
