
import { MockUser, MockEvent } from './mockDataGenerator';

export interface BehavioralDataset {
  users: BehavioralUser[];
  events: BehavioralEvent[];
  sessions: UserSession[];
  conversions: ConversionEvent[];
  metadata: {
    generatedAt: string;
    totalUsers: number;
    totalEvents: number;
    dateRange: { start: string; end: string };
  };
}

export interface BehavioralUser extends MockUser {
  user_segment: 'power_user' | 'regular_user' | 'casual_user' | 'new_user';
  ltv: number; // Lifetime value
  churn_risk: 'low' | 'medium' | 'high';
  acquisition_channel: string;
  first_session_date: string;
  last_activity_date: string;
  total_sessions: number;
  avg_session_duration: number;
}

export interface BehavioralEvent extends MockEvent {
  session_id: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  location: {
    country: string;
    city: string;
    timezone: string;
  };
  engagement_score: number;
  conversion_value?: number;
}

export interface UserSession {
  session_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  page_views: number;
  events_count: number;
  bounce: boolean;
  conversion: boolean;
  traffic_source: string;
  utm_campaign?: string;
}

export interface ConversionEvent {
  conversion_id: string;
  user_id: string;
  session_id: string;
  conversion_type: 'signup' | 'purchase' | 'upgrade' | 'trial_start';
  value: number;
  timestamp: string;
  funnel_step: number;
  attribution_channel: string;
}

export const generateLargeBehavioralDataset = (
  userCount: number = 5000,
  timeframeDays: number = 90
): BehavioralDataset => {
  console.log(`Generating behavioral dataset with ${userCount} users over ${timeframeDays} days...`);
  
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));
  
  // Generate users with behavioral attributes
  const users = generateBehavioralUsers(userCount, startDate, endDate);
  
  // Generate sessions for users
  const sessions = generateUserSessions(users, startDate, endDate);
  
  // Generate events within sessions
  const events = generateBehavioralEvents(users, sessions);
  
  // Generate conversion events
  const conversions = generateConversionEvents(users, sessions);
  
  const dataset: BehavioralDataset = {
    users,
    events,
    sessions,
    conversions,
    metadata: {
      generatedAt: new Date().toISOString(),
      totalUsers: users.length,
      totalEvents: events.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  };
  
  console.log(`Generated dataset: ${dataset.users.length} users, ${dataset.events.length} events, ${dataset.sessions.length} sessions`);
  
  return dataset;
};

