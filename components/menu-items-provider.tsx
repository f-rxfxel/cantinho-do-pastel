'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { MenuItem, Extra } from '@/lib/types'
import { menuItems as defaultItems, extras as defaultExtras } from '@/lib/mock-data'

const STORAGE_KEY = 'pastelaria-menu-items'
const EXTRAS_STORAGE_KEY = 'pastelaria-menu-extras'

type MenuItemsContextValue = {
  items: MenuItem[]
  addItem: (item: MenuItem) => void
  updateItem: (item: MenuItem) => void
  upsertItem: (item: MenuItem) => void
  deleteItem: (itemId: string) => void
  setAvailability: (itemId: string, available: boolean) => void
  extras: Extra[]
  addExtra: (extra: Extra) => void
  updateExtra: (extra: Extra) => void
  deleteExtra: (extraId: string) => void
}

const MenuItemsContext = createContext<MenuItemsContextValue | null>(null)

export function MenuItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(defaultItems)
  const [extras, setExtras] = useState<Extra[]>(defaultExtras)
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

    const storedExtras = window.localStorage.getItem(EXTRAS_STORAGE_KEY)
    if (storedExtras) {
      try {
        const parsed = JSON.parse(storedExtras)
        if (Array.isArray(parsed)) {
          setExtras(parsed)
        }
      } catch {
        setExtras(defaultExtras)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    window.localStorage.setItem(EXTRAS_STORAGE_KEY, JSON.stringify(extras))
  }, [extras, isHydrated])

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

  const addExtra = (extra: Extra) => {
    setExtras(current => [...current, extra])
  }

  const updateExtra = (extra: Extra) => {
    setExtras(current => current.map(e => (e.id === extra.id ? extra : e)))
  }

  const deleteExtra = (extraId: string) => {
    setExtras(current => current.filter(e => e.id !== extraId))
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
        extras,
        addExtra,
        updateExtra,
        deleteExtra,
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
