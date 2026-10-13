import React, { useState } from 'react';
import { X, Scan, CheckCircle2, AlertTriangle, ArrowDownRight, ArrowUpRight, Search } from 'lucide-react';
import { Product } from '../types';
import { apiClient } from '../api/client';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStockUpdated: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onStockUpdated
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (code: string) => {
    setIsScanning(true);
    setMessage(null);
    setScannedProduct(null);

    // Simulate laser reading animation
    setTimeout(async () => {
      const product = await apiClient.getProductByBarcode(code.trim());
      setIsScanning(false);
      if (product) {
        setScannedProduct(product);
      } else {
        setMessage({ text: `No item found for barcode: ${code}`, type: 'error' });
      }
    }, 400);
  };

  const handleStockAction = async (delta: number) => {
    if (!scannedProduct) return;
    const success = await apiClient.adjustStock(
      scannedProduct.id,
      delta,
      delta > 0 ? 'Barcode Scanner Stock-In' : 'Barcode Scanner Dispatch'
    );
    if (success) {
      setMessage({
        text: `Stock successfully updated! New quantity: ${scannedProduct.quantityInStock + delta}`,
        type: 'success'
      });
      setScannedProduct({
        ...scannedProduct,
        quantityInStock: scannedProduct.quantityInStock + delta,
        lowStock: (scannedProduct.quantityInStock + delta) <= scannedProduct.minThreshold
      });
      onStockUpdated();
    } else {
      setMessage({ text: 'Stock update failed.', type: 'error' });
    }
  };

  const sampleBarcodes = [
    { code: '890123456701', label: 'Samsung 2TB NVMe' },
    { code: '890123456702', label: 'GeForce RTX 4080 (Low Stock)' },
    { code: '890123456704', label: 'Wireless Keyboard (Low Stock)' },
    { code: '890123456707', label: 'Corrugated Boxes' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Scan className="w-5 h-5 text-emerald-600" />
            <span>Interactive Barcode &amp; QR Scanner</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Virtual Scanner Viewport */}
          <div className="relative h-44 rounded-xl bg-slate-50 border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Laser Line */}
            <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" style={{ top: '48%' }} />

            <Scan className={`w-12 h-12 text-emerald-600/40 ${isScanning ? 'scale-110 animate-bounce' : ''}`} />
            <p className="mt-2 text-xs font-medium text-slate-600">Position barcode within viewport</p>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-widest mt-0.5">Camera Sensor Active (Simulation)</span>
          </div>

          {/* Quick Barcode Presets */}
          <div>
            <label className="text-xs text-slate-500 block mb-1.5 font-medium">Quick Test Barcode Presets:</label>
            <div className="flex flex-wrap gap-2">
              {sampleBarcodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setBarcodeInput(item.code);
                    handleLookup(item.code);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (barcodeInput.trim()) handleLookup(barcodeInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Scan or enter barcode number..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !barcodeInput.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </form>

          {/* Feedback messages */}
          {message && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Scanned Product Card with Quick Stock-In / Out */}
          {scannedProduct && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{scannedProduct.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {scannedProduct.sku} | Rack: {scannedProduct.locationRack}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  scannedProduct.lowStock ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {scannedProduct.lowStock ? 'LOW STOCK' : 'IN STOCK'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-slate-200">
                <div>
                  <p className="text-slate-500 text-[10px]">Current Qty</p>
                  <p className="font-bold text-slate-900 text-base">{scannedProduct.quantityInStock}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">Min Threshold</p>
                  <p className="font-medium text-slate-700 text-base">{scannedProduct.minThreshold}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px]">Unit Price</p>
                  <p className="font-semibold text-slate-900 text-base">${scannedProduct.unitPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Instant Stock Adjustment */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center text-slate-900 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStockAction(adjustQty)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Receive (+{adjustQty})</span>
                  </button>

                  <button
                    onClick={() => handleStockAction(-adjustQty)}
                    disabled={scannedProduct.quantityInStock < adjustQty}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Dispatch (-{adjustQty})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
