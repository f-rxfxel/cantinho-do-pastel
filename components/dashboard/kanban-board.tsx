'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, AlertTriangle } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  orders: Order[]
  onOrderUpdate: (orders: Order[]) => void
}

const columns: { id: OrderStatus; title: string; color: string }[] = [
  { id: 'new', title: 'Novos Pedidos', color: 'bg-info' },
  { id: 'preparing', title: 'Em Preparo', color: 'bg-warning' },
  { id: 'ready', title: 'Prontos', color: 'bg-success' },
  { id: 'completed', title: 'Finalizados', color: 'bg-muted-foreground' },
]

const priorityConfig = {
  urgent: { label: 'Urgente', variant: 'destructive' as const, className: 'animate-pulse' },
  high: { label: 'Alta', variant: 'default' as const, className: 'bg-warning text-warning-foreground' },
  normal: { label: 'Normal', variant: 'secondary' as const, className: '' },
}

function getElapsedTime(createdAt: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 60000)
  if (diff < 60) return `${diff}min`
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return `${hours}h ${minutes}min`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function KanbanBoard({ orders, onOrderUpdate }: KanbanBoardProps) {
  const [localOrders, setLocalOrders] = useState(orders)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const updatedOrders = localOrders.map((order) => {
      if (order.id === draggableId) {
        return { ...order, status: destination.droppableId as OrderStatus }
      }
      return order
    })

    setLocalOrders(updatedOrders)
    onOrderUpdate(updatedOrders)
  }

  const getOrdersByStatus = (status: OrderStatus) => {
    return localOrders.filter((order) => order.status === status)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnOrders = getOrdersByStatus(column.id)
          return (
            <div key={column.id} className="w-72 shrink-0">
              <div className="mb-3 flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', column.color)} />
                <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {columnOrders.length}
                </Badge>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'min-h-[500px] space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-3 transition-colors',
                      snapshot.isDraggingOver && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    {columnOrders.map((order, index) => {
                      const priority = priorityConfig[order.priority]
                      const elapsed = getElapsedTime(order.createdAt)
                      const isDelayed = order.status === 'preparing' && 
                        (new Date().getTime() - order.createdAt.getTime()) > 15 * 60000

                      return (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                'glass cursor-grab border-glass-border bg-card/80 transition-all duration-200',
                                snapshot.isDragging && 'rotate-2 scale-105 shadow-xl shadow-primary/20',
                                isDelayed && 'border-destructive/50'
                              )}
                            >
                              <CardHeader className="p-3 pb-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-primary">#{order.orderNumber}</span>
                                    {isDelayed && (
                                      <AlertTriangle className="h-4 w-4 animate-pulse text-destructive" />
                                    )}
                                  </div>
                                  <Badge 
                                    variant={priority.variant} 
                                    className={cn('text-xs', priority.className)}
                                  >
                                    {priority.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-3.5 w-3.5" />
                                  <span className="truncate">{order.customerName}</span>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                {/* Items */}
                                <div className="mb-3 space-y-1 rounded-lg bg-secondary/30 p-2">
                                  {order.items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">
                                        {item.quantity}x {item.name}
                                        {item.extras && item.extras.length > 0 && (
                                          <span className="text-accent ml-1">(+{item.extras.join(', ')})</span>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                  {order.items.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{order.items.length - 3} itens
                                    </span>
                                  )}
                                </div>

                                {/* Total */}
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Total</span>
                                  <span className="text-sm font-semibold text-primary">
                                    {formatCurrency(order.total)}
                                  </span>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className={cn('h-3.5 w-3.5', isDelayed ? 'text-destructive' : 'text-muted-foreground')} />
                                    <span className={cn('text-xs', isDelayed ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                                      {elapsed}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
