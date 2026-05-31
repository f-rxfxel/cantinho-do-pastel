'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2,
  ShoppingCart
} from 'lucide-react'
import type { Order, PaymentMethodType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FinalizeOrderModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (orderId: string, paymentMethod: PaymentMethodType) => void
}

export function FinalizeOrderModal({ order, isOpen, onClose, onConfirm }: FinalizeOrderModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pix')

  if (!order) return null

  const handleConfirm = () => {
    onConfirm(order.id, paymentMethod)
    onClose()
  }

  const paymentMethods: { id: PaymentMethodType; label: string; icon: any }[] = [
    { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
    { id: 'pix', label: 'PIX', icon: QrCode },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Finalizar Pedido #{order.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Client Info */}
          <div className="mb-4 rounded-xl bg-secondary/30 p-4 border border-border/50">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Cliente</span>
              <span className="text-foreground font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t border-border/50 mt-2">
              <span>Total</span>
              <span className="text-primary">R$ {order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" />
              Itens do Pedido
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start rounded-lg bg-muted/30 p-3 text-sm border border-border/30">
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-foreground">
                      {item.quantity}x {item.name}
                    </p>
                    {item.extras && item.extras.length > 0 && (
                      <p className="text-[11px] text-primary/70 italic mt-0.5">
                        + {item.extras.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-muted-foreground whitespace-nowrap">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Selection */}
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">Forma de Pagamento</p>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-[10px] font-bold uppercase">{method.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-3 border-t border-border/50 pt-4">
          <Button variant="ghost" onClick={onClose} className="font-bold text-muted-foreground">
            Cancelar
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg shadow-green-500/20 px-8"
            onClick={handleConfirm}
          >
            <CheckCircle2 className="h-4 w-4" />
            Dar Baixa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
