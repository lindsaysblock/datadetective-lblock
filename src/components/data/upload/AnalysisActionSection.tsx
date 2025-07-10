
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SignInModal } from '@/components/auth/SignInModal';
import { useAuthState } from '@/hooks/useAuthState';

interface AnalysisActionSectionProps {
  researchQuestion: string;
  setResearchQuestion: (question: string) => void;
  parsedData: any;
  onStartAnalysis: () => void;
}

export const AnalysisActionSection: React.FC<AnalysisActionSectionProps> = ({
  researchQuestion,
  setResearchQuestion,
  parsedData,
  onStartAnalysis
}) => {
  const { user } = useAuthState();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeClick = () => {
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    if (!parsedData) {
      toast({
        title: "No Data",
        description: "Please upload data first before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!researchQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please describe what you want to analyze or discover.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    onStartAnalysis();
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Your data analysis is ready!",
      });
    }, 3000);
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        setShowSignInModal(false);
        // Automatically start analysis after sign in
        setTimeout(() => handleAnalyzeClick(), 100);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/new-project`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
        });
        setShowSignInModal(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="research-question">Research Question</Label>
        <Textarea
          id="research-question"
          placeholder="What do you want to discover from this data? (e.g., 'What are the main trends in sales over time?')"
          value={researchQuestion}
          onChange={(e) => setResearchQuestion(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <Button 
        onClick={handleAnalyzeClick}
        disabled={analyzing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="lg"
      >
        {analyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Data...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Start Detective Analysis
          </>
        )}
      </Button>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        email={email}
        password={password}
        loading={authLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
      />
    </div>
  );
};
