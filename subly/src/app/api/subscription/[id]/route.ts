import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const subId = parseInt(params.id, 10);

    if (isNaN(subId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subId },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const subId = parseInt(params.id, 10);
    if (isNaN(subId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

    const existing = await prisma.subscription.findUnique({
      where: { id: subId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Subscription not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      category,
      price,
      frequency,
      paymentDate,
      paymentNotificationTime,
    } = body;

    const categoryRecord = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryRecord) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }

    const updated = await prisma.subscription.update({
      where: { id: subId },
      data: {
        title,
        price,
        paymentFrequency: frequency,
        paymentDate: new Date(paymentDate),
        paymentNotificationTime,
        categoryId: categoryRecord.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}
