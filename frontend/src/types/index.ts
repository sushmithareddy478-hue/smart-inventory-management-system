export type UserRole = 'ROLE_ADMIN' | 'ROLE_WAREHOUSE_MANAGER' | 'ROLE_STAFF';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface Product {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  unitPrice: number;
  costPrice: number;
  quantityInStock: number;
  minThreshold: number;
  reorderPoint: number;
  locationRack: string;
  unitOfMeasure: string;
  status: string;
  lowStock?: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  leadTimeDays: number;
  status: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity?: number;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  status: OrderStatus;
  totalAmount: number;
  expectedDeliveryDate: string;
  notes?: string;
  createdByUsername: string;
  createdAt: string;
  items: OrderItem[];
}

export interface DashboardMetrics {
  totalProducts: number;
  lowStockCount: number;
  pendingPurchaseOrders: number;
  totalInventoryValuation: number;
  urgentLowStockProducts: Product[];
  stockByCategory: Record<string, number>;
}

export interface ForecastResult {
  productId: number;
  sku: string;
  productName: string;
  currentStock: number;
  averageDailySales: number;
  projectedRunoutDays: number;
  riskLevel: 'CRITICAL' | 'WARNING' | 'SAFE';
  recommendedOrderQuantity: number;
  aiReasoning: string;
  projections: { date: string; projectedStock: number }[];
}

export interface ReorderSuggestion {
  productId: number;
  sku: string;
  productName: string;
  supplierId: number;
  supplierName: string;
  currentStock: number;
  currentReorderPoint: number;
  suggestedReorderPoint: number;
  suggestedOrderQuantity: number;
  estimatedCost: number;
  supplierLeadTimeDays: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  rationale: string;
}

export interface AuditLog {
  id: number;
  entityName: string;
  entityId: number;
  action: string;
  userEmail: string;
  ipAddress: string;
  changesJson: string;
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  suggestedNextActions?: string[];
}
