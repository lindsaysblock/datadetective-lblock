
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Database, Lightbulb, History, Code, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  queryPart?: string;
}

interface QueryRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const QueryBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hello there! I'm your friendly data assistant, and I'm excited to help you discover insights from your data! \n\nNo need to worry about SQL or database structures - just tell me what you're curious about, and I'll guide you through it step by step. What would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [recommendations, setRecommendations] = useState<QueryRecommendation[]>([
    {
      title: "🕒 Add time filters",
      description: "Let's narrow down to specific dates for more focused results",
      impact: 'high'
    },
    {
      title: "📊 Include related metrics",
      description: "I can suggest related data points that might be interesting",
      impact: 'medium'
    }
  ]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    // Simulate AI response based on user input
    const assistantResponse = generateAssistantResponse(currentInput);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: assistantResponse.content,
      timestamp: new Date(),
      queryPart: assistantResponse.queryPart
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setCurrentInput('');
    
    // Update query if there's a query part
    if (assistantResponse.queryPart) {
      setCurrentQuery(prev => prev + ' ' + assistantResponse.queryPart);
    }
  };

  const generateAssistantResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('sales') || lowerInput.includes('revenue')) {
      return {
        content: "🎉 Awesome! Sales data is super interesting to explore. Let me help you find exactly what you're looking for:\n\n💡 Here are some popular questions I can help with:\n• 📅 How did we perform in a specific time period?\n• 🏷️ Which product categories are our stars?\n• 🌟 Who are our top-performing team members?\n• 📈 What trends can we spot over time?\n\nWhich one sparks your curiosity? Or feel free to ask me something completely different!",
        queryPart: "SELECT"
      };
    } else if (lowerInput.includes('customer') || lowerInput.includes('client')) {
      return {
        content: "🤝 Great choice! Customer insights are gold mines for business decisions. Let's dig in together!\n\n🔍 To give you the most helpful information, I'd love to know:\n• 👥 Are you curious about who your customers are, how they behave, or how happy they are?\n• ✨ Should we focus on your newest customers, loyal long-timers, or everyone?\n• 🗓️ Any particular time period you'd like to zoom in on?\n\nDon't worry if you're not sure - we can explore together!",
        queryPart: "SELECT customer_id, customer_name"
      };
    } else if (lowerInput.includes('product') || lowerInput.includes('inventory')) {
      return {
        content: "🛍️ Perfect! Product data can reveal some amazing insights. I'm here to make this super easy for you!\n\n🤔 Let's start with what interests you most:\n• 🎯 Want to see how products are performing?\n• 📦 Curious about what's in stock?\n• 💰 Interested in pricing strategies?\n• 🏆 Looking to compare your product stars?\n\nJust tell me what's on your mind - there's no wrong answer here!",
        queryPart: "SELECT product_name, category"
      };
    } else {
      return {
        content: "😊 I'd love to help you explore your data! Think of me as your friendly guide who speaks both human and database.\n\n🚀 Here are some popular starting points:\n• 💼 Sales and revenue insights\n• 👥 Customer information and behavior\n• 🛍️ Product performance and inventory\n• 👔 Employee metrics and performance\n• 💰 Financial reports and trends\n\n✨ Or just describe what you're curious about in your own words - I'm great at translating ideas into data insights!",
        queryPart: ""
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur border-b border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Explorer
              </h1>
              <p className="text-blue-600 text-lg">Your friendly guide to data insights</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-5 rounded-3xl shadow-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/90 backdrop-blur border border-blue-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                {message.queryPart && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">Building your query:</p>
                    <code className="text-sm text-blue-800 font-mono">{message.queryPart}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur border-t border-blue-200 p-6">
          <div className="flex gap-4">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="💭 Tell me what you'd like to discover about your data..."
              className="flex-1 p-4 text-lg border-blue-200 focus:border-blue-400 rounded-2xl"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-2xl shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white/60 backdrop-blur border-l border-blue-200 flex flex-col">
        {/* Current Query */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Code className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Your Query in Progress</h3>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {currentQuery || "🌱 We'll build this together as we chat!"}
            </pre>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Smart Suggestions</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-4 hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-blue-100 hover:border-blue-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                  <Badge 
                    variant={rec.impact === 'high' ? 'default' : 'secondary'}
                    className={`text-xs ${rec.impact === 'high' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {rec.impact}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Quick Starters</h3>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("Show me our sales performance this month")}
            >
              <span className="text-lg mr-3">📊</span>
              <span>Monthly sales snapshot</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("Who are our top customers by revenue?")}
            >
              <span className="text-lg mr-3">⭐</span>
              <span>Top customers</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("How are our products performing?")}
            >
              <span className="text-lg mr-3">🚀</span>
              <span>Product insights</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
