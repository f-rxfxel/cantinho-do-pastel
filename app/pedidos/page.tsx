'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { mockOrders } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Clock,
  User,
  Phone,
  Hash,
  ChevronRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusLabels = {
  new: 'Novo',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  completed: 'Finalizado',
  canceled: 'Cancelado',
}

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  preparing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-muted text-muted-foreground border-border',
  canceled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selected = selectedOrder ? mockOrders.find(o => o.id === selectedOrder) : null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6 pt-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
              <p className="text-muted-foreground">Gerencie todos os pedidos do dia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filters */}
              <div className="glass rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou número..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">Todos</option>
                      <option value="new">Novos</option>
                      <option value="preparing">Em Preparo</option>
                      <option value="ready">Prontos</option>
                      <option value="completed">Finalizados</option>
                      <option value="canceled">Cancelados</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={cn(
                      'w-full glass rounded-xl p-4 text-left transition-all hover:border-primary/50',
                      selectedOrder === order.id && 'border-primary ring-1 ring-primary'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-sm font-bold text-primary">#{order.orderNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(order.createdAt, { addSuffix: true, locale: ptBR })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium',
                          statusColors[order.status as keyof typeof statusColors]
                        )}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </span>
                        <span className="font-semibold text-foreground">
                          R$ {order.total.toFixed(2)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-4 sticky top-24">
                {selected ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Pedido #{selected.orderNumber}
                      </h3>
                      <span className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium',
                        statusColors[selected.status as keyof typeof statusColors]
                      )}>
                        {statusLabels[selected.status as keyof typeof statusLabels]}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{selected.customerName}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Itens</h4>
                      <div className="space-y-2">
                        {selected.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {item.quantity}x {item.name}
                              </p>
                              {item.size && (
                                <p className="text-xs text-muted-foreground capitalize">{item.size}</p>
                              )}
                              {item.extras && item.extras.length > 0 && (
                                <p className="text-xs text-accent">+ {item.extras.join(', ')}</p>
                              )}
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selected.notes && (
                      <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Observações</h4>
                        <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3">{selected.notes}</p>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">
                          R$ {selected.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {selected.status !== 'completed' && selected.status !== 'canceled' && (
                      <div className="flex gap-2 pt-2">
                        {selected.status === 'new' && (
                          <button className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                            Iniciar Preparo
                          </button>
                        )}
                        {selected.status === 'preparing' && (
                          <button className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                            Marcar como Pronto
                          </button>
                        )}
                        {selected.status === 'ready' && (
                          <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            Finalizar Pedido
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Hash className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground">Selecione um pedido</p>
                    <p className="text-xs text-muted-foreground/70">para ver os detalhes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
