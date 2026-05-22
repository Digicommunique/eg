import React, { useState } from 'react';
import { useAuthStore, UserRole } from './store/authStore';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { Dashboard } from './modules/Dashboard';
import { Inventory } from './modules/Inventory';
import { StoreKeeperDashboard } from './modules/StoreKeeperDashboard';
import { Production } from './modules/Production';
import { MRP } from './modules/MRP';
import { FinishedGoods } from './modules/FinishedGoods';
import { DealerPerformance } from './modules/DealerPerformance';
import { RegionalSales } from './modules/RegionalSales';
import { ManagementKPI } from './modules/ManagementKPI';
import { Alerts } from './modules/Alerts';
import { CRM } from './modules/CRM';
import { Billing } from './modules/Billing';
import { Warranty } from './modules/Warranty';
import { Service } from './modules/Service';
import { Analytics } from './modules/Analytics';
import { Engagement } from './modules/Engagement';
import { Battery, Zap, ChevronRight, LayoutDashboard, Database, PieChart, Users, ReceiptIndianRupee, ShieldCheck, Wrench, BarChart3, Smartphone } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab ] = useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-200/20 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-200/20 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#546f9b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 border border-slate-200 mx-auto">
          <div className="p-12 md:p-16 flex flex-col justify-center border-r border-slate-100">
            <div className="flex items-center space-x-3 text-primary-600 mb-10 group cursor-default">
              <div className="p-3 bg-primary-100 rounded-2xl border border-primary-200 group-hover:scale-110 transition-transform">
                <Zap fill="currentColor" size={28} className="drop-shadow-[0_0_12px_rgba(84,111,155,0.3)]" />
              </div>
              <span className="font-black text-3xl tracking-tighter italic text-primary-900 drop-shadow-sm">ARCENOL</span>
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-3 leading-tight tracking-tighter italic">ENTERPRISE<br/><span className="text-primary-600 not-italic">COMMAND CENTER</span></h1>
            <p className="text-slate-500 mb-12 text-sm font-medium leading-relaxed max-w-sm">Authenticating your node in the global energy ecosystem. Select your authorization tier below.</p>
            
            <div className="space-y-6">
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 flex items-center">
                <span className="h-px w-8 bg-primary-200 mr-3"></span>
                Security Clearance Required
              </p>
              <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
                {[
                  { role: UserRole.SUPER_ADMIN, label: 'Super Admin', icon: ShieldCheck, color: 'text-primary-600' },
                  { role: UserRole.ADMIN, label: 'Ops Admin', icon: LayoutDashboard, color: 'text-primary-500' },
                  { role: UserRole.STORE_KEEPER, label: 'Inventory', icon: Database, color: 'text-amber-600' },
                  { role: UserRole.PRODUCTION_TEAM, label: 'Manufacturing', icon: Battery, color: 'text-slate-600' },
                  { role: UserRole.QUALITY_TEAM, label: 'Quality Control', icon: Zap, color: 'text-blue-600' },
                  { role: UserRole.SALES_PERSON, label: 'CRM / Sales', icon: Users, color: 'text-slate-600' },
                  { role: UserRole.BILLER, label: 'Finance Hub', icon: ReceiptIndianRupee, color: 'text-slate-600' },
                  { role: UserRole.WARRANTY_TEAM, label: 'Warranty Claims', icon: ShieldCheck, color: 'text-red-600' },
                  { role: UserRole.SERVICE_TEAM, label: 'RMA Center', icon: Wrench, color: 'text-orange-600' },
                  { role: UserRole.PLANT_SERVICE_ENGINEER, label: 'Plant Support', icon: Smartphone, color: 'text-cyan-600' },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => login(item.role)}
                    className="flex items-center p-3.5 rounded-2xl bg-white hover:bg-slate-50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-left group border border-slate-100 relative overflow-hidden shadow-sm"
                  >
                    <div className={cn("p-2 rounded-xl bg-slate-50 mr-3 group-hover:scale-110 transition-transform", item.color)}>
                        <item.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest leading-none mb-1 group-hover:text-primary-600 transition-colors">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight truncate">Level {Math.floor(Math.random() * 5) + 3} Clearance</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex bg-slate-50/50 relative p-16 flex-col justify-between items-center text-center overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 blur-3xl rounded-full"></div>

             <div className="space-y-12 mt-8 w-full max-w-xs relative z-10">
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { role: UserRole.ADMIN, icon: LayoutDashboard, label: 'LIVE DASH', color: 'text-primary-600', shadow: 'shadow-primary-500/10' },
                     { role: UserRole.STORE_KEEPER, icon: Database, label: 'LOGISTICS', color: 'text-amber-600', shadow: 'shadow-amber-500/10' },
                     { role: UserRole.PRODUCTION_TEAM, icon: Battery, label: 'AUTONOMY', color: 'text-slate-600', shadow: 'shadow-slate-500/10' },
                     { role: UserRole.SUPER_ADMIN, icon: PieChart, label: 'STRATEGY', color: 'text-primary-700', shadow: 'shadow-primary-700/10' },
                   ].map((btn) => (
                     <button 
                       key={btn.label}
                       onClick={() => login(btn.role)}
                       className={cn(
                         "p-6 bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-left group cursor-pointer",
                         btn.shadow
                       )}
                     >
                        <btn.icon className={cn("mb-3 transition-transform group-hover:rotate-12", btn.color)} size={36} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] group-hover:text-primary-900 transition-colors">{btn.label}</span>
                     </button>
                   ))}
                </div>

                <div className="py-8 relative">
                    <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl animate-pulse scale-150"></div>
                    <div className="relative h-48 w-48 mx-auto bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xl">
                      <Battery className="text-primary-600/80 rotate-90 animate-pulse" size={90} strokeWidth={0.5} />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full rounded-full border border-primary-500/10 animate-ping opacity-20"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Core Integrity Matrix</p>
                    <p className="text-[10px] text-slate-400 font-medium italic">Standardized Energy Operations v{new Date().getFullYear()}.4.2</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arcenol Digital Ecosystem</h1>
            <p className="text-lg font-bold text-slate-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-400">System Status</p>
                <div className="flex items-center text-xs font-bold text-primary-600">
                   <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_rgba(84,111,155,0.4)]"></div>
                   OPERATIONAL
                </div>
             </div>
             <NotificationCenter />
             <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 transition-colors cursor-pointer">
                <Zap size={20} />
             </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} activeTab={activeTab} />}
          {activeTab === 'management-kpi' && <ManagementKPI />}
          {activeTab === 'dealer-performance' && <DealerPerformance />}
          {activeTab === 'regional-sales' && <RegionalSales />}
          {activeTab === 'alerts' && <Alerts />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'store-keeper' && <StoreKeeperDashboard activeTab={activeTab} />}
          {activeTab === 'raw-material-dashboard' && <StoreKeeperDashboard activeTab={activeTab} />}
          {activeTab === 'finished-goods' && <FinishedGoods />}
          {activeTab === 'mrp' && <MRP />}
          {activeTab === 'production' && <Production />}
          {activeTab === 'crm' && <CRM />}
          {activeTab === 'billing' && <Billing />}
          {activeTab === 'warranty' && <Warranty />}
          {activeTab === 'engagement' && <Engagement />}
          {activeTab === 'service' && <Service />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </main>
    </div>
  );
}
