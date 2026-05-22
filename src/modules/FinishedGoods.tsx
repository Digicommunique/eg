import React, { useState } from 'react';
import { 
  PackageCheck, PackageX, Truck, RefreshCcw, AlertTriangle, 
  Search, Factory, ChevronRight, MapPin, ClipboardList,
  BarChart3, PieChart as PieChartIcon, History, Zap, CheckCircle2,
  Box, Boxes, ArrowUpRight
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export const FinishedGoods: React.FC = () => {
  const { data, loading } = useERPData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('All');

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Zap className="animate-spin text-pink-500 mr-3" />
      <span className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing with Finished Goods Vector...</span>
    </div>
  );

  const finishedGoods = data?.finishedGoods || [];
  const history = data?.productionHistory || [];

  const stats = {
    ready: finishedGoods.filter((i: any) => i.status === 'READY').length,
    hold: finishedGoods.filter((i: any) => i.status === 'HOLD').length,
    damaged: finishedGoods.filter((i: any) => i.status === 'DAMAGED').length,
    returned: finishedGoods.filter((i: any) => i.status === 'RETURNED').length,
    dispatchReady: finishedGoods.filter((i: any) => i.status === 'DISPATCH_READY').length,
  };

  const warehouseStats = (data?.warehouses || []).map((w: string) => ({
    name: w,
    qty: finishedGoods.filter((i: any) => i.warehouse === w).length
  }));

  const productStats = (data?.products || []).map((p: any) => ({
    name: p.name,
    qty: finishedGoods.filter((i: any) => i.model === p.id).length
  }));

  const COLORS = ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'];

  const filteredGoods = finishedGoods.filter((item: any) => {
    const matchesSearch = item.serial.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'All' || item.warehouse === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Boxes size={120} />
        </div>
    <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Finished Goods Intelligence</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center">
             <Zap size={14} className="mr-2 text-primary-600 shadow-[0_0_8px_rgba(0,0,0,0.1)]" /> End-of-Line Audit & Logistics Dispatch Matrix
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SCAN SERIAL / SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-primary-500 outline-none w-64 transition-all shadow-xl shadow-slate-200/50"
            />
          </div>
          <select 
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-xl shadow-slate-200/50 cursor-pointer appearance-none"
          >
            <option value="All">All Warehouses</option>
            {data?.warehouses.map((w: string) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Stats Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Ready Stock', value: stats.ready, icon: PackageCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Hold Stock', value: stats.hold, icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Damaged', value: stats.damaged, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Returned', value: stats.returned, icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Dispatch Ready', value: stats.dispatchReady, icon: Truck, color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-primary-200 transition-all group relative overflow-hidden shadow-xl shadow-slate-200/50">
             <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
                <stat.icon size={100} />
             </div>
             <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl mb-4 shadow-inner", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <p className="text-4xl font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Warehouse Wise Stock Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                   <MapPin size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest font-sans">Warehouse Node Distribution</h3>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Geospatial Stock Allocation</p>
                </div>
             </div>
             <PieChartIcon size={16} className="text-slate-300" />
          </div>
          
          <div className="h-[300px] w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={8} 
                  fontWeight={900} 
                  tickFormatter={(val) => val.toUpperCase()} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={8} fontWeight={900} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '10px', color: '#0f172a', fontWeight: 900 }}
                  itemStyle={{ color: '#0891b2' }}
                />
                <Bar dataKey="qty" fill="#0891b2" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Model Wise Mix */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                   <PieChartIcon size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest font-sans">Product Inventory Mix</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready Stock Composition</p>
                </div>
             </div>
          </div>

          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="qty"
                >
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '10px', fontWeight: 900 }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Inventory Board */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="bg-slate-50 p-8 flex justify-between items-center border-b border-slate-100">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-inner">
                 <Boxes size={20} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic leading-none">Advanced Ready Stock Matrix</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Real-time Artifact Monitoring</p>
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Export Options</span>
              <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 transition-all shadow-sm">
                 <ArrowUpRight size={16} />
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Unique Serial ID</th>
                <th className="px-8 py-6">Product Cluster</th>
                <th className="px-8 py-6">Warehouse Hub</th>
                <th className="px-8 py-6">Production Batch</th>
                <th className="px-8 py-6">Verification Link</th>
                <th className="px-8 py-6 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGoods.map((item: any) => (
                <tr key={item.id} className="group hover:bg-slate-50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <p className="text-[12px] font-black text-slate-900 tracking-widest">{item.serial}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase italic tracking-wider">Entry: {item.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.model}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase leading-none opacity-60">{data?.products.find((p:any) => p.id === item.model)?.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-[11px] font-black text-slate-700 uppercase tracking-widest">
                       <MapPin size={12} className="mr-2 text-primary-500" /> {item.warehouse}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase italic ml-5">Rack: {item.rack}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black text-slate-900 italic">{item.batch}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-primary-600 w-[85%] shadow-[0_0_8px_rgba(8,145,178,0.4)]"></div>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 mt-2 block tracking-widest uppercase">QC CERTIFIED</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={cn(
                      "inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-sm border",
                      item.status === 'READY' ? "bg-primary-50 text-primary-600 border-primary-100" :
                      item.status === 'HOLD' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      item.status === 'DAMAGED' ? "bg-red-50 text-red-600 border-red-100 animate-pulse" :
                      item.status === 'RETURNED' ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-violet-50 text-violet-600 border-violet-100 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                    )}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production History & Batch Analysis */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl relative shadow-slate-200/50">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-inner">
                 <History size={20} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic leading-none">Production Execution Log</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Batch-Wise Transformation Analytics</p>
              </div>
           </div>
           
           <div className="flex items-center space-x-8">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Batches</p>
                 <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{history.length}</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yield Efficiency</p>
                 <p className="text-2xl font-black text-primary-600 italic tracking-tighter">98.4%</p>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto font-mono">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-slate-50">
              <tr>
                <th className="px-8 py-6">Completion Hub</th>
                <th className="px-8 py-6">Artifact Model</th>
                <th className="px-8 py-6">Output Vector</th>
                <th className="px-8 py-6">Batch ID Artifact</th>
                <th className="px-8 py-6 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h: any) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-all duration-300">
                  <td className="px-8 py-6">
                    <p className="text-[11px] font-black text-slate-900 italic tracking-widest uppercase">{h.date}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">Unit-Alpha-01</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[12px] font-black text-primary-600 uppercase tracking-widest leading-none">{h.model}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase truncate max-w-[200px] opacity-60">{data?.products.find((p:any) => p.id === h.model)?.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3 text-slate-900">
                       <p className="text-xl font-black italic tracking-tighter">{h.qty}</p>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UNITS</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-500 font-black shadow-inner">{h.id}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="inline-flex items-center text-primary-600 text-[10px] font-black uppercase tracking-widest bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 shadow-sm">
                       <CheckCircle2 size={14} className="mr-2" /> {h.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
