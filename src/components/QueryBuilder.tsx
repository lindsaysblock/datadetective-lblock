
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Database, Lightbulb, History, Code } from 'lucide-react';
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
      content: "Hi! I'm here to help you build SQL queries without needing to know the database structure. What would you like to find out from your data?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [recommendations, setRecommendations] = useState<QueryRecommendation[]>([
    {
      title: "Add time filters",
      description: "Consider filtering by date ranges for more relevant results",
      impact: 'high'
    },
    {
      title: "Include related metrics",
      description: "Add related KPIs to get a more complete picture",
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
        content: "Great! I can help you analyze sales data. To get started, would you like to see:\n\n1. Total sales for a specific time period?\n2. Sales by product category?\n3. Top performing sales representatives?\n4. Sales trends over time?\n\nWhich option interests you most?",
        queryPart: "SELECT"
      };
    } else if (lowerInput.includes('customer') || lowerInput.includes('client')) {
      return {
        content: "Perfect! Customer analysis is very insightful. Let me ask a few questions:\n\n• Are you interested in customer demographics, behavior, or satisfaction?\n• Do you want to focus on new customers, existing customers, or both?\n• Any specific time frame you'd like to analyze?",
        queryPart: "SELECT customer_id, customer_name"
      };
    } else if (lowerInput.includes('product') || lowerInput.includes('inventory')) {
      return {
        content: "Product data analysis coming up! To help you better:\n\n• Are you looking at product performance, inventory levels, or pricing?\n• Do you want to compare products or focus on specific categories?\n• Should we include supplier or cost information?",
        queryPart: "SELECT product_name, category"
      };
    } else {
      return {
        content: "I'd be happy to help! Could you tell me more about what specific information you're looking for? For example:\n\n• Sales or revenue data\n• Customer information\n• Product performance\n• Employee metrics\n• Financial reports\n\nWhat area would you like to explore?",
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SQL Query Builder</h1>
              <p className="text-gray-600">Build queries through conversation</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.queryPart && (
                  <div className="mt-3 p-2 bg-gray-100 rounded text-sm font-mono text-gray-700">
                    Query part: {message.queryPart}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to find in your data..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Current Query */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Current Query</h3>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {currentQuery || 'No query built yet...'}
            </pre>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{rec.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <Badge 
                    variant={rec.impact === 'high' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {rec.impact}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Quick Start</h3>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm"
              onClick={() => setCurrentInput("Show me sales data for this month")}
            >
              📊 Monthly sales report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm"
              onClick={() => setCurrentInput("Find top 10 customers by revenue")}
            >
              👥 Top customers
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm"
              onClick={() => setCurrentInput("Compare product performance")}
            >
              📈 Product comparison
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
