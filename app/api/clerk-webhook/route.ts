import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  const user = await currentUser();
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const email = user?.emailAddresses[0].emailAddress;

  if (!email) {
    return NextResponse.json(
      { error: 'Email not found' },
      { status: 404 }
    )
  }

  try {
    const userDetail = await prisma.user.upsert({
      where: { email },
        update: {},
        create: {
          id: userId,
          email: email,
        },
    })

    return NextResponse.json({
      id: userDetail.id,
      email: userDetail.email,
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
