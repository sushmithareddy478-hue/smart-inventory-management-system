import { DashboardMetrics, Product, Supplier, PurchaseOrder, ForecastResult, ReorderSuggestion, AuditLog, User, OrderStatus, AuthResponse } from '../types';

const API_BASE = '/api/v1';

// Initial fallback mock data matching V2__seed_demo_data.sql for standalone visual testing
const mockProducts: Product[] = [
  { id: 1, sku: 'SKU-NVME-2TB', barcode: '890123456701', name: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD', categoryName: 'Storage & Networking', supplierId: 1, supplierName: 'Apex Micro Systems Ltd', unitPrice: 179.99, costPrice: 130.00, quantityInStock: 48, minThreshold: 15, reorderPoint: 30, locationRack: 'RACK-B2-04', unitOfMeasure: 'PCS', status: 'ACTIVE', lowStock: false },
  { id: 2, sku: 'SKU-RTX-4080', barcode: '890123456702', name: 'GeForce RTX 4080 Super 16GB OC', categoryName: 'Electronics & Components', supplierId: 1, supplierName: 'Apex Micro Systems Ltd', unitPrice: 999.00, costPrice: 840.00, quantityInStock: 6, minThreshold: 8, reorderPoint: 15, locationRack: 'RACK-A1-02', unitOfMeasure: 'PCS', status: 'ACTIVE', lowStock: true },
  { id: 3, sku: 'SKU-SFP-10G', barcode: '890123456703', name: '10G SFP+ Optical Transceiver Module 850nm', categoryName: 'Storage & Networking', supplierId: 2, supplierName: 'Global Core Logistics Corp', unitPrice: 34.50, costPrice: 21.00, quantityInStock: 120, minThreshold: 25, reorderPoint: 50, locationRack: 'RACK-C1-11', unitOfMeasure: 'PCS', status: 'ACTIVE', lowStock: false },
  { id: 4, sku: 'SKU-MECH-KB', barcode: '890123456704', name: 'ProLogix Wireless Hot-Swap Mechanical Keyboard', categoryName: 'Office Hardware', supplierId: 3, supplierName: 'Shenzhen Precision Parts', unitPrice: 89.00, costPrice: 52.00, quantityInStock: 4, minThreshold: 10, reorderPoint: 20, locationRack: 'RACK-D4-09', unitOfMeasure: 'PCS', status: 'ACTIVE', lowStock: true },
  { id: 5, sku: 'SKU-CAT6A-305M', barcode: '890123456705', name: 'Shielded Cat6A Bulk Pure Copper Cable 305m Spool', categoryName: 'Storage & Networking', supplierId: 2, supplierName: 'Global Core Logistics Corp', unitPrice: 185.00, costPrice: 125.00, quantityInStock: 22, minThreshold: 10, reorderPoint: 18, locationRack: 'RACK-E3-01', unitOfMeasure: 'SPOOL', status: 'ACTIVE', lowStock: false },
  { id: 6, sku: 'SKU-USB-HUB-7P', barcode: '890123456706', name: 'Industrial 7-Port USB 3.2 Gen 2 Hub with 36W Adapter', categoryName: 'Office Hardware', supplierId: 3, supplierName: 'Shenzhen Precision Parts', unitPrice: 62.00, costPrice: 38.00, quantityInStock: 2, minThreshold: 6, reorderPoint: 12, locationRack: 'RACK-D1-05', unitOfMeasure: 'PCS', status: 'ACTIVE', lowStock: true },
  { id: 7, sku: 'SKU-CORR-BX-M', barcode: '890123456707', name: 'Heavy Duty Corrugated Shipping Boxes 12x12x10 (Bundle of 25)', categoryName: 'Packaging & Materials', supplierId: 4, supplierName: 'Nordic Industrial Pack', unitPrice: 38.00, costPrice: 22.00, quantityInStock: 95, minThreshold: 20, reorderPoint: 40, locationRack: 'RACK-W1-08', unitOfMeasure: 'BUNDLE', status: 'ACTIVE', lowStock: false },
  { id: 8, sku: 'SKU-THERM-LBL', barcode: '890123456708', name: 'Direct Thermal Shipping Labels 4x6 inch (4 Rolls / 1000 Labels)', categoryName: 'Packaging & Materials', supplierId: 4, supplierName: 'Nordic Industrial Pack', unitPrice: 29.99, costPrice: 16.50, quantityInStock: 140, minThreshold: 30, reorderPoint: 60, locationRack: 'RACK-W2-02', unitOfMeasure: 'PACK', status: 'ACTIVE', lowStock: false }
];

const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Apex Micro Systems Ltd', contactPerson: 'Marcus Vance', email: 'marcus@apexmicro.com', phone: '+1-555-019-2831', address: '100 Silicon Way, San Jose, CA', rating: 4.90, leadTimeDays: 5, status: 'ACTIVE' },
  { id: 2, name: 'Global Core Logistics Corp', contactPerson: 'Sarah Lin', email: 'slin@globalcorelog.com', phone: '+1-555-018-9922', address: '450 Freight Blvd, Chicago, IL', rating: 4.70, leadTimeDays: 7, status: 'ACTIVE' },
  { id: 3, name: 'Shenzhen Precision Parts', contactPerson: 'Wei Zhang', email: 'export@szprecision.cn', phone: '+86-755-8821-3990', address: 'Building 4, Nanshan Tech Park, Shenzhen', rating: 4.60, leadTimeDays: 14, status: 'ACTIVE' },
  { id: 4, name: 'Nordic Industrial Pack', contactPerson: 'Frederik Lind', email: 'orders@nordicpack.eu', phone: '+45-33-91-20-40', address: 'Industrivej 12, Copenhagen, Denmark', rating: 4.85, leadTimeDays: 4, status: 'ACTIVE' }
];

