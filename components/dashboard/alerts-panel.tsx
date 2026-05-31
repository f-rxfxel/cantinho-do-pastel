'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Clock, Package, ShoppingBag, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Alert } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
}

const alertConfig = {
  delayed: {
    icon: Clock,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
  },
  'out-of-stock': {
    icon: Package,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
  ready: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  'new-order': {
    icon: ShoppingBag,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diff < 1) return 'Agora'
  if (diff < 60) return `Há ${diff}min`
  const hours = Math.floor(diff / 60)
  return `Há ${hours}h`
}

export function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const urgentAlerts = alerts.filter(a => a.type === 'delayed')
  const otherAlerts = alerts.filter(a => a.type !== 'delayed')
  const sortedAlerts = [...urgentAlerts, ...otherAlerts]

  return (
    <Card className="glass border-glass-border bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas
          </CardTitle>
          {urgentAlerts.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {urgentAlerts.length} urgente{urgentAlerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 p-4 pt-0">
            {sortedAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="mb-2 h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Nenhum alerta no momento</p>
              </div>
            ) : (
              sortedAlerts.map((alert) => {
                const config = alertConfig[alert.type]
                const Icon = config.icon

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'group flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-secondary/30',
                      config.borderColor,
                      config.bgColor
                    )}
                  >
                    <div className={cn('mt-0.5 rounded-full p-1.5', config.bgColor)}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-tight">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(alert.createdAt)}</p>
                    </div>
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
