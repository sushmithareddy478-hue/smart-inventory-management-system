import React from 'react';
import { Package, AlertTriangle, DollarSign, Clock, ArrowRight, ShieldCheck, Cpu, Database } from 'lucide-react';
import { DashboardMetrics, Product } from '../types';

interface DashboardProps {
  metrics: DashboardMetrics | null;
  onNavigateToTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  onNavigateToTab,
  onOpenScanner
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Loading real-time inventory metrics...
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Catalog SKUs',
      value: metrics.totalProducts,
      sub: 'Monitored across 4 categories',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockCount,
      sub: 'Action required immediately',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      badge: 'Urgent'
    },
    {
      title: 'Inventory Valuation',
      value: `$${metrics.totalInventoryValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: 'Current asset valuation in warehouse',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Pending Purchase Orders',
      value: metrics.pendingPurchaseOrders,
      sub: 'Awaiting supplier confirmation',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Overview */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Operations Overview</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time telemetry, automated demand velocity predictions, and stock replenishments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            Scan In / Out
          </button>
          <button
            onClick={() => onNavigateToTab('ai')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Ask AI Copilot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-lg border ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                {kpi.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Category Breakdown & Low Stock Alert Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Stock by Category</h3>
            <span className="text-xs text-slate-500">Total Units</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {metrics.stockByCategory ? Object.entries(metrics.stockByCategory).map(([category, count]) => {
              const totalStock = Object.values(metrics.stockByCategory).reduce((a, b) => a + b, 0);
              const percent = Math.min(100, Math.round((count / (totalStock || 1)) * 100));

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[180px]">{category}</span>
                    <span className="text-slate-500 font-mono">{count} units ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-slate-500">No category data available.</p>
            )}
          </div>
        </div>

        {/* Low Stock Watchlist (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">Critical Reorder Watchlist</h3>
            </div>
            <button
              onClick={() => onNavigateToTab('inventory')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-200 bg-slate-50/70">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Item Details</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Current Stock</th>
                  <th className="py-2.5 px-3 font-semibold">Min Threshold</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(metrics.urgentLowStockProducts || []).map((item: Product) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">{item.locationRack}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-rose-700 bg-rose-50 border border-rose-200">
                        {item.quantityInStock} {item.unitOfMeasure}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.minThreshold} {item.unitOfMeasure}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigateToTab('ai')}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                      >
                        Auto-PO Draft
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Telemetry Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <Database className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Database Connection</p>
            <p className="text-slate-500 text-[11px]">HikariCP connection pool running on MySQL / H2</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <Cpu className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Spring AI + OpenAI Integration</p>
            <p className="text-slate-500 text-[11px]">Real-time forecasting algorithms &amp; assistant active</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Security &amp; RBAC Active</p>
            <p className="text-slate-500 text-[11px]">Role access enabled for Admin, Manager, and Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
};
