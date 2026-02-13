'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UrlBar } from './url-bar'
import { KeyValueEditor } from './key-value-editor'
import { BodyEditor } from './body-editor'
import { AuthEditor } from './auth-editor'
import { Tab, KeyValuePair } from '@/types'
import { useStore } from '@/store'
import { useExecuteRequest } from '@/hooks/use-execute-request'

interface RequestPanelProps {
  tab: Tab
}

export function RequestPanel({ tab }: RequestPanelProps) {
  const { updateTabRequest } = useStore()
  const { execute } = useExecuteRequest()

  const handleSend = () => {
    execute(tab)
  }

  return (
    <div className="flex h-full flex-col">
      <UrlBar tab={tab} onSend={handleSend} />
      <Tabs defaultValue="params" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-auto py-0">
          <TabsTrigger
            value="params"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Params
            {tab.request.queryParams.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                {tab.request.queryParams.filter((p) => p.enabled).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="headers"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Headers
            {tab.request.headers.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                {tab.request.headers.filter((h) => h.enabled).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="body"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Body
          </TabsTrigger>
          <TabsTrigger
            value="auth"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Auth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <KeyValueEditor
              pairs={tab.request.queryParams}
              onChange={(pairs) => updateTabRequest(tab.id, { queryParams: pairs })}
              keyPlaceholder="Parameter"
              valuePlaceholder="Value"
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headers" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <KeyValueEditor
              pairs={tab.request.headers}
              onChange={(pairs) => updateTabRequest(tab.id, { headers: pairs })}
              keyPlaceholder="Header"
              valuePlaceholder="Value"
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="body" className="flex-1 m-0 overflow-hidden">
          <BodyEditor tab={tab} />
        </TabsContent>

        <TabsContent value="auth" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <AuthEditor tab={tab} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
