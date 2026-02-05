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
              },
            },
          },
        },
        requests: true,
      },
    })

    if (!collection) {
      return NextResponse.json(
        { message: 'Collection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Get collection error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    const collection = await prisma.collection.update({
      where: { id },
      data: { name, description },
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Update collection error:', error)
    return NextResponse.json(
      { message: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.collection.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete collection error:', error)
    return NextResponse.json(
      { message: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}
