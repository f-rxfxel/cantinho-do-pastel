'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  RefreshCw, 
  Plus, 
  Edit, 
  CheckCircle2, 
  Clock, 
  User, 
  DollarSign,
  ShoppingCart,
  Search,
  X
} from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface OrderListProps {
  orders: Order[]
  onFinalize: (order: Order) => void
  onEdit: (order: Order) => void
  onRefresh: () => void
}

export function OrderList({ orders, onFinalize, onEdit, onRefresh }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const activeOrders = orders
    .filter(order => order.status !== 'completed' && order.status !== 'canceled')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const filteredOrders = activeOrders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toString().includes(searchTerm)
  )

  return (
    <Card className="glass border-glass-border overflow-hidden">
      <CardHeader className="flex flex-col gap-4 bg-secondary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold">Pedidos Ativos</CardTitle>
          <Badge variant="secondary" className="ml-2 font-bold">
            {activeOrders.length}
          </Badge>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:max-w-md sm:justify-end">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Buscar por nome ou nº..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full bg-background/50 pl-10 pr-8 border-border/50 focus:bg-background focus:ring-1 focus:ring-primary"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh} className="h-9 w-9 p-0 sm:w-auto sm:px-3 sm:gap-2 font-medium">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button size="sm" onClick={() => (window.location.href = '/novo-pedido')} className="h-9 w-9 p-0 sm:w-auto sm:px-3 sm:gap-2 font-medium">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground opacity-30">
              <ShoppingCart className="mb-4 h-12 w-12" />
              <p className="font-medium">
                {searchTerm ? 'Nenhum pedido encontrado' : 'Nenhum pedido ativo'}
              </p>
            </div>
          ) : (
            <div className="grid gap-0">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="group relative flex flex-col gap-4 p-6 transition-all hover:bg-secondary/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-1 items-start gap-6">
                    {/* Order Number Badge */}
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <span className="text-[10px] font-bold uppercase opacity-60">Nº</span>
                      <span className="text-lg font-bold tracking-tight">{order.orderNumber}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-foreground truncate">
                            {order.customerName}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDistanceToNow(order.createdAt, { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                      </div>

                      {/* Items Display */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex flex-col bg-secondary/50 border border-border/50 px-3 py-1.5 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">
                                {item.quantity}x
                              </span>
                              <span className="text-xs font-medium text-foreground">
                                {item.name}
                              </span>
                            </div>
                            {item.extras && item.extras.length > 0 && (
                              <span className="text-[10px] text-muted-foreground italic mt-0.5 ml-4">
                                + {item.extras.join(', ')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions & Price */}
                  <div className="flex flex-row items-center justify-between gap-6 border-t border-border/50 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">Total</span>
                      <span className="text-xl font-bold text-primary tracking-tight">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(order)}
                        className="h-9 px-3 gap-2 font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onFinalize(order)}
                        className="h-9 px-4 gap-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
