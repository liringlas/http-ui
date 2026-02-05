import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const environments = await prisma.environment.findMany({
      include: {
        variables: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(environments)
  } catch (error) {
    console.error('Get environments error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch environments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    const environment = await prisma.environment.create({
      data: { name },
      include: {
        variables: true,
      },
    })

    return NextResponse.json(environment)
  } catch (error) {
    console.error('Create environment error:', error)
    return NextResponse.json(
      { message: 'Failed to create environment' },
      { status: 500 }
    )
  }
}
