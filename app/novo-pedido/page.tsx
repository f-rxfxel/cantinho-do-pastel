'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { OrderModal } from '@/components/dashboard/order-modal'
import { toast } from 'sonner'

export default function NovoPedidoPage() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const handleConfirm = (data: any) => {
    toast.success('Pedido criado com sucesso!')
    router.push('/')
  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-center h-[70vh]">
            <p className="text-muted-foreground">Abrindo formulário de pedido...</p>
          </div>
        </main>
      </div>
      <OrderModal 
        order={null}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
