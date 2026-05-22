import React, { useState } from 'react';
import { 
  Package, Search, Filter, Plus, ChevronRight, AlertTriangle, 
  ArrowUpRight, Download, History, BarChart3, Tag, Warehouse,
  Activity, ShieldCheck, Zap, Layers, Microscope, QrCode, Trash2,
  Database, Boxes, Thermometer, Beaker, TrendingUp, Calendar, MapPin,
  ClipboardList, PackagePlus, Truck, RefreshCcw, LayoutDashboard,
  Box, AlertCircle, Move, RotateCcw
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { cn, formatCurrency } from '../lib/utils';
import { useAuthStore, UserRole } from '../store/authStore';

export const StoreKeeperDashboard: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const { user } = useAuthStore();
  const { data, loading } = useERPData();
  const [activeView, setActiveView] = useState<'overview' | 'raw-material'>(
    activeTab === 'raw-material-dashboard' ? 'raw-material' : 'overview'
  );
  const [search, setSearch] = useState('');

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="relative">
        <Database className="animate-pulse text-primary-500 mb-6" size={64} />
        <div className="absolute inset-0 bg-primary-400/20 blur-xl animate-ping rounded-full scale-50"></div>
      </div>
      <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Initiating Logistics Interface...</span>
    </div>
  );

  const inventory = data?.inventory || [];
  const wip = data?.wipInventory || [];
  const finishedGoods = data?.finishedGoods || [];
  const warehouses = data?.warehouses || [];

  // Metrics Calculation
  const totalRawItems = inventory.reduce((acc: number, item: any) => acc + item.qty, 0);
  const lowStockItems = inventory.filter((item: any) => item.qty < (item.minStock || 0));
  const pendingMaterials = inventory.filter((item: any) => item.grn === 'PENDING');
  
  const warehouseStock = warehouses.map((wh: string) => {
    const raw = inventory.filter((i: any) => i.warehouse === wh).reduce((acc: number, item: any) => acc + (item.qty * (item.price || 0)), 0);
    const fg = finishedGoods.filter((i: any) => i.warehouse === wh).length;
    return { name: wh, rawValue: raw, fgCount: fg };
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center">
             {activeView === 'overview' ? 'Store Keeper Command' : 'Raw Material Matrix'}
          </h2>
          <div className="flex items-center mt-3 space-x-4">
             <div className="flex items-center bg-primary-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-primary-500/20">
                <ShieldCheck size={12} className="mr-1.5" /> Security Level: AUTH
             </div>
             <span className="h-1 w-1 rounded-full bg-slate-300"></span>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Active Warehouses: {warehouses.length}
             </p>
          </div>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200">
           <button 
             onClick={() => setActiveView('overview')}
             className={cn(
               "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeView === 'overview' ? "bg-white text-primary-600 shadow-xl shadow-slate-200/50 scale-105" : "text-slate-500 hover:text-slate-900"
             )}
           >
             <LayoutDashboard size={14} className="inline mr-2 mb-0.5" /> Store Overview
           </button>
           <button 
             onClick={() => setActiveView('raw-material')}
             className={cn(
               "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeView === 'raw-material' ? "bg-white text-primary-600 shadow-xl shadow-slate-200/50 scale-105" : "text-slate-500 hover:text-slate-900"
             )}
           >
             <Package size={14} className="inline mr-2 mb-0.5" /> Raw Materials
           </button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
          {/* Top Line Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-primary-200 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <Boxes size={24} />
                  </div>
                  <TrendingUp size={16} className="text-emerald-500" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Inventory Qty</p>
               <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter">{totalRawItems.toLocaleString()}</h3>
               <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400">
                  <span className="text-emerald-600 font-black mr-2">+12.4%</span> vs last month
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-red-200 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <AlertTriangle size={24} />
                  </div>
                  <AlertCircle size={16} className="text-red-500 animate-pulse" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Low Stock Alerts</p>
               <h3 className="text-4xl font-black text-red-600 italic tracking-tighter">{lowStockItems.length}</h3>
               <div className="mt-4 flex items-center text-[10px] font-bold text-red-400">
                  Critical reorder required now
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-amber-200 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <ClipboardList size={24} />
                  </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pending Materials</p>
               <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter">{pendingMaterials.length}</h3>
               <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400">
                  Awaiting Quality Clearance
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-blue-200 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <RotateCcw size={24} />
                  </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Work In Progress</p>
               <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter">{wip.length}</h3>
               <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400">
                  Materials in production lines
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Warehouse Wise Stock */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 shadow-slate-200/40">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Warehouse Distribution</h3>
                  <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline px-4 py-2 bg-primary-50 rounded-xl">View Capacity Map</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {warehouseStock.map((wh, idx) => (
                    <div key={wh.name} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div className="p-2.5 bg-white rounded-xl text-primary-600 shadow-sm">
                            <Warehouse size={18} />
                         </div>
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Node-0{idx+1}</span>
                      </div>
                      <p className="text-lg font-black text-slate-900 mb-1">{wh.name}</p>
                      <div className="mt-4 space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">Raw Valuation</span>
                            <span className="text-slate-900">{formatCurrency(wh.rawValue)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">FG Serialized</span>
                            <span className="text-slate-900">{wh.fgCount} Units</span>
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Critical Low Stock Alerter */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                  <AlertTriangle size={240} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black text-red-500 uppercase italic tracking-widest flex items-center mb-8">
                     <AlertCircle size={20} className="mr-3" /> Red-Zone Stock
                  </h3>
                  <div className="space-y-6">
                     {lowStockItems.slice(0, 4).map(item => (
                       <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                          <div>
                             <p className="text-xs font-black uppercase tracking-tight">{item.name}</p>
                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {item.qty} {item.unit} / <span className="text-red-400">Min {item.minStock}</span>
                             </p>
                          </div>
                          <button className="p-2 bg-red-500/20 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
                             <PackagePlus size={16} />
                          </button>
                       </div>
                     ))}
                     {lowStockItems.length > 4 && (
                        <p className="text-[10px] font-black text-center text-slate-500 uppercase tracking-widest mt-6 cursor-pointer hover:text-white">
                           +{lowStockItems.length - 4} More Critical Alerts
                        </p>
                     )}
                  </div>
                  <button className="w-full mt-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20">
                     Bulk Reorder Authorization
                  </button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
           {/* Detailed Filters Component etc */}
           <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 flex flex-wrap items-center gap-6 shadow-xl shadow-slate-200/40 mb-8">
              <div className="flex-1 min-w-[280px] relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={search} 
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search Material Stage / Rack / SKU..."
                   className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 pl-16 pr-6 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all italic tracking-wide"
                 />
              </div>
              <div className="flex items-center space-x-3">
                 <button className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-400 hover:text-primary-600 transition-all">
                    <Filter size={18} />
                 </button>
                 <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
                    Generate Stock Report
                 </button>
              </div>
           </div>

           {/* Comprehensive Product Stage Table */}
           <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40 relative">
              <div className="overflow-x-auto">
                 <table className="w-full text-left font-mono">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                       <tr>
                          <th className="px-10 py-8">Material Master / Stage</th>
                          <th className="px-10 py-8">Warehouse Location</th>
                          <th className="px-10 py-8">Stock Metric</th>
                          <th className="px-10 py-8">Condition / QC</th>
                          <th className="px-10 py-8 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-900">
                       {inventory.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase())).map((item: any) => (
                          <tr key={item.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                             <td className="px-10 py-8">
                                <div className="flex items-center space-x-4">
                                   <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                      <Box size={24} />
                                   </div>
                                   <div>
                                      <p className="text-[13px] font-black uppercase text-slate-900 tracking-tight leading-none mb-2">{item.name}</p>
                                      <div className="flex items-center space-x-3">
                                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded border border-blue-100 uppercase tracking-widest">RAW MATERIAL</span>
                                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">{item.code}</span>
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center">
                                   <MapPin size={14} className="mr-2 text-slate-400" /> {item.warehouse}
                                </p>
                                <p className="text-[10px] text-primary-500 font-bold mt-1 tracking-[0.2em] bg-primary-50 w-fit px-2 py-0.5 rounded">RACK: {item.rack}</p>
                             </td>
                             <td className="px-10 py-8">
                                <div className="space-y-1">
                                   <p className={cn(
                                     "text-lg font-black italic tracking-tighter leading-none",
                                      item.qty < (item.minStock || 0) ? "text-red-500" : "text-slate-900"
                                   )}>
                                      {item.qty.toLocaleString()} <span className="text-[9px] not-italic text-slate-400 ml-1">{item.unit}</span>
                                   </p>
                                   <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                                      <div 
                                        className={cn("h-full transition-all", item.qty < (item.minStock || 0) ? "bg-red-500" : "bg-emerald-500")}
                                        style={{ width: `${Math.min(100, (item.qty / ((item.reorderLevel || 1) * 1.5)) * 100)}%` }}
                                      ></div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <span className={cn(
                                   "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center",
                                   item.qcStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                                )}>
                                   {item.qcStatus === 'APPROVED' ? <ShieldCheck size={10} className="mr-1.5" /> : <Beaker size={10} className="mr-1.5" />}
                                   {item.qcStatus}
                                </span>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <button className="p-3 bg-slate-100 text-slate-400 hover:bg-primary-600 hover:text-white rounded-xl transition-all active:scale-90">
                                   <Move size={16} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Material Movement Activity */}
           <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/40">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center">
                    <Activity size={24} className="mr-4 text-primary-600" /> Material Movement Logs
                 </h3>
                 <button className="p-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:text-primary-600 transition-all">
                    <History size={20} />
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { type: 'INCOMING', mat: 'Lead Oxide', qty: '+500 Kg', node: 'Warehouse Hub 1', color: 'text-emerald-500' },
                   { type: 'CONSUMED', mat: 'Lithium Cells', qty: '-2400 Pcs', node: 'Production Line A', color: 'text-red-500' },
                   { type: 'TRANSFER', mat: 'Smart BMS', qty: '50 Pcs', node: 'Raw Hub -> Pune', color: 'text-blue-500' }
                 ].map((log, i) => (
                   <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-4">
                      <div className={cn("p-3 rounded-xl bg-white shadow-sm flex items-center justify-center", log.color)}>
                         {log.type === 'INCOMING' ? <Truck size={20} /> : log.type === 'CONSUMED' ? <RefreshCcw size={20} /> : <Move size={20} />}
                      </div>
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{log.type}</p>
                         <p className="text-xs font-black text-slate-900">{log.mat}</p>
                         <div className="flex items-center mt-2">
                            <span className={cn("text-[10px] font-black mr-2", log.color)}>{log.qty}</span>
                            <span className="text-[9px] text-slate-400 font-bold italic truncate max-w-[80px]">{log.node}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
