'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tab, ResponseData, Variable } from '@/types'
import { useStore } from '@/store'
import { useEnvironments, useVariables } from './use-environments'

interface ExecuteRequestInput {
  request: Tab['request']
  variables: Variable[]
}

async function executeRequest(input: ExecuteRequestInput): Promise<ResponseData> {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }
  return response.json()
}

export function useExecuteRequest() {
  const { setTabLoading, setTabResponse } = useStore()
  const queryClient = useQueryClient()
  const { data: environments = [] } = useEnvironments()
  const { data: globalVariables = [] } = useVariables()
  const { activeEnvironmentId } = useStore()

  const mutation = useMutation({
    mutationFn: executeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  const execute = async (tab: Tab) => {
    setTabLoading(tab.id, true)
    setTabResponse(tab.id, undefined)

    try {
      const activeEnv = environments.find((e) => e.id === activeEnvironmentId)
      const envVariables = activeEnv?.variables || []
      const allVariables = [...globalVariables, ...envVariables]

      const response = await mutation.mutateAsync({
        request: tab.request,
        variables: allVariables,
      })

      setTabResponse(tab.id, response)
    } catch (error) {
      setTabResponse(tab.id, {
        statusCode: 0,
        statusText: 'Error',
        headers: {},
        body: error instanceof Error ? error.message : 'Request failed',
        responseTime: 0,
        responseSize: 0,
      })
    }
  }

  return { execute, isLoading: mutation.isPending }
}
