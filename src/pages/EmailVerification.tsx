
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmailVerification } from '@/components/auth/EmailVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const handleVerificationComplete = () => {
    navigate('/profile');
  };

  const handleBack = () => {
    navigate('/signup');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sta-purple-dark to-sta-purple/20 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-sta-purple mb-4">Email Verification</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No email provided for verification. Please sign up first.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/signup')}
              className="w-full bg-sta-purple hover:bg-sta-purple/90"
            >
              Go to Signup
            </Button>
            <Button 
              variant="outline"
              onClick={handleGoToLogin}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sta-purple-dark to-sta-purple/20 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:text-white hover:bg-sta-purple/30"
          onClick={handleGoToLogin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
        
        <EmailVerification 
          email={email}
          onVerificationComplete={handleVerificationComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
