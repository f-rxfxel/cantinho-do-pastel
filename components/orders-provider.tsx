'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { Order, PaymentMethodType } from '@/lib/types'
import { mockOrders } from '@/lib/mock-data'

const STORAGE_KEY = 'pastelaria-orders'

type OrdersContextValue = {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrder: (order: Order) => void
  deleteOrder: (orderId: string) => void
  finalizeOrder: (
    orderId: string,
    paymentMethod: PaymentMethodType
  ) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({
  children,
}: {
  children: ReactNode
}) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)

        const hydratedOrders = parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }))

        setOrders(hydratedOrders)
      } catch {
        setOrders(mockOrders)
      }
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(orders)
    )
  }, [orders, isHydrated])

  const addOrder = (order: Order) => {
    setOrders(current => [order, ...current])
  }

  const updateOrder = (order: Order) => {
    setOrders(current =>
      current.map(currentOrder =>
        currentOrder.id === order.id
          ? order
          : currentOrder
      )
    )
  }

  const deleteOrder = (orderId: string) => {
    setOrders(current =>
      current.filter(order => order.id !== orderId)
    )
  }

  const finalizeOrder = (
    orderId: string,
    paymentMethod: PaymentMethodType
  ) => {
    setOrders(current =>
      current.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: 'completed',
              paymentMethod,
            }
          : order
      )
    )
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        finalizeOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)

  if (!context) {
    throw new Error(
      'useOrders must be used within OrdersProvider'
    )
  }

  return context
}