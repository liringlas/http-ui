import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const history = await prisma.history.findMany({
      orderBy: { executedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await prisma.history.deleteMany()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear history error:', error)
    return NextResponse.json(
      { message: 'Failed to clear history' },
      { status: 500 }
    )
  }
}
