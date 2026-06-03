'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { OrderList } from '@/components/dashboard/order-list'
import { FinalizeOrderModal } from '@/components/dashboard/finalize-order-modal'
import { OrderModal } from '@/components/dashboard/order-modal'
import type { Order, PaymentMethodType } from '@/lib/types'
import { toast } from 'sonner'
import { useOrders } from '@/components/orders-provider'
export default function PedidosPage() {
  const [isOpen, setIsOpen] = useState(true)
const {
  orders,
  addOrder,
  updateOrder,
  finalizeOrder
} = useOrders()
  
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
    updateOrder(orderData as Order)

    toast.success(
      `Pedido #${orderData.orderNumber} atualizado`
    )
  } else {
    const newOrder = {
      ...orderData,
      id: `o-${Date.now()}`,
      status: 'new',
      createdAt: new Date(),
      orderNumber:
        Math.floor(Math.random() * 9000) + 1000,
    } as Order

    addOrder(newOrder)

    toast.success(
      `Pedido #${newOrder.orderNumber} criado com sucesso`
    )
  }
}

  const handleOpenFinalize = (order: Order) => {
    setSelectedOrderForFinalize(order)
    setIsFinalizeModalOpen(true)
  }

const handleConfirmFinalize = (
  orderId: string,
  paymentMethod: PaymentMethodType
) => {
  finalizeOrder(orderId, paymentMethod)

  const order = orders.find(o => o.id === orderId)

  toast.success(
    `Pedido #${order?.orderNumber} finalizado com ${paymentMethod}`
  )
}

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          title="Painel de Atendimento" 
          subtitle="Gerencie os pedidos ativos e acompanhe a produção."
        />

        {/* Page Content */}
        <main className="p-6">
          {/* Page Action */}

          {/* Active Orders List */}
          <div className="mb-6">
            <OrderList 
              orders={orders} 
              onEdit={handleEdit}
              onFinalize={handleOpenFinalize}
              onRefresh={handleRefresh}
              onCreate={handleCreateNew}
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
