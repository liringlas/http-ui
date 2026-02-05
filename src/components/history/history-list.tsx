'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useHistory, useClearHistory } from '@/hooks/use-history'
import { useStore } from '@/store'
import { formatTime, getStatusColor } from '@/lib/http-client'

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-500',
  POST: 'bg-blue-500/20 text-blue-500',
  PUT: 'bg-yellow-500/20 text-yellow-500',
  PATCH: 'bg-orange-500/20 text-orange-500',
  DELETE: 'bg-red-500/20 text-red-500',
  HEAD: 'bg-purple-500/20 text-purple-500',
  OPTIONS: 'bg-gray-500/20 text-gray-500',
}

export function HistoryList() {
  const { data: history = [], isLoading } = useHistory()
  const clearHistory = useClearHistory()
  const { addTab } = useStore()

  const handleClick = (entry: (typeof history)[0]) => {
    addTab({
      name: entry.url,
      method: entry.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
      url: entry.url,
      queryParams: [],
      headers: JSON.parse(entry.requestHeaders || '[]'),
      bodyType: entry.requestBody ? 'json' : 'none',
      body: entry.requestBody || '',
      authType: 'none',
      authConfig: { type: 'none' },
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading history...</div>
    )
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          History
        </span>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => clearHistory.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
          No history yet
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-muted"
              onClick={() => handleClick(entry)}
            >
              <Badge
                variant="secondary"
                className={cn(
                  'h-5 px-1.5 text-[10px] font-semibold shrink-0',
                  methodColors[entry.method]
                )}
              >
                {entry.method}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-mono">{entry.url}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={cn('font-medium', getStatusColor(entry.statusCode))}>
                    {entry.statusCode}
                  </span>
                  <span>{formatTime(entry.responseTime)}</span>
                  <span>
                    {new Date(entry.executedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
