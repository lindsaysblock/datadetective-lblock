
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, History, BarChart3, Settings, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DatasetsGrid from '@/components/data/DatasetsGrid';
import { useIndexPageState } from '@/hooks/useIndexPageState';
import { SignInModal } from '@/components/auth/SignInModal';
import { useAuthState } from '@/hooks/useAuthState';

const Index = () => {
  const {
    datasets,
    datasetsLoading,
  } = useIndexPageState();

  const { user, loading: authLoading } = useAuthState();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinueExistingProject = () => {
    if (!user) {
      setShowSignInModal(true);
    } else {
      navigate('/query-history');
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        setShowSignInModal(false);
        toast({
          title: "Signed In Successfully",
          description: `Welcome back!`,
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        setShowSignInModal(false);
        toast({
          title: "Account Created",
          description: "Check your email for the confirmation link!",
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user ? 'Welcome Back, Detective!' : 'Welcome to Data Detective'}
            </h1>
            <p className="text-gray-600">
              {user 
                ? 'What would you like to investigate today?' 
                : 'Discover insights from your data with AI-powered analysis'
              }
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card 
              className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/new-project')}
            >
              <div className="text-center">
                <div className="p-4 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Start New Project</h3>
                <p className="text-gray-600">Upload fresh data and begin a new investigation</p>
              </div>
            </Card>

            <Card 
              className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={handleContinueExistingProject}
            >
              <div className="text-center">
                <div className="p-4 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Continue Existing Project</h3>
                <p className="text-gray-600">Resume analysis on your saved datasets</p>
              </div>
            </Card>

            <Card 
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/dashboard')}
            >
              <div className="text-center">
                <div className="p-4 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">View comprehensive data analytics and insights</p>
              </div>
            </Card>
          </div>

          {/* Admin and Testing Section */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card 
                className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/admin')}
              >
                <div className="text-center">
                  <div className="p-3 bg-orange-500 rounded-full w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Admin Panel</h3>
                  <p className="text-gray-600">System administration and QA tools</p>
                </div>
              </Card>

              <Card 
                className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/pipeline-review')}
              >
                <div className="text-center">
                  <div className="p-3 bg-teal-500 rounded-full w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Pipeline Review</h3>
                  <p className="text-gray-600">Analytics pipeline testing and optimization</p>
                </div>
              </Card>
            </div>
          )}

          {/* Recent Activity Section - Only show for authenticated users */}
          {user && datasets && datasets.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <Card className="border-blue-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    Quick access to your latest investigations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DatasetsGrid datasets={datasets?.slice(0, 3) || []} loading={datasetsLoading} />
                  {datasets && datasets.length > 3 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => navigate('/query-history')}>
                        View All Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

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

export default Index;
