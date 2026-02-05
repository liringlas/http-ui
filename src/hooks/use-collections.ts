'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Collection, RequestData, Folder } from '@/types'

async function fetchCollections(): Promise<Collection[]> {
  const response = await fetch('/api/collections')
  if (!response.ok) throw new Error('Failed to fetch collections')
  return response.json()
}

async function createCollection(data: { name: string; description?: string }): Promise<Collection> {
  const response = await fetch('/api/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create collection')
  return response.json()
}

async function deleteCollection(id: string): Promise<void> {
  const response = await fetch(`/api/collections/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete collection')
}

async function createFolder(data: { name: string; collectionId: string; parentId?: string }): Promise<Folder> {
  const response = await fetch('/api/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create folder')
  return response.json()
}

async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`/api/folders/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete folder')
}

async function createRequest(data: Partial<RequestData>): Promise<RequestData> {
  const response = await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create request')
  return response.json()
}

async function updateRequest(id: string, data: Partial<RequestData>): Promise<RequestData> {
  const response = await fetch(`/api/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update request')
  return response.json()
}

async function deleteRequest(id: string): Promise<void> {
  const response = await fetch(`/api/requests/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete request')
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useUpdateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequestData> }) =>
      updateRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useDeleteRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

async function exportCollection(id: string): Promise<unknown> {
  const response = await fetch(`/api/collections/${id}/export`)
  if (!response.ok) throw new Error('Failed to export collection')
  return response.json()
}

async function importCollection(data: unknown): Promise<Collection> {
  const response = await fetch('/api/collections/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to import collection')
  return response.json()
}

export function useExportCollection() {
  return useMutation({
    mutationFn: exportCollection,
  })
}

export function useImportCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: importCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
