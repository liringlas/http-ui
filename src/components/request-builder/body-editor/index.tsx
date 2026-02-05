'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BodyType, Tab } from '@/types'
import { useStore } from '@/store'
import { JsonEditor } from './json-editor'

interface BodyEditorProps {
  tab: Tab
}

const bodyTypes: { value: BodyType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'raw', label: 'Raw' },
  { value: 'x-www-form-urlencoded', label: 'x-www-form-urlencoded' },
  { value: 'form-data', label: 'Form Data' },
]

export function BodyEditor({ tab }: BodyEditorProps) {
  const { updateTabRequest } = useStore()

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={tab.request.bodyType}
        onValueChange={(value) =>
          updateTabRequest(tab.id, { bodyType: value as BodyType })
        }
        className="flex h-full flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 py-0 h-auto">
          {bodyTypes.map((type) => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="none" className="flex-1 m-0">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            This request does not have a body
          </div>
        </TabsContent>

        <TabsContent value="json" className="flex-1 m-0 overflow-hidden">
          <JsonEditor
            value={tab.request.body}
            onChange={(value) => updateTabRequest(tab.id, { body: value })}
          />
        </TabsContent>

        <TabsContent value="raw" className="flex-1 m-0 overflow-hidden">
          <JsonEditor
            value={tab.request.body}
            onChange={(value) => updateTabRequest(tab.id, { body: value })}
            language="plaintext"
          />
        </TabsContent>

        <TabsContent value="x-www-form-urlencoded" className="flex-1 m-0 overflow-hidden">
          <JsonEditor
            value={tab.request.body}
            onChange={(value) => updateTabRequest(tab.id, { body: value })}
            language="plaintext"
            placeholder="key1=value1&key2=value2"
          />
        </TabsContent>

        <TabsContent value="form-data" className="flex-1 m-0 overflow-hidden">
          <JsonEditor
            value={tab.request.body}
            onChange={(value) => updateTabRequest(tab.id, { body: value })}
            language="plaintext"
            placeholder="Enter form data as JSON: { &quot;key&quot;: &quot;value&quot; }"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
