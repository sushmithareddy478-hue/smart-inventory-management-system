import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { AiAssistant } from './pages/AiAssistant';
import { SuppliersAndOrders } from './pages/SuppliersAndOrders';
import { AuditAndUsers } from './pages/AuditAndUsers';
import { DashboardMetrics, Product, UserRole, AuthResponse } from './types';
import { apiClient } from './api/client';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(() => apiClient.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const existing = apiClient.getCurrentUser();
    return existing ? existing.role : 'ROLE_ADMIN';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([
        apiClient.getDashboardMetrics(),
        apiClient.getProducts()
      ]);
      setMetrics(m);
      setProducts(p);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: AuthResponse) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    apiClient.logout();
    setCurrentUser(null);
  };

  // If user is not authenticated, display the Login security gate
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const lowStockCount = products.filter(p => p.quantityInStock <= p.minThreshold).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-600 selection:text-white font-sans">
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        lowStockCount={lowStockCount}
        onOpenScanner={() => setIsScannerOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {loading && !metrics ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-emerald-600"></div>
              <p className="text-xs font-medium">Loading inventory data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  metrics={metrics}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              )}

              {activeTab === 'inventory' && (
                <Inventory
                  products={products}
                  currentRole={currentRole}
                  onRefresh={refreshAllData}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              )}

              {activeTab === 'ai' && (
                <AiAssistant />
              )}

              {activeTab === 'orders' && (
                <SuppliersAndOrders
                  currentRole={currentRole}
                  onRefreshAll={refreshAllData}
                />
              )}

              {activeTab === 'admin' && (
                <AuditAndUsers
                  currentRole={currentRole}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Barcode & QR Code Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onStockUpdated={refreshAllData}
      />
    </div>
  );
};

export default App;
