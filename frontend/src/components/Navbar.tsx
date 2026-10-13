import React from 'react';
import { Bell, Scan, Shield, Boxes, User as UserIcon, LogOut } from 'lucide-react';
import { UserRole, AuthResponse } from '../types';

interface NavbarProps {
  currentUser: AuthResponse | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  lowStockCount: number;
  onOpenScanner: () => void;
  onNavigateToTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  setCurrentRole,
  lowStockCount,
  onOpenScanner,
  onNavigateToTab,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Inventory Pro
            </span>
            <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Enterprise v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">Warehouse &amp; Supply Chain Management</p>
        </div>
      </div>

      {/* Action shortcuts & User Profile controls */}
      <div className="flex items-center gap-3">
        {/* Quick Barcode Scanner Trigger */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-300/80 text-xs font-medium transition-colors shadow-xs"
          title="Open Barcode / QR Scanner"
        >
          <Scan className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Scan Barcode / QR</span>
        </button>

        {/* Low Stock Alerts Notification Bell */}
        <button
          onClick={() => onNavigateToTab('inventory')}
          className="relative p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shadow-xs"
          title={`${lowStockCount} items low in stock`}
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Active Role Selector */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 hidden md:flex font-medium">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Role:</span>
          </div>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-white text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-xs font-medium"
          >
            <option value="ROLE_ADMIN">Admin (Full Access)</option>
            <option value="ROLE_WAREHOUSE_MANAGER">Warehouse Manager</option>
            <option value="ROLE_STAFF">Staff (Read &amp; Scan)</option>
          </select>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-2 ml-1">
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 hidden lg:flex text-right">
              <div className="text-xs">
                <div className="font-semibold text-slate-900 leading-tight">
                  {currentUser?.fullName || currentUser?.username || 'Authenticated User'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  @{currentUser?.username || 'user'}
                </div>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-semibold text-xs" title={currentUser?.email || 'User'}>
              <UserIcon className="w-4 h-4" />
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 text-xs font-medium transition-colors shadow-xs ml-1"
              title="Sign out of session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
