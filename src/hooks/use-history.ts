'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HistoryEntry } from '@/types'

async function fetchHistory(): Promise<HistoryEntry[]> {
  const response = await fetch('/api/history')
  if (!response.ok) throw new Error('Failed to fetch history')
  return response.json()
}

async function clearHistory(): Promise<void> {
  const response = await fetch('/api/history', {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to clear history')
}

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: fetchHistory,
  })
}

export function useClearHistory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}
