'use client'

import { useState, type FormEvent } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMenuItems } from '../../components/menu-items-provider'
import type { MenuItem, Extra } from '@/lib/types'
import {
  Search,
  Edit2,
  Check,
  X,
  Cookie,
  UtensilsCrossed,
  Coffee,
  Plus,
} from 'lucide-react'

export default function CardapioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { 
    items, 
    upsertItem, 
    deleteItem, 
    setAvailability, 
    extras, 
    addExtra, 
    updateExtra, 
    deleteExtra 
  } = useMenuItems()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  
  // New state for inline adding and editing of extras
  const [addingExtraType, setAddingExtraType] = useState<'simple' | 'special' | 'doce' | null>(null)
  const [newExtraName, setNewExtraName] = useState('')
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null)
  const [editingExtraName, setEditingExtraName] = useState('')

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    category: 'pastel-milho' as MenuItem['category'],
    description: '',
    available: true,
    prices: {
      pequeno: '',
      medio: '',
      grande: '',
      '300ml': '',
      '400ml': '',
      '500ml': '',
      unico: '',
    },
  })

  const categories = [
    { id: 'all', name: 'Todos', icon: Cookie },
    { id: 'pastel-milho', name: 'Farinha de Milho', icon: Cookie },
    { id: 'pastel-trigo', name: 'Farinha de Trigo', icon: UtensilsCrossed },
    { id: 'pastel-doce', name: 'Pastéis Doces', icon: Cookie },
    { id: 'suco', name: 'Sucos', icon: Coffee },
    { id: 'churros', name: 'Churros', icon: Cookie },
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const simpleExtras = extras.filter(e => e.type === 'simple')
  const specialExtras = extras.filter(e => e.type === 'special')
  const doceExtras = extras.filter(e => e.type === 'doce')

  const handleAddExtra = (type: 'simple' | 'special' | 'doce') => {
    if (!newExtraName.trim()) {
      setAddingExtraType(null)
      setNewExtraName('')
      return
    }

    const price = type === 'simple' ? 2 : 3
    const id = `${type}-${newExtraName.toLowerCase().replace(/\s+/g, '-')}`
    
    addExtra({
      id,
      name: newExtraName.trim(),
      price,
      type
    })

    setAddingExtraType(null)
    setNewExtraName('')
  }

  const handleEditExtra = (extra: Extra) => {
    setEditingExtraId(extra.id)
    setEditingExtraName(extra.name)
  }

  const handleUpdateExtra = (extra: Extra) => {
    if (!editingExtraName.trim()) {
      setEditingExtraId(null)
      return
    }

    updateExtra({
      ...extra,
      name: editingExtraName.trim()
    })
    setEditingExtraId(null)
  }

  const categoryOptions = categories.filter(category => category.id !== 'all')

  const priceFieldsByCategory: Record<MenuItem['category'], Array<{ key: keyof MenuItem['prices']; label: string }>> = {
    'pastel-milho': [
      { key: 'pequeno', label: 'Pequeno' },
      { key: 'medio', label: 'Médio' },
      { key: 'grande', label: 'Grande' },
    ],
    'pastel-trigo': [{ key: 'unico', label: 'Preço único' }],
    'pastel-doce': [{ key: 'unico', label: 'Preço único' }],
    'suco': [
      { key: '300ml', label: '300ml' },
      { key: '400ml', label: '400ml' },
      { key: '500ml', label: '500ml' },
    ],
    'churros': [{ key: 'unico', label: 'Preço único' }],
  }

  const parsePrice = (value: string) => {
    const normalized = value.trim().replace(',', '.')
    if (!normalized) return undefined
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  const buildPrices = () => {
    const fields = priceFieldsByCategory[formState.category]
    return fields.reduce<MenuItem['prices']>((acc, field) => {
      const parsed = parsePrice(formState.prices[field.key] || '')
      if (parsed !== undefined) {
        acc[field.key] = parsed
      }
      return acc
    }, {})
  }

  const getNormalizedId = (name: string, category: string) => {
    const base = `${category}-${name}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return base || `item-${Date.now()}`
  }

  const openCreateForm = () => {
    setEditingItem(null)
    setFormError(null)
    setFormState({
      id: '',
      name: '',
      category: 'pastel-milho',
      description: '',
      available: true,
      prices: {
        pequeno: '',
        medio: '',
        grande: '',
        '300ml': '',
        '400ml': '',
        '500ml': '',
        unico: '',
      },
    })
    setIsFormOpen(true)
  }

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item)
    setFormError(null)
    setFormState({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description || '',
      available: item.available,
      prices: {
        pequeno: item.prices.pequeno?.toString() || '',
        medio: item.prices.medio?.toString() || '',
        grande: item.prices.grande?.toString() || '',
        '300ml': item.prices['300ml']?.toString() || '',
        '400ml': item.prices['400ml']?.toString() || '',
        '500ml': item.prices['500ml']?.toString() || '',
        unico: item.prices.unico?.toString() || '',
      },
    })
    setIsFormOpen(true)
  }

  const handleSaveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = formState.name.trim()
    if (!name) {
      setFormError('Informe o nome do item.')
      return
    }

    const prices = buildPrices()
    const hasValidPrice = Object.values(prices).some(price => price && price > 0)
    if (!hasValidPrice) {
      setFormError('Informe pelo menos um preço válido.')
      return
    }

    const baseId = editingItem?.id || getNormalizedId(name, formState.category)
    const resolvedId = !editingItem && items.some(item => item.id === baseId)
      ? `${baseId}-${Date.now()}`
      : baseId

    const nextItem: MenuItem = {
      id: resolvedId,
      name,
      category: formState.category,
      description: formState.description.trim() || undefined,
      prices,
      available: formState.available,
    }

    upsertItem(nextItem)

    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId)
  }

  const toggleAvailability = (itemId: string, value: boolean) => {
    setAvailability(itemId, value)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header 
          title="Cardápio" 
          subtitle="Cantinho do Pastel - Monte do seu jeito!"
        />
        <main className="p-6">
          {/* Search and Filters */}
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button onClick={openCreateForm} className="gap-2">
                  <Plus className="h-4 w-4" />
                </Button>
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Produtos</h3>
              </div>
              <div className="space-y-3">
                {filteredItems.length === 0 && (
                  <div className="glass rounded-xl p-6 text-center text-sm text-muted-foreground">
                    Nenhum item encontrado para os filtros atuais.
                  </div>
                )}
                {filteredItems.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <span
                            className={cn(
                              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                              item.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            )}
                          >
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
                        <div className="mt-3 flex items-center gap-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={(value) => toggleAvailability(item.id, value)}
                          />
                          <span className="text-xs text-muted-foreground">Disponível para venda</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditForm(item)}
                          aria-label={`Editar ${item.name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              aria-label={`Remover ${item.name}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover {item.name} do cardápio? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Adicionais</h3>
              
              {/* Simple Extras */}
              <div className="glass rounded-xl p-4 group">
                <h4 className="font-medium text-foreground mb-3">Adicionais Simples - R$ 2,00</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {simpleExtras.map((extra) => (
                    <div key={extra.id} className="relative group/extra">
                      {editingExtraId === extra.id ? (
                        <div className="flex items-center gap-1 rounded-lg bg-blue-500/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            type="text"
                            value={editingExtraName}
                            onChange={(e) => setEditingExtraName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateExtra(extra)}
                            onBlur={() => setEditingExtraId(null)}
                            className="w-20 bg-transparent border-none text-xs text-blue-400 focus:outline-none"
                          />
                          <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateExtra(extra)}
                            className="rounded-md p-1 text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="inline-block rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-400 transition-colors">
                            {extra.name}
                          </span>
                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-md bg-popover border border-border p-1 shadow-md opacity-0 group-hover/extra:opacity-100 transition-opacity z-20">
                            <button
                              onClick={() => handleEditExtra(extra)}
                              className="p-1 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteExtra(extra.id)}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {addingExtraType === 'simple' ? (
                    <div className="flex items-center gap-1 rounded-lg bg-blue-500/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Nome..."
                        value={newExtraName}
                        onChange={(e) => setNewExtraName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExtra('simple')}
                        className="w-20 bg-transparent border-none text-xs text-blue-400 focus:outline-none placeholder:text-blue-400/50"
                      />
                      <button 
                        onClick={() => handleAddExtra('simple')}
                        className="rounded-md p-1 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingExtraType('simple')}
                      className="flex items-center gap-1 rounded-lg border border-dashed border-blue-500/30 px-2 py-2 text-sm text-blue-400/70 hover:border-blue-500 hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  )}
                </div>
              </div>

              {/* Special Extras */}
              <div className="glass rounded-xl p-4 group">
                <h4 className="font-medium text-foreground mb-3">Adicionais Especiais - R$ 3,00</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {specialExtras.map((extra) => (
                    <div key={extra.id} className="relative group/extra">
                      {editingExtraId === extra.id ? (
                        <div className="flex items-center gap-1 rounded-lg bg-accent/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            type="text"
                            value={editingExtraName}
                            onChange={(e) => setEditingExtraName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateExtra(extra)}
                            onBlur={() => setEditingExtraId(null)}
                            className="w-20 bg-transparent border-none text-xs text-accent focus:outline-none"
                          />
                          <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateExtra(extra)}
                            className="rounded-md p-1 text-accent hover:bg-accent/20 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="inline-block rounded-lg bg-accent/20 px-3 py-2 text-sm text-accent transition-colors">
                            {extra.name}
                          </span>
                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-md bg-popover border border-border p-1 shadow-md opacity-0 group-hover/extra:opacity-100 transition-opacity z-20">
                            <button
                              onClick={() => handleEditExtra(extra)}
                              className="p-1 text-accent hover:bg-accent/10 rounded transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteExtra(extra.id)}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {addingExtraType === 'special' ? (
                    <div className="flex items-center gap-1 rounded-lg bg-accent/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Nome..."
                        value={newExtraName}
                        onChange={(e) => setNewExtraName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExtra('special')}
                        className="w-20 bg-transparent border-none text-xs text-accent focus:outline-none placeholder:text-accent/50"
                      />
                      <button 
                        onClick={() => handleAddExtra('special')}
                        className="rounded-md p-1 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingExtraType('special')}
                      className="flex items-center gap-1 rounded-lg border border-dashed border-accent/30 px-2 py-2 text-sm text-accent/70 hover:border-accent hover:text-accent transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sweet Extras */}
              <div className="glass rounded-xl p-4 group">
                <h4 className="font-medium text-foreground mb-3">Adicionais Doces - R$ 3,00</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {doceExtras.map((extra) => (
                    <div key={extra.id} className="relative group/extra">
                      {editingExtraId === extra.id ? (
                        <div className="flex items-center gap-1 rounded-lg bg-pink-500/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                          <input
                            autoFocus
                            type="text"
                            value={editingExtraName}
                            onChange={(e) => setEditingExtraName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateExtra(extra)}
                            onBlur={() => setEditingExtraId(null)}
                            className="w-20 bg-transparent border-none text-xs text-pink-400 focus:outline-none"
                          />
                          <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateExtra(extra)}
                            className="rounded-md p-1 text-pink-400 hover:bg-pink-500/20 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="inline-block rounded-lg bg-pink-500/20 px-3 py-2 text-sm text-pink-400 transition-colors">
                            {extra.name}
                          </span>
                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-md bg-popover border border-border p-1 shadow-md opacity-0 group-hover/extra:opacity-100 transition-opacity z-20">
                            <button
                              onClick={() => handleEditExtra(extra)}
                              className="p-1 text-pink-400 hover:bg-pink-500/10 rounded transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteExtra(extra.id)}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {addingExtraType === 'doce' ? (
                    <div className="flex items-center gap-1 rounded-lg bg-pink-500/20 pl-2 pr-1 py-1 animate-in zoom-in-95 duration-200">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Nome..."
                        value={newExtraName}
                        onChange={(e) => setNewExtraName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExtra('doce')}
                        className="w-20 bg-transparent border-none text-xs text-pink-400 focus:outline-none placeholder:text-pink-400/50"
                      />
                      <button 
                        onClick={() => handleAddExtra('doce')}
                        className="rounded-md p-1 text-pink-400 hover:bg-pink-500/20 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingExtraType('doce')}
                      className="flex items-center gap-1 rounded-lg border border-dashed border-pink-500/30 px-2 py-2 text-sm text-pink-400/70 hover:border-pink-500 hover:text-pink-400 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  )}
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
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setEditingItem(null)
            setFormError(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar item' : 'Novo item'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveItem}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Nome</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => setFormState(state => ({ ...state, name: event.target.value }))}
                  placeholder="Ex: Pastel de carne"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Categoria</label>
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState(state => ({
                      ...state,
                      category: event.target.value as MenuItem['category'],
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Descrição</label>
              <textarea
                value={formState.description}
                onChange={(event) =>
                  setFormState(state => ({ ...state, description: event.target.value }))
                }
                placeholder="Detalhes do item (opcional)"
                className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Preços</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {priceFieldsByCategory[formState.category].map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formState.prices[field.key] || ''}
                      onChange={(event) =>
                        setFormState(state => ({
                          ...state,
                          prices: { ...state.prices, [field.key]: event.target.value },
                        }))
                      }
                      placeholder="0,00"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formState.available}
                onCheckedChange={(value) =>
                  setFormState(state => ({ ...state, available: value }))
                }
              />
              <span className="text-sm text-muted-foreground">Disponível para venda</span>
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false)
                  setEditingItem(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? 'Salvar alterações' : 'Criar item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
