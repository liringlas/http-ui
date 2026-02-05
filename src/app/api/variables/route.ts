import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const variables = await prisma.variable.findMany({
      where: { environmentId: null },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(variables)
  } catch (error) {
    console.error('Get variables error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch variables' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, environmentId } = body

    const variable = await prisma.variable.create({
      data: { key, value, environmentId },
    })

    return NextResponse.json(variable)
  } catch (error) {
    console.error('Create variable error:', error)
    return NextResponse.json(
      { message: 'Failed to create variable' },
      { status: 500 }
    )
  }
}
