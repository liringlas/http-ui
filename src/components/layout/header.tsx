'use client'

import { Plus, Settings, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStore } from '@/store'
import { useEnvironments } from '@/hooks/use-environments'
import { EnvironmentManager } from '@/components/environments/environment-manager'

export function Header() {
  const { addTab, activeEnvironmentId, setActiveEnvironment } = useStore()
  const { data: environments = [] } = useEnvironments()

  return (
    <header className="flex h-12 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-semibold">HTTP UI</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTab()}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={activeEnvironmentId || 'none'}
          onValueChange={(value) =>
            setActiveEnvironment(value === 'none' ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="No Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Environment</SelectItem>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <EnvironmentManager />

        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
