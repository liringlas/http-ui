import { RequestData, ResponseData, KeyValuePair, Variable } from '@/types'
import { resolveVariables, resolveKeyValuePairs } from './variable-resolver'

export interface ExecuteRequestOptions {
  request: RequestData
  variables?: Variable[]
}

export async function executeRequest({
  request,
  variables = [],
}: ExecuteRequestOptions): Promise<ResponseData> {
  const resolvedUrl = resolveVariables(request.url, variables)
  const resolvedParams = resolveKeyValuePairs(request.queryParams, variables)
  const resolvedHeaders = resolveKeyValuePairs(request.headers, variables)
  const resolvedBody = resolveVariables(request.body, variables)

  const url = new URL(resolvedUrl)

  resolvedParams
    .filter((p) => p.enabled && p.key)
    .forEach((p) => {
      url.searchParams.append(p.key, p.value)
    })

  const headers: Record<string, string> = {}
  resolvedHeaders
    .filter((h) => h.enabled && h.key)
    .forEach((h) => {
      headers[h.key] = h.value
    })

  applyAuth(request, headers, url, variables)

  if (request.bodyType === 'json' && resolvedBody) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  } else if (request.bodyType === 'x-www-form-urlencoded' && resolvedBody) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded'
  }

  const startTime = performance.now()

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  if (!['GET', 'HEAD'].includes(request.method) && request.bodyType !== 'none' && resolvedBody) {
    fetchOptions.body = resolvedBody
  }

  const response = await fetch(url.toString(), fetchOptions)
  const endTime = performance.now()

  const responseBody = await response.text()
  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })

  return {
    statusCode: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: responseBody,
    responseTime: Math.round(endTime - startTime),
    responseSize: new Blob([responseBody]).size,
  }
}

function applyAuth(
  request: RequestData,
  headers: Record<string, string>,
  url: URL,
  variables: Variable[]
): void {
  const { authType, authConfig } = request

  switch (authType) {
    case 'bearer':
      if (authConfig.bearer?.token) {
        const token = resolveVariables(authConfig.bearer.token, variables)
        headers['Authorization'] = `Bearer ${token}`
      }
      break
    case 'basic':
      if (authConfig.basic?.username || authConfig.basic?.password) {
        const username = resolveVariables(authConfig.basic.username || '', variables)
        const password = resolveVariables(authConfig.basic.password || '', variables)
        const encoded = btoa(`${username}:${password}`)
        headers['Authorization'] = `Basic ${encoded}`
      }
      break
    case 'api-key':
      if (authConfig.apiKey?.key && authConfig.apiKey?.value) {
        const key = resolveVariables(authConfig.apiKey.key, variables)
        const value = resolveVariables(authConfig.apiKey.value, variables)
        if (authConfig.apiKey.addTo === 'header') {
          headers[key] = value
        } else {
          url.searchParams.append(key, value)
        }
      }
      break
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-green-500'
  if (status >= 300 && status < 400) return 'text-yellow-500'
  if (status >= 400 && status < 500) return 'text-orange-500'
  if (status >= 500) return 'text-red-500'
  return 'text-gray-500'
}