const mockOrders: PurchaseOrder[] = [
  {
    id: 1,
    orderNumber: 'PO-2026-001',
    supplierId: 1,
    supplierName: 'Apex Micro Systems Ltd',
    status: 'APPROVED',
    totalAmount: 14985.00,
    expectedDeliveryDate: '2026-10-15',
    notes: 'Urgent batch restock for enterprise NVMe and GPU units',
    createdByUsername: 'manager',
    createdAt: '2026-09-29T08:30:00',
    items: [
      { id: 1, productId: 1, productName: 'Samsung 990 PRO 2TB NVMe', sku: 'SKU-NVME-2TB', quantity: 50, unitPrice: 130.00, receivedQuantity: 0 },
      { id: 2, productId: 2, productName: 'GeForce RTX 4080 Super', sku: 'SKU-RTX-4080', quantity: 10, unitPrice: 840.00, receivedQuantity: 0 }
    ]
  },
  {
    id: 2,
    orderNumber: 'PO-2026-002',
    supplierId: 3,
    supplierName: 'Shenzhen Precision Parts',
    status: 'PENDING',
    totalAmount: 2140.00,
    expectedDeliveryDate: '2026-10-22',
    notes: 'Q4 replenishment for hot-swap keyboards and USB hubs',
    createdByUsername: 'manager',
    createdAt: '2026-10-01T10:15:00',
    items: [
      { id: 3, productId: 4, productName: 'ProLogix Mechanical Keyboard', sku: 'SKU-MECH-KB', quantity: 25, unitPrice: 52.00, receivedQuantity: 0 },
      { id: 4, productId: 6, productName: 'Industrial 7-Port USB 3.2 Hub', sku: 'SKU-USB-HUB-7P', quantity: 20, unitPrice: 38.00, receivedQuantity: 0 }
    ]
  }
];