const generateBehavioralUsers = (count: number, startDate: Date, endDate: Date): BehavioralUser[] => {
  const segments = ['power_user', 'regular_user', 'casual_user', 'new_user'] as const;
  const channels = ['organic_search', 'paid_search', 'social_media', 'email', 'direct', 'referral'];
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR', 'IN', 'ES'];
  const plans = ['free', 'premium', 'enterprise'] as const;
  
  return Array.from({ length: count }, (_, i) => {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const signupDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const lastActivity = new Date(signupDate.getTime() + Math.random() * (endDate.getTime() - signupDate.getTime()));
    
    // Segment-based behavior patterns
    const segmentMultipliers = {
      power_user: { sessions: 15, duration: 45, ltv: 500 },
      regular_user: { sessions: 8, duration: 25, ltv: 200 },
      casual_user: { sessions: 3, duration: 12, ltv: 50 },
      new_user: { sessions: 1, duration: 8, ltv: 0 }
    };
    
    const multiplier = segmentMultipliers[segment];
    const totalSessions = Math.floor(Math.random() * multiplier.sessions) + 1;
    
    return {
      user_id: `user_${i + 1}`,
      email: `user${i + 1}@example.com`,
      signup_date: signupDate.toISOString(),
      plan: plans[Math.floor(Math.random() * plans.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      age: Math.floor(Math.random() * 50) + 18,
      user_segment: segment,
      ltv: multiplier.ltv + Math.floor(Math.random() * multiplier.ltv),
      churn_risk: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
      acquisition_channel: channels[Math.floor(Math.random() * channels.length)],
      first_session_date: signupDate.toISOString(),
      last_activity_date: lastActivity.toISOString(),
      total_sessions: totalSessions,
      avg_session_duration: multiplier.duration + Math.floor(Math.random() * 20)
    };
  });
};

const generateUserSessions = (users: BehavioralUser[], startDate: Date, endDate: Date): UserSession[] => {
  const sessions: UserSession[] = [];
  const sources = ['organic', 'paid', 'social', 'email', 'direct', 'referral'];
  const campaigns = ['spring_sale', 'product_launch', 'retargeting', 'brand_awareness', null];
  
  users.forEach(user => {
    const sessionCount = user.total_sessions;
    
    for (let i = 0; i < sessionCount; i++) {
      const sessionStart = new Date(
        new Date(user.first_session_date).getTime() + 
        Math.random() * (new Date(user.last_activity_date).getTime() - new Date(user.first_session_date).getTime())
      );
      
      const durationMinutes = user.avg_session_duration + Math.floor(Math.random() * 30) - 15;
      const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60 * 1000);
      
      const pageViews = Math.floor(Math.random() * 15) + 1;
      const eventsCount = Math.floor(Math.random() * 25) + pageViews;
      
      sessions.push({
        session_id: `session_${user.user_id}_${i + 1}`,
        user_id: user.user_id,
        start_time: sessionStart.toISOString(),
        end_time: sessionEnd.toISOString(),
        duration_minutes: durationMinutes,
        page_views: pageViews,
        events_count: eventsCount,
        bounce: pageViews === 1 && durationMinutes < 5,
        conversion: Math.random() > 0.85,
        traffic_source: sources[Math.floor(Math.random() * sources.length)],
        utm_campaign: campaigns[Math.floor(Math.random() * campaigns.length)]
      });
    }
  });
  
  return sessions;
};

const generateBehavioralEvents = (users: BehavioralUser[], sessions: UserSession[]): BehavioralEvent[] => {
  const events: BehavioralEvent[] = [];
  const eventTypes = [
    'page_view', 'button_click', 'form_submit', 'search', 'download',
    'video_play', 'video_complete', 'scroll_depth', 'time_on_page',
    'feature_usage', 'error_occurred', 'help_viewed', 'chat_initiated'
  ];
  
  const pages = [
    '/dashboard', '/profile', '/settings', '/analytics', '/reports',
    '/billing', '/help', '/features', '/integrations', '/api-docs'
  ];
  
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const cities = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Tokyo', 'São Paulo'];
  
  sessions.forEach(session => {
    const user = users.find(u => u.user_id === session.user_id)!;
    const eventCount = session.events_count;
    
    for (let i = 0; i < eventCount; i++) {
      const eventTime = new Date(
        new Date(session.start_time).getTime() + 
        (i / eventCount) * (new Date(session.end_time).getTime() - new Date(session.start_time).getTime())
      );
      
      events.push({
        event_id: `event_${session.session_id}_${i + 1}`,
        user_id: user.user_id,
        session_id: session.session_id,
        event_name: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        timestamp: eventTime.toISOString(),
        device_type: Math.random() > 0.6 ? 'mobile' : Math.random() > 0.5 ? 'desktop' : 'tablet',
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        location: {
          country: user.country,
          city: cities[Math.floor(Math.random() * cities.length)],
          timezone: 'UTC'
        },
        engagement_score: Math.floor(Math.random() * 100) + 1,
        conversion_value: session.conversion ? Math.floor(Math.random() * 1000) + 50 : undefined,
        properties: {
          page: pages[Math.floor(Math.random() * pages.length)],
          category: 'user_interaction'
        }
      });
    }
  });
  
  return events;
};

const generateConversionEvents = (users: BehavioralUser[], sessions: UserSession[]): ConversionEvent[] => {
  const conversions: ConversionEvent[] = [];
  const conversionTypes = ['signup', 'purchase', 'upgrade', 'trial_start'] as const;
  const channels = ['organic', 'paid', 'social', 'email', 'direct'];
  
  const conversionSessions = sessions.filter(s => s.conversion);
  
  conversionSessions.forEach((session, index) => {
    const user = users.find(u => u.user_id === session.user_id)!;
    const conversionType = conversionTypes[Math.floor(Math.random() * conversionTypes.length)];
    
    let value = 0;
    switch (conversionType) {
      case 'signup': value = 0; break;
      case 'trial_start': value = 0; break;
      case 'purchase': value = Math.floor(Math.random() * 500) + 50; break;
      case 'upgrade': value = Math.floor(Math.random() * 200) + 100; break;
    }
    
    conversions.push({
      conversion_id: `conv_${session.session_id}`,
      user_id: user.user_id,
      session_id: session.session_id,
      conversion_type: conversionType,
      value,
      timestamp: new Date(
        new Date(session.start_time).getTime() + 
        Math.random() * (new Date(session.end_time).getTime() - new Date(session.start_time).getTime())
      ).toISOString(),
      funnel_step: Math.floor(Math.random() * 5) + 1,
      attribution_channel: channels[Math.floor(Math.random() * channels.length)]
    });
  });
  
  return conversions;
};

export const convertBehavioralDatasetToCSV = (dataset: BehavioralDataset): string => {
  const headers = [
    'user_id', 'event_name', 'timestamp', 'session_id', 'device_type', 
    'page', 'engagement_score', 'user_segment', 'acquisition_channel',
    'conversion_value', 'country', 'browser', 'traffic_source'
  ];
  
  const rows = [headers.join(',')];
  
  dataset.events.forEach(event => {
    const user = dataset.users.find(u => u.user_id === event.user_id);
    const session = dataset.sessions.find(s => s.session_id === event.session_id);
    
    if (user && session) {
      rows.push([
        event.user_id,
        event.event_name,
        event.timestamp,
        event.session_id,
        event.device_type,
        event.properties.page || '',
        event.engagement_score,
        user.user_segment,
        user.acquisition_channel,
        event.conversion_value || '',
        user.country,
        event.browser,
        session.traffic_source
      ].map(field => `"${field}"`).join(','));
    }
  });
  
  return rows.join('\n');
};
