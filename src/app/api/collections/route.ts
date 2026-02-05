import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        folders: {
          where: { parentId: null },
          include: {
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
            requests: true,
          },
        },
        requests: {
          where: { folderId: null },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const formattedCollections = collections.map((c) => ({
      ...c,
      requests: c.requests.map(formatRequest),
      folders: c.folders.map(formatFolder),
    }))

    return NextResponse.json(formattedCollections)
  } catch (error) {
    console.error('Get collections error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const collection = await prisma.collection.create({
      data: { name, description },
      include: {
        folders: true,
        requests: true,
      },
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json(
      { message: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

function formatRequest(request: {
  id: string
  name: string
  method: string
  url: string
  queryParams: string
  headers: string
  bodyType: string
  body: string
  authType: string
  authConfig: string
  collectionId: string | null
  folderId: string | null
}) {
  return {
    ...request,
    queryParams: JSON.parse(request.queryParams),
    headers: JSON.parse(request.headers),
    authConfig: JSON.parse(request.authConfig),
  }
}

function formatFolder(folder: {
  id: string
  name: string
  collectionId: string
  parentId: string | null
  children?: Array<{ id: string; name: string; collectionId: string; parentId: string | null; requests: unknown[]; children?: unknown[] }>
  requests: Array<{
    id: string
    name: string
    method: string
    url: string
    queryParams: string
    headers: string
    bodyType: string
    body: string
    authType: string
    authConfig: string
    collectionId: string | null
    folderId: string | null
  }>
}): unknown {
  return {
    ...folder,
    requests: folder.requests.map(formatRequest),
    children: folder.children?.map((c) => formatFolder(c as typeof folder)) || [],
  }
}
