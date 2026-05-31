'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { mockOrders } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Clock,
  ChefHat,
  AlertTriangle,
  Check,
  Timer,
} from 'lucide-react'

export default function ProducaoPage() {
  const preparingOrders = mockOrders.filter(o => o.status === 'preparing')
  const newOrders = mockOrders.filter(o => o.status === 'new')
  const readyOrders = mockOrders.filter(o => o.status === 'ready')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6 pt-20">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Painel de Produção</h1>
            <p className="text-muted-foreground">Acompanhe os pedidos em tempo real</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{newOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Na fila</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <ChefHat className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{preparingOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Em preparo</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{readyOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Prontos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Queue */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Fila de Pedidos
              </h3>
              <div className="space-y-3">
                {newOrders.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido na fila</p>
                ) : (
                  newOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary">#{order.orderNumber}</span>
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          order.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          order.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {order.priority === 'urgent' ? 'URGENTE' : order.priority === 'high' ? 'Alta' : 'Normal'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-foreground">
                            {item.quantity}x {item.name}
                            {item.extras && item.extras.length > 0 && (
                              <span className="text-accent text-xs ml-1">(+{item.extras.join(', ')})</span>
                            )}
                          </p>
                        ))}
                      </div>
                      <button className="w-full mt-3 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700">
                        Iniciar Preparo
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Preparing */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-amber-400" />
                Em Preparo
              </h3>
              <div className="space-y-3">
                {preparingOrders.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido em preparo</p>
                ) : (
                  preparingOrders.map((order) => {
                    const isDelayed = order.estimatedTime && order.estimatedTime < 5
                    return (
                      <div key={order.id} className={cn(
                        'rounded-lg border p-3',
                        isDelayed ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-card'
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-primary">#{order.orderNumber}</span>
                          <div className="flex items-center gap-2">
                            {isDelayed && <AlertTriangle className="h-4 w-4 text-red-400" />}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              {order.estimatedTime}min
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <p key={item.id} className="text-sm text-foreground">
                              {item.quantity}x {item.name}
                              {item.extras && item.extras.length > 0 && (
                                <span className="text-accent text-xs ml-1">(+{item.extras.join(', ')})</span>
                              )}
                            </p>
                          ))}
                        </div>
                        {order.notes && (
                          <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 rounded px-2 py-1">
                            {order.notes}
                          </p>
                        )}
                        <div className="w-full bg-muted rounded-full h-2 mt-3">
                          <div 
                            className={cn(
                              'h-2 rounded-full transition-all',
                              isDelayed ? 'bg-red-500' : 'bg-amber-500'
                            )}
                            style={{ width: `${Math.min(100, (15 - (order.estimatedTime || 0)) / 15 * 100)}%` }}
                          />
                        </div>
                        <button className="w-full mt-3 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                          Marcar como Pronto
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Ready */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                Prontos para Retirada
              </h3>
              <div className="space-y-3">
                {readyOrders.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido pronto</p>
                ) : (
                  readyOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-green-400">#{order.orderNumber}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">{order.customerName}</p>
                      <div className="space-y-1 mt-2">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-xs text-muted-foreground">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                      <button className="w-full mt-3 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        Entregar ao Cliente
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
