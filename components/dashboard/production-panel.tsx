'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, AlertTriangle, ChefHat, Flame } from 'lucide-react'
import type { Order } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProductionPanelProps {
  orders: Order[]
}

function getElapsedTime(createdAt: Date): number {
  return Math.floor((new Date().getTime() - createdAt.getTime()) / 60000)
}

function getProgressPercentage(elapsed: number, estimated: number): number {
  return Math.min((elapsed / estimated) * 100, 100)
}

export function ProductionPanel({ orders }: ProductionPanelProps) {
  const preparingOrders = orders
    .filter((order) => order.status === 'preparing')
    .sort((a, b) => {
      // Sort by priority first, then by time
      const priorityOrder = { urgent: 0, high: 1, normal: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

  return (
    <Card className="glass border-glass-border bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ChefHat className="h-5 w-5 text-primary" />
            Painel de Produção
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {preparingOrders.length} em preparo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {preparingOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ChefHat className="mb-2 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Nenhum pedido em preparo</p>
          </div>
        ) : (
          preparingOrders.map((order) => {
            const elapsed = getElapsedTime(order.createdAt)
            const estimated = order.estimatedTime || 15
            const progress = getProgressPercentage(elapsed, estimated)
            const isOverdue = elapsed > estimated
            const isCritical = progress >= 80

            return (
              <div
                key={order.id}
                className={cn(
                  'rounded-lg border border-border/50 bg-secondary/30 p-3 transition-all',
                  isOverdue && 'border-destructive/50 bg-destructive/5',
                  isCritical && !isOverdue && 'border-warning/50 bg-warning/5'
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">#{order.orderNumber}</span>
                    <span className="text-sm text-muted-foreground">{order.customerName}</span>
                    {order.priority === 'urgent' && (
                      <Badge variant="destructive" className="animate-pulse text-xs">
                        <Flame className="mr-1 h-3 w-3" />
                        Urgente
                      </Badge>
                    )}
                    {order.priority === 'high' && (
                      <Badge className="bg-warning text-warning-foreground text-xs">
                        Alta
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isOverdue ? (
                      <AlertTriangle className="h-4 w-4 animate-pulse text-destructive" />
                    ) : (
                      <Clock className={cn('h-4 w-4', isCritical ? 'text-warning' : 'text-muted-foreground')} />
                    )}
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isOverdue ? 'text-destructive' : isCritical ? 'text-warning' : 'text-muted-foreground'
                      )}
                    >
                      {elapsed}min / {estimated}min
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {order.items.map((item) => (
                    <Badge key={item.id} variant="outline" className="text-xs">
                      {item.quantity}x {item.name}
                    </Badge>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <Progress
                    value={progress}
                    className={cn(
                      'h-2',
                      isOverdue && '[&>div]:bg-destructive',
                      isCritical && !isOverdue && '[&>div]:bg-warning'
                    )}
                  />
                  {order.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Obs:</span> {order.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
