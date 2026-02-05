'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { KeyValuePair } from '@/types'

interface KeyValueEditorProps {
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueEditorProps) {
  const addPair = () => {
    onChange([
      ...pairs,
      { id: crypto.randomUUID(), key: '', value: '', enabled: true },
    ])
  }

  const updatePair = (id: string, updates: Partial<KeyValuePair>) => {
    onChange(
      pairs.map((pair) => (pair.id === id ? { ...pair, ...updates } : pair))
    )
  }

  const removePair = (id: string) => {
    onChange(pairs.filter((pair) => pair.id !== id))
  }

  return (
    <div className="space-y-2 p-4">
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <Checkbox
            checked={pair.enabled}
            onCheckedChange={(checked) =>
              updatePair(pair.id, { enabled: checked as boolean })
            }
          />
          <Input
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => updatePair(pair.id, { key: e.target.value })}
            className="flex-1 font-mono text-sm"
          />
          <Input
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => updatePair(pair.id, { value: e.target.value })}
            className="flex-1 font-mono text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removePair(pair.id)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addPair} className="gap-2">
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  )
}
