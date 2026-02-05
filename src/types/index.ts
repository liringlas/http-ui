export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

export type BodyType = 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded' | 'raw'

export type AuthType = 'none' | 'bearer' | 'basic' | 'api-key'

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export interface AuthConfig {
  type: AuthType
  bearer?: { token: string }
  basic?: { username: string; password: string }
  apiKey?: { key: string; value: string; addTo: 'header' | 'query' }
}

export interface RequestData {
  id?: string
  name: string
  method: HttpMethod
  url: string
  queryParams: KeyValuePair[]
  headers: KeyValuePair[]
  bodyType: BodyType
  body: string
  authType: AuthType
  authConfig: AuthConfig
  collectionId?: string | null
  folderId?: string | null
}

export interface ResponseData {
  statusCode: number
  statusText: string
  headers: Record<string, string>
  body: string
  responseTime: number
  responseSize: number
}

export interface Collection {
  id: string
  name: string
  description?: string | null
  folders: Folder[]
  requests: RequestData[]
}

export interface Folder {
  id: string
  name: string
  collectionId: string
  parentId?: string | null
  children: Folder[]
  requests: RequestData[]
}

export interface Environment {
  id: string
  name: string
  isActive: boolean
  variables: Variable[]
}

export interface Variable {
  id: string
  key: string
  value: string
  environmentId?: string | null
}

export interface HistoryEntry {
  id: string
  executedAt: string
  method: string
  url: string
  statusCode: number
  responseTime: number
  responseSize: number
  responseBody: string
  responseHeaders: string
  requestHeaders: string
  requestBody: string
}

export interface Tab {
  id: string
  name: string
  request: RequestData
  response?: ResponseData
  isLoading?: boolean
  isDirty?: boolean
}