export const apiClient = {
  getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('inventory_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data: AuthResponse = await res.json();
        localStorage.setItem('inventory_token', data.token);
        localStorage.setItem('inventory_user', JSON.stringify(data));
        return data;
      }
      if (res.status === 401 && contentType.includes('application/json')) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Invalid username or password');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('401') && !e.message.includes('fetch')) {
        throw e;
      }
    }

    // Demo credentials fallback for standalone preview / Vercel deployment
    const validDemoPasswords = ['admin123', 'manager123', 'staff123', 'secret', 'password'];
    if (!validDemoPasswords.includes(password)) {
      throw new Error('Invalid username or password. Please use quick-fill buttons below: admin123, manager123, or staff123');
    }

    let role: any = 'ROLE_STAFF';
    let fullName = 'Staff Member';
    if (usernameOrEmail.toLowerCase().includes('admin')) {
      role = 'ROLE_ADMIN';
      fullName = 'System Administrator';
    } else if (usernameOrEmail.toLowerCase().includes('manager')) {
      role = 'ROLE_WAREHOUSE_MANAGER';
      fullName = 'Elena Rostova';
    } else {
      fullName = 'Alex Chen';
    }

    const fallbackUser: AuthResponse = {
      token: 'demo-local-jwt-token',
      tokenType: 'Bearer',
      id: 1,
      username: usernameOrEmail,
      email: `${usernameOrEmail}@inventorypro.io`,
      fullName: fullName,
      role: role
    };
    localStorage.setItem('inventory_token', fallbackUser.token);
    localStorage.setItem('inventory_user', JSON.stringify(fallbackUser));
    return fallbackUser;
  },

  getCurrentUser(): AuthResponse | null {
    const raw = localStorage.getItem('inventory_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('inventory_token');
    localStorage.removeItem('inventory_user');
  },

  async fetchWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...(options?.headers || {})
        }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return fallback;
    }
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const totalVal = mockProducts.reduce((sum, p) => sum + (p.quantityInStock * p.unitPrice), 0);
    const lowCount = mockProducts.filter(p => p.quantityInStock <= p.minThreshold).length;

    const fallback: DashboardMetrics = {
      totalProducts: mockProducts.length,
      lowStockCount: lowCount,
      pendingPurchaseOrders: mockOrders.filter(o => o.status === 'PENDING').length,
      totalInventoryValuation: totalVal,
      urgentLowStockProducts: mockProducts.filter(p => p.quantityInStock <= p.minThreshold),
      stockByCategory: {
        'Storage & Networking': 190,
        'Electronics & Components': 6,
        'Office Hardware': 6,
        'Packaging & Materials': 235
      }
    };
    return this.fetchWithFallback<DashboardMetrics>(`${API_BASE}/dashboard/metrics`, fallback);
  },

  async getProducts(): Promise<Product[]> {
    return this.fetchWithFallback<Product[]>(`${API_BASE}/products`, mockProducts);
  },

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    try {
      const res = await fetch(`${API_BASE}/products/barcode/${barcode}`, {
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {}
    return mockProducts.find(p => p.barcode === barcode);
  },

  async adjustStock(productId: number, quantityChange: number, reason: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify({
          productId,
          quantityChange,
          transactionType: quantityChange > 0 ? 'STOCK_IN' : 'STOCK_OUT',
          reason
        })
      });
      if (res.ok) return true;
    } catch {}

    // Fallback in-memory
    const p = mockProducts.find(item => item.id === productId);
    if (p) {
      p.quantityInStock = Math.max(0, p.quantityInStock + quantityChange);
      p.lowStock = p.quantityInStock <= p.minThreshold;
    }
    return true;
  },

  async getSuppliers(): Promise<Supplier[]> {
    return this.fetchWithFallback<Supplier[]>(`${API_BASE}/suppliers`, mockSuppliers);
  },

  async getOrders(): Promise<PurchaseOrder[]> {
    return this.fetchWithFallback<PurchaseOrder[]>(`${API_BASE}/orders`, mockOrders);
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status?status=${status}`, {
        method: 'PATCH',
        headers: { ...this.getAuthHeader() }
      });
      if (res.ok) return true;
    } catch {}

    const order = mockOrders.find(o => o.id === orderId);
    if (order) order.status = status;
    return true;
  },

  async askAiAssistant(message: string): Promise<{ response: string; intent?: string; suggestedNextActions?: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
        body: JSON.stringify({ message })
      });
      if (res.ok) return await res.json();
    } catch {}

    // Autonomous rule-based smart reply fallback
    const lower = message.toLowerCase();
    if (lower.includes('low') || lower.includes('shortage')) {
      const urgent = mockProducts.filter(p => p.quantityInStock <= p.minThreshold);
      return {
        response: `⚠️ Found **${urgent.length} items** below minimum threshold:\n` +
          urgent.map(p => `• **${p.name}** (Stock: ${p.quantityInStock}, Min: ${p.minThreshold})`).join('\n') +
          `\n\nRecommendation: Expedite purchase order generation for Apex Micro Systems and Shenzhen Precision.`,
        intent: 'QUERY_LOW_STOCK',
        suggestedNextActions: ['Create PO for RTX 4080 Super', 'Adjust Safety Stock Thresholds']
      };
    } else if (lower.includes('po') || lower.includes('draft') || lower.includes('order')) {
      return {
        response: `📝 **Purchase Order Draft Generated**:\n- **Supplier**: Apex Micro Systems Ltd\n- **Items**: 10x GeForce RTX 4080 Super ($8,400.00)\n- **Estimated Lead Time**: 5 business days.\n\nReady for warehouse manager approval in the Orders tab.`,
        intent: 'GENERATE_PO_DRAFT',
        suggestedNextActions: ['Approve Purchase Order', 'Notify Supplier via Email']
      };
    } else {
      return {
        response: `Hello! I am your **Inventory Pro AI Copilot**.\nI'm constantly analyzing inventory velocities, lead times, and stock levels.\n\nTry asking:\n1. "Which items are low in stock?"\n2. "Generate a purchase order draft for Supplier Apex"\n3. "What is our 30-day stock depletion forecast?"`,
        intent: 'GENERAL_ASSIST',
        suggestedNextActions: ['Check Low Stock Alerts', 'Run 30-Day Demand Forecast']
      };
    }
  },

  async getDemandForecast(): Promise<ForecastResult[]> {
    const fallback: ForecastResult[] = [
      {
        productId: 2,
        sku: 'SKU-RTX-4080',
        productName: 'GeForce RTX 4080 Super 16GB OC',
        currentStock: 6,
        averageDailySales: 1.45,
        projectedRunoutDays: 4,
        riskLevel: 'CRITICAL',
        recommendedOrderQuantity: 20,
        aiReasoning: 'Heavy sales velocity (1.45/day) combined with a 5-day supplier lead time will result in zero stockout within 4 days.',
        projections: [
          { date: 'Day 1', projectedStock: 6 },
          { date: 'Day 2', projectedStock: 4 },
          { date: 'Day 3', projectedStock: 3 },
          { date: 'Day 4', projectedStock: 1 },
          { date: 'Day 5', projectedStock: 0 },
          { date: 'Day 6', projectedStock: 0 },
          { date: 'Day 7', projectedStock: 0 },
        ]
      },
      {
        productId: 4,
        sku: 'SKU-MECH-KB',
        productName: 'ProLogix Wireless Hot-Swap Mechanical Keyboard',
        currentStock: 4,
        averageDailySales: 0.85,
        projectedRunoutDays: 5,
        riskLevel: 'CRITICAL',
        recommendedOrderQuantity: 25,
        aiReasoning: '14-day international lead time from Shenzhen Precision demands immediate reordering before full stockout occurs.',
        projections: [
          { date: 'Day 1', projectedStock: 4 },
          { date: 'Day 2', projectedStock: 3 },
          { date: 'Day 3', projectedStock: 2 },
          { date: 'Day 4', projectedStock: 1 },
          { date: 'Day 5', projectedStock: 0 },
          { date: 'Day 6', projectedStock: 0 },
          { date: 'Day 7', projectedStock: 0 },
        ]
      },
      {
        productId: 1,
        sku: 'SKU-NVME-2TB',
        productName: 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD',
        currentStock: 48,
        averageDailySales: 1.10,
        projectedRunoutDays: 43,
        riskLevel: 'SAFE',
        recommendedOrderQuantity: 0,
        aiReasoning: 'Stock levels healthy. Sufficient buffer exists for the next 6 weeks under steady consumption velocity.',
        projections: [
          { date: 'Day 1', projectedStock: 48 },
          { date: 'Day 2', projectedStock: 47 },
          { date: 'Day 3', projectedStock: 46 },
          { date: 'Day 4', projectedStock: 45 },
          { date: 'Day 5', projectedStock: 43 },
          { date: 'Day 6', projectedStock: 42 },
          { date: 'Day 7', projectedStock: 41 },
        ]
      }
    ];
    return this.fetchWithFallback<ForecastResult[]>(`${API_BASE}/ai/forecast`, fallback);
  },

  async getReorderSuggestions(): Promise<ReorderSuggestion[]> {
    const fallback: ReorderSuggestion[] = [
      {
        productId: 2,
        sku: 'SKU-RTX-4080',
        productName: 'GeForce RTX 4080 Super 16GB OC',
        supplierId: 1,
        supplierName: 'Apex Micro Systems Ltd',
        currentStock: 6,
        currentReorderPoint: 15,
        suggestedReorderPoint: 22,
        suggestedOrderQuantity: 25,
        estimatedCost: 21000.00,
        supplierLeadTimeDays: 5,
        priority: 'URGENT',
        rationale: 'High velocity spikes during compute lab orders. Increasing reorder safety point from 15 to 22.'
      },
      {
        productId: 4,
        sku: 'SKU-MECH-KB',
        productName: 'ProLogix Wireless Hot-Swap Mechanical Keyboard',
        supplierId: 3,
        supplierName: 'Shenzhen Precision Parts',
        currentStock: 4,
        currentReorderPoint: 20,
        suggestedReorderPoint: 32,
        suggestedOrderQuantity: 30,
        estimatedCost: 1560.00,
        supplierLeadTimeDays: 14,
        priority: 'URGENT',
        rationale: '14-day vendor lead time buffer requires higher minimum inventory ceiling.'
      }
    ];
    return this.fetchWithFallback<ReorderSuggestion[]>(`${API_BASE}/ai/reorder-suggestions`, fallback);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const fallback: AuditLog[] = [
      { id: 1, entityName: 'Product', entityId: 2, action: 'STOCK_ADJUSTMENT', userEmail: 'manager@inventorypro.io', ipAddress: '192.168.1.45', changesJson: '{"sku": "SKU-RTX-4080", "delta": -14, "reason": "Dispatch SO-8901"}', createdAt: '2026-09-25T11:15:00' },
      { id: 2, entityName: 'PurchaseOrder', entityId: 1, action: 'CREATE', userEmail: 'manager@inventorypro.io', ipAddress: '192.168.1.45', changesJson: '{"order_number": "PO-2026-001", "total": 14985.00, "status": "APPROVED"}', createdAt: '2026-09-29T08:30:00' },
      { id: 3, entityName: 'Product', entityId: 4, action: 'STOCK_ADJUSTMENT', userEmail: 'staff@inventorypro.io', ipAddress: '192.168.1.80', changesJson: '{"sku": "SKU-MECH-KB", "delta": -16, "reason": "Dispatch SO-8920"}', createdAt: '2026-09-28T16:45:00' }
    ];
    return this.fetchWithFallback<AuditLog[]>(`${API_BASE}/audit`, fallback);
  },

  async getUsers(): Promise<User[]> {
    const fallback: User[] = [
      { id: 1, username: 'admin', email: 'admin@inventorypro.io', fullName: 'System Administrator', role: 'ROLE_ADMIN', status: 'ACTIVE' },
      { id: 2, username: 'manager', email: 'manager@inventorypro.io', fullName: 'Elena Rostova', role: 'ROLE_WAREHOUSE_MANAGER', status: 'ACTIVE' },
      { id: 3, username: 'staff', email: 'staff@inventorypro.io', fullName: 'Alex Chen', role: 'ROLE_STAFF', status: 'ACTIVE' }
    ];
    return this.fetchWithFallback<User[]>(`${API_BASE}/users`, fallback);
  }
};
