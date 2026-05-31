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
  title?: string
  subtitle?: string
}

export function Header({ isOpen = true, setIsOpen, title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Spacer (for fixed hamburger) */}
        <div className="w-10 lg:hidden shrink-0" />
        
        <div className="hidden md:flex flex-col">
          {title && (
            <h1 className="text-base font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-none mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
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
