'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CollectionTree } from '@/components/collections/collection-tree'
import { HistoryList } from '@/components/history/history-list'
import { FolderTree, Clock } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="collections" className="flex flex-1 flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
          <TabsTrigger value="collections" className="gap-2 data-[state=active]:bg-muted">
            <FolderTree className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-muted">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="collections" className="mt-0 flex-1">
          <ScrollArea className="h-full">
            <CollectionTree />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="history" className="mt-0 flex-1">
          <ScrollArea className="h-full">
            <HistoryList />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
