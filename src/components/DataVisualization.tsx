
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface VisualizationRecommendation {
  type: 'bar' | 'line' | 'pie' | 'comparison';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  data: DataPoint[];
  reason: string;
}

interface DataVisualizationProps {
  recommendations: VisualizationRecommendation[];
  onSelectVisualization: (type: string, data: DataPoint[]) => void;
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

const DataVisualization: React.FC<DataVisualizationProps> = ({
  recommendations,
  onSelectVisualization
}) => {
  const renderChart = (rec: VisualizationRecommendation) => {
    const config = rec.data.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length]
      };
      return acc;
    }, {} as any);

    switch (rec.type) {
      case 'bar':
        return (
          <ChartContainer config={config} className="h-48">
            <BarChart data={rec.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-primary)" />
            </BarChart>
          </ChartContainer>
        );
      
      case 'line':
        return (
          <ChartContainer config={config} className="h-48">
            <LineChart data={rec.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="var(--color-primary)" />
            </LineChart>
          </ChartContainer>
        );
      
      case 'pie':
        return (
          <ChartContainer config={config} className="h-48">
            <PieChart>
              <Pie
                data={rec.data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {rec.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );
      
      default:
        return <div className="h-48 flex items-center justify-center text-muted-foreground">Chart preview</div>;
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">📊 Visualization Recommendations</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Based on your data, here are some visualizations that could help you understand the patterns better:
      </p>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow border border-blue-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <rec.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {rec.type}
              </Badge>
            </div>
            
            <div className="mb-4">
              {renderChart(rec)}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">💡 {rec.reason}</p>
              <Button 
                size="sm" 
                onClick={() => onSelectVisualization(rec.type, rec.data)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Use This Chart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default DataVisualization;
