'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Environment, Variable } from '@/types'

async function fetchEnvironments(): Promise<Environment[]> {
  const response = await fetch('/api/environments')
  if (!response.ok) throw new Error('Failed to fetch environments')
  return response.json()
}

async function createEnvironment(data: { name: string }): Promise<Environment> {
  const response = await fetch('/api/environments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create environment')
  return response.json()
}

async function updateEnvironment(id: string, data: Partial<Environment>): Promise<Environment> {
  const response = await fetch(`/api/environments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update environment')
  return response.json()
}

async function deleteEnvironment(id: string): Promise<void> {
  const response = await fetch(`/api/environments/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete environment')
}

async function activateEnvironment(id: string): Promise<Environment> {
  const response = await fetch(`/api/environments/${id}/activate`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to activate environment')
  return response.json()
}

async function fetchVariables(): Promise<Variable[]> {
  const response = await fetch('/api/variables')
  if (!response.ok) throw new Error('Failed to fetch variables')
  return response.json()
}

async function createVariable(data: { key: string; value: string; environmentId?: string }): Promise<Variable> {
  const response = await fetch('/api/variables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create variable')
  return response.json()
}

async function updateVariable(id: string, data: Partial<Variable>): Promise<Variable> {
  const response = await fetch(`/api/variables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update variable')
  return response.json()
}

async function deleteVariable(id: string): Promise<void> {
  const response = await fetch(`/api/variables/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete variable')
}

export function useEnvironments() {
  return useQuery({
    queryKey: ['environments'],
    queryFn: fetchEnvironments,
  })
}

export function useCreateEnvironment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useUpdateEnvironment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Environment> }) =>
      updateEnvironment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useDeleteEnvironment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useActivateEnvironment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useVariables() {
  return useQuery({
    queryKey: ['variables'],
    queryFn: fetchVariables,
  })
}

export function useCreateVariable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVariable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variables'] })
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useUpdateVariable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Variable> }) =>
      updateVariable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variables'] })
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}

export function useDeleteVariable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVariable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variables'] })
      queryClient.invalidateQueries({ queryKey: ['environments'] })
    },
  })
}
