import type { Order, Alert, DailyMetrics, ProductSale, HourlySale, PaymentMethod, MenuItem, Extra, Customer, FinancialTransaction, HistoryRecord } from './types'

// Cardápio baseado na imagem do Cantinho do Pastel
export const menuItems: MenuItem[] = [
  // Pastéis de Farinha de Milho
  { id: 'milho-carne', name: 'Pastel de Carne (Milho)', category: 'pastel-milho', prices: { pequeno: 2, medio: 5, grande: 8 }, available: true },
  { id: 'milho-queijo', name: 'Pastel de Queijo (Milho)', category: 'pastel-milho', prices: { pequeno: 2, medio: 5, grande: 8 }, available: true },
  
  // Pastéis de Farinha de Trigo
  { id: 'trigo-atum', name: 'Pastel de Atum', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  { id: 'trigo-carne', name: 'Pastel de Carne', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  { id: 'trigo-frango', name: 'Pastel de Frango', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  { id: 'trigo-mussarela', name: 'Pastel de Mussarela', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  { id: 'trigo-presunto', name: 'Pastel de Presunto', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  { id: 'trigo-queijo-minas', name: 'Pastel de Queijo Minas', category: 'pastel-trigo', prices: { unico: 9 }, available: true },
  
  // Pastéis Doces
  { id: 'doce-banana', name: 'Pastel de Banana', category: 'pastel-doce', description: 'Banana com queijo e canela', prices: { unico: 9 }, available: true },
  { id: 'doce-romeu', name: 'Romeu e Julieta', category: 'pastel-doce', description: 'Queijo com goiabada', prices: { unico: 9 }, available: true },
  { id: 'doce-sensacao', name: 'Sensação', category: 'pastel-doce', description: 'Nutella com creme morango', prices: { unico: 9 }, available: true },
  { id: 'doce-brigadeiro', name: 'Brigadeiro', category: 'pastel-doce', description: 'Chocolate cremoso', prices: { unico: 9 }, available: true },
  
  // Sucos Naturais
  { id: 'suco-abacaxi', name: 'Suco de Abacaxi', category: 'suco', prices: { '300ml': 8, '400ml': 10, '500ml': 12 }, available: true },
  { id: 'suco-maracuja', name: 'Suco de Maracujá', category: 'suco', prices: { '300ml': 8, '400ml': 10, '500ml': 12 }, available: true },
  { id: 'suco-laranja', name: 'Suco de Laranja', category: 'suco', prices: { '300ml': 8, '400ml': 10, '500ml': 12 }, available: true },
  { id: 'suco-frutas', name: 'Suco de Frutas Vermelhas', category: 'suco', prices: { '300ml': 8, '400ml': 10, '500ml': 12 }, available: true },
  
  // Churros
  { id: 'churros', name: 'Churros', category: 'churros', description: 'Doce de leite com açúcar e canela', prices: { unico: 8 }, available: true },
]

// Adicionais
export const extras: Extra[] = [
  // Adicionais Simples - R$ 2,00
  { id: 'ovo', name: 'Ovo', price: 2, type: 'simple' },
  { id: 'catupiry', name: 'Catupiry', price: 2, type: 'simple' },
  { id: 'cebola', name: 'Cebola', price: 2, type: 'simple' },
  { id: 'milho', name: 'Milho', price: 2, type: 'simple' },
  { id: 'azeitona', name: 'Azeitona', price: 2, type: 'simple' },
  { id: 'tomate', name: 'Tomate', price: 2, type: 'simple' },
  
  // Adicionais Especiais - R$ 3,00
  { id: 'bacon', name: 'Bacon', price: 3, type: 'special' },
  { id: 'calabresa', name: 'Calabresa', price: 3, type: 'special' },
  { id: 'catupiry-original', name: 'Catupiry Original', price: 3, type: 'special' },
  { id: 'cheddar', name: 'Cheddar', price: 3, type: 'special' },
  { id: 'tomate-seco', name: 'Tomate Seco', price: 3, type: 'special' },
  
  // Adicionais Doces - R$ 3,00
  { id: 'banana', name: 'Banana', price: 3, type: 'doce' },
  { id: 'brigadeiro', name: 'Brigadeiro', price: 3, type: 'doce' },
  { id: 'creme-morango', name: 'Creme Morango', price: 3, type: 'doce' },
  { id: 'creme-ninho', name: 'Creme Ninho', price: 3, type: 'doce' },
  { id: 'doce-leite', name: 'Doce de Leite', price: 3, type: 'doce' },
  { id: 'goiabada', name: 'Goiabada', price: 3, type: 'doce' },
  { id: 'morango', name: 'Morango', price: 3, type: 'doce' },
  { id: 'nutella', name: 'Nutella', price: 3, type: 'doce' },
]

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 1042,
    customerName: 'Maria Silva',
    items: [
      { id: '1a', name: 'Pastel de Carne', quantity: 3, price: 9, extras: ['Catupiry', 'Bacon'] },
      { id: '1b', name: 'Pastel de Queijo (Milho)', quantity: 2, price: 5, size: 'medio' },
      { id: '1c', name: 'Suco de Laranja', quantity: 2, price: 10, size: '400ml' },
    ],
    total: 62.00,
    status: 'new',
    priority: 'high',
    createdAt: new Date(Date.now() - 5 * 60000),
    estimatedTime: 15,
  },
  {
    id: '2',
    orderNumber: 1041,
    customerName: 'João Santos',
    items: [
      { id: '2a', name: 'Pastel de Frango', quantity: 2, price: 9 },
      { id: '2b', name: 'Pastel de Mussarela', quantity: 2, price: 9, extras: ['Cheddar'] },
      { id: '2c', name: 'Suco de Abacaxi', quantity: 2, price: 8, size: '300ml' },
    ],
    total: 58.00,
    status: 'new',
    priority: 'normal',
    createdAt: new Date(Date.now() - 8 * 60000),
    estimatedTime: 12,
  },
  {
    id: '3',
    orderNumber: 1040,
    customerName: 'Ana Costa',
    items: [
      { id: '3a', name: 'Romeu e Julieta', quantity: 2, price: 9 },
      { id: '3b', name: 'Sensação', quantity: 1, price: 9, extras: ['Nutella'] },
      { id: '3c', name: 'Suco de Maracujá', quantity: 2, price: 12, size: '500ml' },
    ],
    total: 54.00,
    status: 'preparing',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 12 * 60000),
    estimatedTime: 8,
    notes: 'Sem muito açúcar no suco',
  },
  {
    id: '4',
    orderNumber: 1039,
    customerName: 'Carlos Oliveira',
    items: [
      { id: '4a', name: 'Pastel de Carne (Milho)', quantity: 4, price: 8, size: 'grande', extras: ['Ovo', 'Cebola'] },
      { id: '4b', name: 'Churros', quantity: 2, price: 8 },
    ],
    total: 52.00,
    status: 'preparing',
    priority: 'normal',
    createdAt: new Date(Date.now() - 18 * 60000),
    estimatedTime: 5,
  },
  {
    id: '5',
    orderNumber: 1038,
    customerName: 'Fernanda Lima',
    items: [
      { id: '5a', name: 'Pastel de Atum', quantity: 2, price: 9, extras: ['Catupiry Original'] },
      { id: '5b', name: 'Pastel de Presunto', quantity: 2, price: 9 },
      { id: '5c', name: 'Suco de Frutas Vermelhas', quantity: 2, price: 10, size: '400ml' },
    ],
    total: 62.00,
    status: 'ready',
    priority: 'high',
    createdAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: '6',
    orderNumber: 1037,
    customerName: 'Roberto Alves',
    items: [
      { id: '6a', name: 'Pastel de Queijo Minas', quantity: 3, price: 9, extras: ['Bacon', 'Calabresa'] },
      { id: '6b', name: 'Brigadeiro', quantity: 2, price: 9, extras: ['Creme Ninho'] },
    ],
    total: 57.00,
    status: 'ready',
    priority: 'normal',
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '7',
    orderNumber: 1036,
    customerName: 'Patricia Mendes',
    items: [
      { id: '7a', name: 'Pastel de Queijo (Milho)', quantity: 6, price: 5, size: 'medio' },
      { id: '7b', name: 'Pastel de Carne (Milho)', quantity: 6, price: 5, size: 'medio' },
    ],
    total: 60.00,
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 35 * 60000),
  },
  {
    id: '8',
    orderNumber: 1035,
    customerName: 'Lucas Pereira',
    items: [
      { id: '8a', name: 'Pastel de Frango', quantity: 2, price: 9 },
      { id: '8b', name: 'Suco de Laranja', quantity: 1, price: 8, size: '300ml' },
    ],
    total: 26.00,
    status: 'completed',
    priority: 'normal',
    createdAt: new Date(Date.now() - 45 * 60000),
  },
  {
    id: '9',
    orderNumber: 1034,
    customerName: 'Juliana Souza',
    items: [
      { id: '9a', name: 'Pastel de Banana', quantity: 3, price: 9, extras: ['Doce de Leite'] },
      { id: '9b', name: 'Suco de Maracujá', quantity: 3, price: 10, size: '400ml' },
    ],
    total: 66.00,
    status: 'completed',
    priority: 'normal',
    createdAt: new Date(Date.now() - 60 * 60000),
  },
]

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'delayed',
    message: 'Pedido #1040 está atrasado há 5 minutos',
    createdAt: new Date(Date.now() - 2 * 60000),
    orderId: '3',
  },
  {
    id: 'a2',
    type: 'out-of-stock',
    message: 'Pastel de Atum com estoque baixo (5 unidades)',
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'a3',
    type: 'ready',
    message: 'Pedido #1038 está pronto para retirada',
    createdAt: new Date(Date.now() - 10 * 60000),
    orderId: '5',
  },
  {
    id: 'a4',
    type: 'new-order',
    message: 'Novo pedido recebido: #1042',
    createdAt: new Date(Date.now() - 5 * 60000),
    orderId: '1',
  },
]

