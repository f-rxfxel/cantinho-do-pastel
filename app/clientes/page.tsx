'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { mockCustomers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Search,
  User,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  Star,
  ChevronRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const selected = selectedCustomer ? mockCustomers.find(c => c.id === selectedCustomer) : null

  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6 pt-20">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua base de clientes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockCustomers.length}</p>
                  <p className="text-sm text-muted-foreground">Total de clientes</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Faturamento total</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <ShoppingBag className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Pedidos realizados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Customers List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search */}
              <div className="glass rounded-xl p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Customers */}
              <div className="space-y-3">
                {sortedCustomers.map((customer, index) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer.id)}
                    className={cn(
                      'w-full glass rounded-xl p-4 text-left transition-all hover:border-primary/50',
                      selectedCustomer === customer.id && 'border-primary ring-1 ring-primary'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full font-semibold',
                          index === 0 ? 'bg-amber-500/20 text-amber-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-400' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {index < 3 ? (
                            <Star className="h-5 w-5" />
                          ) : (
                            customer.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-semibold text-foreground">R$ {customer.totalSpent.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{customer.totalOrders} pedidos</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-4 sticky top-24">
                {selected ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                        {selected.name.charAt(0)}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-foreground">{selected.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{selected.totalOrders}</p>
                        <p className="text-xs text-muted-foreground">Pedidos</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-xl font-bold text-foreground">R$ {selected.totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Total gasto</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Última visita
                      </h4>
                      <p className="text-sm text-foreground">
                        {formatDistanceToNow(selected.lastVisit, { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Itens favoritos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.favoriteItems.map((item, i) => (
                          <span key={i} className="rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">
                        Ticket médio: <span className="font-medium text-foreground">
                          R$ {(selected.totalSpent / selected.totalOrders).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <User className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground">Selecione um cliente</p>
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
