# DevX - AI-Powered Technical Learning Assistant

DevX is an intelligent assistant that transforms complex technical concepts, documentation, and code into short, visual, real-life explanations. It helps developers and students accelerate learning by providing intuitive, digestible content that reduces search fatigue.

## ✨ Features

- 🤖 **AI-Powered Explanations**: Uses OpenAI to break down complex concepts
- 💬 **Interactive Chat Interface**: Floating chat widget for seamless interaction
- 📝 **Conversation History**: Persistent chat history with automatic title generation
- 🎯 **Context-Aware**: Adapts responses based on user role and page context
- 💅 **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS
- 🔄 **Real-time Responses**: Streaming responses with typing indicators
- 📊 **Usage Tracking**: Monitor token usage and costs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vinaycoder153/DevX.git
cd DevX
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your-actual-api-key-here
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **AI Service**: OpenAI GPT API
- **Markdown**: marked with highlight.js for code syntax

### Project Structure

```
DevX/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── chat/          # Chat endpoint
│   │       └── conversations/ # Conversation management
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Home page
├── components/
│   └── ChatWidget.tsx        # Main chat UI component
├── lib/
│   ├── ai.ts                 # AI service integration
│   └── prisma.ts             # Database client
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 📚 Usage

### Basic Chat

1. Click the chat button in the bottom-right corner
2. Type your question or paste code
3. Get instant, easy-to-understand explanations

### Example Queries

- "Explain React hooks using a real-world analogy"
- "What does async/await do in JavaScript?"
- "Explain this code: [paste code snippet]"
- "What is a REST API in simple terms?"

### API Endpoints

#### POST /api/ai/chat
Send a chat message and get AI response.

**Request:**
```json
{
  "message": "Explain React useState",
  "conversationId": "optional-conversation-id",
  "context": {
    "page": "home",
    "userRole": "PARTICIPANT"
  }
}
```

**Response:**
```json
{
  "message": "AI response here...",
  "conversationId": "conv-id",
  "usage": {
    "tokens": 150,
    "cost": 0.0003
  }
}
```

#### GET /api/ai/conversations
Get conversation history for a user.

**Query Parameters:**
- `userId` (optional): User ID, defaults to "demo-user"

## 🎨 Features in Detail

### AI Service
- Context-aware prompting based on user role and page
- Automatic conversation title generation
- Token usage and cost tracking
- Error handling and retry logic

### Chat Widget
- Floating toggle button
- Sliding panel with smooth animations
- Message history with auto-scroll
- Markdown rendering with syntax highlighting
- Loading states and typing indicators
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Database Schema
- **User**: Store user information and AI preferences
- **Conversation**: Track chat conversations with context
- **Message**: Store individual messages with metadata
- **AIUsage**: Monitor token usage and costs

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# OpenAI
OPENAI_API_KEY="your-api-key"
OPENAI_MODEL="gpt-3.5-turbo"
OPENAI_MAX_TOKENS="1000"
```

### Customization

#### Change AI Model
Edit `OPENAI_MODEL` in `.env`:
- `gpt-3.5-turbo` (default, faster, cheaper)
- `gpt-4` (more powerful, slower, expensive)

#### Adjust Token Limit
Edit `OPENAI_MAX_TOKENS` in `.env` to control response length.

## 📖 Documentation

For detailed documentation, see:
- [Requirements](requirements.md) - Full requirements specification
- [Design](design.md) - System architecture and design decisions
- [Tasks](tasks.md) - Implementation roadmap

## 🤝 Contributing

This is a prototype project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the GPT API
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- All contributors and users

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ by the DevX Team