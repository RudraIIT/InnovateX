import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET is not configured in environment variables');
  }

  const headers = Object.fromEntries(req.headers);
  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(payload, headers) as {
      type: string;
      data: {
        id: string;
        email_addresses: { email_address: string }[];
        username?: string;
        first_name?: string;
        last_name?: string;
        last_active_at?: string;
      };
    };

    const { id } = evt.data;
    const eventType = evt.type;

    console.log('Webhook received:', {
      eventType,
      data: evt.data,
    });

    if (eventType === 'user.created') {
      const { email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses[0].email_address;
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || username;

      const user = await prisma.user.create({
        data: {
          id,
          email,
          name: fullName || null,
          createdAt: new Date(),
        },
      });

      console.log('User created in database:', user);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Webhook verification failed',
    }, { status: 400 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
