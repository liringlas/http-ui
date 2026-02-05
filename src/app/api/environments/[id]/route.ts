import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const environment = await prisma.environment.findUnique({
      where: { id },
      include: {
        variables: true,
      },
    })

    if (!environment) {
      return NextResponse.json(
        { message: 'Environment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(environment)
  } catch (error) {
    console.error('Get environment error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch environment' },
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
    const { name, variables } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name

    const environment = await prisma.environment.update({
      where: { id },
      data: updateData,
      include: {
        variables: true,
      },
    })

    if (variables !== undefined) {
      await prisma.variable.deleteMany({
        where: { environmentId: id },
      })

      if (variables.length > 0) {
        await prisma.variable.createMany({
          data: variables.map((v: { key: string; value: string }) => ({
            key: v.key,
            value: v.value,
            environmentId: id,
          })),
        })
      }

      const updatedEnv = await prisma.environment.findUnique({
        where: { id },
        include: { variables: true },
      })
      return NextResponse.json(updatedEnv)
    }

    return NextResponse.json(environment)
  } catch (error) {
    console.error('Update environment error:', error)
    return NextResponse.json(
      { message: 'Failed to update environment' },
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
    await prisma.environment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete environment error:', error)
    return NextResponse.json(
      { message: 'Failed to delete environment' },
      { status: 500 }
    )
  }
}
