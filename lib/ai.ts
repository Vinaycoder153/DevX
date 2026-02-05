import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY environment variable is not set!');
  console.error('Please add your OpenAI API key to the .env file');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  usage: {
    tokens: number;
    cost: number;
  };
}

export class AIService {
  private model: string;
  private maxTokens: number;

  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10);
  }

  async generateResponse(
    messages: ChatMessage[],
    context?: Record<string, unknown>
  ): Promise<AIResponse> {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
    }

    try {
      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt(context);
      
      const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content
        }))
      ];

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: chatMessages,
        max_tokens: this.maxTokens,
        temperature: 0.7,
      });

      const responseMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(tokens);

      return {
        message: responseMessage,
        usage: {
          tokens,
          cost,
        },
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Generate a short, concise title (max 5 words) for this conversation based on the first message.',
          },
          { role: 'user', content: firstMessage },
        ],
        max_tokens: 50,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || 'New Conversation';
    } catch (error) {
      console.error('Title Generation Error:', error);
      return 'New Conversation';
    }
  }

  private buildSystemPrompt(context?: Record<string, unknown>): string {
    const basePrompt = `You are DevX, an AI-powered assistant that transforms complex technical concepts, documentation, and code into short, visual, real-life explanations. Your goal is to:

1. Break down complex technical concepts into simple, digestible explanations
2. Use real-world analogies to make abstract ideas concrete
3. Provide visual descriptions when helpful (e.g., "imagine this like...")
4. Keep responses concise and focused
5. Adapt to the user's technical level

When explaining code:
- Identify the core functionality and purpose
- Explain patterns and best practices
- Use simple language and avoid jargon when possible

When explaining concepts:
- Start with the "what" and "why"
- Use analogies from everyday life
- Build from simple to complex progressively`;

    if (context) {
      const { page, userRole, eventId } = context;
      
      let contextPrompt = '\n\nCurrent Context:\n';
      if (userRole) {
        contextPrompt += `- User Role: ${userRole}\n`;
      }
      if (page) {
        contextPrompt += `- Current Page: ${page}\n`;
      }
      if (eventId) {
        contextPrompt += `- Event ID: ${eventId}\n`;
      }

      return basePrompt + contextPrompt;
    }

    return basePrompt;
  }

  private calculateCost(tokens: number): number {
    // Approximate cost per 1K tokens for GPT-3.5-turbo
    const costPer1KTokens = 0.002;
    return (tokens / 1000) * costPer1KTokens;
  }
}

export const aiService = new AIService();
