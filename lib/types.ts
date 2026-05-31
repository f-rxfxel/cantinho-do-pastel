export interface Order {
  id: string
  orderNumber: number
  customerName: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  priority: 'normal' | 'high' | 'urgent'
  createdAt: Date
  estimatedTime?: number
  notes?: string
  paymentMethod?: PaymentMethodType
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  size?: 'pequeno' | 'medio' | 'grande' | '300ml' | '400ml' | '500ml'
  extras?: string[]
  notes?: string
}

export type OrderStatus = 
  | 'new'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'canceled'

export type PaymentMethodType = 'dinheiro' | 'cartao' | 'pix'

export interface FinancialTransaction {
  id: string
  type: 'inflow' | 'outflow'
  category: string
  amount: number
  description: string
  date: Date
  paymentMethod?: PaymentMethodType
  orderId?: string
}

export interface DailyBalance {
  date: string
  totalInflow: number
  totalOutflow: number
  netTotal: number
  ordersCount: number
  status: 'open' | 'closed'
}

export interface HistoryRecord {
  id: string
  date: string
  totalRevenue: number
  totalExpense: number
  profit: number
  ordersCount: number
  transactions: FinancialTransaction[]
}

export interface Alert {
  id: string
  type: 'delayed' | 'out-of-stock' | 'new-order' | 'ready'
  message: string
  createdAt: Date
  orderId?: string
}

export interface DailyMetrics {
  totalOrders: number
  totalRevenue: number
  averageTicket: number
  ordersInProgress: number
  ordersCompleted: number
  averageProductionTime: number
  growthOrders: number
  growthRevenue: number
}

export interface ProductSale {
  name: string
  quantity: number
  revenue: number
}

export interface HourlySale {
  hour: string
  orders: number
  revenue: number
}

export interface PaymentMethod {
  method: string
  count: number
  percentage: number
}

// Menu types based on the cardapio
export interface MenuItem {
  id: string
  name: string
  category: 'pastel-milho' | 'pastel-trigo' | 'pastel-doce' | 'suco' | 'churros'
  description?: string
  prices: {
    pequeno?: number
    medio?: number
    grande?: number
    '300ml'?: number
    '400ml'?: number
    '500ml'?: number
    unico?: number
  }
  available: boolean
}

export interface Extra {
  id: string
  name: string
  price: number
  type: 'simple' | 'special' | 'doce'
}

export interface Customer {
  id: string
  name: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastVisit: Date
  favoriteItems: string[]
}
