'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { OrderList } from '@/components/dashboard/order-list'
import { FinalizeOrderModal } from '@/components/dashboard/finalize-order-modal'
import { OrderModal } from '@/components/dashboard/order-modal'
import {
  mockOrders,
  mockDailyMetrics,
} from '@/lib/mock-data'
import type { Order, PaymentMethodType } from '@/lib/types'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  
  const [selectedOrderForFinalize, setSelectedOrderForFinalize] = useState<Order | null>(null)
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false)
  
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  const handleRefresh = () => {
    toast.success('Lista de pedidos atualizada')
  }

  const handleCreateNew = () => {
    setSelectedOrderForEdit(null)
    setIsOrderModalOpen(true)
  }

  const handleEdit = (order: Order) => {
    setSelectedOrderForEdit(order)
    setIsOrderModalOpen(true)
  }

  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (selectedOrderForEdit) {
      // Update existing
      setOrders(prev => prev.map(o => o.id === orderData.id ? { ...o, ...orderData } as Order : o))
      toast.success(`Pedido #${orderData.orderNumber} atualizado`)
    } else {
      // Create new
      const newOrder = {
        ...orderData,
        id: `o-${Date.now()}`,
        status: 'new',
        createdAt: new Date(),
        orderNumber: Math.floor(Math.random() * 9000) + 1000,
      } as Order
      setOrders(prev => [newOrder, ...prev])
      toast.success(`Pedido #${newOrder.orderNumber} criado com sucesso`)
    }
  }

  const handleOpenFinalize = (order: Order) => {
    setSelectedOrderForFinalize(order)
    setIsFinalizeModalOpen(true)
  }

  const handleConfirmFinalize = (orderId: string, paymentMethod: PaymentMethodType) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' as const, paymentMethod } 
        : order
    ))
    
    const order = orders.find(o => o.id === orderId)
    toast.success(`Pedido #${order?.orderNumber} finalizado com ${paymentMethod}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Page Content */}
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Painel de Atendimento</h1>
              <p className="text-muted-foreground">
                Gerencie os pedidos ativos e acompanhe a produção.
              </p>
            </div>
            <button 
              onClick={handleCreateNew}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Novo Pedido
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="mb-6">
            <MetricsCards metrics={mockDailyMetrics} />
          </div>

          {/* Active Orders List */}
          <div className="mb-6">
            <OrderList 
              orders={orders} 
              onEdit={handleEdit}
              onFinalize={handleOpenFinalize}
              onRefresh={handleRefresh}
            />
          </div>
        </main>
      </div>

      <FinalizeOrderModal
        order={selectedOrderForFinalize}
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        onConfirm={handleConfirmFinalize}
      />

      <OrderModal
        order={selectedOrderForEdit}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onConfirm={handleSaveOrder}
      />
    </div>
  )
}
