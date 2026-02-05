import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.environment.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    })

    const environment = await prisma.environment.update({
      where: { id },
      data: { isActive: true },
      include: {
        variables: true,
      },
    })

    return NextResponse.json(environment)
  } catch (error) {
    console.error('Activate environment error:', error)
    return NextResponse.json(
      { message: 'Failed to activate environment' },
      { status: 500 }
    )
  }
}
