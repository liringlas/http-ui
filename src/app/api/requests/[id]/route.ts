import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const req = await prisma.request.findUnique({
      where: { id },
    })

    if (!req) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...req,
      queryParams: JSON.parse(req.queryParams),
      headers: JSON.parse(req.headers),
      authConfig: JSON.parse(req.authConfig),
    })
  } catch (error) {
    console.error('Get request error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch request' },
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
    const {
      name,
      method,
      url,
      queryParams,
      headers,
      bodyType,
      body: reqBody,
      authType,
      authConfig,
      collectionId,
      folderId,
    } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (method !== undefined) updateData.method = method
    if (url !== undefined) updateData.url = url
    if (queryParams !== undefined) updateData.queryParams = JSON.stringify(queryParams)
    if (headers !== undefined) updateData.headers = JSON.stringify(headers)
    if (bodyType !== undefined) updateData.bodyType = bodyType
    if (reqBody !== undefined) updateData.body = reqBody
    if (authType !== undefined) updateData.authType = authType
    if (authConfig !== undefined) updateData.authConfig = JSON.stringify(authConfig)
    if (collectionId !== undefined) updateData.collectionId = collectionId
    if (folderId !== undefined) updateData.folderId = folderId

    const req = await prisma.request.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...req,
      queryParams: JSON.parse(req.queryParams),
      headers: JSON.parse(req.headers),
      authConfig: JSON.parse(req.authConfig),
    })
  } catch (error) {
    console.error('Update request error:', error)
    return NextResponse.json(
      { message: 'Failed to update request' },
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
    await prisma.request.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete request error:', error)
    return NextResponse.json(
      { message: 'Failed to delete request' },
      { status: 500 }
    )
  }
}
