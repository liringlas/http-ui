import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ImportRequest {
  name: string
  method: string
  url: string
  queryParams: unknown[]
  headers: unknown[]
  bodyType: string
  body: string
  authType: string
  authConfig: unknown
}

interface ImportFolder {
  name: string
  requests: ImportRequest[]
  folders?: ImportFolder[]
}

interface ImportData {
  version: string
  collection: {
    name: string
    description?: string
    folders: ImportFolder[]
    requests: ImportRequest[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ImportData = await request.json()
    const { collection: importCollection } = body

    const collection = await prisma.collection.create({
      data: {
        name: importCollection.name,
        description: importCollection.description,
      },
    })

    for (const folder of importCollection.folders || []) {
      await createFolderRecursive(folder, collection.id, null)
    }

    for (const req of importCollection.requests || []) {
      await prisma.request.create({
        data: {
          name: req.name,
          method: req.method,
          url: req.url,
          queryParams: JSON.stringify(req.queryParams || []),
          headers: JSON.stringify(req.headers || []),
          bodyType: req.bodyType || 'none',
          body: req.body || '',
          authType: req.authType || 'none',
          authConfig: JSON.stringify(req.authConfig || { type: 'none' }),
          collectionId: collection.id,
        },
      })
    }

    const importedCollection = await prisma.collection.findUnique({
      where: { id: collection.id },
      include: {
        folders: {
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
    })

    return NextResponse.json(importedCollection)
  } catch (error) {
    console.error('Import collection error:', error)
    return NextResponse.json(
      { message: 'Failed to import collection' },
      { status: 500 }
    )
  }
}

async function createFolderRecursive(
  folder: ImportFolder,
  collectionId: string,
  parentId: string | null
) {
  const createdFolder = await prisma.folder.create({
    data: {
      name: folder.name,
      collectionId,
      parentId,
    },
  })

  for (const req of folder.requests || []) {
    await prisma.request.create({
      data: {
        name: req.name,
        method: req.method,
        url: req.url,
        queryParams: JSON.stringify(req.queryParams || []),
        headers: JSON.stringify(req.headers || []),
        bodyType: req.bodyType || 'none',
        body: req.body || '',
        authType: req.authType || 'none',
        authConfig: JSON.stringify(req.authConfig || { type: 'none' }),
        collectionId,
        folderId: createdFolder.id,
      },
    })
  }

  for (const childFolder of folder.folders || []) {
    await createFolderRecursive(childFolder, collectionId, createdFolder.id)
  }
}
