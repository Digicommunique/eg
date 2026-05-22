import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Settings, 
  Zap, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Package, 
  AlertTriangle, 
  History,
  TrendingUp,
  FileText,
  Calculator,
  Trash2,
  Copy,
  Save,
  X,
  Activity,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useERPData } from '../hooks/useERPData';

export const MRP: React.FC = () => {
  const { data, loading, refetch } = useERPData();
  const [activeTab, setActiveTab] = useState<'planning' | 'bom'>('planning');
  const [selectedModel, setSelectedModel] = useState('');
  const [productionQty, setProductionQty] = useState<number>(0);
  const [calculation, setCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDuplicateModal, setIsDuplicateModal] = useState(false);

  const handleSaveProduct = async () => {
    if (!editingProduct.id || !editingProduct.name) return;
    const method = data?.products.find((p: any) => p.id === editingProduct.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/products/${editingProduct.id}` : '/api/products';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (sourceId: string) => {
    const newId = prompt("Enter New Product ID (e.g. BAT-NEXT-GY):");
    const newName = prompt("Enter New Product Name:");
    if (!newId || !newName) return;

    try {
      const res = await fetch('/api/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, newId, newName })
      });
      if (res.ok) {
        refetch();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addBOMItem = () => {
    const newItem = { matId: '', name: '', qty: 0, unit: 'Pcs', wastage: 0 };
    setEditingProduct({
      ...editingProduct,
      bom: [...(editingProduct.bom || []), newItem]
    });
  };

  const removeBOMItem = (idx: number) => {
    const newBOM = [...editingProduct.bom];
    newBOM.splice(idx, 1);
    setEditingProduct({ ...editingProduct, bom: newBOM });
  };

  const updateBOMItem = (idx: number, field: string, value: any) => {
    const newBOM = [...editingProduct.bom];
    if (field === 'matId') {
      const invItem = data?.inventory.find((i: any) => i.id === value);
      newBOM[idx] = { ...newBOM[idx], matId: value, name: invItem?.name || '', unit: invItem?.unit || 'Pcs' };
    } else {
      newBOM[idx] = { ...newBOM[idx], [field]: value };
    }
    setEditingProduct({ ...editingProduct, bom: newBOM });
  };

  const [isCalculated, setIsCalculated] = useState(false);

  // Debounced calculation for "Live" feel
  useEffect(() => {
    if (selectedModel && productionQty > 0) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCalculation(null);
    }
  }, [selectedModel, productionQty]);

  const handleCalculate = async () => {
    if (!selectedModel || productionQty <= 0) return;
    setIsCalculating(true);
    try {
      const resp = await fetch(`/api/mrp/calculate?modelId=${selectedModel}&qty=${productionQty}`);
      const res = await resp.json();
      setCalculation(res);
      setIsCalculated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreatePlan = async (mode: 'RESERVE' | 'CONSUME') => {
    try {
      const resp = await fetch('/api/mrp/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          modelId: selectedModel, 
          qty: productionQty,
          mode 
        })
      });
      
      if (!resp.ok) {
        const error = await resp.json();
        alert(`Error: ${error.message}\nMissing: ${error.missing?.map((m: any) => `${m.name} (Req: ${m.required})`).join(', ')}`);
        return;
      }

      const plan = await resp.json();
      alert(`Production ${mode === 'RESERVE' ? 'Plan Created' : 'Started'} Successfully!\nAllocated materials for ${productionQty} units.`);
      setCalculation(null);
      setProductionQty(0);
      setSelectedModel('');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure? This will delete the entire BOM matrix for this model.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) refetch();
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
       <div className="relative">
          <div className="absolute inset-0 bg-primary-200/20 blur-3xl rounded-full animate-pulse"></div>
          <Cpu size={60} className="text-primary-600 animate-bounce relative z-10" />
       </div>
       <h3 className="mt-10 text-lg font-black italic uppercase tracking-tighter text-slate-900">
          Synchronizing MRP Engine...
       </h3>
       <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 animate-pulse">
          Analyzing Multi-Warehouse Logical State
       </p>
    </div>
  );

  return (
    <div className={cn("space-y-6 relative transition-opacity duration-300", isSyncing && "opacity-50 pointer-events-none")}>
      {isSyncing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
          <div className="bg-white border border-slate-200 text-slate-900 px-8 py-6 rounded-[2.5rem] shadow-4xl flex items-center space-x-4 animate-in zoom-in-95">
            <Zap size={20} className="text-primary-600 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Recomputing Production Matrix...</span>
          </div>
        </div>
      )}
      {/* BOM EDITOR OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 text-slate-900">
           <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-4xl flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                 <div className="flex items-center space-x-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-200 flex items-center justify-center text-primary-600 shadow-sm">
                       <Settings size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">BOM Matrix Configurator</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Technical parameters for <span className="text-primary-600 underline decoration-primary-300 underline-offset-4">{editingProduct.id || 'Unit Blueprint'}</span></p>
                    </div>
                 </div>
                 <button onClick={() => setEditingProduct(null)} className="p-4 hover:bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-90 bg-white">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-12 overflow-y-auto space-y-12 flex-1 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Model Architecture ID</label>
                       <input 
                         type="text" 
                         disabled={data?.products.some((p:any) => p.id === editingProduct.id)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-primary-500/20 outline-none transition-all disabled:opacity-50 text-slate-900 placeholder:text-slate-300 italic uppercase tracking-widest"
                         placeholder="e.g. BAT-NEXT-200"
                         value={editingProduct.id || ''}
                         onChange={(e) => setEditingProduct({...editingProduct, id: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-3">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Commercial Blueprint Name</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-slate-900 placeholder:text-slate-300 italic"
                         placeholder="e.g. High-Efficiency Inverter Battery 200Ah"
                         value={editingProduct.name || ''}
                         onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex justify-between items-center">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center">
                          <Layers size={16} className="mr-3 text-primary-600" /> Component Ratios & Wastage Matrix
                       </h4>
                       <button onClick={addBOMItem} className="text-[10px] font-black uppercase text-primary-600 bg-primary-50 px-6 py-3 rounded-xl border border-primary-100 hover:bg-primary-600 hover:text-white transition-all flex items-center shadow-md active:scale-95">
                          <Plus size={16} className="mr-2" /> Inject Component
                       </button>
                    </div>

                    <div className="space-y-4">
                       {editingProduct.bom?.map((item: any, idx: number) => (
                          <div key={idx} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 grid grid-cols-12 gap-6 items-end group relative transition-all hover:bg-white hover:border-primary-200 hover:shadow-2xl hover:shadow-slate-200/50">
                             <div className="col-span-4">
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Base Resource</label>
                                <select 
                                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-black focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-slate-900 shadow-sm"
                                  value={item.matId}
                                  onChange={(e) => updateBOMItem(idx, 'matId', e.target.value)}
                                >
                                   <option value="" className="bg-white">Select Node</option>
                                   {data?.inventory.map((inv: any) => (
                                      <option key={inv.id} value={inv.id} className="bg-white">{inv.name} ({inv.id})</option>
                                   ))}
                                </select>
                             </div>
                             <div className="col-span-2 text-center">
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest text-left pl-1">Batch Qty</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-black focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-slate-900 text-center shadow-sm"
                                  value={item.qty || ''}
                                  onChange={(e) => updateBOMItem(idx, 'qty', parseFloat(e.target.value) || 0)}
                                />
                             </div>
                             <div className="col-span-2">
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Unit</label>
                                <div className="px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase shadow-inner text-center">{item.unit || 'PCS'}</div>
                             </div>
                             <div className="col-span-2">
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Tolerance %</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-black focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-amber-600 text-center shadow-sm"
                                  value={item.wastage || ''}
                                  onChange={(e) => updateBOMItem(idx, 'wastage', parseInt(e.target.value) || 0)}
                                />
                             </div>
                             <div className="col-span-1 border-l border-slate-200 pl-6">
                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Effective</label>
                                <p className="text-sm font-black text-primary-600 italic tracking-tighter">{(item.qty * (1 + (item.wastage/100))).toFixed(2)}</p>
                             </div>
                             <div className="col-span-1 flex justify-end">
                                <button onClick={() => removeBOMItem(idx)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                                   <Trash2 size={20} />
                                </button>
                             </div>
                          </div>
                       ))}
                       {(!editingProduct.bom || editingProduct.bom.length === 0) && (
                          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                             <div className="h-20 w-20 bg-white rounded-[1.5rem] mx-auto flex items-center justify-center mb-6 shadow-sm">
                                <Layers size={36} className="text-slate-200" />
                             </div>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-mono">Logical components not yet defined in matrix</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t bg-slate-50 flex justify-between items-center">
                 <div className="flex items-center space-x-3 px-4">
                    <ShieldAlert size={16} className="text-amber-500" />
                    <p className="text-[10px] font-black text-slate-400 italic uppercase tracking-wider">Validated BOM constraints directly influence unit margin and floor throughput velocity.</p>
                 </div>
                 <div className="flex items-center space-x-4">
                    <button onClick={() => setEditingProduct(null)} className="px-8 py-3.5 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all shadow-sm active:scale-95">Abandone</button>
                    <button onClick={handleSaveProduct} className="px-12 py-3.5 rounded-2xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 flex items-center active:scale-95">
                       <Save size={18} className="mr-3" /> Commit Blueprint
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-6">
           <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-200 flex items-center justify-center text-primary-600 shadow-xl shadow-slate-100/50">
              <Cpu size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">MRP Intelligence</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Core Production & Resource Balancer System</p>
           </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200">
           <button 
             onClick={() => setActiveTab('planning')} 
             className={cn("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'planning' ? "bg-white text-primary-600 shadow-xl" : "text-slate-500 hover:text-slate-900")}
           >
             Planning Hub
           </button>
           <button 
             onClick={() => setActiveTab('bom')} 
             className={cn("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'bom' ? "bg-white text-primary-600 shadow-xl" : "text-slate-500 hover:text-slate-900")}
           >
             Master BOM
           </button>
        </div>
      </div>

      {activeTab === 'planning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Planner Input Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 relative overflow-hidden shadow-4xl shadow-slate-200/40">
               <div className="absolute -right-8 -top-8 p-8 opacity-[0.03] rotate-12">
                  <Calculator size={200} />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-600 mb-10 flex items-center bg-primary-50 w-fit px-4 py-1.5 rounded-full border border-primary-100">
                  <Zap size={14} className="mr-2" /> Simulation Module
               </h3>
               
               <div className="space-y-8 relative z-10">
                  <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Architecture</label>
                       <div className="flex items-center space-x-1.5">
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Engine Ready</span>
                       </div>
                    </div>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all cursor-pointer box-shadow-sm italic appearance-none"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="" className="bg-white">Select Node Blueprint</option>
                      {data?.products.map((p: any) => (
                        <option key={p.id} value={p.id} className="bg-white">{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Batch Execution Qty</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder:text-slate-300 italic tracking-widest"
                      placeholder="e.g. 100 UNITS"
                      value={productionQty || ''}
                      onChange={(e) => setProductionQty(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <button 
                    disabled={!selectedModel || productionQty <= 0 || isCalculating}
                    onClick={() => handleCalculate()}
                    className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed mt-4 flex items-center justify-center group italic"
                  >
                    {isCalculating ? (
                      <Activity size={18} className="animate-spin mr-3" />
                    ) : (
                      <RefreshCw size={18} className="mr-3 group-hover:rotate-180 transition-transform duration-700" />
                    )}
                    {isCalculating ? 'Computing Matrix...' : 'Start Simulation'}
                  </button>
               </div>
            </div>

            {/* Smart Purchase Suggestions */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-4xl shadow-slate-200/40">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center">
                  <TrendingUp size={16} className="mr-3 text-primary-500" /> Procure Alerts
               </h3>
               <div className="space-y-4">
                  {data?.inventory.filter((i:any) => (i.qty - (i.reservedQty || 0)) < (i.minStock || 500)).map((item: any) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-primary-100 transition-all shadow-sm">
                       <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight italic">{item.name}</p>
                          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">Shortfall: <span className="font-mono">{(item.minStock || 500) - (item.qty - (item.reservedQty || 0))}</span> UNITS</p>
                       </div>
                       <button onClick={() => alert(`Purchase Order initiated for ${item.name}`)} className="h-10 w-10 bg-white border border-slate-200 text-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-90">
                          <Plus size={18} />
                       </button>
                    </div>
                  ))}
                  {data?.inventory.filter((i:any) => (i.qty - (i.reservedQty || 0)) < (i.minStock || 500)).length === 0 && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                       <CheckCircle2 size={40} className="mx-auto text-primary-600 opacity-20 mb-4" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Inventory states balanced</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Requirements Matrix Section */}
          <div className="lg:col-span-2">
            {!calculation ? (
               <div className="h-full flex flex-col items-center justify-center p-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 text-slate-300 shadow-4xl shadow-slate-200/40">
                  <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 border border-slate-100">
                     <Layers size={48} className="opacity-10 text-slate-900" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-3 text-slate-400">Analysis Engine Idle</h4>
                  <p className="text-[10px] font-black tracking-widest uppercase text-slate-300">Execute simulation to visualize recursive dependencies</p>
               </div>
            ) : (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-5xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-8 border-b border-slate-100">
                       <div>
                          <div className="flex items-center space-x-3 mb-2">
                             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{calculation.modelName}</h3>
                             <span className="px-3 py-1 bg-primary-600 text-white text-[9px] font-black rounded-lg tracking-widest">BATCH V1</span>
                          </div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Simulated Construction: <span className="text-primary-600 italic">{calculation.qty} UNITS</span></p>
                       </div>
                       <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleAction("Reserve Stock", () => handleCreatePlan('RESERVE'))}
                            className="px-8 py-3.5 rounded-2xl bg-white border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-xl shadow-amber-500/5 active:scale-95 italic"
                          >
                            Reserve Resource
                          </button>
                          <button 
                            onClick={() => handleAction("Release Production", () => handleCreatePlan('CONSUME'))}
                            className="px-10 py-3.5 rounded-2xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 italic"
                          >
                            Release Build
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                       <div className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 flex items-center space-x-6">
                          <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl", calculation.requirements.some((r:any) => r.deficient > 0) ? 'bg-red-500 shadow-red-500/20' : 'bg-primary-600 shadow-primary-600/20')}>
                             {calculation.requirements.some((r:any) => r.deficient > 0) ? <ShieldAlert size={32} /> : <CheckCircle2 size={32} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Availability State</p>
                             <p className={cn("text-lg font-black uppercase tracking-widest italic", calculation.requirements.some((r:any) => r.deficient > 0) ? 'text-red-600' : 'text-primary-600')}>
                                {calculation.requirements.some((r:any) => r.deficient > 0) 
                                   ? 'Critical Stock Missing' 
                                   : 'Infrastructure Ready'}
                             </p>
                          </div>
                       </div>
                       <div className="p-8 rounded-[2.5rem] bg-primary-50 border border-primary-100 flex items-center space-x-6">
                          <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xl shadow-primary-500/10">
                             <TrendingUp size={32} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Valuation Delta</p>
                             <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{calculation.requirements.reduce((a:number, b:any) => a + (b.requiredTotal * 100), 0).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono">
                         <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">
                            <tr>
                               <th className="px-6 py-6">Component Artifact</th>
                               <th className="px-6 py-6 text-center">Net Matrix</th>
                               <th className="px-6 py-6">Target Requirement</th>
                               <th className="px-6 py-6">Operational Stock</th>
                               <th className="px-6 py-6 text-right">Node Static</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 text-[12px] font-black text-slate-900">
                            {calculation.requirements.map((req: any, idx: number) => (
                               <tr key={idx} className="hover:bg-slate-50 transition-all group">
                                  <td className="px-6 py-6 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{req.name}</td>
                                  <td className="px-6 py-6 text-center text-slate-400 font-bold">{req.perUnit.toFixed(2)}</td>
                                  <td className="px-6 py-6 text-slate-900 italic">{req.requiredTotal.toFixed(2)} <span className="text-[9px] text-slate-400 not-italic uppercase ml-1 font-black">{req.unit}</span></td>
                                  <td className={cn("px-6 py-6 font-black italic", req.available < req.requiredTotal ? 'text-red-500' : 'text-primary-600')}>
                                     {req.available.toFixed(2)} {req.unit}
                                  </td>
                                  <td className="px-6 py-6 text-right">
                                     {req.deficient > 0 ? (
                                        <div className="inline-flex px-4 py-1.5 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                                           Missing {req.deficient.toFixed(2)}
                                        </div>
                                     ) : (
                                        <div className="inline-flex px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                           Synchronized
                                        </div>
                                     )}
                                  </td>
                                </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] border border-primary-100 bg-primary-50/30 flex items-start space-x-5">
                     <div className="h-10 w-10 rounded-xl bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-md shrink-0">
                        <AlertTriangle size={20} />
                     </div>
                     <p className="text-[11px] font-black text-slate-900 leading-relaxed uppercase tracking-tight italic">
                        <span className="text-primary-600 underline underline-offset-4 decoration-primary-300">System Protocol:</span> Simulation creates a virtual footprint. Committing a plan 'Soft Reserves' materials until build completion. System maintains 100% serialization integrity.
                     </p>
                  </div>
               </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bom' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Matrix Builds', value: data?.products.length, icon: CheckCircle2, color: 'text-primary-600', bColor: 'bg-primary-50' },
                { label: 'System Margin Loss', value: '4.8%', icon: Zap, color: 'text-amber-600', bColor: 'bg-amber-50' },
                { label: 'Alt-Map Depth', value: '15%', icon: Layers, color: 'text-blue-600', bColor: 'bg-blue-50' },
                { label: 'Stable Revision', value: 'v3.2', icon: ShieldAlert, color: 'text-emerald-600', bColor: 'bg-emerald-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-4xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className={cn("absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700", stat.color)}>
                     <stat.icon size={120} strokeWidth={3} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 italic tracking-tighter mb-4">{stat.value}</p>
                  <span className={cn("px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 inline-block", stat.color, stat.bColor)}>
                     Verified Static
                  </span>
                </div>
              ))}
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-5xl shadow-slate-200/50">
               <div className="p-12 border-b flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/50">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Master BOM Repository</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 underline decoration-primary-300 underline-offset-4">Precise logical material mapping per architectural building unit</p>
                 </div>
                 <button 
                   onClick={() => setEditingProduct({ id: '', name: '', bom: [], price: 0, type: 'Battery' })} 
                   className="px-10 py-4 bg-primary-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 flex items-center active:scale-95 italic"
                 >
                    <Plus size={20} className="mr-3" /> New Architecture Node
                 </button>
              </div>
              <div className="divide-y divide-slate-50">
                 {data?.products.map((product: any) => (
                    <div key={product.id} className="p-12 hover:bg-slate-50 transition-all group duration-500">
                       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
                          <div className="flex items-center space-x-6">
                             <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-200 text-primary-600 flex items-center justify-center font-black text-2xl shadow-xl group-hover:scale-110 transition-transform group-hover:rotate-12 group-hover:border-primary-500">
                                {product.id.split('-')[1] || product.id[0]}
                             </div>
                             <div>
                                <div className="flex items-center space-x-4 mb-1">
                                  <h4 className="font-black text-xl text-slate-900 uppercase italic tracking-tighter">{product.name}</h4>
                                  <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-lg tracking-widest shadow-sm">ID: {product.id}</span>
                                </div>
                                <div className="flex items-center space-x-6 mt-2">
                                   <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center italic">
                                      <Zap size={14} className="mr-2" /> {product.type || 'Standard'}
                                   </span>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center bg-white px-3 py-1 rounded-full border border-slate-200">
                                      {product.bom?.length} Artifacts Defined
                                   </span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                             <button 
                               onClick={() => handleAction("Duplicate BOM", () => handleDuplicate(product.id))} 
                               title="Duplicate & Edit"
                               className="p-4 text-slate-400 bg-white border border-slate-200 rounded-2xl hover:text-primary-600 hover:border-primary-600 transition-all shadow-md active:scale-90"
                             >
                                <Copy size={20}/>
                             </button>
                             <button 
                               onClick={() => setEditingProduct(product)} 
                               className="px-10 py-3 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 hover:border-primary-600 transition-all shadow-md active:scale-95 italic"
                             >
                                Edit Matrix
                             </button>
                             <button 
                               onClick={() => handleAction("Delete BOM", () => handleDeleteProduct(product.id))} 
                               className="p-4 text-slate-400 bg-white border border-slate-200 rounded-2xl hover:text-red-500 hover:border-red-500 transition-all shadow-md active:scale-90"
                             >
                                <Trash2 size={20}/>
                             </button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                          {product.bom.map((item: any, idx: number) => (
                             <div key={idx} className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:border-primary-600 transition-all group/item cursor-crosshair">
                                <div className="flex justify-between items-start mb-4">
                                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic truncate max-w-[60%]">{item.name}</p>
                                   <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">Waste: {item.wastage}%</span>
                                </div>
                                <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                                   <div>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Base Matrix</p>
                                      <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{item.qty}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Effective</p>
                                      <p className="text-sm font-black text-primary-600 italic">{(item.qty * (1 + (item.wastage/100))).toFixed(2)} <span className="text-[9px] text-slate-400 not-italic ml-1">{item.unit}</span></p>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
                 {data?.products.length === 0 && (
                   <div className="p-40 text-center">
                      <Cpu size={64} className="mx-auto text-slate-200 mb-8 opacity-20" />
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">No architectural nodes found in blueprint engine</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-900 p-12 rounded-[4rem] text-white overflow-hidden relative group cursor-pointer shadow-4xl hover:shadow-primary-900/40 transition-all">
                 <div className="absolute -right-20 -top-20 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12 group-hover:scale-110">
                    <Zap size={300} />
                 </div>
                 <h4 className="text-[11px] font-black text-primary-500 uppercase tracking-[0.3em] mb-10">Logic Execution Layer</h4>
                 <h3 className="text-4xl font-black leading-tight max-w-md group-hover:text-primary-300 transition-colors uppercase italic tracking-tighter">Automate material consumption <span className="text-white underline decoration-primary-500 decoration-8 underline-offset-[12px] decoration-double">real-time floor sync</span>.</h3>
                 <p className="text-[11px] text-slate-400 mt-12 font-black tracking-[0.2em] uppercase flex items-center">
                    <ArrowRight size={16} className="mr-3 text-primary-500 group-hover:translate-x-4 transition-transform" /> Connect Factory IoT Cluster
                 </p>
              </div>
              <div className="bg-primary-600 p-12 rounded-[4rem] text-white overflow-hidden relative group cursor-pointer shadow-4xl hover:shadow-primary-600/40 transition-all">
                 <div className="absolute -right-20 -top-20 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-1000 -rotate-12 group-hover:scale-110">
                    <FileText size={300} />
                 </div>
                 <h4 className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-10">Compliance Protocol</h4>
                 <h3 className="text-4xl font-black leading-tight max-w-md group-hover:text-white/80 transition-colors uppercase italic tracking-tighter">Maintain ISO 9001:2015 <span className="text-white underline decoration-white/30 decoration-8 underline-offset-[12px] decoration-double">Traceability Standards</span>.</h3>
                 <p className="text-[11px] text-white/50 mt-12 font-black tracking-[0.2em] uppercase flex items-center">
                    <ArrowRight size={16} className="mr-3 text-white group-hover:translate-x-4 transition-transform" /> Generate Immutable Compliance Audit
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
