import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resolveVariables, resolveKeyValuePairs } from '@/lib/variable-resolver'
import { RequestData, Variable, AuthType } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { request: reqData, variables = [] } = body as {
      request: RequestData
      variables: Variable[]
    }

    const resolvedUrl = resolveVariables(reqData.url, variables)
    const resolvedParams = resolveKeyValuePairs(reqData.queryParams || [], variables)
    const resolvedHeaders = resolveKeyValuePairs(reqData.headers || [], variables)
    const resolvedBody = resolveVariables(reqData.body || '', variables)

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

    applyAuth(reqData, headers, url, variables)

    if (reqData.bodyType === 'json' && resolvedBody) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    } else if (reqData.bodyType === 'x-www-form-urlencoded' && resolvedBody) {
      headers['Content-Type'] =
        headers['Content-Type'] || 'application/x-www-form-urlencoded'
    }

    const startTime = performance.now()

    const fetchOptions: RequestInit = {
      method: reqData.method,
      headers,
    }

    if (
      !['GET', 'HEAD'].includes(reqData.method) &&
      reqData.bodyType !== 'none' &&
      resolvedBody
    ) {
      fetchOptions.body = resolvedBody
    }

    const response = await fetch(url.toString(), fetchOptions)
    const endTime = performance.now()

    const responseBody = await response.text()
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    const responseTime = Math.round(endTime - startTime)
    const responseSize = new Blob([responseBody]).size

    await prisma.history.create({
      data: {
        method: reqData.method,
        url: url.toString(),
        statusCode: response.status,
        responseTime,
        responseSize,
        responseBody,
        responseHeaders: JSON.stringify(responseHeaders),
        requestHeaders: JSON.stringify(reqData.headers || []),
        requestBody: resolvedBody,
      },
    })

    return NextResponse.json({
      statusCode: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      responseTime,
      responseSize,
    })
  } catch (error) {
    console.error('Execute request error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    )
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
        const username = resolveVariables(authConfig.basic?.username || '', variables)
        const password = resolveVariables(authConfig.basic?.password || '', variables)
        const encoded = Buffer.from(`${username}:${password}`).toString('base64')
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