export const mockDailyMetrics: DailyMetrics = {
  totalOrders: 127,
  totalRevenue: 4850.00,
  averageTicket: 38.19,
  ordersInProgress: 8,
  ordersCompleted: 89,
  averageProductionTime: 12,
  growthOrders: 15.3,
  growthRevenue: 22.7,
}

export const mockProductSales: ProductSale[] = [
  { name: 'Pastel de Carne', quantity: 156, revenue: 1404.00 },
  { name: 'Pastel de Queijo (Milho)', quantity: 132, revenue: 660.00 },
  { name: 'Pastel de Frango', quantity: 98, revenue: 882.00 },
  { name: 'Suco de Laranja', quantity: 87, revenue: 870.00 },
  { name: 'Romeu e Julieta', quantity: 45, revenue: 405.00 },
  { name: 'Churros', quantity: 38, revenue: 304.00 },
]

export const mockHourlySales: HourlySale[] = [
  { hour: '14h', orders: 12, revenue: 480 },
  { hour: '15h', orders: 18, revenue: 720 },
  { hour: '16h', orders: 15, revenue: 600 },
  { hour: '17h', orders: 22, revenue: 880 },
  { hour: '18h', orders: 35, revenue: 1400 },
  { hour: '19h', orders: 42, revenue: 1680 },
  { hour: '20h', orders: 38, revenue: 1520 },
  { hour: '21h', orders: 18, revenue: 720 },
]

