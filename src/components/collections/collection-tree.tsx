'use client'

import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Trash2,
  FileJson,
  Download,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useCreateFolder,
  useDeleteFolder,
  useCreateRequest,
  useDeleteRequest,
  useExportCollection,
  useImportCollection,
} from '@/hooks/use-collections'
import { Collection, Folder as FolderType, RequestData } from '@/types'

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-500',
  POST: 'bg-blue-500/20 text-blue-500',
  PUT: 'bg-yellow-500/20 text-yellow-500',
  PATCH: 'bg-orange-500/20 text-orange-500',
  DELETE: 'bg-red-500/20 text-red-500',
  HEAD: 'bg-purple-500/20 text-purple-500',
  OPTIONS: 'bg-gray-500/20 text-gray-500',
}

export function CollectionTree() {
  const { data: collections = [], isLoading } = useCollections()
  const createCollection = useCreateCollection()
  const importCollection = useImportCollection()
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection.mutate({ name: newCollectionName.trim() })
      setNewCollectionName('')
      setShowNewCollection(false)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        try {
          const data = JSON.parse(text)
          importCollection.mutate(data)
        } catch {
          alert('Invalid JSON file')
        }
      }
    }
    input.click()
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading collections...
      </div>
    )
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          Collections
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleImport}
            title="Import Collection"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowNewCollection(true)}
            title="New Collection"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
          No collections yet
        </div>
      ) : (
        <div className="space-y-1">
          {collections.map((collection) => (
            <CollectionItem key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      <Dialog open={showNewCollection} onOpenChange={setShowNewCollection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCollection(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CollectionItem({ collection }: { collection: Collection }) {
  const [expanded, setExpanded] = useState(true)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [newName, setNewName] = useState('')
  const deleteCollection = useDeleteCollection()
  const createFolder = useCreateFolder()
  const createRequest = useCreateRequest()
  const exportCollection = useExportCollection()

  const handleExport = async () => {
    const data = await exportCollection.mutateAsync(collection.id)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${collection.name.replace(/[^a-z0-9]/gi, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCreateFolder = () => {
    if (newName.trim()) {
      createFolder.mutate({ name: newName.trim(), collectionId: collection.id })
      setNewName('')
      setShowNewFolder(false)
    }
  }

  const handleCreateRequest = () => {
    if (newName.trim()) {
      createRequest.mutate({
        name: newName.trim(),
        collectionId: collection.id,
        method: 'GET',
        url: '',
        queryParams: [],
        headers: [],
        bodyType: 'none',
        body: '',
        authType: 'none',
        authConfig: { type: 'none' },
      })
      setNewName('')
      setShowNewRequest(false)
    }
  }

  return (
    <div>
      <div className="group flex items-center gap-1 rounded px-2 py-1 hover:bg-muted">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {expanded ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-yellow-500" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-yellow-500" />
        )}
        <span className="flex-1 truncate text-sm">{collection.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowNewRequest(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowNewFolder(true)}>
              <Folder className="mr-2 h-4 w-4" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteCollection.mutate(collection.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {expanded && (
        <div className="ml-4 border-l pl-2">
          {collection.folders?.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              collectionId={collection.id}
            />
          ))}
          {collection.requests?.map((request) => (
            <RequestItem key={request.id} request={request} />
          ))}
        </div>
      )}

      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Folder name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolder(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Request</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Request name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRequest()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FolderItem({
  folder,
  collectionId,
}: {
  folder: FolderType
  collectionId: string
}) {
  const [expanded, setExpanded] = useState(true)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [newName, setNewName] = useState('')
  const deleteFolder = useDeleteFolder()
  const createRequest = useCreateRequest()

  const handleCreateRequest = () => {
    if (newName.trim()) {
      createRequest.mutate({
        name: newName.trim(),
        collectionId,
        folderId: folder.id,
        method: 'GET',
        url: '',
        queryParams: [],
        headers: [],
        bodyType: 'none',
        body: '',
        authType: 'none',
        authConfig: { type: 'none' },
      })
      setNewName('')
      setShowNewRequest(false)
    }
  }

  return (
    <div>
      <div className="group flex items-center gap-1 rounded px-2 py-1 hover:bg-muted">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {expanded ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-blue-500" />
        )}
        <span className="flex-1 truncate text-sm">{folder.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowNewRequest(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteFolder.mutate(folder.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {expanded && (
        <div className="ml-4 border-l pl-2">
          {folder.children?.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              collectionId={collectionId}
            />
          ))}
          {folder.requests?.map((request) => (
            <RequestItem key={request.id} request={request} />
          ))}
        </div>
      )}

      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Request</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Request name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRequest()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RequestItem({ request }: { request: RequestData }) {
  const { addTab } = useStore()
  const deleteRequest = useDeleteRequest()

  const handleClick = () => {
    addTab(request)
  }

  return (
    <div
      className="group flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted"
      onClick={handleClick}
    >
      <FileJson className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Badge
        variant="secondary"
        className={cn('h-5 px-1.5 text-[10px] font-semibold shrink-0', methodColors[request.method])}
      >
        {request.method}
      </Badge>
      <span className="flex-1 truncate text-sm">{request.name}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              if (request.id) deleteRequest.mutate(request.id)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
