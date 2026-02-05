import { Variable } from '@/types'

export function resolveVariables(
  text: string,
  variables: Variable[]
): string {
  if (!text) return text

  const variableMap = new Map<string, string>()
  variables.forEach((v) => {
    variableMap.set(v.key, v.value)
  })

  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variableMap.get(key) ?? match
  })
}

export function resolveKeyValuePairs(
  pairs: Array<{ key: string; value: string; enabled: boolean }>,
  variables: Variable[]
): Array<{ key: string; value: string; enabled: boolean }> {
  return pairs.map((pair) => ({
    ...pair,
    key: resolveVariables(pair.key, variables),
    value: resolveVariables(pair.value, variables),
  }))
}

export function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map((m) => m.slice(2, -2)))]
}
