import React, { useState } from 'react';
import { Plus, Search, FileText, Download, Share2, Filter, IndianRupee, MapPin, Calendar, User, ShoppingBag, CheckCircle2, ChevronRight, ArrowLeft, Printer, Trash2, AlertCircle } from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { formatCurrency, cn } from '../lib/utils';

export const Billing: React.FC = () => {
  const { data, loading, refetch } = useERPData();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Invoice State
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]); // { modelId, serials: [], price }
  const [isSelectingStock, setIsSelectingStock] = useState(false);
  const [activeModelForStock, setActiveModelForStock] = useState<string | null>(null);

  const dealers = data?.leads.filter((l: any) => l.status === 'CONVERTED') || [
      // Fallback for demo if no unconverted leads exist yet
      { id: 'l1', company: 'Green Motors Ahmedabad', location: 'Ahmedabad' }
  ];

  const availableStock = data?.finishedGoods.filter((fg: any) => fg.status === 'READY') || [];

  const handleCreateInvoice = async () => {
    if (!selectedDealer || cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + (item.price * item.serials.length), 0);
    const tax = total * 0.18; // 18% GST

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealerId: selectedDealer.id,
        items: cart.map(item => ({
            model: item.modelId,
            qty: item.serials.length,
            serials: item.serials,
            price: item.price
        })),
        total: total + tax,
        tax
      })
    });

    if (res.ok) {
        setView('list');
        setCart([]);
        setSelectedDealer(null);
        refetch();
    }
  };

  const addToCart = (modelId: string, serial: string) => {
    const product = data?.products.find((p: any) => p.id === modelId);
    const price = product?.price || 0;

    setCart(prev => {
        const existing = prev.find(item => item.modelId === modelId);
        if (existing) {
            if (existing.serials.includes(serial)) {
                return prev.map(item => item.modelId === modelId ? { ...item, serials: item.serials.filter((s: string) => s !== serial) } : item);
            }
            return prev.map(item => item.modelId === modelId ? { ...item, serials: [...item.serials, serial] } : item);
        }
        return [...prev, { modelId, serials: [serial], price }];
    });
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

  if (loading || isSyncing) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
       <div className="inline-block p-6 bg-slate-100 rounded-3xl relative overflow-hidden">
          <IndianRupee size={40} className="text-primary-600 animate-pulse relative z-10" />
          <div className="absolute inset-0 bg-primary-600/5 animate-pulse"></div>
       </div>
       <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-primary-900 animate-pulse">
          {isSyncing ? 'Committing Financial Transaction...' : 'Loading Billing Systems...'}
       </p>
    </div>
  );

  const filteredInvoices = data?.invoices.filter((inv: any) => {
    const dealer = data?.leads.find((l: any) => l.id === inv.dealerId);
    return inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           dealer?.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Billing & Accounts</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Direct GST Invoicing & Financial Ledger Management</p>
            </div>
            <button onClick={() => handleAction("Create View", () => setView('create'))} className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20 flex items-center hover:bg-primary-700 transition-all border border-slate-100 group active:scale-95">
              <Plus size={16} className="mr-2 text-white group-hover:rotate-90 transition-transform" /> Create Sale Invoice
            </button>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all hover:scale-[1.02] cursor-default relative overflow-hidden group">
           <div className="flex justify-between items-start relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">Total Sales (MTD)</p>
              <IndianRupee size={20} className="text-primary-600" />
           </div>
           <p className="text-2xl font-black relative z-10 italic mt-2 text-slate-900 truncate break-all" title={formatCurrency(data?.invoices.reduce((a:any, b:any) => a + b.total, 0))}>{formatCurrency(data?.invoices.reduce((a:any, b:any) => a + b.total, 0))}</p>
           <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative z-10 shadow-inner">
              <div className="h-full bg-primary-600 w-2/3 shadow-[0_0_10px_rgba(8,145,178,0.3)]"></div>
           </div>
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-700 blur-[2px]">
              <ShoppingBag size={120} />
           </div>
        </div>

        <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 transition-all hover:scale-[1.02] hover:border-red-200 cursor-default group">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding Amount</p>
              <AlertCircle size={20} className="text-red-500 opacity-40 group-hover:opacity-100 group-hover:animate-pulse transition-all" />
           </div>
           <p className="text-3xl font-black text-red-600 italic mt-2 drop-shadow-sm">₹4.50L</p>
           <p className="text-[10px] mt-2 font-black text-slate-400 uppercase tracking-widest">12 Pending dealer payments</p>
        </div>

        <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 transition-all hover:scale-[1.02] hover:border-primary-200 cursor-default group">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">E-Way Bills & Dispatch</p>
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(8,145,178,0.6)]"></div>
           </div>
           <p className="text-4xl font-black text-slate-900 italic mt-2 drop-shadow-sm">03 <span className="text-sm text-slate-400 not-italic uppercase tracking-widest ml-1">Ready</span></p>
           <p className="text-[10px] mt-2 font-black text-primary-600 uppercase tracking-widest flex items-center">
             <CheckCircle2 size={12} className="mr-1" /> Synchronized with NIC Portal
           </p>
        </div>
      </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className="p-6 border-b flex items-center bg-slate-50/50">
               <div className="relative flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search invoice or dealer..." 
                   className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-14 pr-6 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all italic tracking-wide h-12" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6">Invoice #</th>
                    <th className="px-10 py-6">Dealer / Party</th>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6">Amount</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredInvoices?.slice().reverse().map((inv: any) => {
                    const dealer = data?.leads.find((l:any) => l.id === inv.dealerId);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-10 py-8 font-black text-primary-600 text-sm group-hover:translate-x-1 transition-transform inline-block whitespace-nowrap">{inv.id}</td>
                        <td className="px-10 py-8">
                          <p className="font-black text-[13px] text-slate-900 uppercase tracking-tight">{dealer?.company || 'Walk-in Customer'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{dealer?.location}</p>
                        </td>
                        <td className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">{inv.date}</td>
                        <td className="px-10 py-8 font-black text-slate-900 italic">{formatCurrency(inv.total)}</td>
                        <td className="px-10 py-8">
                          <span className={cn(
                             "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center w-fit",
                             inv.status === 'PAID' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-primary-50 text-primary-600 border border-primary-100"
                          )}>
                             {inv.status === 'PAID' && <CheckCircle2 size={10} className="mr-1.5" />}
                             {inv.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <button 
                               onClick={() => alert(`Downloading Invoice ${inv.id} PDF...`)}
                               className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all border border-slate-100"
                             >
                               <Download size={16} />
                             </button>
                             <button 
                               onClick={() => alert(`Sharing Invoice ${inv.id} link...`)}
                               className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all border border-slate-100"
                             >
                               <Share2 size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-right duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-4xl shadow-slate-200/60">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center text-slate-900 relative">
                 <div className="flex items-center space-x-6 relative z-10">
                    <button onClick={() => setView('list')} className="p-4 hover:bg-white rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-90 bg-white">
                       <ArrowLeft size={20} className="text-primary-600" />
                    </button>
                    <div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">New Sale Invoice</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">GST-compliant digital voucher & warranty token</p>
                    </div>
                 </div>
                 <div className="text-right relative z-10">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Timestamp</p>
                    <p className="font-black text-2xl italic tracking-tight text-primary-600">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* Party Selection & Billing Details */}
                 <div className="lg:col-span-2 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-[11px] font-black text-primary-600 uppercase mb-8 flex items-center tracking-widest">
                          <User size={16} className="mr-3" /> Select Party / Dealer
                       </h4>
                       <div className="grid grid-cols-1 gap-6">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Dealer Company / Registered Entity</label>
                             <select 
                                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer box-shadow-sm italic" 
                                value={selectedDealer?.id || ''} 
                                onChange={(e) => {
                                    const dealer = dealers.find(d => d.id === e.target.value);
                                    setSelectedDealer(dealer);
                                }}
                             >
                                <option value="" className="bg-white">Select a Dealer Node...</option>
                                {dealers.map(d => <option key={d.id} value={d.id} className="bg-white">{d.company} — {d.location}</option>)}
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase mb-8 flex items-center tracking-widest">
                          <ShoppingBag size={16} className="mr-3 text-primary-600" /> Items & Serial Numbers
                       </h4>
                       <div className="space-y-6">
                           {data?.products.map(product => (
                               <div key={product.id} className="p-6 bg-slate-50 rounded- [2rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-primary-200 transition-all shadow-sm">
                                   <div>
                                       <p className="font-black text-slate-900 uppercase tracking-tight text-sm italic">{product.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{formatCurrency(product.price)} / Unit Base</p>
                                   </div>
                                   <div className="flex items-center space-x-6">
                                       <div className="text-right">
                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory</p>
                                           <p className="font-black text-lg text-primary-600 italic tracking-tighter">
                                               {availableStock.filter((fg:any) => fg.model === product.id).length} PCS
                                           </p>
                                       </div>
                                       <button 
                                          onClick={() => { 
                                              handleAction("Open Picker", () => {
                                                  setActiveModelForStock(product.id); 
                                                  setIsSelectingStock(true); 
                                              });
                                          }}
                                          className="bg-white text-primary-600 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-100 hover:bg-primary-600 hover:text-white transition-all shadow-md active:scale-95"
                                       >
                                          Pick Serials
                                       </button>
                                   </div>
                                </div>
                           ))}
                       </div>
                    </div>

                    {/* Cart Summary Header for Mobile */}
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.2em] italic">Current Invoice Matrix</p>
                       <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                           <thead className="bg-white/50 text-[9px] font-black text-slate-400 uppercase border-b border-white">
                              <tr>
                                 <th className="px-4 py-4">Artifact</th>
                                 <th className="px-4 py-4">Serials Picked</th>
                                 <th className="px-4 py-4">Rate</th>
                                 <th className="px-4 py-4 text-right">Valuation</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {cart.map((item, idx) => {
                                  const product = data?.products.find((p:any) => p.id === item.modelId);
                                  return (
                                      <tr key={idx} className="text-[11px] bg-white group hover:bg-slate-50 transition-colors">
                                          <td className="px-4 py-5 font-black text-slate-900 italic uppercase">{product?.name}</td>
                                          <td className="px-4 py-5">
                                              <div className="flex flex-wrap gap-2">
                                                  {item.serials.map((s: string) => (
                                                      <span key={s} className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[9px] font-black text-primary-600">
                                                          {s.split('-').pop()}
                                                      </span>
                                                  ))}
                                              </div>
                                          </td>
                                          <td className="px-4 py-5 text-slate-500">{formatCurrency(item.price)}</td>
                                          <td className="px-4 py-5 font-black text-slate-900 text-right">{formatCurrency(item.price * item.serials.length)}</td>
                                      </tr>
                                  );
                              })}
                              {cart.length === 0 && (
                                  <tr>
                                      <td colSpan={4} className="px-4 py-12 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Matrix is currently empty.</td>
                                  </tr>
                              )}
                           </tbody>
                        </table>
                       </div>
                    </div>
                 </div>

                 {/* Checkout Summary Sidebar */}
                 <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 sticky top-8 shadow-3xl shadow-slate-200/50">
                       <h4 className="text-[11px] font-black text-slate-900 uppercase mb-8 tracking-widest flex items-center">
                          <CheckCircle2 size={16} className="mr-3 text-primary-600" /> Invoice Summary
                       </h4>
                       <div className="space-y-6 pb-6 border-b border-slate-100">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                             <span>Basis Sub-total</span>
                             <span className="text-slate-900">{formatCurrency(cart.reduce((a, b) => a + (b.price * b.serials.length), 0))}</span>
                          </div>
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                             <span>GST Calculation (18%)</span>
                             <span className="text-amber-600">{formatCurrency(cart.reduce((a, b) => a + (b.price * b.serials.length), 0) * 0.18)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                             <span>Shipping Node</span>
                             <span className="text-slate-900">₹0.00</span>
                          </div>
                       </div>
                       <div className="pt-8 flex justify-between items-center mb-10">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Final Ledger</span>
                          <span className="text-3xl font-black text-primary-600 italic tracking-tighter">
                             {formatCurrency(cart.reduce((a, b) => a + (b.price * b.serials.length), 0) * 1.18)}
                          </span>
                       </div>
                       
                       <button 
                         disabled={!selectedDealer || cart.length === 0}
                         onClick={() => handleAction("Generating Invoice", handleCreateInvoice)}
                         className="w-full py-5 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 italic"
                        >
                           Generate Final Invoice <ChevronRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
                       </button>
                       <p className="mt-6 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
                        By generating, serial numbers will be marked as SOLD and warranty will be activated in the service database automatically.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Serial Picker Dialog */}
      {isSelectingStock && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
              <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase italic tracking-tight">Pick Serial Nodes</h3>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">{activeModelForStock}</p>
                      </div>
                      <button onClick={() => setIsSelectingStock(false)} className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-200 shadow-sm transition-all active:scale-90">✕</button>
                  </div>
                  <div className="p-10">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {availableStock.filter((fg: any) => fg.model === activeModelForStock).map((fg: any) => {
                              const isPicked = cart.find(c => c.modelId === activeModelForStock)?.serials.includes(fg.serial);
                              return (
                                  <button 
                                    key={fg.id}
                                    onClick={() => addToCart(fg.model, fg.serial)}
                                    className={cn(
                                        "p-5 rounded-2xl border-2 text-left transition-all relative group",
                                        isPicked ? "bg-primary-50 border-primary-500 scale-[1.02]" : "bg-white border-slate-50 hover:border-slate-200"
                                    )}
                                  >
                                      <div className="flex justify-between items-start mb-3">
                                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{fg.warehouse}</span>
                                          {isPicked && <CheckCircle2 size={16} className="text-primary-600" />}
                                      </div>
                                      <p className="font-mono text-[11px] font-black text-slate-900 tracking-widest uppercase">{fg.serial}</p>
                                  </button>
                              );
                          })}
                          {availableStock.filter((fg: any) => fg.model === activeModelForStock).length === 0 && (
                              <div className="col-span-full py-20 text-center text-slate-400 italic font-black uppercase text-[10px] tracking-[0.3em]">No inventory artifacts available for pick-up.</div>
                          )}
                      </div>
                      <div className="mt-10 flex justify-end">
                          <button onClick={() => setIsSelectingStock(false)} className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all">Save Selection Matrix</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
