import React, { useState } from 'react';
import { 
  Factory, Box, QrCode, Printer, CheckCircle2, History, Database, 
  Wrench, Plus, AlertCircle, Tag, Cpu, Zap, Activity, BadgeCheck, 
  Package, TrendingUp, BarChart3, LineChart as LineChartIcon,
  Layers, Settings, Microscope, FlaskConical, ClipboardCheck, ArrowRight
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export const Production: React.FC = () => {
  const { data, loading, refetch } = useERPData();
  const [activeSubTab, setActiveSubTab] = useState<'wip' | 'assembly' | 'grading' | 'history'>('wip');
  
  // Production Step State
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState('');
  const [qty, setQty] = useState(1);
  const [targetWarehouse, setTargetWarehouse] = useState('Main Warehouse');
  const [targetRack, setTargetRack] = useState('A-01');
  const [serials, setSerials] = useState<string[]>([]);

  // WIP State
  const [wipStep, setWipStep] = useState(1);
  const [wipName, setWipName] = useState('Cell Pack Assembly');
  const [wipQty, setWipQty] = useState(10);

  // Grading State
  const [selectedRaw, setSelectedRaw] = useState<any>(null);
  const [processingDegree, setProcessingDegree] = useState('Voltage Calibration');
  const [outputBatches, setOutputBatches] = useState([{ grade: 'A', qty: 0, rack: '' }]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleAction = (actionName: string, callback: () => void | Promise<void>) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(async () => {
      await callback();
      setIsSyncing(false);
    }, 100);
  };

  const handleStartWIP = async () => {
     // Implementation for starting WIP process
     const components = data?.products.find((p:any) => p.id === selectedModel)?.bom.map((b:any) => ({
        matId: b.matId,
        qty: b.qty * wipQty
     })) || [];

     await fetch('/api/production/wip/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: wipName,
            qty: wipQty,
            components
        })
     });
     setWipStep(1);
     setActiveSubTab('wip');
     refetch();
  };

  const handleCompleteProduction = async () => {
    const res = await fetch('/api/production/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        qty,
        warehouse: targetWarehouse,
        rack: targetRack
      })
    });
    const result = await res.json();
    setSerials(result.serials);
    setStep(3);
    refetch();
  };

  const handleProcessGrading = async () => {
    await fetch('/api/processing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputId: selectedRaw.id,
        processingDegree,
        outputBatches
      })
    });
    setSelectedRaw(null);
    setOutputBatches([{ grade: 'A', qty: 0, rack: '' }]);
    refetch();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Cpu className="animate-spin text-accent-500 mb-6" size={48} />
      <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Initializing Manufacturing Core...</span>
    </div>
  );

  const wipInventory = data?.wipInventory || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Production Console</h2>
          <div className="flex items-center mt-2 space-x-4">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               <Zap size={14} className="mr-2 text-primary-600 shadow-[0_0_8px_rgba(0,0,0,0.1)]" /> Floor Master Override
             </div>
             <span className="h-1 w-1 rounded-full bg-slate-300"></span>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               Operational Performance: 94.2%
             </p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200">
            {[
              { id: 'wip', label: 'WIP Control', icon: Activity },
              { id: 'assembly', label: 'Final Assembly', icon: Factory },
              { id: 'grading', label: 'Cell Grading', icon: FlaskConical },
              { id: 'history', label: 'Logs', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleAction(`Switch to ${tab.label}`, () => setActiveSubTab(tab.id as any))}
                className={cn(
                  "flex items-center px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeSubTab === tab.id ? "bg-accent-500 text-[#071426] shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <tab.icon size={14} className="mr-2" />
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {activeSubTab === 'wip' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
           {/* WIP Overview Stats */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden group shadow-xl">
                 <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
                    <Activity size={140} />
                 </div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Total Semi-Finished Nodes</h4>
                 <p className="text-6xl font-black text-slate-900 italic tracking-tighter mb-4">{wipInventory.length}</p>
                 <div className="flex items-center text-[10px] font-black text-primary-600 uppercase tracking-widest">
                    <TrendingUp size={14} className="mr-2" /> Processing Active
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 relative overflow-hidden shadow-xl flex flex-col justify-between">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mb-1">Process Started Flow</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource-to-WIP Transformation Protocol</p>
                    </div>
                    <button 
                       onClick={() => setWipStep(2)}
                       className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-lg shadow-primary-500/20"
                    >
                       Initiate NEW Process
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cell Packs</p>
                       <p className="text-2xl font-black text-slate-900">{wipInventory.filter(w => w.name.includes('Cell')).length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">BMS Mounted</p>
                       <p className="text-2xl font-black text-slate-900">{wipInventory.filter(w => w.name.includes('BMS')).length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ready Hub</p>
                       <p className="text-2xl font-black text-slate-900">{wipInventory.filter(w => w.stage === 'READY').length}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* WIP Inventory Table */}
           <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
              <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Semi-Finished Logical Stock</h3>
                 <div className="flex items-center space-x-3 text-[10px] font-black text-primary-600 uppercase tracking-widest">
                    <Settings className="animate-spin-slow" size={16} /> Precision Tracking Active
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left font-mono">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                       <tr>
                          <th className="px-10 py-8">Assembly Logic</th>
                          <th className="px-10 py-8">Process Stage</th>
                          <th className="px-10 py-8 text-center">Unit Count</th>
                          <th className="px-10 py-8">Last Node Update</th>
                          <th className="px-10 py-8 text-right">Commitments</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {wipInventory.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-all group duration-300">
                             <td className="px-10 py-8">
                                <p className="text-[16px] font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary-600 transition-colors leading-none">{item.name}</p>
                                <p className="text-[9px] text-slate-400 font-black uppercase mt-3 tracking-widest italic">{item.id}</p>
                             </td>
                             <td className="px-10 py-8">
                                <div className="bg-primary-50 text-primary-600 border border-primary-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit">
                                   <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse mr-2"></div>
                                   {item.stage}
                                </div>
                             </td>
                             <td className="px-10 py-8 text-center text-2xl font-black text-slate-900 italic tracking-tighter">
                                {item.qty}
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                   <History size={14} className="mr-2 text-slate-300" /> {item.lastUpdate}
                                </p>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary-600 hover:bg-primary-50 border border-slate-100 transition-all group-hover:border-primary-100">
                                   <ArrowRight size={20} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* WIP Modal Overlay */}
           {wipStep === 2 && (
             <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-8">
                <div className="bg-white w-full max-w-2xl rounded-[3rem] border border-slate-100 p-12 shadow-4xl animate-in zoom-in duration-500">
                   <div className="flex justify-between items-center mb-12">
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Process Initiation</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 underline decoration-primary-500 decoration-2 underline-offset-4">Material Issue & Transformation</p>
                      </div>
                      <button onClick={() => setWipStep(1)} className="text-slate-400 hover:text-slate-900 transition-colors uppercase font-black text-[10px] tracking-widest border border-slate-200 px-4 py-2 rounded-xl">Discard Protocol</button>
                   </div>

                   <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Target Type</label>
                            <select 
                               value={wipName}
                               onChange={e => setWipName(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 italic uppercase focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                            >
                               <option>Cell Pack Assembly</option>
                               <option>BMS Mounted Pack</option>
                               <option>Tested Modules</option>
                               <option>Half-Assembled Chassis</option>
                            </select>
                         </div>
                         <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Magnitude Count</label>
                            <input 
                               type="number"
                               value={wipQty}
                               onChange={e => setWipQty(parseInt(e.target.value) || 0)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 italic focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                               placeholder="Units to Initiate"
                            />
                         </div>
                      </div>

                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                         <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-6 flex items-center">
                            <Layers size={14} className="mr-2" /> MATERIAL ISSUE PREVIEW
                         </h4>
                         <div className="space-y-3">
                            {data?.products.find(p => p.id === '72V30A')?.bom.slice(0,3).map((b:any) => (
                               <div key={b.matId} className="flex justify-between items-center text-[11px] font-black text-slate-500 font-mono tracking-tight">
                                  <span>{b.name}</span>
                                  <span className="text-slate-900">{(b.qty * wipQty).toLocaleString()} {b.unit}</span>
                               </div>
                            ))}
                            <p className="pt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic border-t border-slate-200 mt-4">Required stock will be atomically deducted on execution</p>
                         </div>
                      </div>
                      
                      <button 
                         onClick={handleStartWIP}
                         className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                      >
                         Execute Material Issue & Start WIP
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>
      ) : activeSubTab === 'assembly' ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-2xl">
              <div className="flex bg-slate-50 p-2 border-b border-slate-100">
                {[
                  { id: 1, label: 'Model Selection' },
                  { id: 2, label: 'BOM Validation' },
                  { id: 3, label: 'QC & Artifacts' }
                ].map(s => (
                  <div key={s.id} className={cn(
                    "flex-1 p-6 rounded-[1.5rem] text-center text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    step === s.id ? 'bg-primary-600 text-white shadow-xl scale-[1.02]' : 'text-slate-400'
                  )}>
                     {s.label}
                  </div>
                ))}
              </div>

              <div className="p-12">
                 {step === 1 && (
                    <div className="space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {data?.products.map((p: any) => (
                             <button 
                                key={p.id}
                                onClick={() => setSelectedModel(p.id)}
                                className={cn(
                                   "p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group",
                                   selectedModel === p.id 
                                     ? "border-primary-500 bg-primary-50 shadow-xl" 
                                     : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                                )}
                             >
                                <Box className={cn("mb-6 transition-colors duration-500", selectedModel === p.id ? "text-primary-600" : "text-slate-300")} size={36} />
                                <p className={cn("font-black text-lg uppercase tracking-tighter leading-none mb-2", selectedModel === p.id ? "text-slate-900" : "text-slate-400")}>{p.name}</p>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ARC_ID: {p.id}</span>
                             </button>
                          ))}
                       </div>
                       <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Production Magnitude Target</label>
                          <input 
                             type="number"
                             value={qty}
                             onChange={e => setQty(parseInt(e.target.value) || 1)}
                             className="w-full bg-transparent border-b-4 border-slate-200 text-5xl font-black text-slate-900 italic outline-none focus:border-primary-500 transition-all pb-4 tracking-tighter"
                          />
                       </div>
                       <button 
                          disabled={!selectedModel}
                          onClick={() => setStep(2)}
                          className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                       >
                          Analyze BOM Integrity →
                       </button>
                    </div>
                 )}

                 {step === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right duration-500 font-mono">
                       <h3 className="text-xl font-black text-slate-900 italic flex items-center uppercase tracking-tight">
                          <ClipboardCheck className="mr-3 text-emerald-600" /> Automated Material Protocol Analysis
                       </h3>
                       <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                                <tr>
                                   <th className="px-8 py-5">Component Node</th>
                                   <th className="px-8 py-5">Requirement</th>
                                   <th className="px-8 py-5">Global Stock</th>
                                   <th className="px-8 py-5 text-right">Integrity</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {data?.products.find(p => p.id === selectedModel)?.bom.map((b:any) => (
                                   <tr key={b.matId}>
                                      <td className="px-8 py-6 text-[12px] font-black text-slate-900 uppercase tracking-widest">{b.name}</td>
                                      <td className="px-8 py-6 text-[10px] text-slate-400">{(b.qty * qty).toLocaleString()} {b.unit}</td>
                                      <td className="px-8 py-6 text-[10px] text-slate-400">{(data?.inventory.find(i => i.id === b.matId)?.qty || 0).toLocaleString()}</td>
                                      <td className="px-8 py-6 text-right">
                                         <div className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                       <button 
                          onClick={handleCompleteProduction}
                          className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                       >
                          Authorize Final Assembly & Serialization
                       </button>
                    </div>
                 )}

                 {step === 3 && (
                    <div className="text-center space-y-10 animate-in zoom-in duration-500">
                       <div className="flex flex-col items-center">
                          <div className="h-24 w-24 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] rounded-full flex items-center justify-center text-white mb-8">
                             <BadgeCheck size={48} />
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">Protocol Successful</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Serialized artifacts generated for {qty} units</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                          {serials.map(s => (
                             <div key={s} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center shadow-lg">
                                <Barcode value={s} height={40} fontSize={10} background="#ffffff" />
                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                   <QRCodeSVG value={s} size={100} />
                                </div>
                                <p className="mt-4 text-[12px] font-black text-primary-900 tracking-[0.1em]">{s}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      ) : activeSubTab === 'grading' ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
               <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight flex items-center mb-10">
                  <Microscope className="mr-3 text-primary-600" /> Material Scrutiny Panel
               </h3>
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {data?.inventory.filter(i => i.qty > 0).map(item => (
                     <button 
                        key={item.id}
                        onClick={() => setSelectedRaw(item)}
                        className={cn(
                           "w-full p-8 rounded-[2rem] border-2 text-left flex justify-between items-center transition-all duration-300",
                           selectedRaw?.id === item.id ? "bg-primary-50 border-primary-500 shadow-lg" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                        )}
                     >
                        <div>
                           <p className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1">{item.name}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BATCH: {item.batch}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{item.qty}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">U Units</p>
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {selectedRaw && (
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl animate-in slide-in-from-right duration-500 space-y-10 flex flex-col justify-between">
                  <div className="space-y-10">
                     <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight flex items-center border-b border-slate-100 pb-10">
                        <Settings className="mr-3 text-primary-600" /> Transformation Ruleset
                     </h3>
                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calibration Logic Degree</label>
                        <select 
                           value={processingDegree}
                           onChange={e => setProcessingDegree(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 italic focus:ring-1 focus:ring-primary-500 outline-none transition-all uppercase"
                        >
                           <option>Voltage Calibration Matrix</option>
                           <option>Cycle Integrity Pulse</option>
                           <option>Internal Resistance Grading</option>
                        </select>
                     </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cell Testing Parameters (QC-Core)</p>
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-slate-500 uppercase">Voltage (V)</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black text-slate-900 italic outline-none focus:ring-1 focus:ring-primary-500" placeholder="3.7V - 4.2V" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-slate-500 uppercase">IR (mΩ)</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black text-slate-900 italic outline-none focus:ring-1 focus:ring-primary-500" placeholder="< 30mΩ" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-slate-500 uppercase">Capacity (mAh)</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black text-slate-900 italic outline-none focus:ring-1 focus:ring-primary-500" placeholder="2500mAh" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black text-slate-500 uppercase">Cycle Count</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black text-slate-900 italic outline-none focus:ring-1 focus:ring-primary-500" placeholder="0 - 2000" />
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Graded Vector Distribution (Output)</p>
                        {outputBatches.map((b, i) => (
                           <div key={i} className="flex space-x-3">
                              <select 
                                 className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black text-slate-900 italic uppercase focus:ring-1 focus:ring-primary-500 outline-none"
                                 value={b.grade}
                                 onChange={e => {
                                     const nb = [...outputBatches];
                                     nb[i].grade = e.target.value;
                                     setOutputBatches(nb);
                                 }}
                              >
                                 <option>GRADE X-A</option>
                                 <option>GRADE X-B</option>
                                 <option>GRADE X-REJECT</option>
                              </select>
                              <input 
                                 type="number"
                                 placeholder="QTY"
                                 value={b.qty || ''}
                                 onChange={e => {
                                     const nb = [...outputBatches];
                                     nb[i].qty = parseInt(e.target.value) || 0;
                                     setOutputBatches(nb);
                                 }}
                                 className="w-24 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black text-slate-900 focus:ring-1 focus:ring-primary-500 outline-none"
                              />
                           </div>
                        ))}
                        <button onClick={() => setOutputBatches([...outputBatches, { grade: 'A', qty: 0, rack: '' }])} className="text-[9px] font-black text-primary-600 uppercase flex items-center hover:text-primary-800 transition-colors">
                           <Plus size={14} className="mr-2" /> Add Distribution Target
                        </button>
                     </div>
                  </div>

                  <button 
                     onClick={handleProcessGrading}
                     className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                  >
                     Commit Transformation Protocol
                  </button>
               </div>
            )}
         </div>
      ) : (
         <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl animate-in fade-in duration-500">
            <table className="w-full text-left font-mono">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-6">Audit Timestamp</th>
                     <th className="px-8 py-6">Material Profile</th>
                     <th className="px-8 py-6">Produced Magnitude</th>
                     <th className="px-8 py-6">Serialization Matrix</th>
                     <th className="px-8 py-6 text-right">Commitment Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {data?.productionHistory.map((h: any) => (
                     <tr key={h.id} className="hover:bg-slate-50 transition-all">
                        <td className="px-8 py-6 text-[10px] font-black text-slate-400">{h.date}</td>
                        <td className="px-8 py-6 text-[12px] font-black text-slate-900 italic">{h.model}</td>
                        <td className="px-8 py-6 text-[14px] font-black text-primary-600 italic">{h.qty} UNITS</td>
                        <td className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase">
                           START: {h.serials[0]}...
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">COMPLETED / ARCHIVED</span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};
