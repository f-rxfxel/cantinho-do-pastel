'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { MenuItem } from '@/lib/types'
import { menuItems as defaultItems } from '@/lib/mock-data'

const STORAGE_KEY = 'pastelaria-menu-items'

type MenuItemsContextValue = {
  items: MenuItem[]
  addItem: (item: MenuItem) => void
  updateItem: (item: MenuItem) => void
  upsertItem: (item: MenuItem) => void
  deleteItem: (itemId: string) => void
  setAvailability: (itemId: string, available: boolean) => void
}

const MenuItemsContext = createContext<MenuItemsContextValue | null>(null)

export function MenuItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(defaultItems)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const storedItems = window.localStorage.getItem(STORAGE_KEY)
    if (storedItems) {
      try {
        const parsed = JSON.parse(storedItems)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      } catch {
        setItems(defaultItems)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, isHydrated])

  const addItem = (item: MenuItem) => {
    setItems(current => [...current, item])
  }

  const updateItem = (item: MenuItem) => {
    setItems(current => current.map(currentItem => (currentItem.id === item.id ? item : currentItem)))
  }

  const upsertItem = (item: MenuItem) => {
    setItems(current => {
      const exists = current.some(currentItem => currentItem.id === item.id)
      return exists
        ? current.map(currentItem => (currentItem.id === item.id ? item : currentItem))
        : [...current, item]
    })
  }

  const deleteItem = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId))
  }

  const setAvailability = (itemId: string, available: boolean) => {
    setItems(current =>
      current.map(item => (item.id === itemId ? { ...item, available } : item))
    )
  }

  return (
    <MenuItemsContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        upsertItem,
        deleteItem,
        setAvailability,
      }}
    >
      {children}
    </MenuItemsContext.Provider>
  )
}

export function useMenuItems() {
  const context = useContext(MenuItemsContext)
  if (!context) {
    throw new Error('useMenuItems must be used within MenuItemsProvider')
  }
  return context
}
