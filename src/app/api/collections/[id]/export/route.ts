import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        folders: {
          include: {
            requests: true,
            children: {
              include: {
                requests: true,
                children: {
                  include: {
                    requests: true,
                  },
                },
              },
            },
          },
        },
        requests: {
          where: { folderId: null },
        },
      },
    })

    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      )
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      collection: {
        name: collection.name,
        description: collection.description,
        folders: collection.folders.map(formatFolderForExport),
        requests: collection.requests.map(formatRequestForExport),
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Export collection error:', error)
    return NextResponse.json(
      { message: 'Failed to export collection' },
      { status: 500 }
    )
  }
}

function formatRequestForExport(request: {
  name: string
  method: string
  url: string
  queryParams: string
  headers: string
  bodyType: string
  body: string
  authType: string
  authConfig: string
}) {
  return {
    name: request.name,
    method: request.method,
    url: request.url,
    queryParams: JSON.parse(request.queryParams),
    headers: JSON.parse(request.headers),
    bodyType: request.bodyType,
    body: request.body,
    authType: request.authType,
    authConfig: JSON.parse(request.authConfig),
  }
}

function formatFolderForExport(folder: {
  name: string
  requests: Array<{
    name: string
    method: string
    url: string
    queryParams: string
    headers: string
    bodyType: string
    body: string
    authType: string
    authConfig: string
  }>
  children?: Array<{
    name: string
    requests: Array<{
      name: string
      method: string
      url: string
      queryParams: string
      headers: string
      bodyType: string
      body: string
      authType: string
      authConfig: string
    }>
    children?: unknown[]
  }>
}): unknown {
  return {
    name: folder.name,
    requests: folder.requests.map(formatRequestForExport),
    folders: folder.children?.map((c) => formatFolderForExport(c as typeof folder)) || [],
  }
}
