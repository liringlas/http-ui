import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        requests: true,
        children: {
          include: {
            requests: true,
          },
        },
      },
    })

    if (!folder) {
      return NextResponse.json(
        { message: 'Folder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Get folder error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch folder' },
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
    const { name, parentId } = body

    const folder = await prisma.folder.update({
      where: { id },
      data: { name, parentId },
    })

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Update folder error:', error)
    return NextResponse.json(
      { message: 'Failed to update folder' },
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
    await prisma.folder.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete folder error:', error)
    return NextResponse.json(
      { message: 'Failed to delete folder' },
      { status: 500 }
    )
  }
}
