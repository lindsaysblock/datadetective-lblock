
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Clock, TrendingUp, Download, Eye } from 'lucide-react';
import { QuestionLog } from '@/types/data';
import { formatDistanceToNow } from 'date-fns';

interface QuestionLogDisplayProps {
  questionLog: QuestionLog[];
  onExportLog: () => void;
  onViewVisualizations?: (questionId: string) => void;
}

const QuestionLogDisplay: React.FC<QuestionLogDisplayProps> = ({
  questionLog,
  onExportLog,
  onViewVisualizations
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (questionLog.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No additional questions asked yet.</p>
          <p className="text-sm mt-1">Use "Ask More Questions" to dive deeper into your analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Question Log ({questionLog.length})
          </CardTitle>
          <Button onClick={onExportLog} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {questionLog.map((log, index) => (
          <div key={log.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Q{index + 1}
                    </Badge>
                    <Badge className={`text-xs ${getConfidenceColor(log.confidence)}`}>
                      {log.confidence} confidence
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                    <p className="font-medium text-blue-900 text-sm mb-1">Question:</p>
                    <p className="text-blue-800 text-sm">{log.question}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="font-medium text-green-900 text-sm mb-1">Answer:</p>
                    <p className="text-green-800 text-sm whitespace-pre-wrap">{log.answer}</p>
                  </div>
                </div>
              </div>
              
              {log.visualizations && log.visualizations.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      {log.visualizations.length} visualization{log.visualizations.length > 1 ? 's' : ''} generated
                    </p>
                    {onViewVisualizations && (
                      <Button
                        onClick={() => onViewVisualizations(log.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Charts
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {index < questionLog.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionLogDisplay;
