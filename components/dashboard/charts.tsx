'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, ShoppingBag, CreditCard, DollarSign } from 'lucide-react'
import type { HourlySale, ProductSale, PaymentMethod } from '@/lib/types'

interface ChartsProps {
  hourlySales: HourlySale[]
  topProducts: ProductSale[]
  weeklyRevenue: { day: string; revenue: number }[]
  paymentMethods: PaymentMethod[]
}

const COLORS = ['hsl(35, 90%, 55%)', 'hsl(25, 85%, 50%)', 'hsl(45, 80%, 55%)', 'hsl(15, 75%, 50%)']

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function Charts({ hourlySales, topProducts, weeklyRevenue, paymentMethods }: ChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Hourly Sales */}
      <Card className="glass border-glass-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Vendas por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(35, 90%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(35, 90%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(35, 90%, 55%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="glass border-glass-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [value, 'Quantidade']}
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 12%)',
                  border: '1px solid hsl(0, 0%, 20%)',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="quantity" 
                fill="hsl(35, 90%, 55%)" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Revenue */}
      <Card className="glass border-glass-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-primary" />
            Faturamento Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(0, 0%, 50%)" 
                fontSize={11}
                tickLine={false}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="hsl(25, 85%, 50%)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glass border-glass-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-primary" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="percentage"
                  nameKey="method"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentual']}
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 12%)',
                    border: '1px solid hsl(0, 0%, 20%)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {paymentMethods.map((method, index) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">{method.method}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {method.percentage.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
