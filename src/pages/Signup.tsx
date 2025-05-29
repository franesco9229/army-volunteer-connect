
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getCognitoConfig } from '@/services/cognitoConfig';

export default function Signup() {
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const hasCognitoConfig = !!getCognitoConfig();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async () => {
    try {
      await signUp();
      // OIDC will handle the redirect to Cognito hosted UI
    } catch (error) {
      console.error(error);
      toast.error("Authentication failed. Please try again.");
    }
  };

  const handleGoBack = () => {
    navigate('/opportunities');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sta-purple-dark to-sta-purple/20">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-sta-purple">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Join our volunteering community</p>
          </div>

          {!hasCognitoConfig && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>No Cognito Configuration:</strong> Please configure your AWS Cognito settings in the Settings page to enable authentication.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {hasCognitoConfig ? (
              <Button 
                onClick={handleSignUp}
                className="w-full bg-sta-purple hover:bg-sta-purple/90"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account with Cognito
              </Button>
            ) : (
              <Button 
                disabled
                variant="outline"
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Configure Cognito to Sign Up
              </Button>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account? The sign up button will redirect you to Cognito where you can choose to sign in instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
