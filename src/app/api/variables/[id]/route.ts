import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { key, value } = body

    const updateData: Record<string, unknown> = {}
    if (key !== undefined) updateData.key = key
    if (value !== undefined) updateData.value = value

    const variable = await prisma.variable.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(variable)
  } catch (error) {
    console.error('Update variable error:', error)
    return NextResponse.json(
      { message: 'Failed to update variable' },
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
    await prisma.variable.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete variable error:', error)
    return NextResponse.json(
      { message: 'Failed to delete variable' },
      { status: 500 }
    )
  }
}
