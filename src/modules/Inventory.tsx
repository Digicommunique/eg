import React, { useState } from 'react';
import { 
  Package, Search, Filter, Plus, ChevronRight, AlertTriangle, 
  ArrowUpRight, Download, History, BarChart3, Tag, Warehouse,
  Activity, ShieldCheck, Zap, Layers, Microscope, QrCode, Trash2,
  Database, Boxes, Thermometer, Beaker, TrendingUp, Calendar, MapPin
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { cn, formatCurrency } from '../lib/utils';
import { useAuthStore, UserRole } from '../store/authStore';

export const Inventory: React.FC = () => {
  const { user } = useAuthStore();
  const { data, loading, refetch } = useERPData();
  const [activeTab, setActiveTab] = useState<'raw' | 'graded' | 'warehouse'>('raw');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Database className="animate-pulse text-primary-500 mb-6" size={48} />
      <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Calibrating Material Matrix Data...</span>
    </div>
  );

  const inventory = data?.inventory || [];
  const gradedCells = data?.gradedInventory || [];
  const warehouses = data?.warehouses || [];

  const filteredInventory = inventory.filter((item: any) => 
    (item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()) || (item.code || '').toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory === 'ALL' || item.category === filterCategory)
  );

  const categories = ['ALL', ...new Set(inventory.map((i: any) => i.category))];

  // Graded Stats
  const gradeA = gradedCells.filter((c: any) => c.grade === 'A').length;
  const gradeB = gradedCells.filter((c: any) => c.grade === 'B').length;
  const gradeC = gradedCells.filter((c: any) => c.grade === 'C').length;
  const rejected = gradedCells.filter((c: any) => c.grade === 'REJECT').length;

  const avgIR = gradedCells.length > 0 
    ? (gradedCells.reduce((acc: number, c: any) => acc + (c.ir || 0), 0) / gradedCells.length).toFixed(1)
    : 0;

  const handleAction = (actionName: string, callback: () => void) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      callback();
      setIsSyncing(false);
    }, 200);
  };

  return (
    <div className={cn("space-y-8 pb-20 transition-all duration-500", isSyncing && "opacity-50 blur-[1px]")}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory Intelligence</h2>
          <div className="flex items-center mt-2 space-x-4">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               <Layers size={14} className="mr-2 text-primary-600" /> Multi-Layer Resource Vault
             </p>
             <span className="h-1 w-1 rounded-full bg-slate-300"></span>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               Registered SKUs: {inventory.length + gradedCells.length}
             </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button className="bg-white text-slate-400 p-3.5 rounded-2xl border border-slate-200 hover:text-primary-600 hover:bg-primary-50 transition-all active:scale-90 shadow-sm">
              <Download size={20} />
           </button>
           <button className="bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
              <Plus size={18} className="mr-2" /> New Procurement
           </button>
        </div>
      </div>

      {/* Modern Tab System */}
      <div className="flex space-x-1 p-1.5 bg-slate-100 rounded-3xl border border-slate-200 w-fit">
        {[
          { id: 'raw', label: 'Raw Master', icon: Package },
          { id: 'graded', label: 'Cell Grading', icon: Zap },
          { id: 'warehouse', label: 'Warehouse Hub', icon: Warehouse }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleAction(`Switch to ${tab.label}`, () => setActiveTab(tab.id as any))}
            className={cn(
              "flex items-center px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === tab.id ? "bg-primary-600 text-white shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            <tab.icon size={14} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'raw' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
           {/* Enhanced Search/Filter Panel */}
           <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 flex flex-wrap items-center gap-6 shadow-xl shadow-slate-200/40">
              <div className="flex-1 min-w-[280px] relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={search} 
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search Material Master (ID, Code, Name)..."
                   className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 pl-16 pr-6 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all italic tracking-wide"
                 />
              </div>
              <div className="flex items-center space-x-4 pr-2">
                 <Filter size={18} className="text-slate-400" />
                 <select 
                   value={filterCategory}
                   onChange={e => setFilterCategory(e.target.value)}
                   className="bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl px-6 py-4 outline-none cursor-pointer hover:bg-slate-100 transition-all"
                 >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-white">{cat}</option>)}
                 </select>
              </div>
           </div>

           {/* Advanced Material Table */}
           <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl relative shadow-slate-200/40">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                       <tr>
                          <th className="px-10 py-8">Material Matrix / Code</th>
                          <th className="px-10 py-8 text-center">Batch / QC</th>
                          <th className="px-10 py-8">Inventory Depth</th>
                          <th className="px-10 py-8">Supply Chain Hub</th>
                          <th className="px-10 py-8">Warehouse Node</th>
                          {isAdmin && <th className="px-10 py-8 text-right">Valuation</th>}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-900">
                       {filteredInventory.map((item: any) => (
                          <tr key={item.id} className="group hover:bg-slate-50 transition-all duration-300">
                             <td className="px-10 py-8">
                                <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors leading-none">{item.name}</p>
                                <div className="flex items-center mt-2.5 space-x-3">
                                   <span className="text-[10px] text-primary-600 font-black tracking-widest bg-primary-50 px-2 py-0.5 rounded border border-primary-100">CODE: {item.code || 'N/A'}</span>
                                   <span className="h-0.5 w-3 bg-slate-100"></span>
                                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.category}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8 text-center">
                                <div className="flex flex-col items-center space-y-2">
                                   <span className="bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                      {item.batch}
                                   </span>
                                   <span className={cn(
                                      "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center",
                                      item.qcStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                                   )}>
                                      {item.qcStatus === 'APPROVED' ? <ShieldCheck size={10} className="mr-1.5" /> : <Beaker size={10} className="mr-1.5" />}
                                      {item.qcStatus}
                                   </span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="space-y-2">
                                   <div className="flex items-end justify-between mb-1">
                                      <p className={cn(
                                        "text-xl font-black italic tracking-tighter leading-none",
                                         item.qty < (item.minStock || 0) ? "text-red-500" : "text-slate-900"
                                      )}>
                                         {item.qty.toLocaleString()} <span className="text-[10px] not-italic text-slate-400 ml-1">{item.unit}</span>
                                      </p>
                                      {item.qty < (item.minStock || 0) && <AlertTriangle size={14} className="text-red-500 animate-pulse mb-1" />}
                                   </div>
                                   <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={cn("h-full transition-all", item.qty < (item.minStock || 0) ? "bg-red-500" : "bg-primary-600")}
                                        style={{ width: `${Math.min(100, (item.qty / ((item.reorderLevel || 1) * 1.5)) * 100)}%` }}
                                      ></div>
                                   </div>
                                   <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">MIN: {item.minStock} | ROL: {item.reorderLevel}</p>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center">
                                   <ArrowUpRight size={14} className="mr-2 text-slate-400" /> {item.supplier}
                                </p>
                                <p className="text-[10px] text-slate-400 font-black mt-1">GRN: {item.grn || 'PENDING'}</p>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{item.warehouse}</p>
                                <p className="text-[10px] text-primary-500 font-bold mt-1 tracking-[0.2em]">{item.rack}</p>
                             </td>
                             {isAdmin && (
                                <td className="px-10 py-8 text-right">
                                   <div className="flex flex-col items-end">
                                      <p className="text-[13px] font-black text-slate-900 italic tracking-tighter">{formatCurrency(item.qty * (item.price || 0))}</p>
                                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Valuation</p>
                                   </div>
                                </td>
                             )}
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeTab === 'graded' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
           {/* Cell Grading Interactive KPIs */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Grade A Premium', value: gradeA, icon: ShieldCheck, color: 'text-emerald-600', bColor: 'bg-emerald-50', note: 'Li-ion Premium Packs' },
                { label: 'Grade B Standard', value: gradeB, icon: Zap, color: 'text-amber-600', bColor: 'bg-amber-50', note: 'Budget Segments' },
                { label: 'Grade C Secondary', value: gradeC, icon: History, color: 'text-blue-600', bColor: 'bg-blue-50', note: 'ESS / Storage' },
                { label: 'Rejected Flux', value: rejected, icon: Trash2, color: 'text-red-600', bColor: 'bg-red-50', note: 'Recycle Scrutiny' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-crosshair shadow-2xl shadow-slate-200/40">
                   <div className={cn("absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700", kpi.color)}>
                      <kpi.icon size={160} strokeWidth={3} />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                   <p className="text-5xl font-black text-slate-900 italic tracking-tighter mb-4 flex items-baseline text-shadow-glow">
                      {kpi.value} <span className="text-sm not-italic ml-2 font-black text-slate-400">PCS</span>
                   </p>
                   <div className="flex items-center mt-6">
                      <span className={cn("px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border", kpi.color, kpi.bColor, "border-black/5")}>
                         {kpi.note}
                      </span>
                   </div>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Grading Technical Summary */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-3xl relative overflow-hidden flex flex-col justify-between shadow-slate-200/40">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none"></div>
                 <div>
                    <div className="flex items-center space-x-3 mb-10">
                       <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                          <Beaker size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Grading Analytics</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Quality Consistency Matrix</p>
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-slate-100 transition-all">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                             <Zap size={14} className="mr-2 text-primary-600" /> Average IR Level
                          </p>
                          <div className="flex items-baseline space-x-2">
                             <p className="text-5xl font-black text-slate-900 italic tracking-tighter">{avgIR}</p>
                             <p className="text-[12px] font-black text-slate-400 uppercase">mΩ</p>
                          </div>
                          <div className="mt-4 flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                             <TrendingUp size={12} className="mr-2" /> 1.2% Lower vs Std
                          </div>
                       </div>

                       <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-slate-100 transition-all">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                             <Thermometer size={14} className="mr-2 text-blue-600" /> Testing Temperature
                          </p>
                          <div className="flex items-baseline space-x-2">
                             <p className="text-5xl font-black text-slate-900 italic tracking-tighter">24.5</p>
                             <p className="text-[12px] font-black text-slate-400 uppercase">°C</p>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-[0.15em] italic">Laboratory Standard Active</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-10 pt-8 border-t border-slate-100">
                    <button className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/10 hover:shadow-primary-500/30 transition-all active:scale-95">
                       Execute New Test Batch
                    </button>
                 </div>
              </div>

              {/* Technical Graded Inventory Repos */}
              <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-3xl flex flex-col min-h-[600px] shadow-slate-200/40">
                 <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Technical Graded Repository</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Authenticated testing artifacts & metrics</p>
                    </div>
                    <div className="flex items-center space-x-3">
                       <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">OPERATIONAL REAL-TIME SYNC</span>
                    </div>
                 </div>
                 <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left font-mono">
                       <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                          <tr>
                             <th className="px-10 py-6">Cell Artifact / Dt.</th>
                             <th className="px-10 py-6">Test Vector (V / IR / C)</th>
                             <th className="px-10 py-6">Grade / Use</th>
                             <th className="px-10 py-6 text-right">Auth Code</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-slate-900">
                          {gradedCells.map((cell: any) => (
                             <tr key={cell.id} className="hover:bg-slate-50 transition-all group duration-300">
                                <td className="px-10 py-8">
                                   <div className="flex items-center space-x-4">
                                      <div className={cn(
                                         "h-10 w-10 rounded-xl flex items-center justify-center border",
                                         cell.grade === 'A' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                         cell.grade === 'B' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                         "bg-red-50 text-red-600 border-red-100"
                                      )}>
                                         <QrCode size={20} />
                                      </div>
                                      <div>
                                         <p className="text-[14px] font-black text-slate-900 uppercase tracking-widest leading-none">{cell.serial}</p>
                                         <p className="text-[9px] text-slate-400 font-black uppercase mt-2 tracking-widest italic flex items-center">
                                            <Calendar size={10} className="mr-1.5" /> {cell.date}
                                         </p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <div className="grid grid-cols-3 gap-4">
                                      <div className="flex flex-col">
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volts</span>
                                         <span className="text-sm font-black text-slate-900 italic">{cell.voltage}V</span>
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Res.</span>
                                         <span className="text-sm font-black text-primary-600 italic">{cell.ir}mΩ</span>
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cap.</span>
                                         <span className="text-sm font-black text-blue-600 italic">{cell.capacity}mAh</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <p className="text-[11px] font-black text-slate-900 uppercase mb-1 tracking-widest">GRADE {cell.grade}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-wider">{cell.usage}</p>
                                </td>
                                <td className="px-10 py-8 text-right">
                                   <div className="inline-flex flex-col items-end">
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{cell.engineer}</p>
                                      <span className="text-[8px] text-slate-400 font-black uppercase mt-1">Certified</span>
                                   </div>
                                </td>
                             </tr>
                          ))}
                          {gradedCells.length === 0 && (
                            <tr>
                               <td colSpan={4} className="px-10 py-40 text-center">
                                  <Boxes className="mx-auto text-slate-200 mb-6" size={48} />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No cell artifacts detected in tiered matrix</p>
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {warehouses.map((wh: string, idx: number) => (
             <div key={wh} className="bg-white rounded-[3.5rem] p-12 border border-slate-100 relative overflow-hidden group hover:scale-[1.03] transition-all cursor-pointer shadow-3xl shadow-slate-200/40">
                <div className="absolute -right-8 -top-8 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700 rotate-12">
                   <Warehouse size={220} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-10">
                      <div className="h-16 w-16 rounded-[1.5rem] bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-xl shadow-primary-500/5">
                         <Warehouse size={32} />
                      </div>
                      <div className="text-right">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">NODE ARCH {idx + 1}</span>
                         <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">ACTIVE SYNC</span>
                      </div>
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter mb-4">{wh}</h3>
                   <div className="space-y-4 mb-12">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         <Activity size={14} className="mr-3 text-primary-600" /> Stock Velocity: <span className="text-slate-900 ml-2 font-black">High</span>
                      </div>
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         <Plus size={14} className="mr-3 text-emerald-600" /> Incoming: <span className="text-slate-900 ml-2 font-black">42 SKUs</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Capacity</p>
                         <p className="text-3xl font-black text-slate-900 italic tracking-tighter">84%</p>
                      </div>
                      <button className="bg-slate-50 px-8 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 hover:bg-primary-600 hover:text-white hover:border-transparent transition-all shadow-xl">
                         Node Details
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
