'use client'

import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { Badge } from '@/components/ui/badge'

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-500',
  POST: 'bg-blue-500/20 text-blue-500',
  PUT: 'bg-yellow-500/20 text-yellow-500',
  PATCH: 'bg-orange-500/20 text-orange-500',
  DELETE: 'bg-red-500/20 text-red-500',
  HEAD: 'bg-purple-500/20 text-purple-500',
  OPTIONS: 'bg-gray-500/20 text-gray-500',
}

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab } = useStore()

  if (tabs.length === 0) {
    return (
      <div className="flex h-10 items-center border-b bg-muted/30 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addTab()}
          className="gap-2 text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-10 items-center border-b bg-muted/30 overflow-hidden">
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="flex w-max">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                'group flex h-10 min-w-[120px] max-w-[200px] cursor-pointer items-center gap-2 border-r px-3 transition-colors',
                activeTabId === tab.id
                  ? 'bg-background'
                  : 'bg-muted/50 hover:bg-muted'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Badge
                variant="secondary"
                className={cn(
                  'h-5 px-1.5 text-[10px] font-semibold',
                  methodColors[tab.request.method]
                )}
              >
                {tab.request.method}
              </Badge>
              <span className="flex-1 truncate text-sm">
                {tab.request.url || tab.name}
              </span>
              {tab.isDirty && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(tab.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-none border-l"
        onClick={() => addTab()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
