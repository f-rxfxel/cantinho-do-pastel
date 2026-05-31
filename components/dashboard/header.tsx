'use client'

import { Bell, User, ChevronDown, Menu, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface HeaderProps {
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export function Header({ isOpen = true, setIsOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Spacer (for fixed hamburger) */}
        <div className="w-10 lg:hidden shrink-0" />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Status */}
        {setIsOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "hidden sm:flex gap-2 h-9 px-3",
              isOpen ? 'border-green-500/30 text-green-500 hover:bg-green-500/10' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", isOpen ? "bg-green-500" : "bg-red-500")} />
            <span className="hidden lg:inline">{isOpen ? 'Loja Aberta' : 'Loja Fechada'}</span>
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center" variant="destructive">
                4
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Pedido #1042 atrasado</span>
              <span className="text-xs text-muted-foreground">Há 5 minutos</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-9 pl-1 pr-2 md:pr-3 hover:bg-secondary/50">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">AD</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start lg:flex text-left">
                <span className="text-xs font-bold leading-tight">Admin</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Gerente</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive gap-2">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
