import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title || 'New Conversation',
        lastMessage: conv.messages[0]?.content || '',
        updatedAt: conv.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Conversations API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
