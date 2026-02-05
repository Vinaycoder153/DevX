import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { aiService } from '@/lib/ai';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().optional(),
  userId: z.string().default('demo-user'), // For prototype, using default user
  context: z.object({
    page: z.string().optional(),
    eventId: z.string().optional(),
    userRole: z.enum(['SUPER_ADMIN', 'ORGANIZER', 'PARTICIPANT', 'JUDGE']).optional(),
    additionalData: z.record(z.any()).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = chatRequestSchema.parse(body);

    // Ensure user exists (for prototype)
    let user = await prisma.user.findUnique({
      where: { id: validated.userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: validated.userId,
          email: `${validated.userId}@demo.com`,
          name: 'Demo User',
          role: validated.context?.userRole || 'PARTICIPANT',
        },
      });
    }

    // Get or create conversation
    let conversation;
    if (validated.conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: validated.conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          },
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          context: validated.context || {},
          messages: {
            create: [],
          },
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: validated.message,
      },
    });

    // Prepare messages for AI
    const chatHistory = conversation.messages.map(m => ({
      role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    chatHistory.push({
      role: 'user',
      content: validated.message,
    });

    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      chatHistory,
      validated.context
    );

    // Save AI response
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: aiResponse.message,
        metadata: {
          tokens: aiResponse.usage.tokens,
          cost: aiResponse.usage.cost,
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        },
      },
    });

    // Track usage
    await prisma.aiUsage.create({
      data: {
        userId: user.id,
        tokensUsed: aiResponse.usage.tokens,
        cost: aiResponse.usage.cost,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        endpoint: 'chat',
      },
    });

    // Generate title if this is the first message
    if (!conversation.title && chatHistory.length === 1) {
      const title = await aiService.generateTitle(validated.message);
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { title },
      });
    }

    return NextResponse.json({
      message: aiResponse.message,
      conversationId: conversation.id,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
