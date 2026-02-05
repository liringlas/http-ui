'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AuthType, Tab } from '@/types'
import { useStore } from '@/store'

interface AuthEditorProps {
  tab: Tab
}

const authTypes: { value: AuthType; label: string }[] = [
  { value: 'none', label: 'No Auth' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'api-key', label: 'API Key' },
]

export function AuthEditor({ tab }: AuthEditorProps) {
  const { updateTabRequest } = useStore()
  const { authType, authConfig } = tab.request

  const updateAuthConfig = (updates: Partial<typeof authConfig>) => {
    updateTabRequest(tab.id, {
      authConfig: { ...authConfig, ...updates },
    })
  }

  return (
    <div className="p-4 space-y-4">
      <Tabs
        value={authType}
        onValueChange={(value) =>
          updateTabRequest(tab.id, {
            authType: value as AuthType,
            authConfig: { ...authConfig, type: value as AuthType },
          })
        }
      >
        <TabsList className="w-full justify-start">
          {authTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="none" className="mt-4">
          <p className="text-muted-foreground">
            This request does not use any authorization
          </p>
        </TabsContent>

        <TabsContent value="bearer" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Token</Label>
            <Input
              placeholder="Enter bearer token"
              value={authConfig.bearer?.token || ''}
              onChange={(e) =>
                updateAuthConfig({ bearer: { token: e.target.value } })
              }
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              The token will be added as: Authorization: Bearer {'<token>'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="basic" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              placeholder="Enter username"
              value={authConfig.basic?.username || ''}
              onChange={(e) =>
                updateAuthConfig({
                  basic: { ...authConfig.basic, username: e.target.value, password: authConfig.basic?.password || '' },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={authConfig.basic?.password || ''}
              onChange={(e) =>
                updateAuthConfig({
                  basic: { ...authConfig.basic, password: e.target.value, username: authConfig.basic?.username || '' },
                })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="api-key" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Key</Label>
            <Input
              placeholder="e.g., X-API-Key"
              value={authConfig.apiKey?.key || ''}
              onChange={(e) =>
                updateAuthConfig({
                  apiKey: {
                    ...authConfig.apiKey,
                    key: e.target.value,
                    value: authConfig.apiKey?.value || '',
                    addTo: authConfig.apiKey?.addTo || 'header'
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              placeholder="Enter API key value"
              value={authConfig.apiKey?.value || ''}
              onChange={(e) =>
                updateAuthConfig({
                  apiKey: {
                    ...authConfig.apiKey,
                    value: e.target.value,
                    key: authConfig.apiKey?.key || '',
                    addTo: authConfig.apiKey?.addTo || 'header'
                  },
                })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Add to</Label>
            <Select
              value={authConfig.apiKey?.addTo || 'header'}
              onValueChange={(value) =>
                updateAuthConfig({
                  apiKey: {
                    ...authConfig.apiKey,
                    addTo: value as 'header' | 'query',
                    key: authConfig.apiKey?.key || '',
                    value: authConfig.apiKey?.value || ''
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="query">Query Params</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