export const mockPaymentMethods: PaymentMethod[] = [
  { method: 'PIX', count: 58, percentage: 45.7 },
  { method: 'Cartão Crédito', count: 35, percentage: 27.6 },
  { method: 'Cartão Débito', count: 22, percentage: 17.3 },
  { method: 'Dinheiro', count: 12, percentage: 9.4 },
]

export const mockWeeklyRevenue = [
  { day: 'Seg', revenue: 3200 },
  { day: 'Ter', revenue: 2800 },
  { day: 'Qua', revenue: 3500 },
  { day: 'Qui', revenue: 4100 },
  { day: 'Sex', revenue: 5200 },
  { day: 'Sáb', revenue: 6800 },
  { day: 'Dom', revenue: 4850 },
]

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Maria Silva', phone: '(35) 99999-1234', totalOrders: 45, totalSpent: 1850.00, lastVisit: new Date(Date.now() - 5 * 60000), favoriteItems: ['Pastel de Carne', 'Suco de Laranja'] },
  { id: '2', name: 'João Santos', phone: '(35) 98888-5678', totalOrders: 32, totalSpent: 1240.00, lastVisit: new Date(Date.now() - 8 * 60000), favoriteItems: ['Pastel de Frango', 'Pastel de Mussarela'] },
  { id: '3', name: 'Ana Costa', phone: '(35) 97777-9012', totalOrders: 28, totalSpent: 980.00, lastVisit: new Date(Date.now() - 12 * 60000), favoriteItems: ['Romeu e Julieta', 'Sensação'] },
  { id: '4', name: 'Carlos Oliveira', phone: '(35) 96666-3456', totalOrders: 52, totalSpent: 2100.00, lastVisit: new Date(Date.now() - 18 * 60000), favoriteItems: ['Pastel de Carne (Milho)', 'Churros'] },
  { id: '5', name: 'Fernanda Lima', phone: '(35) 95555-7890', totalOrders: 19, totalSpent: 720.00, lastVisit: new Date(Date.now() - 25 * 60000), favoriteItems: ['Pastel de Atum', 'Suco de Frutas Vermelhas'] },
  { id: '6', name: 'Roberto Alves', phone: '(35) 94444-1234', totalOrders: 67, totalSpent: 2580.00, lastVisit: new Date(Date.now() - 30 * 60000), favoriteItems: ['Pastel de Queijo Minas', 'Brigadeiro'] },
  { id: '7', name: 'Patricia Mendes', phone: '(35) 93333-5678', totalOrders: 41, totalSpent: 1650.00, lastVisit: new Date(Date.now() - 35 * 60000), favoriteItems: ['Pastel de Queijo (Milho)'] },
  { id: '8', name: 'Lucas Pereira', phone: '(35) 92222-9012', totalOrders: 23, totalSpent: 890.00, lastVisit: new Date(Date.now() - 45 * 60000), favoriteItems: ['Pastel de Frango', 'Suco de Laranja'] },
]

export const mockTransactions: FinancialTransaction[] = [
  { id: 't1', type: 'inflow', category: 'Venda', amount: 62.00, description: 'Pedido #1042', date: new Date(), paymentMethod: 'pix' },
  { id: 't2', type: 'inflow', category: 'Venda', amount: 58.00, description: 'Pedido #1041', date: new Date(), paymentMethod: 'cartao' },
  { id: 't3', type: 'outflow', category: 'Insumos', amount: 150.00, description: 'Compra de farinha e óleo', date: new Date() },
  { id: 't4', type: 'outflow', category: 'Troco', amount: 50.00, description: 'Reposição de troco', date: new Date() },
]

export const mockHistory: HistoryRecord[] = [
  {
    id: 'h1',
    date: '2024-05-20',
    totalRevenue: 1200.00,
    totalExpense: 200.00,
    profit: 1000.00,
    ordersCount: 35,
    transactions: []
  },
  {
    id: 'h2',
    date: '2024-05-19',
    totalRevenue: 1500.00,
    totalExpense: 300.00,
    profit: 1200.00,
    ordersCount: 42,
    transactions: []
  }
]
