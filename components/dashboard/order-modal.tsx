'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { extras } from '@/lib/mock-data'
import { useMenuItems } from '@/components/menu-items-provider'
import { cn } from '@/lib/utils'
import {
  Plus,
  Minus,
  ShoppingCart,
  User,
  Trash2,
  Check,
  UtensilsCrossed,
  Coffee,
  Cookie,
} from 'lucide-react'
import type { MenuItem, Order } from '@/lib/types'
import { toast } from 'sonner'

type SelectedSize = 'pequeno' | 'medio' | 'grande' | '300ml' | '400ml' | '500ml' | 'unico'

interface CartItem {
  id: string
  menuItemId: string
  name: string
  quantity: number
  size: SelectedSize
  price: number
  extras: string[]
  extrasPrice: number
}

interface OrderModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (orderData: Partial<Order>) => void
}

export function OrderModal({ order, isOpen, onClose, onConfirm }: OrderModalProps) {
  const { items: menuItems } = useMenuItems()
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('pastel-trigo')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<SelectedSize>('unico')

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName)
      setNotes(order.notes || '')
      
      const orderItems = order.items.map(item => ({
        id: item.id,
        menuItemId: item.id.split('-')[0], // Simplified
        name: item.name,
        quantity: item.quantity,
        size: (item.size as SelectedSize) || 'unico',
        price: item.price,
        extras: item.extras || [],
        extrasPrice: 0 
      }))
      setCart(orderItems)
    } else {
      // Reset
      setCustomerName('')
      setNotes('')
      setCart([])
    }
  }, [order, isOpen])

  const categories = [
    { id: 'pastel-milho', name: 'Milho', icon: Cookie },
    { id: 'pastel-trigo', name: 'Trigo', icon: UtensilsCrossed },
    { id: 'pastel-doce', name: 'Doces', icon: Cookie },
    { id: 'suco', name: 'Sucos', icon: Coffee },
    { id: 'churros', name: 'Churros', icon: Cookie },
  ]

  const filteredItems = menuItems.filter(
    item => item.category === selectedCategory && item.available
  )
  
  const simpleExtras = extras.filter(e => e.type === 'simple')
  const specialExtras = extras.filter(e => e.type === 'special')
  const doceExtras = extras.filter(e => e.type === 'doce')

  const getAvailableExtras = () => {
    if (selectedCategory === 'pastel-doce' || selectedCategory === 'churros') {
      return doceExtras
    }
    if (selectedCategory === 'suco') {
      return []
    }
    return [...simpleExtras, ...specialExtras]
  }

  const getItemPrice = (item: MenuItem, size: SelectedSize): number => {
    if (item.prices.unico) return item.prices.unico
    return item.prices[size as keyof typeof item.prices] || 0
  }

  const getExtrasTotal = () => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId)
      return total + (extra?.price || 0)
    }, 0)
  }

  const addToCart = (item: MenuItem) => {
    const price = getItemPrice(item, selectedSize)
    const extrasPrice = getExtrasTotal()
    
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      quantity: 1,
      size: selectedSize,
      price,
      extras: selectedExtras.map(id => extras.find(e => e.id === id)?.name || ''),
      extrasPrice,
    }

    setCart([...cart, cartItem])
    setSelectedExtras([])
    setSelectedItem(null)
  }

  const updateCartItemQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price + item.extrasPrice) * item.quantity
    }, 0)
  }

  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId))
    } else {
      setSelectedExtras([...selectedExtras, extraId])
    }
  }

  const handleConfirmOrder = () => {
    if (cart.length === 0) return
    
    const orderData: Partial<Order> = {
      id: order?.id || `o-${Date.now()}`,
      customerName: customerName || 'Cliente Balcão',
      notes,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        extras: item.extras
      })),
      total: getCartTotal(),
      status: order?.status || 'new',
      createdAt: order?.createdAt || new Date(),
      orderNumber: order?.orderNumber || Math.floor(Math.random() * 9000) + 1000,
      priority: order?.priority || 'normal'
    }

    onConfirm(orderData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? `Editar Pedido #${order.orderNumber}` : 'Novo Pedido'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 py-4">
          {/* Left: Menu Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="glass rounded-xl p-4 bg-secondary/10 border-border/50">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Nome do Cliente</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories & Items Grid */}
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setSelectedItem(null)
                      setSelectedExtras([])
                      if (cat.id === 'pastel-milho') setSelectedSize('medio')
                      else if (cat.id === 'suco') setSelectedSize('400ml')
                      else setSelectedSize('unico')
                    }}
                    className={cn(
                      'whitespace-nowrap flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item.id)
                      setSelectedExtras([])
                    }}
                    className={cn(
                      'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                      selectedItem === item.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-background hover:border-primary/30'
                    )}
                  >
                    <span className="text-xs font-semibold text-foreground truncate w-full">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      R$ {(item.prices.unico || item.prices.pequeno || item.prices['300ml'] || 0).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item Options */}
            {selectedItem && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-semibold text-muted-foreground">Personalizar Item:</p>
                <div className="flex flex-wrap gap-2">
                  {getAvailableExtras().map(extra => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all',
                        selectedExtras.includes(extra.id)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-background border border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {extra.name} (+R$ {extra.price.toFixed(2)})
                    </button>
                  ))}
                </div>
                <Button 
                  size="sm" 
                  className="w-full gap-2 font-semibold"
                  onClick={() => {
                    const item = menuItems.find(i => i.id === selectedItem)
                    if (item) addToCart(item)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            )}
          </div>

          {/* Right: Cart Summary */}
          <div className="lg:col-span-1 border-l border-border/50 pl-4 flex flex-col h-full">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Itens do Pedido
            </h3>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                  <ShoppingCart className="h-8 w-8 mb-2" />
                  <p className="text-[10px]">O carrinho está vazio</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/50 bg-secondary/5 p-3 text-xs">
                    <div className="flex justify-between font-bold text-foreground">
                      <span className="truncate flex-1 pr-2">{item.quantity}x {item.name}</span>
                      <span className="shrink-0 text-primary">R$ {((item.price + item.extrasPrice) * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.extras.length > 0 && (
                      <p className="text-[10px] text-primary/70 mt-1 italic">+ {item.extras.join(', ')}</p>
                    )}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, -1)} 
                          className="h-6 w-6 flex items-center justify-center rounded bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5"/>
                        </button>
                        <span className="w-4 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, 1)} 
                          className="h-6 w-6 flex items-center justify-center rounded bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5"/>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="space-y-2 mb-4">
                <label className="text-xs text-muted-foreground font-medium">Observações Gerais</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Pastel bem frito, pouco açúcar no suco..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs h-16 resize-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold">Total do Pedido</span>
                <span className="text-xl font-black text-primary">R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg shadow-green-500/20"
                onClick={handleConfirmOrder}
                disabled={cart.length === 0 || !customerName}
              >
                <Check className="h-4 w-4" />
                {order ? 'Salvar Alterações' : 'Confirmar Pedido'}
              </Button>
              {!customerName && cart.length > 0 && (
                <p className="text-[10px] text-red-500 mt-2 text-center">Informe o nome do cliente para confirmar</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
