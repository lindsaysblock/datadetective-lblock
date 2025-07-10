
import { useMemo } from 'react';
import { ParsedData } from '@/utils/dataParser';

export const useDashboardData = (data?: ParsedData) => {
  const processedData = useMemo(() => {
    if (data) return data;
    
    return {
      columns: [
        { name: 'user_id', type: 'string' as const, samples: ['user_1', 'user_2'] },
        { name: 'event_name', type: 'string' as const, samples: ['login', 'purchase'] },
        { name: 'timestamp', type: 'date' as const, samples: ['2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'] },
        { name: 'value', type: 'number' as const, samples: [1, 99.99] }
      ],
      rows: [
        { user_id: 'user_1', event_name: 'login', timestamp: '2024-01-01T10:00:00Z', value: 1 },
        { user_id: 'user_2', event_name: 'purchase', timestamp: '2024-01-01T11:00:00Z', value: 99.99 }
      ],
      summary: { 
        totalRows: 2, 
        totalColumns: 4,
        possibleUserIdColumns: ['user_id'],
        possibleEventColumns: ['event_name'],
        possibleTimestampColumns: ['timestamp']
      }
    };
  }, [data]);

  const findings = useMemo(() => ([
    {
      id: '1',
      title: 'User Engagement Peak',
      description: 'Peak user activity occurs between 10-11 AM',
      confidence: 'high',
      type: 'insight'
    }
  ]), []);

  const recommendations = useMemo(() => ([
    {
      id: '1',
      type: 'bar' as const,
      title: 'User Activity by Hour',
      description: 'Shows peak usage times',
      config: { xAxis: 'hour', yAxis: 'count' }
    }
  ]), []);

  const hypotheses = useMemo(() => ([
    {
      id: '1',
      hypothesis: 'Users are more active in the morning',
      status: 'testing' as const,
      confidence: 0.75,
      evidence: ['Peak activity at 10-11 AM', 'Lower evening engagement']
    }
  ]), []);

  return {
    processedData,
    findings,
    recommendations,
    hypotheses
  };
};
