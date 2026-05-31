'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  FileText,
  ChevronRight
} from 'lucide-react'
import { mockHistory } from '@/lib/mock-data'
import type { HistoryRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function HistoricoPage() {
  const [history, setHistory] = useState<HistoryRecord[]>(mockHistory)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<HistoryRecord>>({})

  const filteredHistory = history.filter(h => 
    h.date.includes(searchTerm)
  )

  const handleDelete = (id: string) => {
    setHistory(history.filter(h => h.id !== id))
    toast.success('Registro excluído com sucesso')
  }

  const handleEdit = (record: HistoryRecord) => {
    setSelectedRecord(record)
    setEditData(record)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedRecord) return
    
    setHistory(history.map(h => 
      h.id === selectedRecord.id ? { ...h, ...editData } as HistoryRecord : h
    ))
    setIsEditModalOpen(false)
    toast.success('Registro atualizado com sucesso')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Histórico de Vendas</h1>
              <p className="text-muted-foreground">
                Consulte e gerencie os fechamentos anteriores.
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>

          <Card className="glass border-glass-border">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Registros de Fechamento</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por data..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/30 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Pedidos</th>
                      <th className="px-4 py-3 font-medium">Faturamento</th>
                      <th className="px-4 py-3 font-medium">Despesas</th>
                      <th className="px-4 py-3 font-medium">Lucro Líquido</th>
                      <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {record.date}
                          </div>
                        </td>
                        <td className="px-4 py-4">{record.ordersCount}</td>
                        <td className="px-4 py-4 text-green-500 font-medium">R$ {record.totalRevenue.toFixed(2)}</td>
                        <td className="px-4 py-4 text-red-500">R$ {record.totalExpense.toFixed(2)}</td>
                        <td className="px-4 py-4 font-bold text-primary">R$ {record.profit.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                              onClick={() => handleEdit(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              onClick={() => handleDelete(record.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro: {selectedRecord?.date}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Faturamento (R$)</label>
                <input
                  type="number"
                  value={editData.totalRevenue}
                  onChange={(e) => setEditData({ ...editData, totalRevenue: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Despesas (R$)</label>
                <input
                  type="number"
                  value={editData.totalExpense}
                  onChange={(e) => setEditData({ ...editData, totalExpense: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qtd. Pedidos</label>
              <input
                type="number"
                value={editData.ordersCount}
                onChange={(e) => setEditData({ ...editData, ordersCount: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
