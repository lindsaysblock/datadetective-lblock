
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Database, Lightbulb, History, Code, Sparkles, Settings, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import DataSourceConfig from './DataSourceConfig';
import { parseFile, generateDataInsights, ParsedData } from '../utils/dataParser';

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

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

const QueryBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hello! I'm here to help you discover insights from your data! \n\nI'm your personal data detective - I'll help you understand user behaviors whether your information is in databases, files, analytics platforms, or anywhere else. Just tell me what you're trying to answer, and I'll guide you through finding the perfect insights! \n\n✨ What are you trying to answer?",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [showDataConfig, setShowDataConfig] = useState(false);
  const [connectedData, setConnectedData] = useState<ParsedData | null>(null);
  const [recommendations, setRecommendations] = useState<DataRecommendation[]>([
    {
      title: "🔍 Connect your data sources",
      description: "Upload files or connect to databases to start exploring",
      impact: 'high'
    },
    {
      title: "📋 Tell me what you want to learn",
      description: "Ask about user behaviors, trends, or patterns you're curious about",
      impact: 'medium'
    }
  ]);

  const handleDataSourceConnect = (source: DataSource) => {
    console.log('Connected to data source:', source);
    // Here you would typically establish the actual connection
    // For now, we'll just log it and update recommendations
    updateRecommendationsAfterConnection();
  };

  const handleFileUpload = async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      setConnectedData(parsedData);
      
      const insights = generateDataInsights(parsedData);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🎉 Great! I've analyzed your data file "${file.name}" and here's what I found:\n\n${insights.join('\n')}\n\nNow I can help you explore user behaviors in this dataset! What would you like to discover? For example:\n• "Show me user activity patterns"\n• "What are the most common user actions?"\n• "How do users behave over time?"`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      updateRecommendationsAfterConnection();
      setShowDataConfig(false);
    } catch (error) {
      console.error('Error parsing file:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ I had trouble reading that file. Please make sure it's a valid CSV or JSON file with user behavior data. The error was: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const updateRecommendationsAfterConnection = () => {
    setRecommendations([
      {
        title: "📊 Analyze user patterns",
        description: "Discover how users interact with your product or service",
        impact: 'high'
      },
      {
        title: "🔍 Find behavior trends",
        description: "Identify trends and changes in user behavior over time",
        impact: 'high'
      },
      {
        title: "🎯 Segment users",
        description: "Group users by behavior patterns or characteristics",
        impact: 'medium'
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    // Generate contextual response based on user input and available data
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
    
    // If no data is connected, guide them to connect data first
    if (!connectedData) {
      return {
        content: "🔗 I'd love to help you explore that! First, let's connect to your data so I can give you specific insights.\n\n🎯 To get started:\n• 📁 Upload a CSV or JSON file with your user behavior data\n• 🔌 Connect to your database or analytics platform\n• 📊 Link your existing data warehouse\n\nClick the 'Connect Data' button to set up your data sources, then ask me anything about your users!",
        queryPart: ""
      };
    }
    
    // Generate responses based on connected data
    if (lowerInput.includes('user') || lowerInput.includes('behavior') || lowerInput.includes('activity')) {
      const userColumns = connectedData.summary.possibleUserIdColumns;
      const eventColumns = connectedData.summary.possibleEventColumns;
      
      return {
        content: `👥 Perfect! I can help you understand user behaviors in your data.\n\n🔍 Based on your dataset, I can analyze:\n${userColumns.length > 0 ? `• User patterns using: ${userColumns.join(', ')}\n` : ''}${eventColumns.length > 0 ? `• Activity trends from: ${eventColumns.join(', ')}\n` : ''}• Behavior patterns across ${connectedData.summary.totalRows} user interactions\n\n💡 What specific user behavior interests you most?\n• User journey analysis\n• Feature usage patterns\n• Activity frequency\n• Time-based behavior trends`,
        queryPart: "User Behavior Analysis:"
      };
    } else if (lowerInput.includes('trend') || lowerInput.includes('time') || lowerInput.includes('pattern')) {
      const timeColumns = connectedData.summary.possibleTimestampColumns;
      
      return {
        content: `📈 Excellent! I can help you discover trends and patterns.\n\n⏰ Your data has ${timeColumns.length > 0 ? `timestamp information in: ${timeColumns.join(', ')}` : 'data points I can analyze over time'}\n\n🔍 I can show you:\n• Usage patterns throughout different time periods\n• Trending behaviors and changes\n• Seasonal or cyclical patterns\n• Growth or decline in specific activities\n\nWhat time period or trend interests you most?`,
        queryPart: "Trend Analysis:"
      };
    } else if (lowerInput.includes('segment') || lowerInput.includes('group') || lowerInput.includes('cohort')) {
      return {
        content: `🎯 Great choice! User segmentation reveals powerful insights.\n\n📊 With your dataset of ${connectedData.summary.totalRows} records, I can help you:\n• Group users by behavior patterns\n• Identify high-value user segments\n• Find users with similar characteristics\n• Create cohorts based on activity levels\n\n💭 What kind of segments are you most interested in?\n• Activity level (active vs. inactive users)\n• Feature usage (power users vs. casual users)\n• Engagement patterns\n• Custom behavioral groupings`,
        queryPart: "User Segmentation:"
      };
    } else {
      return {
        content: `✨ I love your curiosity! With your connected data, I can help you discover amazing insights.\n\n🎯 Here's what I can explore in your ${connectedData.summary.totalRows}-row dataset:\n\n• 👥 **User Behavior Patterns**: How users interact and engage\n• 📈 **Trends & Changes**: What's changing over time\n• 🔍 **Deep Insights**: Hidden patterns in your data\n• 🎯 **User Segments**: Different types of users and their behaviors\n\nWhat aspect of your user data interests you most? Even a general question is perfect to get started!`,
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

  if (showDataConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowDataConfig(false)}
              className="flex items-center gap-2"
            >
              ← Back to Chat
            </Button>
          </div>
          <DataSourceConfig 
            onDataSourceConnect={handleDataSourceConnect}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur border-b border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Data Explorer
                </h1>
                <p className="text-blue-600 text-lg">Discover insights from your user behavior data</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowDataConfig(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Upload className="w-4 h-4" />
              Connect Data
            </Button>
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
                    <p className="text-xs text-blue-600 font-medium mb-1">Building your exploration:</p>
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
        {/* Data Status */}
        {connectedData && (
          <div className="p-6 border-b border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Connected Data</h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <p className="text-sm text-gray-700 mb-2">📊 {connectedData.summary.totalRows} rows, {connectedData.summary.totalColumns} columns</p>
              <p className="text-sm text-gray-700">🔍 Ready to explore user behaviors!</p>
            </div>
          </div>
        )}

        {/* Current Progress */}
        <div className="p-6 border-b border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Code className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Exploration Progress</h3>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {currentQuery || "🌱 Let's discover insights together!"}
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <History className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Popular Questions</h3>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("What user behaviors are most common?")}
            >
              <span className="text-lg mr-3">👥</span>
              <span>User behavior patterns</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("How has user activity changed over time?")}
            >
              <span className="text-lg mr-3">📈</span>
              <span>Activity trends</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => setCurrentInput("Which features do users engage with most?")}
            >
              <span className="text-lg mr-3">🎯</span>
              <span>Feature engagement</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
