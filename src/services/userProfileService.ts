import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  tour_completed: boolean | null;
  preferences: Json | null;
  api_keys_configured: Json | null;
  usage_stats: Json | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface AnalysisSession {
  id: string;
  user_id: string;
  session_name: string;
  question: string;
  file_data: Json | null;
  analysis_results: Json | null;
  confidence_score: number | null;
  ai_provider: string | null;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export class UserProfileService {
  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Check if user has completed the guided tour
   */
  static async hasTourCompleted(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    return profile?.tour_completed || false;
  }

  /**
   * Mark the guided tour as completed for a user
   */
  static async markTourCompleted(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ tour_completed: true })
      .eq('id', userId);

    if (error) {
      console.error('Error marking tour as completed:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Save analysis session for authenticated user
   */
  static async saveAnalysisSession(session: Omit<AnalysisSession, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('user_analysis_sessions')
      .insert(session)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving analysis session:', error);
      throw error;
    }

    return data.id;
  }

  /**
   * Get user's analysis sessions
   */
  static async getUserAnalysisSessions(userId: string): Promise<AnalysisSession[]> {
    const { data, error } = await supabase
      .from('user_analysis_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis sessions:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update analysis session
   */
  static async updateAnalysisSession(
    sessionId: string, 
    updates: Partial<AnalysisSession>
  ): Promise<void> {
    const { error } = await supabase
      .from('user_analysis_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating analysis session:', error);
      throw error;
    }
  }

  /**
   * Delete analysis session
   */
  static async deleteAnalysisSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_analysis_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting analysis session:', error);
      throw error;
    }
  }
}