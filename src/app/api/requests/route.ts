import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const formattedRequests = requests.map((r) => ({
      ...r,
      queryParams: JSON.parse(r.queryParams),
      headers: JSON.parse(r.headers),
      authConfig: JSON.parse(r.authConfig),
    }))

    return NextResponse.json(formattedRequests)
  } catch (error) {
    console.error('Get requests error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      method = 'GET',
      url = '',
      queryParams = [],
      headers = [],
      bodyType = 'none',
      body: reqBody = '',
      authType = 'none',
      authConfig = { type: 'none' },
      collectionId,
      folderId,
    } = body

    const newRequest = await prisma.request.create({
      data: {
        name,
        method,
        url,
        queryParams: JSON.stringify(queryParams),
        headers: JSON.stringify(headers),
        bodyType,
        body: reqBody,
        authType,
        authConfig: JSON.stringify(authConfig),
        collectionId,
        folderId,
      },
    })

    return NextResponse.json({
      ...newRequest,
      queryParams: JSON.parse(newRequest.queryParams),
      headers: JSON.parse(newRequest.headers),
      authConfig: JSON.parse(newRequest.authConfig),
    })
  } catch (error) {
    console.error('Create request error:', error)
    return NextResponse.json(
      { message: 'Failed to create request' },
      { status: 500 }
    )
  }
}
