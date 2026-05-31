'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Receipt, Clock, CheckCircle2, Timer } from 'lucide-react'
import type { DailyMetrics } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MetricsCardsProps {
  metrics: DailyMetrics
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Pedidos Hoje',
      value: metrics.totalOrders,
      growth: metrics.growthOrders,
      icon: ShoppingBag,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Faturamento',
      value: formatCurrency(metrics.totalRevenue),
      growth: metrics.growthRevenue,
      icon: DollarSign,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(metrics.averageTicket),
      icon: Receipt,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: 'Em Preparo',
      value: metrics.ordersInProgress,
      icon: Timer,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      title: 'Finalizados',
      value: metrics.ordersCompleted,
      icon: CheckCircle2,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      title: 'Tempo Médio',
      value: `${metrics.averageProductionTime}min`,
      icon: Clock,
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="glass border-glass-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className={cn('rounded-lg p-2', card.iconBg)}>
                <card.icon className={cn('h-5 w-5', card.iconColor)} />
              </div>
            </div>
            {card.growth !== undefined && (
              <div className="mt-3 flex items-center gap-1">
                {card.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={cn('text-xs font-medium', card.growth >= 0 ? 'text-success' : 'text-destructive')}>
                  {card.growth >= 0 ? '+' : ''}{card.growth}%
                </span>
                <span className="text-xs text-muted-foreground">vs ontem</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
