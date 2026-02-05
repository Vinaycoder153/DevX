# DevX AI Assistant - Design Document

## Overview

The DevX AI Assistant is an intelligent chat-based helper integrated into the Nexus Events platform to assist users with event management, platform navigation, and development tasks. The assistant provides context-aware guidance based on the user's current role, page context, and platform state.

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Service    │
│   Chat Widget   │◄──►│   /api/ai/*     │◄──►│   OpenAI API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI State      │    │   Database      │    │   Rate Limiter  │
│   Management    │    │   Conversations │    │   & Monitoring  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: React components with TypeScript
- **Backend**: Next.js API routes
- **AI Service**: OpenAI GPT API
- **Database**: PostgreSQL with Prisma ORM (extending existing schema)
- **Authentication**: NextAuth.js (existing system)
- **UI Framework**: Tailwind CSS + Radix UI (existing components)

## Database Design

### New Models

#### Conversation Model
```prisma
model Conversation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String?  // Auto-generated from first message
  context   Json?    // Page context, user role, etc.
  
  messages  Message[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Message Model
```prisma
model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  
  role           MessageRole  // USER, ASSISTANT, SYSTEM
  content        String       @db.Text
  metadata       Json?        // Token usage, model used, etc.
  
  createdAt      DateTime     @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

#### AIUsage Model
```prisma
model AIUsage {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  tokensUsed  Int
  cost        Float
  model       String
  endpoint    String   // chat, completion, etc.
  
  createdAt   DateTime @default(now())
}
```

#### User Model Extensions
```prisma
// Add to existing User model
model User {
  // ... existing fields
  
  // AI Assistant fields
  aiPreferences    Json?           // Chat preferences, model selection
  aiUsageLimit     Int?            // Monthly token limit
  aiUsageReset     DateTime?       // When usage resets
  
  conversations    Conversation[]
  aiUsage          AIUsage[]
}
```

**Design Rationale**: 
- Separate conversation and message models allow for conversation history and context preservation
- Usage tracking enables cost monitoring and rate limiting
- JSON fields for preferences and context provide flexibility for future features

## API Design

### Core Endpoints

#### POST /api/ai/chat
**Purpose**: Handle chat messages and generate AI responses

```typescript
interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    page: string;
    eventId?: string;
    userRole: UserRole;
    additionalData?: Record<string, any>;
  };
}

interface ChatResponse {
  message: string;
  conversationId: string;
  usage: {
    tokens: number;
    cost: number;
  };
}
```

#### GET /api/ai/conversations
**Purpose**: Retrieve user's conversation history

```typescript
interface ConversationsResponse {
  conversations: {
    id: string;
    title: string;
    lastMessage: string;
    updatedAt: string;
  }[];
}
```

#### DELETE /api/ai/conversations/[id]
**Purpose**: Delete a specific conversation

**Design Rationale**: 
- RESTful API design follows existing platform patterns
- Context-aware requests enable personalized responses
- Usage tracking in responses enables client-side monitoring

## Component Architecture

### Chat Widget Hierarchy

```
ChatWidget (Main Container)
├── ChatToggle (Floating Button)
├── ChatPanel (Sliding Panel)
│   ├── ChatHeader
│   │   ├── ConversationTitle
│   │   └── ChatActions (Clear, Settings)
│   ├── MessageList
│   │   ├── MessageBubble (User)
│   │   ├── MessageBubble (Assistant)
│   │   └── TypingIndicator
│   └── MessageInput
│       ├── TextArea
│       ├── SendButton
│       └── AttachmentButton*
```

### Component Specifications

#### ChatWidget Component
```typescript
interface ChatWidgetProps {
  initialContext?: ChatContext;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark' | 'auto';
}

interface ChatContext {
  page: string;
  eventId?: string;
  userRole: UserRole;
  additionalData?: Record<string, any>;
}
```

#### MessageBubble Component
```typescript
interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
  showAvatar?: boolean;
  enableCodeHighlighting?: boolean;
}
```

**Design Rationale**:
- Modular component structure enables reusability and testing
- Context-aware props allow for page-specific customization
- Flexible positioning and theming support different use cases

## AI Service Integration

### Service Layer Architecture

```typescript
class AIService {
  private client: OpenAI;
  private rateLimiter: RateLimiter;
  
  async generateResponse(
    messages: Message[],
    context: ChatContext,
    userId: string
  ): Promise<AIResponse>;
  
  async generateTitle(firstMessage: string): Promise<string>;
  
  private buildSystemPrompt(context: ChatContext): string;
  private trackUsage(userId: string, usage: Usage): Promise<void>;
}
```

### Context-Aware Prompting

The AI service will generate dynamic system prompts based on:

1. **User Role Context**:
   - SUPER_ADMIN: Platform management, analytics, system configuration
   - ORGANIZER: Event creation, participant management, judging
   - PARTICIPANT: Event discovery, registration, submission guidance
   - JUDGE: Scoring criteria, evaluation process

2. **Page Context**:
   - Event creation: Form guidance, best practices
   - Dashboard: Navigation help, feature explanations
   - Results: Score interpretation, certificate generation

3. **Platform State**:
   - Current events, user's registrations
   - Database schema awareness for query assistance
   - Available features and permissions

**Design Rationale**:
- Context-aware prompting provides more relevant and accurate responses
- Role-based customization ensures appropriate access and guidance
- Dynamic system prompts adapt to user's current needs

## Security & Privacy

### Authentication & Authorization
- Leverage existing NextAuth.js system
- API routes protected with session validation
- Role-based access control for AI features

### Data Privacy
- Conversation data encrypted at rest
- User consent for AI interaction logging
- Configurable data retention policies
- No sensitive data (passwords, payment info) in AI context

### Rate Limiting
- Per-user token limits (configurable by admin)
- API rate limiting to prevent abuse
- Cost monitoring and alerts

**Design Rationale**:
- Security-first approach protects user data and platform integrity
- Rate limiting prevents cost overruns and ensures fair usage
- Privacy controls comply with data protection regulations

## User Experience Design

### Chat Interface Patterns

1. **Progressive Disclosure**:
   - Collapsed floating button → Expanded chat panel
   - Conversation history accessible but not overwhelming
   - Advanced features hidden behind settings

2. **Context Awareness**:
   - Welcome messages adapt to current page
   - Suggested prompts based on user role and context
   - Smart defaults for common tasks

3. **Feedback Mechanisms**:
   - Message reactions (helpful/not helpful)
   - Conversation rating system
   - Error reporting for incorrect responses

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Configurable text size

**Design Rationale**:
- Progressive disclosure reduces cognitive load
- Context awareness improves task completion rates
- Accessibility ensures inclusive user experience

## Integration Points

### Dashboard Integration
- Chat widget available on all authenticated pages
- Context automatically populated from current page state
- Seamless integration with existing UI components

### Event Management Integration
- Event creation assistance with form validation
- Participant management guidance
- Judging workflow support

### Platform-Specific Features
- Database query assistance for developers
- API documentation and examples
- Troubleshooting guides for common issues

**Design Rationale**:
- Deep integration provides contextual help exactly when needed
- Platform-specific knowledge reduces support burden
- Developer-focused features improve platform maintainability

## Performance Considerations

### Optimization Strategies

1. **Response Caching**:
   - Cache common responses for frequently asked questions
   - Context-aware cache keys
   - TTL-based invalidation

2. **Lazy Loading**:
   - Chat widget loads only when needed
   - Conversation history paginated
   - Message content streaming for long responses

3. **Resource Management**:
   - Connection pooling for AI API calls
   - Request queuing during high load
   - Graceful degradation when AI service unavailable

**Design Rationale**:
- Caching reduces AI API costs and improves response times
- Lazy loading minimizes initial page load impact
- Resource management ensures platform stability

## Monitoring & Analytics

### Metrics Collection
- Conversation engagement rates
- Most common user queries
- AI response accuracy feedback
- Usage patterns by role and page

### Cost Monitoring
- Token usage tracking per user/organization
- Cost alerts and budgeting
- Usage trend analysis

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- System resource utilization

**Design Rationale**:
- Comprehensive monitoring enables continuous improvement
- Cost tracking prevents budget overruns
- Performance metrics ensure good user experience

## Future Extensibility

### Planned Enhancements
- Multi-language support
- Voice input/output capabilities
- File upload and analysis
- Custom model fine-tuning
- Advanced analytics dashboard

### Architecture Flexibility
- Plugin system for custom AI tools
- Configurable AI providers (OpenAI, Anthropic, etc.)
- Webhook integration for external systems
- API for third-party integrations

**Design Rationale**:
- Modular architecture supports future feature additions
- Provider flexibility reduces vendor lock-in
- Extensibility points enable customization without core changes

## Implementation Phases

### Phase 1: Foundation (Tasks 1-2)
- Database schema extensions
- Basic AI service integration
- Core infrastructure setup

### Phase 2: Core Chat (Tasks 3-5)
- API endpoints implementation
- Chat UI components
- Dashboard integration

### Phase 3: Context Features (Tasks 6-7)
- Event management assistance
- Platform-specific context integration
- Advanced prompting system

### Phase 4: Polish (Tasks 8-9)
- Comprehensive testing
- Documentation and deployment
- Performance optimization

**Design Rationale**:
- Phased approach enables iterative development and testing
- Each phase delivers working functionality
- Early phases establish foundation for advanced features

## Success Metrics

### User Engagement
- Daily active users of AI assistant
- Average conversation length
- User retention after first AI interaction

### Task Completion
- Successful event creation with AI assistance
- Reduced support ticket volume
- Time to complete common tasks

### Technical Performance
- AI response accuracy (user feedback)
- System uptime and reliability
- Cost per interaction optimization

**Design Rationale**:
- Measurable success criteria enable data-driven improvements
- User-focused metrics ensure value delivery
- Technical metrics maintain system health and efficiency