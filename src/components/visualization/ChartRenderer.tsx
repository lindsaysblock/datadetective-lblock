
import React from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
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
  CartesianGrid
} from 'recharts';
import { VisualizationRecommendation } from '../../utils/visualization/recommendationEngine';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

interface ChartRendererProps {
  recommendation: VisualizationRecommendation;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ recommendation }) => {
  const config = recommendation.data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: CHART_COLORS[index % CHART_COLORS.length]
    };
    return acc;
  }, {} as any);

  switch (recommendation.type) {
    case 'bar':
      return (
        <ChartContainer config={config} className="h-48">
          <BarChart data={recommendation.data}>
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
          <LineChart data={recommendation.data}>
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
              data={recommendation.data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
            >
              {recommendation.data.map((entry, index) => (
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

export default ChartRenderer;
