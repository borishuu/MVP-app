import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/verifyAuth';

export async function POST(request: NextRequest) {
  try {
    const { userId, error } = await verifyAuth(request);

    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      category,
      price,
      frequency,
      paymentDate,
      receiveNotifications,
      paymentNotificationTime,
      receiveFreqDemands
    } = body;

    if (!title || !price || !paymentDate || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(category)

    const existingCategory = await prisma.category.findFirst({
      where: { name: category }
    });
    
    if (!existingCategory) {
      return NextResponse.json({ error: 'Invalid category name' }, { status: 400 });
    }
    

    const newSubscription = await prisma.subscription.create({
      data: {
        title,
        price,
        paymentFrequency: frequency,
        paymentDate: new Date(paymentDate),
        receiveNotifications,
        paymentNotificationTime,
        receiveFreqDemands,
        user: { connect: { id: userId as number } },
        category: { connect: { id: existingCategory.id } }
      }
    });

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
