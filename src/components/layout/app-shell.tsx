'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { TabBar } from './tab-bar'
import { RequestPanel } from '@/components/request-builder/request-panel'
import { ResponsePanel } from '@/components/response-viewer/response-panel'
import { useStore } from '@/store'

export function AppShell() {
  const { tabs, activeTabId } = useStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full flex-col">
            <TabBar />
            {activeTab ? (
              <ResizablePanelGroup direction="vertical" className="flex-1">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <RequestPanel tab={activeTab} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <ResponsePanel tab={activeTab} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                <p>Create a new request to get started</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
