import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Lock, Mail, ArrowLeft, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getCognitoConfig } from '@/services/cognitoConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from location state or default to profile
  const from = location.state?.from || '/profile';
  const hasCognitoConfig = !!getCognitoConfig();

  // Show error message if redirected from signup
  useEffect(() => {
    if (location.state?.error && location.state?.fromSignup) {
      toast.error(location.state.error);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo: Use email as username
      await signIn(email, password);
      toast.success("Successfully logged in!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = async () => {
    setIsLoading(true);
    try {
      // Use the signIn method with special mock credentials
      await signIn('MOCK_USER', 'MOCK_PASSWORD');
      toast.success("Successfully logged in with demo data!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Demo login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/opportunities');
  };

  const handleEmailVerification = () => {
    const email = window.prompt('Please enter your email address for verification:');
    if (email && email.trim()) {
      navigate(`/email-verification?email=${encodeURIComponent(email.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sta-purple-dark to-sta-purple/20 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:text-white hover:bg-sta-purple/30"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Opportunities
        </Button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-sta-purple">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Log in to continue your volunteering journey</p>
          </div>

          {!hasCognitoConfig && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Demo Mode:</strong> No AWS Cognito configured. You can enter any email/password or use the demo button below.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-sta-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-sta-purple hover:bg-sta-purple/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Mode Button - Always visible */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
              </div>
            </div>
            <Button 
              onClick={handleMockLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full mt-4 border-sta-purple text-sta-purple hover:bg-sta-purple hover:text-white"
            >
              <User className="mr-2 h-4 w-4" />
              {isLoading ? 'Logging in...' : 'Try Demo Mode'}
            </Button>
          </div>

          {/* Email Verification Link */}
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={handleEmailVerification}
              className="text-sta-purple hover:underline text-sm"
            >
              Need to verify your email?
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sta-purple hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
