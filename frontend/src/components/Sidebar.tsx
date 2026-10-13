import React from 'react';
import { LayoutDashboard, Boxes, Sparkles, Truck, FileText, AlertTriangle, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lowStockCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Manager', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'ai', label: 'AI Forecasting & Copilot', icon: Sparkles, highlight: true },
    { id: 'orders', label: 'Suppliers & Orders', icon: Truck },
    { id: 'admin', label: 'Audit & Roles', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-5">
        <div className="px-3 pt-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-3 h-3" />
                    {item.badge}
                  </span>
                )}

                {item.highlight && !item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Intelligence Status Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Demand Forecasting</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Dynamic sales velocity &amp; safety-stock calculation active.
        </p>
      </div>
    </aside>
  );
};
