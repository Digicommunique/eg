import React from 'react';
import { 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Star, 
  Share2, 
  Settings2, 
  ArrowRight,
  Bell,
  Wrench,
  Award,
  MapPin,
  Plus,
  RefreshCcw,
  Zap,
  ChevronRight,
  Battery
} from 'lucide-react';
import { useERPData } from '../hooks/useERPData';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';

export const Engagement: React.FC = () => {
  const { data, loading } = useERPData();
  const [activeMockTab, setActiveMockTab] = React.useState('Warranty');
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleAction = (actionName: string, callback: () => void | Promise<void>) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(async () => {
      await callback();
      setIsSyncing(false);
    }, 1500);
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
       <div className="relative">
          <div className="absolute inset-0 bg-accent-500/20 blur-3xl rounded-full animate-pulse"></div>
          <Smartphone size={60} className="text-accent-500 animate-bounce relative z-10" />
       </div>
       <h3 className="mt-10 text-lg font-black italic uppercase tracking-tighter text-slate-900">
          Loading Engagement Portal...
       </h3>
       <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-accent-600 animate-pulse">
          Direct-to-Consumer Core Handshake
       </p>
    </div>
  );

  const engagement = data?.engagement || {
    stats: { activeAppUsers: 0, qrScans30d: 0, claimRequests: 0, avgRating: 0 },
    funnel: [],
    recentScans: []
  };

  return (
    <div className={cn("space-y-8 pb-12 transition-opacity duration-300", isSyncing && "opacity-50 pointer-events-none")}>
      {isSyncing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
          <div className="bg-primary-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in zoom-in-95">
            <Zap size={20} className="text-accent-400 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Syncing Mobile Ecosystem...</span>
          </div>
        </div>
      )}
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black text-[#111827] tracking-tight italic uppercase">Customer Engagement Portal</h2>
           <p className="text-sm font-bold text-accent-600 uppercase tracking-widest mt-1">QR-Linked Mobile Ecosystem & Direct-to-Consumer Analytics</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => handleAction('Marketing Campaign Sync', () => {})}
             className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-slate-50 active:scale-95 transition-all shadow-xl shadow-slate-200/40"
           >
              <Share2 size={14} className="mr-2 text-slate-400" /> Marketing Campaigns
           </button>
           <button 
             onClick={() => handleAction('Batch QR Generation', () => {})}
             className="px-6 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-black active:scale-95 transition-all shadow-2xl shadow-accent-900/30 border border-white/5"
           >
              <QrCode size={14} className={cn("mr-2 text-accent-400 shadow-[0_0_8px_rgba(15,180,148,0.5)]")} /> Generate Batch QRs
           </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Active App Users', value: engagement.stats.activeAppUsers.toLocaleString(), icon: Smartphone, trend: '+12%', color: 'text-accent-500' },
           { label: 'QR Scans (Last 30d)', value: engagement.stats.qrScans30d.toLocaleString(), icon: QrCode, trend: '+12%', color: 'text-accent-600' },
           { label: 'Claim Requests', value: engagement.stats.claimRequests, icon: ShieldCheck, trend: '+12%', color: 'text-accent-500' },
           { label: 'Avg User Rating', value: `${engagement.stats.avgRating}/5`, icon: Star, trend: '+12%', color: 'text-amber-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/60 relative overflow-hidden group hover:border-accent-400/30 transition-all cursor-default">
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("p-4 rounded-2xl bg-slate-50 group-hover:bg-slate-950 group-hover:text-accent-400 transition-all shadow-inner", stat.color)}>
                    <stat.icon size={20} />
                 </div>
                 <span className="text-[10px] font-black text-accent-600 bg-accent-50 px-2 py-1 rounded-lg shadow-sm">
                    {stat.trend}
                 </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-[#111827] tracking-tighter italic drop-shadow-sm">{stat.value}</p>
           </div>
         ))}
      </div>

      {/* MAIN PORTAL AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* MOBILE MOCKUP */}
         <div className="relative h-[720px] bg-[#0c1b3d] rounded-[3rem] border-[10px] border-[#152747] shadow-2xl overflow-hidden flex flex-col group">
            {/* Status Bar Mock */}
            <div className="h-6 w-32 bg-[#152747] rounded-b-3xl mx-auto mb-6 shrink-0"></div>
            
            <div className="px-6 pb-24 h-full overflow-y-auto no-scrollbar scroll-smooth">
               {/* Mobile Header */}
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <p className="text-slate-400 text-xs font-bold">Good Morning,</p>
                     <p className="text-white text-xl font-black tracking-tight">Aditya Sharma</p>
                  </div>
                  <div className="p-3 rounded-full bg-white/10 text-white relative border border-white/5">
                     <Bell size={18} />
                     <span className="absolute top-2 right-2 h-2 w-2 bg-[#ff4b4b] rounded-full border-2 border-[#0c1b3d]"></span>
                  </div>
               </div>

               {/* Primary Device Card */}
               <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-md">
                  <div className="flex items-center space-x-5">
                     <div className="h-14 w-14 bg-accent-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(15,180,148,0.3)] shrink-0">
                        <Battery size={28} className="rotate-90" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Primary Device</p>
                        <h4 className="text-white font-black text-lg tracking-tight">INV-150 SuperFlow</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-accent-400 font-black text-xl tracking-tight leading-none">98%</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Healthy</p>
                     </div>
                  </div>
               </div>

               {/* Bento Menu Grid */}
               <div className="bg-slate-50 -mx-6 px-6 py-10 rounded-t-[3rem] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Warranty', icon: ShieldCheck, bg: 'bg-[#e7f9f0]', color: 'text-[#059669]' },
                       { label: 'Service', icon: Wrench, bg: 'bg-[#f1f5f9]', color: 'text-[#334155]' },
                       { label: 'Rewards', icon: Award, bg: 'bg-[#fffae5]', color: 'text-[#d97706]' },
                       { label: 'Find Dealer', icon: MapPin, bg: 'bg-[#eef2ff]', color: 'text-[#4f46e5]' }
                     ].map((item, i) => (
                       <div 
                         key={i} 
                         onClick={() => handleAction(item.label, () => setActiveMockTab(item.label))}
                         className={cn(
                           "h-32 rounded-3xl flex flex-col items-center justify-center space-y-3 cursor-pointer shadow-sm border border-transparent hover:scale-[1.02] active:scale-95 transition-all",
                           item.bg
                         )}
                       >
                          <item.icon size={28} className={item.color} />
                          <span className={cn("text-xs font-black uppercase tracking-tight", item.color)}>{item.label}</span>
                       </div>
                     ))}
                  </div>

                  {/* Service History Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                     <div className="flex justify-between items-center mb-6">
                        <h5 className="text-sm font-black text-primary-900 uppercase">Service History</h5>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                              <div className="h-2.5 w-2.5 bg-accent-500 rounded-full"></div>
                              <div>
                                 <p className="text-xs font-black text-slate-900">Energy</p>
                                 <p className="text-[10px] text-slate-400 font-bold">24 Apr 2026</p>
                              </div>
                           </div>
                           <span className="text-[8px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">Completed</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                              <div className="h-2.5 w-2.5 bg-accent-500 rounded-full"></div>
                              <div>
                                 <p className="text-xs font-black text-slate-900">Health Check</p>
                                 <p className="text-[10px] text-slate-400 font-bold">12 Jan 2026</p>
                              </div>
                           </div>
                           <span className="text-[8px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">Verified</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* ANALYTICS & CONTROLS */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/40 hover:shadow-slate-200/60 transition-all cursor-default group">
               <h3 className="text-xl font-black text-[#111827] italic tracking-tight mb-8 group-hover:text-accent-600 transition-colors">QR Engagement Funnel</h3>
               <div className="space-y-8">
                  {engagement.funnel.map((step: any, i: number) => (
                    <div key={i} onClick={() => handleAction(`Funnel: ${step.label}`, () => {})} className="space-y-3 cursor-pointer group/funnel transition-all hover:translate-x-1 active:scale-[0.98]">
                       <div className="flex justify-between items-end">
                          <div>
                             <span className="text-sm font-black text-[#111827] uppercase tracking-tight group-hover/funnel:text-accent-600 transition-colors">{step.label}</span>
                             <span className="text-[10px] font-bold text-slate-400 ml-2">({step.value.toLocaleString()})</span>
                          </div>
                          <span className="text-sm font-black text-primary-900 italic tracking-tighter">{step.percentage}%</span>
                       </div>
                       <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000 group-hover/funnel:opacity-80 shadow-lg",
                              i === 0 ? "bg-[#111827] shadow-black/20" : i === 1 ? "bg-primary-900 shadow-primary-900/20" : i === 2 ? "bg-accent-600 shadow-accent-600/30" : "bg-accent-400 shadow-accent-400/20"
                            )}
                            style={{ width: `${step.percentage}%` }}
                          ></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#f8fafc] rounded-[2.5rem] p-10 flex flex-col items-center text-center justify-center space-y-6 relative overflow-hidden border border-slate-100 group">
                     <div 
                       onClick={() => handleAction('QR Download', () => {})}
                       className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 relative group cursor-pointer hover:scale-110 active:scale-95 transition-all"
                     >
                     <QRCodeSVG value="https://arc-powercare.com/scan/v2" size={120} />
                     <div className="absolute -top-3 -right-3 h-8 w-8 bg-accent-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
                        <Zap size={14} />
                     </div>
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-[#111827] italic tracking-tight uppercase group-hover:text-accent-600 transition-colors">Instant Loyalty Trigger</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-[220px]">Current QR redirects to <span className="text-accent-600 block underline underline-offset-4 decoration-accent-200 mt-1 cursor-pointer hover:text-accent-500 transition-colors">auth.powerwise.com/v2/scan</span></p>
                  </div>
                  <div className="flex space-x-3 w-full">
                     <button 
                       onClick={() => handleAction('Edit Destination URL', () => {})}
                       className="flex-1 px-4 py-4 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-accent-500 active:scale-95 transition-all shadow-sm"
                     >
                       Edit Dest
                     </button>
                     <button 
                       onClick={() => handleAction('Campaign Offer Add', () => {})}
                       className="flex-1 px-4 py-4 bg-[#111827] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-black/10"
                     >
                       Add Offer
                     </button>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 hover:shadow-slate-200/60 transition-all">
                  <h4 className="text-sm font-black text-[#111827] uppercase tracking-widest mb-6 flex items-center">
                     <RefreshCcw size={16} className="mr-2 text-accent-500 animate-spin-slow" /> Real-time Activity
                  </h4>
                  <div className="space-y-6">
                     {engagement.recentScans.map((scan: any) => (
                       <div 
                         key={scan.id} 
                         onClick={() => handleAction(`User History: ${scan.user}`, () => {})}
                         className="flex items-center space-x-4 group cursor-pointer hover:translate-x-1 duration-300 active:scale-95"
                       >
                          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-accent-600 group-hover:text-white group-hover:rotate-12 transition-all shadow-inner">
                             <Smartphone size={18} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] font-black text-[#111827] uppercase tracking-tight group-hover:text-accent-600 transition-colors">{scan.model}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{scan.user} • {scan.location}</p>
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">{scan.time}</span>
                       </div>
                     ))}
                  </div>
                  <button 
                    onClick={() => handleAction('Full Analytics Matrix View', () => {})}
                    className="w-full mt-10 py-4 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-accent-50 hover:text-accent-600 active:scale-95 transition-all border border-dashed border-slate-200"
                  >
                     View All Activity Matrix
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
