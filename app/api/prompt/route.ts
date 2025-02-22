import { NextResponse } from 'next/server'

const promptStore = new Map<string, string>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  const prompt = promptStore.get(userId) ?? null
  
  return NextResponse.json({
    prompt,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  try {
    const { userId, prompt } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Value must be a string' },
        { status: 400 }
      )
    }

    promptStore.set(userId, prompt)

    return NextResponse.json({
      message: 'Value updated successfully',
      prompt,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to update value',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}