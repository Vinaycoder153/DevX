import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">DevX</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            An AI-powered assistant that transforms complex technical concepts into simple, visual explanations
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What can DevX do for you?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Explain Code</h3>
                <p className="text-sm text-gray-600">
                  Paste any code snippet and get a clear explanation of what it does and how it works.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Simplify Concepts</h3>
                <p className="text-sm text-gray-600">
                  Break down complex technical concepts into easy-to-understand explanations with real-world analogies.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Learn Faster</h3>
                <p className="text-sm text-gray-600">
                  Accelerate your learning with visual descriptions and intuitive explanations tailored to your level.
                </p>
              </div>
            </div>
          </div>

          {/* Example Questions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Try asking me...
            </h2>
            <div className="space-y-3 text-left">
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="text-gray-700">
                  💡 &quot;Explain how React hooks work using a real-world analogy&quot;
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="text-gray-700">
                  🔍 &quot;What does async/await do in JavaScript? Keep it simple!&quot;
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="text-gray-700">
                  📊 &quot;Explain REST API in a way a beginner can understand&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-lg text-gray-700 mb-4">
              Click the chat button in the bottom right to get started! 👇
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="font-medium">Start chatting with DevX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            DevX - AI-Powered Technical Learning Assistant (Prototype)
          </p>
          <p className="text-xs mt-2">
            Built with Next.js, TypeScript, Prisma, and OpenAI
          </p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget initialContext={{ page: 'home', userRole: 'PARTICIPANT' }} />
    </main>
  );
}
