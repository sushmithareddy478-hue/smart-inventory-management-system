import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Clock, XCircle, Plus, Star, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { PurchaseOrder, Supplier, OrderStatus, UserRole } from '../types';
import { apiClient } from '../api/client';

interface SuppliersAndOrdersProps {
  currentRole: UserRole;
  onRefreshAll: () => void;
}

export const SuppliersAndOrders: React.FC<SuppliersAndOrdersProps> = ({ currentRole, onRefreshAll }) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');

  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [newPoSupplierId, setNewPoSupplierId] = useState<number>(1);
  const [newPoQty, setNewPoQty] = useState<number>(20);
  const [newPoDelivery, setNewPoDelivery] = useState<string>('2026-10-25');
  const [newPoNotes, setNewPoNotes] = useState<string>('Standard inventory replenishment');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ord, sup] = await Promise.all([
      apiClient.getOrders(),
      apiClient.getSuppliers()
    ]);
    setOrders(ord);
    setSuppliers(sup);
  };

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    await apiClient.updateOrderStatus(orderId, status);
    await loadData();
    onRefreshAll();
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === Number(newPoSupplierId));
    const created: PurchaseOrder = {
      id: Date.now(),
      orderNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: Number(newPoSupplierId),
      supplierName: sup ? sup.name : 'Apex Micro Systems Ltd',
      status: 'PENDING',
      totalAmount: newPoQty * 85.0,
      expectedDeliveryDate: newPoDelivery,
      notes: newPoNotes,
      createdByUsername: 'manager',
      createdAt: new Date().toISOString(),
      items: [
        { productId: 1, productName: 'Replenishment Batch', sku: 'SKU-BATCH-01', quantity: newPoQty, unitPrice: 85.0 }
      ]
    };
    orders.unshift(created);
    setIsCreatePoOpen(false);
    onRefreshAll();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            Approved
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Received &amp; Stocked
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers &amp; Procurement Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage partner vendor logistics, lead times, and purchase order fulfillment workflows</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Purchase Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'suppliers' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendor Directory ({suppliers.length})
            </button>
          </div>

          {(currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_WAREHOUSE_MANAGER') && (
            <button
              onClick={() => setIsCreatePoOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Purchase Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">PO Number</th>
                  <th className="py-3 px-4 font-semibold">Supplier</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Expected Delivery</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {order.orderNumber}
                      <div className="text-[10px] text-slate-500 font-normal">By {order.createdByUsername}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {order.supplierName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.expectedDeliveryDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'APPROVED')}
                              className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium shadow-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                              className="px-2.5 py-1 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium shadow-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'RECEIVED')}
                            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors"
                          >
                            Receive &amp; Ingest Stock
                          </button>
                        )}
                        {order.status === 'RECEIVED' && (
                          <span className="text-slate-500 text-xs italic">Fulfillment Complete</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-slate-700">{s.rating} Supplier Rating</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {s.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.email} ({s.contactPerson})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Avg Lead Time: <strong className="text-slate-800">{s.leadTimeDays} business days</strong>
                </span>
                <button
                  onClick={() => {
                    setNewPoSupplierId(s.id);
                    setIsCreatePoOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-300 shadow-xs transition-colors"
                >
                  Create Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isCreatePoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleCreatePo} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Generate New Purchase Order</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Select Supplier</label>
                <select
                  value={newPoSupplierId}
                  onChange={(e) => setNewPoSupplierId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.leadTimeDays}d lead time)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Estimated Replenishment Qty (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={newPoQty}
                  onChange={(e) => setNewPoQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Target Delivery Date</label>
                <input
                  type="date"
                  value={newPoDelivery}
                  onChange={(e) => setNewPoDelivery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Procurement Notes</label>
                <textarea
                  rows={2}
                  value={newPoNotes}
                  onChange={(e) => setNewPoNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreatePoOpen(false)}
                className="px-4 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Submit Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
