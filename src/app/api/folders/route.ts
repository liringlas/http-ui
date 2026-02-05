import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, collectionId, parentId } = body

    const folder = await prisma.folder.create({
      data: { name, collectionId, parentId },
      include: {
        requests: true,
        children: true,
      },
    })

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Create folder error:', error)
    return NextResponse.json(
      { message: 'Failed to create folder' },
      { status: 500 }
    )
  }
}
