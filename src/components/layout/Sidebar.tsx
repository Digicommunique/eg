import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Factory, 
  Cpu,
  Users, 
  ReceiptIndianRupee, 
  ShieldCheck, 
  Wrench, 
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Bell,
  Map,
  Database,
  Layers
} from 'lucide-react';
import { useAuthStore, UserRole } from '../../store/authStore';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigation = [
  {
    title: 'OVERVIEW',
    color: 'cyan',
    items: [
      { id: 'dashboard', label: 'Overview Monitoring', icon: LayoutDashboard, roles: Object.values(UserRole) },
      { id: 'management-kpi', label: 'MANAGEMENT KPI', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
      { id: 'dealer-performance', label: 'DEALER PERFORMANCE', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES_PERSON] },
      { id: 'regional-sales', label: 'REGIONAL SALES FLOW', icon: Map, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES_PERSON] },
      { id: 'alerts', label: 'OPERATIONAL ALERTS', icon: Bell, roles: Object.values(UserRole) },
    ]
  },
  {
    title: 'OPERATIONS',
    color: 'slate',
    items: [
      { id: 'store-keeper', label: 'STORE KEEPER DASHBOARD', icon: Database, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STORE_KEEPER] },
      { id: 'raw-material-dashboard', label: 'RAW MATERIAL DASHBOARD', icon: Package, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STORE_KEEPER] },
      { id: 'finished-goods', label: 'FINISHED GOODS', icon: Factory, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STORE_KEEPER] },
      { id: 'inventory', label: 'INVENTORY MASTER', icon: Layers, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STORE_KEEPER] },
      { id: 'mrp', label: 'MRP PLANNING', icon: Cpu, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRODUCTION_TEAM] },
      { id: 'production', label: 'MANUFACTURING HUB', icon: Factory, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRODUCTION_TEAM, UserRole.STORE_KEEPER] },
    ]
  },
  {
    title: 'COMMERCIAL',
    color: 'slate',
    items: [
      { id: 'crm', label: 'CRM & SALES', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES_PERSON] },
      { id: 'billing', label: 'BILLING & ACCOUNTS', icon: ReceiptIndianRupee, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.BILLER] },
    ]
  },
  {
    title: 'POST-SALES',
    color: 'slate',
    items: [
      { id: 'warranty', label: 'WARRANTY MANAGEMENT', icon: ShieldCheck, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.WARRANTY_TEAM] },
      { id: 'engagement', label: 'CUSTOMER ENGAGEMENT', icon: Smartphone, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES_PERSON] },
      { id: 'service', label: 'SERVICE CENTER', icon: Wrench, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SERVICE_TEAM, UserRole.PLANT_SERVICE_ENGINEER] },
      { id: 'analytics', label: 'ANALYTICS REPORTING', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(true);

  if (!user) return null;

  return (
    <div className={cn(
      "h-screen text-white transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden",
      isOpen ? "w-64" : "w-20"
    )} style={{ background: 'radial-gradient(circle at 30% 50%, #e38676 0%, #912551 100%)' }}>
      {/* Decorative glass overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

      <div className="p-6 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-sm">
        {isOpen && (
          <div className="font-black text-2xl tracking-tighter italic text-white drop-shadow-md relative">
            ARCENOL<span className="text-white/40 text-3xl leading-none">.</span>
            <div className="absolute -top-1 -right-4 h-2 w-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isOpen ? <X size={20} className="text-white/60" /> : <Menu size={20} className="text-white/60" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
        {navigation.map((section) => {
          const visibleItems = section.items.filter(item => item.roles.includes(user.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className={cn(
              "space-y-1 p-2 rounded-2xl transition-all duration-500",
              section.color === 'cyan' && "bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm"
            )}>
              {isOpen && (
                <p className={cn(
                  "px-2 text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center",
                  section.color === 'cyan' ? "text-white" : "text-white/40"
                )}>
                  <span className={cn("h-px w-4 mr-3", section.color === 'cyan' ? "bg-white/40" : "bg-white/20")}></span>
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative border border-transparent mb-1 active:scale-95",
                      activeTab === item.id 
                        ? "bg-white text-primary-900 font-black shadow-xl" 
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {activeTab === item.id && (
                      <div className="absolute left-0 w-1.5 h-6 bg-primary-600 rounded-r-full shadow-lg" />
                    )}
                    <item.icon size={18} className={cn(
                      "transition-all duration-500 group-hover:scale-110",
                      activeTab === item.id ? "text-primary-600" : "text-white/60 group-hover:text-white"
                    )} />
                    {isOpen && <span className={cn(
                      "ml-4 text-[10px] font-black uppercase tracking-[0.15em] leading-none transition-all duration-300",
                      activeTab === item.id ? "scale-105" : "group-hover:translate-x-1"
                    )}>{item.label}</span>}
                    {isOpen && activeTab === item.id && <ChevronRight size={14} className="ml-auto text-primary-200" />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10 bg-black/10 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-3 mb-6 p-2 rounded-2xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-white text-primary-900 flex items-center justify-center font-black text-lg shadow-xl">
            {user.name[0]}
          </div>
          {isOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate text-white">{user.name}</p>
              <p className="text-[9px] font-bold text-white/40 truncate uppercase tracking-widest">{user.role}</p>
            </div>
          )}
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest group active:scale-95 border border-white/5"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="ml-3">System Logout</span>}
        </button>
      </div>
    </div>
  );
};
