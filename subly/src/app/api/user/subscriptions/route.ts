import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId, error } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId: userId as number },
      include: {
        category: true, 
      },
    });

    return NextResponse.json(userSubscriptions, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch user subscriptions" }, { status: 500 });
  }
}
