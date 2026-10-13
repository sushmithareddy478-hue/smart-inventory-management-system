import React, { useState } from 'react';
import { Search, Plus, Scan, Filter, ArrowUpRight, ArrowDownRight, Package, AlertCircle } from 'lucide-react';
import { Product, UserRole } from '../types';
import { apiClient } from '../api/client';

interface InventoryProps {
  products: Product[];
  currentRole: UserRole;
  onRefresh: () => void;
  onOpenScanner: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  products,
  currentRole,
  onRefresh,
  onOpenScanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Quick Adjustment Modal State
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    barcode: '',
    name: '',
    categoryName: 'Electronics & Components',
    unitPrice: 99.00,
    costPrice: 65.00,
    quantityInStock: 25,
    minThreshold: 10,
    reorderPoint: 20,
    locationRack: 'RACK-A1-05',
    unitOfMeasure: 'PCS'
  });

  const categories = ['ALL', 'Electronics & Components', 'Storage & Networking', 'Office Hardware', 'Packaging & Materials'];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const matchesCategory = selectedCategory === 'ALL' || p.categoryName === selectedCategory;
    const matchesLowStock = !lowStockFilter || (p.quantityInStock <= p.minThreshold);

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleAdjustSubmit = async (isStockIn: boolean) => {
    if (!adjustingProduct) return;
    const delta = isStockIn ? adjustAmount : -adjustAmount;
    await apiClient.adjustStock(
      adjustingProduct.id,
      delta,
      adjustReason || (isStockIn ? 'Manual Stock In' : 'Manual Dispatch')
    );
    setAdjustingProduct(null);
    setAdjustAmount(1);
    setAdjustReason('');
    onRefresh();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: Date.now(),
      ...newProduct,
      status: 'ACTIVE',
      lowStock: newProduct.quantityInStock <= newProduct.minThreshold
    };
    products.push(created);
    setIsAddModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog &amp; Stock Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage SKUs, scan barcodes, and track warehouse shelf allocations</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition-colors shadow-xs"
          >
            <Scan className="w-4 h-4 text-slate-600" />
            <span>Barcode Scanner</span>
          </button>

          {(currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_WAREHOUSE_MANAGER') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or barcode number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              lowStockFilter
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Low Stock Only</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">SKU &amp; Barcode</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Shelf Rack</th>
                <th className="py-3 px-4 font-semibold">Unit Price</th>
                <th className="py-3 px-4 font-semibold">Stock Level</th>
                <th className="py-3 px-4 font-semibold text-right">Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Package className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    No products matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.quantityInStock <= p.minThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.supplierName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-emerald-700 font-semibold">{p.sku}</div>
                        <div className="text-slate-500 text-[10px]">BAR: {p.barcode}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          {p.categoryName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                        {p.locationRack}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ${p.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                              isLow
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {p.quantityInStock} {p.unitOfMeasure}
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-rose-600 font-medium flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" />
                              Min {p.minThreshold}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 shadow-xs transition-colors"
                        >
                          Adjust Qty
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Adjust Stock: {adjustingProduct.name}</h3>
            <p className="text-xs text-slate-500">Current stock: {adjustingProduct.quantityInStock} {adjustingProduct.unitOfMeasure}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Adjustment Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Reason / Reference (Audit Log)</label>
                <input
                  type="text"
                  placeholder="e.g. Inbound shipment PO-88, or Damaged stock scrap"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdjustSubmit(false)}
                disabled={adjustingProduct.quantityInStock < adjustAmount}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Stock Out (-{adjustAmount})</span>
              </button>
              <button
                onClick={() => handleAdjustSubmit(true)}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Stock In (+{adjustAmount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleCreateProduct} className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base">Add New Product to Catalog</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-600 block mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">SKU</label>
                <input
                  type="text"
                  required
                  placeholder="SKU-XXX-01"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Barcode</label>
                <input
                  type="text"
                  required
                  placeholder="890123456..."
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.unitPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.costPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Initial Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantityInStock}
                  onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Min Threshold</label>
                <input
                  type="number"
                  value={newProduct.minThreshold}
                  onChange={(e) => setNewProduct({ ...newProduct, minThreshold: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
