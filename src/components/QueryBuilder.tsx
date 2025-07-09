
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

interface DataRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const QueryBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hello! I'm here to help you find answers in your data! \n\nThink of me as your personal data detective - I'll help you discover insights whether your information is organized in databases, spreadsheets, files, or anywhere else. Just tell me what you're curious about, and I'll guide you through finding the perfect answer! \n\n✨ What are you trying to answer?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [recommendations, setRecommendations] = useState<DataRecommendation[]>([
    {
      title: "🔍 Identify data sources",
      description: "Let's find where your relevant information might be stored",
      impact: 'high'
    },
    {
      title: "📋 Clarify your question",
      description: "I can help make your question more specific for better results",
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

    // Generate contextual response based on user input
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
    
    // Update query building progress if there's a query part
    if (assistantResponse.queryPart) {
      setCurrentQuery(prev => prev + ' ' + assistantResponse.queryPart);
    }
  };

  const generateAssistantResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('sales') || lowerInput.includes('revenue') || lowerInput.includes('money') || lowerInput.includes('profit')) {
      return {
        content: "💰 Great question about financial performance! Let me help you find those answers.\n\n🔍 To get you the best insights, I need to understand your data landscape:\n\n• 📊 Do you have sales data in a system like CRM, database, or spreadsheets?\n• 📅 What time period interests you most?\n• 🎯 Are you looking at overall performance or specific products/regions?\n• 💡 Any particular metrics that matter most to your business?\n\nDon't worry if you're not sure where your data lives - I can help you identify the right sources!",
        queryPart: "Sales Analysis:"
      };
    } else if (lowerInput.includes('customer') || lowerInput.includes('client') || lowerInput.includes('user')) {
      return {
        content: "👥 Excellent! Customer insights can really transform how you understand your business.\n\n🤔 Let's explore what you want to learn:\n\n• 🔍 Are you curious about customer behavior, satisfaction, demographics, or something else?\n• 📋 Do you have customer information in a CRM, database, surveys, or other sources?\n• 🎯 Are you focusing on specific customer segments or everyone?\n• ⏰ Any particular timeframe you're interested in?\n\nIf you're not sure where your customer data is stored, I can help you identify potential sources!",
        queryPart: "Customer Analysis:"
      };
    } else if (lowerInput.includes('product') || lowerInput.includes('inventory') || lowerInput.includes('item')) {
      return {
        content: "🛍️ Product insights can unlock so many opportunities! Let's dive in.\n\n💭 To point you in the right direction:\n\n• 📈 What aspect of your products interests you? (performance, popularity, inventory, etc.)\n• 📁 Where might this information live? (inventory systems, sales records, databases, spreadsheets?)\n• 🎯 Specific products or categories you're most curious about?\n• 📊 Any particular metrics you want to track?\n\nNo worries if you're unsure about data sources - I'll help you figure out where to look!",
        queryPart: "Product Analysis:"
      };
    } else if (lowerInput.includes('where') || lowerInput.includes('find') || lowerInput.includes('data') || lowerInput.includes('source')) {
      return {
        content: "🕵️ Perfect! Let's be data detectives together and find your information sources.\n\n🔍 Here's how we can identify where your answers might be hiding:\n\n• 💾 **Databases & Systems**: CRM, ERP, accounting software, etc.\n• 📊 **Spreadsheets**: Excel, Google Sheets, CSV files\n• 📁 **Files & Documents**: Reports, logs, text files\n• 🌐 **Online Sources**: Web analytics, social media, APIs\n• 📋 **Surveys & Forms**: Customer feedback, internal data collection\n\nTell me more about your question, and I'll help you brainstorm where that information might be stored!",
        queryPart: "Data Discovery:"
      };
    } else {
      return {
        content: "✨ I love your curiosity! Let's work together to find the perfect answer.\n\n🤝 Here's how I can help you:\n\n• 🎯 **Clarify your question**: Make it more specific for better results\n• 🔍 **Find data sources**: Identify where your information might be stored\n• 🛠️ **Build the right approach**: Whether it's databases, files, or other sources\n• 💡 **Suggest better questions**: Sometimes a slight tweak reveals amazing insights\n\nCan you tell me more about what you're hoping to discover? Even a general idea is perfect to start with!",
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
                Data Detective
              </h1>
              <p className="text-blue-600 text-lg">Your friendly guide to finding answers in any data</p>
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
                    <p className="text-xs text-blue-600 font-medium mb-1">Building your search:</p>
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
              placeholder="💭 What are you trying to answer?"
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
        {/* Current Progress */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Code className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Your Search Progress</h3>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {currentQuery || "🌱 We'll build your perfect search together!"}
            </pre>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Helpful Suggestions</h3>
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

        {/* Quick Starters */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Popular Questions</h3>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("How is our business performing this month?")}
            >
              <span className="text-lg mr-3">📈</span>
              <span>Business performance</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("Who are our most valuable customers?")}
            >
              <span className="text-lg mr-3">⭐</span>
              <span>Customer insights</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("What trends should I be aware of?")}
            >
              <span className="text-lg mr-3">🔍</span>
              <span>Trend analysis</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
