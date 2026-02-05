'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy, Download, Loader2 } from 'lucide-react'
import { Tab } from '@/types'
import { JsonViewer } from './json-viewer'
import { formatBytes, formatTime, getStatusColor } from '@/lib/http-client'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface ResponsePanelProps {
  tab: Tab
}

export function ResponsePanel({ tab }: ResponsePanelProps) {
  const { response, isLoading } = tab

  const detectedLanguage = useMemo(() => {
    if (!response) return 'plaintext'
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('json')) return 'json'
    if (contentType.includes('xml')) return 'xml'
    if (contentType.includes('html')) return 'html'
    try {
      JSON.parse(response.body)
      return 'json'
    } catch {
      return 'plaintext'
    }
  }, [response])

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.body)
    }
  }

  const downloadResponse = () => {
    if (response) {
      const blob = new Blob([response.body], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `response.${detectedLanguage === 'json' ? 'json' : 'txt'}`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Sending request...</span>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Send a request to see the response</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className={cn('font-mono', getStatusColor(response.statusCode))}
          >
            {response.statusCode} {response.statusText}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatTime(response.responseTime)}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatBytes(response.responseSize)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyResponse}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadResponse}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="body" className="flex flex-1 flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-auto py-0">
          <TabsTrigger
            value="body"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Body
          </TabsTrigger>
          <TabsTrigger
            value="headers"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Headers
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {Object.keys(response.headers).length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="flex-1 m-0 overflow-hidden">
          <JsonViewer value={response.body} language={detectedLanguage} />
        </TabsContent>

        <TabsContent value="headers" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 pr-4 font-mono text-sm font-medium">
                        {key}
                      </td>
                      <td className="py-2 font-mono text-sm text-muted-foreground">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
