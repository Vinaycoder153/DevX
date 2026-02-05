# DevX Setup Guide

This guide will help you set up and run the DevX prototype on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- An **OpenAI API key** ([Get one here](https://platform.openai.com/api-keys))

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Vinaycoder153/DevX.git
cd DevX
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Prisma for database management
- OpenAI SDK
- Tailwind CSS and other UI dependencies

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file and add your actual OpenAI API key:

```env
# Database
DATABASE_URL="file:./dev.db"

# OpenAI - IMPORTANT: Replace with your actual API key
OPENAI_API_KEY="sk-your-actual-api-key-here"
OPENAI_MODEL="gpt-3.5-turbo"
OPENAI_MAX_TOKENS="1000"

# NextAuth (for future use)
NEXTAUTH_SECRET="development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Getting an OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 4. Set Up the Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

This will:
- Create a SQLite database file (`dev.db`)
- Set up tables for Users, Conversations, Messages, and AI Usage tracking

### 5. Run the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 6. Test the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the DevX homepage
3. Click the chat button in the bottom-right corner
4. Start chatting with the AI assistant!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Issue: Build fails with "OPENAI_API_KEY not found"
**Solution:** Make sure you have created a `.env` file with your OpenAI API key.

### Issue: Database migrations fail
**Solution:** Delete the `dev.db` file and run `npx prisma migrate dev` again.

### Issue: Chat doesn't work / AI responds with errors
**Solution:** Verify that:
1. Your OpenAI API key is valid
2. You have credits in your OpenAI account
3. The API key is correctly set in the `.env` file

### Issue: Port 3000 is already in use
**Solution:** Either stop the other process using port 3000, or run Next.js on a different port:
```bash
PORT=3001 npm run dev
```

## Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

This opens a browser-based database viewer at `http://localhost:5555`

### Reset Database

If you need to reset your database:

```bash
npx prisma migrate reset
```

## Project Structure

```
DevX/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── ai/
│   │       ├── chat/         # Chat endpoint
│   │       └── conversations/# Conversation management
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   └── ChatWidget.tsx        # Main chat component
├── lib/                      # Utility libraries
│   ├── ai.ts                 # AI service
│   └── prisma.ts             # Database client
├── prisma/                   # Database schema and migrations
│   └── schema.prisma         # Database schema
├── public/                   # Static files
├── .env.example              # Example environment variables
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## Configuration Options

### Change AI Model

Edit `OPENAI_MODEL` in `.env`:
- `gpt-3.5-turbo` - Fast and cost-effective (default)
- `gpt-4` - More powerful but slower and more expensive
- `gpt-4-turbo` - Good balance of speed and capability

### Adjust Response Length

Edit `OPENAI_MAX_TOKENS` in `.env`:
- Lower values (500-1000) = Shorter, faster responses
- Higher values (1500-2000) = Longer, more detailed responses

### Modify System Prompt

Edit `lib/ai.ts` to customize the AI's behavior and personality.

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set these in your production environment:
- `OPENAI_API_KEY` - Your production OpenAI key
- `DATABASE_URL` - Production database URL (consider PostgreSQL)
- `NEXTAUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Your production URL

### Recommended Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **AWS / Google Cloud / Azure**

## Cost Considerations

### OpenAI API Costs

- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03-0.06 per 1K tokens

Average conversation (10 messages): $0.01-0.05

### Monitoring Usage

Check the `AIUsage` table in your database to monitor:
- Total tokens used
- Cost per conversation
- Usage per user

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/Vinaycoder153/DevX/issues)
- **Documentation**: See [README.md](README.md) for detailed information
- **OpenAI Docs**: [OpenAI API Documentation](https://platform.openai.com/docs)

## Next Steps

Once you have the prototype running:

1. Explore the chat functionality
2. Review the code in `components/ChatWidget.tsx`
3. Check the API routes in `app/api/ai/`
4. Customize the system prompt in `lib/ai.ts`
5. Add your own features and improvements!

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Happy coding! 🚀
