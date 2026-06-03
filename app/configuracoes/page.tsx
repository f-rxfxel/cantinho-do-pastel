'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  Settings,
  Store,
  Clock,
  Phone,
  Printer,
  Bell,
  Palette,
  Users,
  Shield,
  Save,
  Check,
} from 'lucide-react'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('loja')
  const [saved, setSaved] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const currentTheme = isMounted ? (resolvedTheme ?? theme) : 'dark'

  const tabs = [
    { id: 'loja', name: 'Dados da Loja', icon: Store },
    { id: 'horarios', name: 'Horários', icon: Clock },
    { id: 'impressao', name: 'Impressão', icon: Printer },
    { id: 'notificacoes', name: 'Notificações', icon: Bell },
    { id: 'aparencia', name: 'Aparência', icon: Palette },
    { id: 'usuarios', name: 'Usuários', icon: Users },
    { id: 'seguranca', name: 'Segurança', icon: Shield },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header 
          title="Configurações" 
          subtitle="Gerencie as configurações do sistema"
        />
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        activeTab === tab.id
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="glass rounded-xl p-6">
                {activeTab === 'loja' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        Dados da Loja
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Nome da Loja</label>
                          <input
                            type="text"
                            defaultValue="Cantinho do Pastel"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">CNPJ</label>
                          <input
                            type="text"
                            defaultValue="12.345.678/0001-90"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefone
                          </label>
                          <input
                            type="tel"
                            defaultValue="(35) 9 9820-0003"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">E-mail</label>
                          <input
                            type="email"
                            defaultValue="contato@cantinhodopasstel.com.br"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm text-muted-foreground mb-2 block">Endereço</label>
                          <input
                            type="text"
                            defaultValue="Rua das Flores, 123 - Centro"
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'horarios' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Horário de Funcionamento
                    </h3>
                    <div className="space-y-4">
                      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, i) => (
                        <div key={day} className="flex items-center gap-4">
                          <span className="w-24 text-sm text-foreground">{day}</span>
                          <input
                            type="time"
                            defaultValue={i < 5 ? '14:00' : i === 5 ? '12:00' : ''}
                            disabled={i === 6}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          />
                          <span className="text-muted-foreground">às</span>
                          <input
                            type="time"
                            defaultValue={i < 5 ? '21:00' : i === 5 ? '22:00' : ''}
                            disabled={i === 6}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          />
                          <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            <input
                              type="checkbox"
                              defaultChecked={i === 6}
                              className="rounded border-border"
                            />
                            Fechado
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'impressao' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Printer className="h-5 w-5 text-primary" />
                      Configurações de Impressão
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Impressora Padrão</label>
                        <select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                          <option>Epson TM-T20</option>
                          <option>Bematech MP-4200</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="auto-print" defaultChecked className="rounded border-border" />
                        <label htmlFor="auto-print" className="text-sm text-foreground">
                          Imprimir automaticamente ao receber pedido
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="print-kitchen" defaultChecked className="rounded border-border" />
                        <label htmlFor="print-kitchen" className="text-sm text-foreground">
                          Imprimir comanda para cozinha
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="print-customer" className="rounded border-border" />
                        <label htmlFor="print-customer" className="text-sm text-foreground">
                          Imprimir comprovante para cliente
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notificacoes' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notificações
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div>
                          <p className="font-medium text-foreground">Novos pedidos</p>
                          <p className="text-sm text-muted-foreground">Receber alerta sonoro ao receber novo pedido</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-border h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div>
                          <p className="font-medium text-foreground">Pedidos atrasados</p>
                          <p className="text-sm text-muted-foreground">Alertar quando pedido ultrapassar tempo estimado</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-border h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div>
                          <p className="font-medium text-foreground">Estoque baixo</p>
                          <p className="text-sm text-muted-foreground">Alertar quando produto estiver com estoque baixo</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-border h-5 w-5" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'aparencia' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Aparência
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Tema</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            aria-pressed={currentTheme === 'dark'}
                            className={cn(
                              'flex-1 rounded-lg border p-4 text-center transition-all',
                              currentTheme === 'dark'
                                ? 'border-primary ring-2 ring-primary/40 bg-zinc-900'
                                : 'border-border bg-white/90 hover:border-primary/40'
                            )}
                          >
                            <span className="text-sm font-medium text-foreground">Escuro</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setTheme('light')}
                            aria-pressed={currentTheme === 'light'}
                            className={cn(
                              'flex-1 rounded-lg border p-4 text-center transition-all',
                              currentTheme === 'light'
                                ? 'border-primary ring-2 ring-primary/40 bg-white'
                                : 'border-border bg-zinc-900/80 hover:border-primary/40'
                            )}
                          >
                            <span className="text-sm font-medium text-foreground">Claro</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Cor Principal</label>
                        <div className="flex gap-3">
                          {['#f97316', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'].map((color) => (
                            <button
                              key={color}
                              className={cn(
                                'h-10 w-10 rounded-full border-2 transition-all',
                                color === '#f97316' ? 'border-white scale-110' : 'border-transparent'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'usuarios' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Usuários
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Admin', email: 'admin@cantinho.com', role: 'Administrador' },
                        { name: 'João Atendente', email: 'joao@cantinho.com', role: 'Atendente' },
                        { name: 'Maria Cozinha', email: 'maria@cantinho.com', role: 'Cozinha' },
                      ].map((user) => (
                        <div key={user.email} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      + Adicionar Usuário
                    </button>
                  </div>
                )}

                {activeTab === 'seguranca' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Segurança
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Senha Atual</label>
                        <input
                          type="password"
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Nova Senha</label>
                        <input
                          type="password"
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all',
                      saved
                        ? 'bg-green-600 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {saved ? (
                      <>
                        <Check className="h-4 w-4" />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
