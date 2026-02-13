"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Send, Loader2, Save } from "lucide-react";
import { HttpMethod, Tab } from "@/types";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  useCollections,
  useUpdateRequest,
  useCreateRequest,
} from "@/hooks/use-collections";

const methods: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

const methodColors: Record<string, string> = {
  GET: "text-green-500",
  POST: "text-blue-500",
  PUT: "text-yellow-500",
  PATCH: "text-orange-500",
  DELETE: "text-red-500",
  HEAD: "text-purple-500",
  OPTIONS: "text-gray-500",
};

interface UrlBarProps {
  tab: Tab;
  onSend: () => void;
}

export function UrlBar({ tab, onSend }: UrlBarProps) {
  const { updateTabRequest, updateTab } = useStore();
  const { data: collections = [] } = useCollections();
  const updateRequest = useUpdateRequest();
  const createRequest = useCreateRequest();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const hasId = !!tab.request.id;
  const canSave = tab.isDirty || !hasId;

  const handleSave = useCallback(async () => {
    if (hasId) {
      // Update existing request in collection
      await updateRequest.mutateAsync({
        id: tab.request.id!,
        data: {
          name: tab.request.name,
          method: tab.request.method,
          url: tab.request.url,
          queryParams: tab.request.queryParams,
          headers: tab.request.headers,
          bodyType: tab.request.bodyType,
          body: tab.request.body,
          authType: tab.request.authType,
          authConfig: tab.request.authConfig,
        },
      });
      updateTab(tab.id, { isDirty: false });
    } else {
      // Show dialog to save to collection
      setSaveName(tab.request.name || "New Request");
      setSelectedCollectionId(collections[0]?.id || "");
      setSelectedFolderId("");
      setShowSaveDialog(true);
    }
  }, [hasId, tab, collections, updateRequest, updateTab]);

  const handleSaveToCollection = async () => {
    if (!selectedCollectionId || !saveName.trim()) return;

    const newRequest = await createRequest.mutateAsync({
      name: saveName.trim(),
      collectionId: selectedCollectionId,
      folderId: selectedFolderId || undefined,
      method: tab.request.method,
      url: tab.request.url,
      queryParams: tab.request.queryParams,
      headers: tab.request.headers,
      bodyType: tab.request.bodyType,
      body: tab.request.body,
      authType: tab.request.authType,
      authConfig: tab.request.authConfig,
    });

    // Update tab with the new ID so future saves update instead of creating
    updateTabRequest(tab.id, { id: newRequest.id, name: saveName.trim() });
    updateTab(tab.id, { isDirty: false, name: saveName.trim() });
    setShowSaveDialog(false);
  };

  const selectedCollection = collections.find(
    (c) => c.id === selectedCollectionId,
  );

  // Keyboard shortcut: Cmd+S (macOS) or Ctrl+S (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  return (
    <>
      <div className="flex gap-2 p-4">
        <Select
          value={tab.request.method}
          onValueChange={(value) =>
            updateTabRequest(tab.id, { method: value as HttpMethod })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <span
                className={cn(
                  "font-semibold",
                  methodColors[tab.request.method],
                )}
              >
                {tab.request.method}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {methods.map((method) => (
              <SelectItem key={method} value={method}>
                <span className={cn("font-semibold", methodColors[method])}>
                  {method}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter URL or paste text"
          value={tab.request.url}
          onChange={(e) => updateTabRequest(tab.id, { url: e.target.value })}
          className="flex-1 font-mono text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />

        <Button
          onClick={onSend}
          disabled={tab.isLoading || !tab.request.url}
          className="gap-2 px-6 cursor-pointer"
          variant={"outline"}
        >
          {tab.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>

        <Button
          variant={canSave ? "default" : "outline"}
          onClick={handleSave}
          disabled={updateRequest.isPending || createRequest.isPending}
          className="gap-2 cursor-pointer"
        >
          {updateRequest.isPending || createRequest.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-name">Name</Label>
              <Input
                id="request-name"
                placeholder="Request name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select
                value={selectedCollectionId}
                onValueChange={(value) => {
                  setSelectedCollectionId(value);
                  setSelectedFolderId("");
                }}
              >
                <SelectTrigger id="collection">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCollection && selectedCollection.folders.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="folder">Folder (optional)</Label>
                <Select
                  value={selectedFolderId}
                  onValueChange={setSelectedFolderId}
                >
                  <SelectTrigger id="folder">
                    <SelectValue placeholder="Root (no folder)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Root (no folder)</SelectItem>
                    {selectedCollection.folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveToCollection}
              disabled={
                !selectedCollectionId ||
                !saveName.trim() ||
                createRequest.isPending
              }
            >
              {createRequest.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
