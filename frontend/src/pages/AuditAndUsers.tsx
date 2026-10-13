import React, { useState, useEffect } from 'react';
import { Shield, FileText, Check, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { AuditLog, User, UserRole } from '../types';
import { apiClient } from '../api/client';

interface AuditAndUsersProps {
  currentRole: UserRole;
}

export const AuditAndUsers: React.FC<AuditAndUsersProps> = ({ currentRole }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'matrix'>('audit');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [logs, uList] = await Promise.all([
      apiClient.getAuditLogs(),
      apiClient.getUsers()
    ]);
    setAuditLogs(logs);
    setUsers(uList);
  };

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    if (currentRole !== 'ROLE_ADMIN') {
      setNotice('Access Denied: Only users with ROLE_ADMIN can modify user permissions.');
      setTimeout(() => setNotice(null), 4000);
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setNotice(`Updated user role to ${newRole}`);
    setTimeout(() => setNotice(null), 3000);
  };

  const permissionMatrix = [
    { permission: 'View Dashboard & Stock Counts', admin: true, manager: true, staff: true },
    { permission: 'Scan Barcodes & Look Up Items', admin: true, manager: true, staff: true },
    { permission: 'Perform Stock Adjustments (Dispatch/Receive)', admin: true, manager: true, staff: true },
    { permission: 'Create & Update Product Catalog', admin: true, manager: true, staff: false },
    { permission: 'Delete Inventory SKUs', admin: true, manager: false, staff: false },
    { permission: 'Create & Approve Purchase Orders', admin: true, manager: true, staff: false },
    { permission: 'Use AI Demand Forecasting & Copilot', admin: true, manager: true, staff: true },
    { permission: 'Manage Users & Security Roles', admin: true, manager: false, staff: false },
    { permission: 'View System Audit Trail Logs', admin: true, manager: true, staff: false }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trails &amp; Access Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">Immutable audit event logs and Multi-Tenant Role-Based Access Control (RBAC)</p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'users' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'matrix' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Permission Matrix
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tab 1: Audit Logs Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Entity &amp; Action</th>
                  <th className="py-3 px-4 font-semibold">User Email</th>
                  <th className="py-3 px-4 font-semibold">IP Address</th>
                  <th className="py-3 px-4 font-semibold">Delta &amp; Changes (JSON)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{log.entityName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200 text-emerald-800 font-semibold">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {log.userEmail}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">
                      <code className="bg-slate-50 px-2 py-1 rounded border border-slate-200 block max-w-md truncate">
                        {log.changesJson}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Role Management */}
      {activeTab === 'users' && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Assigned Organization Accounts</span>
            {currentRole !== 'ROLE_ADMIN' && (
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 flex items-center gap-1 font-medium">
                <Lock className="w-3.5 h-3.5" />
                Read-only mode (Admin privileges required to alter roles)
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        disabled={currentRole !== 'ROLE_ADMIN'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 disabled:opacity-60 cursor-pointer shadow-xs focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        <option value="ROLE_WAREHOUSE_MANAGER">ROLE_WAREHOUSE_MANAGER</option>
                        <option value="ROLE_STAFF">ROLE_STAFF</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: RBAC Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Resource / Capability</th>
                  <th className="py-3 px-4 font-semibold text-center">ROLE_ADMIN</th>
                  <th className="py-3 px-4 font-semibold text-center">ROLE_WAREHOUSE_MANAGER</th>
                  <th className="py-3 px-4 font-semibold text-center">ROLE_STAFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{item.permission}</td>
                    <td className="py-3 px-4 text-center">
                      {item.admin ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.manager ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.staff ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
