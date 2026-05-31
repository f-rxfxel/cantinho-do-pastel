'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Plus,
  Filter,
  Download,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { mockOrders, mockTransactions, mockDailyMetrics } from '@/lib/mock-data'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import type { FinancialTransaction, PaymentMethodType, Order } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions)
  const [isOutflowModalOpen, setIsOutflowModalOpen] = useState(false)
  const [outflowData, setOutflowData] = useState({ amount: '', description: '' })
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Finalized orders for today (mocking today)
  const finalizedOrders = mockOrders.filter(o => o.status === 'completed')

  const totalInflow = transactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalOutflow = transactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netTotal = totalInflow - totalOutflow

  const handleAddOutflow = () => {
    if (!outflowData.amount || !outflowData.description) {
      toast.error('Preencha todos os campos')
      return
    }

    const newTransaction: FinancialTransaction = {
      id: `t-${Date.now()}`,
      type: 'outflow',
      category: 'Saída',
      amount: parseFloat(outflowData.amount),
      description: outflowData.description,
      date: new Date()
    }

    setTransactions([newTransaction, ...transactions])
    setIsOutflowModalOpen(false)
    setOutflowData({ amount: '', description: '' })
    toast.success('Saída registrada com sucesso')
  }

  const handleCloseDay = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Fechando caixa e salvando histórico...',
        success: 'Dia encerrado! Dados movidos para o histórico.',
        error: 'Erro ao fechar o dia.',
      }
    )
  }

  const navigateDate = (amount: number) => {
    if (date) {
      setDate(addDays(date, amount))
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header 
          title="Controle Financeiro" 
          subtitle="Acompanhe o fluxo de caixa e as vendas do dia."
        />
        <main className="p-6">
          <div className="mb-6 flex items-center justify-end">
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigateDate(-1)}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn(
                      "gap-2 justify-start text-left font-normal min-w-[140px]",
                      !date && "text-muted-foreground"
                    )}>
                      <CalendarIcon className="h-4 w-4" />
                      {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigateDate(1)}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleCloseDay}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                Fechamento do Dia
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="mb-8">
            <MetricsCards metrics={mockDailyMetrics} />
          </div>

          {/* Cash Flow Summary */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card className="glass border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Entradas do Dia</p>
                  <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-foreground">R$ {totalInflow.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Saídas do Dia</p>
                  <ArrowDownCircle className="h-4 w-4 text-red-500" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-foreground">R$ {totalOutflow.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-glass-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-foreground">R$ {netTotal.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Transactions List */}
            <Card className="lg:col-span-2 glass border-glass-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fluxo de Caixa</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-3 w-3" />
                    Filtrar
                  </Button>
                  <Dialog open={isOutflowModalOpen} onOpenChange={setIsOutflowModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1 bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="h-3 w-3" />
                        Cadastrar Saída
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Saída de Caixa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Valor (R$)</label>
                          <input
                            type="number"
                            value={outflowData.amount}
                            onChange={(e) => setOutflowData({ ...outflowData, amount: e.target.value })}
                            placeholder="0,00"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Descrição</label>
                          <input
                            type="text"
                            value={outflowData.description}
                            onChange={(e) => setOutflowData({ ...outflowData, description: e.target.value })}
                            placeholder="Ex: Compra de Óleo"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsOutflowModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddOutflow} className="bg-red-600 hover:bg-red-700 text-white">Confirmar Saída</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-secondary/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          t.type === 'inflow' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {t.type === 'inflow' ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{t.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {t.type === 'inflow' && (
                              <>
                                <span>{t.category}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{format(t.date, 'HH:mm')}</span>
                            {t.paymentMethod && (
                              <>
                                <span>•</span>
                                <span className="uppercase">{t.paymentMethod}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={cn(
                        "font-bold",
                        t.type === 'inflow' ? "text-green-500" : "text-red-500"
                      )}>
                        {t.type === 'inflow' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary / Payment Methods */}
            <div className="space-y-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Vendas por Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['pix', 'debito', 'credito', 'dinheiro'].map((method) => {
                    const amount = transactions
                      .filter(t => t.paymentMethod === method)
                      .reduce((sum, t) => sum + t.amount, 0)
                    const count = transactions.filter(t => t.paymentMethod === method).length
                    
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium capitalize text-foreground">{method}</span>
                          <span className="text-xs text-muted-foreground">{count} pedidos</span>
                        </div>
                        <span className="font-semibold text-foreground">R$ {amount.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="glass border-glass-border bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    Resumo do Dia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    O caixa está <span className="text-green-500 font-bold">ABERTO</span>.
                  </p>
                  <p className="text-muted-foreground">
                    Total bruto: <span className="text-foreground font-medium">R$ {totalInflow.toFixed(2)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Total líquido: <span className="text-foreground font-medium">R$ {netTotal.toFixed(2)}</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
