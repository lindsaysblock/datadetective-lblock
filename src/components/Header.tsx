import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Mail, 
  Download, 
  Calendar,
  Key,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OAuthButtons } from './auth/OAuthButtons';
import { EmailAuthTabs } from './auth/EmailAuthTabs';
import DataDetectiveLogo from './DataDetectiveLogo';

interface HeaderProps {
  user: any;
  onUserChange: (user: any) => void;
}

const Header = ({ user, onUserChange }: HeaderProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        setActiveTab('home');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
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
      } else {
        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onUserChange(null);
      setActiveTab('home');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/`
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <DataDetectiveLogo size="md" showText={true} animated={false} />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Dashboard</TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              {user ? (
                <>
                  <User className="w-4 h-4" />
                  Account
                </>
              ) : (
                '🔐 Sign In'
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="hidden">
            {/* Hidden content, just for tab functionality */}
          </TabsContent>

          <TabsContent value="auth" className="absolute top-full right-0 z-50 mt-2 w-96">
            <Card className="p-6 shadow-lg">
              {user ? (
                <div className="space-y-4">
                  <div className="text-center border-b pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Account Management</h3>
                    </div>
                    <p className="text-sm text-gray-600">Signed in as: {user.email}</p>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Key className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <Label htmlFor="reset-email" className="text-sm font-medium">Reset Password</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="text-xs"
                          />
                          <Button size="sm" onClick={handleResetPassword}>
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full justify-start gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Help & Walkthrough
                    </Button>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Recurring Reports</p>
                        <p className="text-xs text-gray-600">Manage email exports & downloads</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Download className="w-4 h-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Analysis Downloads</p>
                        <p className="text-xs text-gray-600">Access your saved reports</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sign In to Data Detective</h3>
                    <p className="text-gray-600 text-sm">Access advanced features and save your work</p>
                  </div>

                  <OAuthButtons loading={loading} setLoading={setLoading} />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>

                  <EmailAuthTabs
                    email={email}
                    password={password}
                    loading={loading}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSignIn={handleSignIn}
                    onSignUp={handleSignUp}
                  />
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </header>
  );
};

export default Header;
