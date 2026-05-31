'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { menuItems, extras } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Search,
  Edit2,
  Check,
  X,
  Cookie,
  UtensilsCrossed,
  Coffee,
} from 'lucide-react'

export default function CardapioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'Todos', icon: Cookie },
    { id: 'pastel-milho', name: 'Farinha de Milho', icon: Cookie },
    { id: 'pastel-trigo', name: 'Farinha de Trigo', icon: UtensilsCrossed },
    { id: 'pastel-doce', name: 'Pastéis Doces', icon: Cookie },
    { id: 'suco', name: 'Sucos', icon: Coffee },
    { id: 'churros', name: 'Churros', icon: Cookie },
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const simpleExtras = extras.filter(e => e.type === 'simple')
  const specialExtras = extras.filter(e => e.type === 'special')
  const doceExtras = extras.filter(e => e.type === 'doce')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6 pt-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cardápio</h1>
              <p className="text-muted-foreground">Cantinho do Pastel - Monte do seu jeito!</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Items List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Produtos</h3>
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <span className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                            item.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          )}>
                            {item.available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {item.available ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.prices.unico && (
                            <span className="rounded-md bg-primary/20 px-2 py-1 text-sm font-semibold text-primary">
                              R$ {item.prices.unico.toFixed(2)}
                            </span>
                          )}
                          {item.prices.pequeno && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              P: R$ {item.prices.pequeno.toFixed(2)}
                            </span>
                          )}
                          {item.prices.medio && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              M: R$ {item.prices.medio.toFixed(2)}
                            </span>
                          )}
                          {item.prices.grande && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              G: R$ {item.prices.grande.toFixed(2)}
                            </span>
                          )}
                          {item.prices['300ml'] && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              300ml: R$ {item.prices['300ml'].toFixed(2)}
                            </span>
                          )}
                          {item.prices['400ml'] && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              400ml: R$ {item.prices['400ml'].toFixed(2)}
                            </span>
                          )}
                          {item.prices['500ml'] && (
                            <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                              500ml: R$ {item.prices['500ml'].toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Adicionais</h3>
              
              {/* Simple Extras */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-3">Adicionais Simples - R$ 2,00</h4>
                <div className="flex flex-wrap gap-2">
                  {simpleExtras.map((extra) => (
                    <span key={extra.id} className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                      {extra.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Extras */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-3">Adicionais Especiais - R$ 3,00</h4>
                <div className="flex flex-wrap gap-2">
                  {specialExtras.map((extra) => (
                    <span key={extra.id} className="rounded-lg bg-accent/20 px-3 py-2 text-sm text-accent">
                      {extra.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sweet Extras */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-3">Adicionais Doces - R$ 3,00</h4>
                <div className="flex flex-wrap gap-2">
                  {doceExtras.map((extra) => (
                    <span key={extra.id} className="rounded-lg bg-pink-500/20 px-3 py-2 text-sm text-pink-400">
                      {extra.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Business Info */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-3">Informações</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Horário:</span> Seg - Sex 14:00 - 21:00
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">Contato:</span> (35) 9 9820-0003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
