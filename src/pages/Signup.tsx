
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getCognitoConfig } from '@/services/cognitoConfig';
import { EmailVerification } from '@/components/auth/EmailVerification';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const hasCognitoConfig = !!getCognitoConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, email, name);
      
      // If we reach here with Cognito, it means verification is needed
      if (hasCognitoConfig) {
        console.log('Signup successful with Cognito, showing verification screen');
        setPendingEmail(email);
        setShowVerification(true);
        toast.success("Account created! Please check your email for verification code.");
      } else {
        // Mock mode - no verification needed
        toast.success("Account created successfully!");
        navigate('/profile');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        // Check if this is actually a successful signup that needs verification
        if (errorMessage.includes('confirmation') || 
            errorMessage.includes('confirm_sign_up') || 
            errorMessage.includes('next step: confirm_sign_up') ||
            errorMessage.includes('registration requires confirmation')) {
          console.log('Signup successful, showing verification screen');
          setPendingEmail(email);
          setShowVerification(true);
          toast.success("Account created! Please check your email for verification code.");
          return;
        }
        
        // Handle specific errors
        if (errorMessage.includes('usernameexistsexception')) {
          toast.error("An account with this email already exists. Please try signing in.");
          return;
        }
        
        if (errorMessage.includes('invalidpasswordexception')) {
          toast.error("Password does not meet requirements. Please choose a stronger password.");
          return;
        }
      }
      
      // For other errors, show verification screen anyway (in case it's a Cognito quirk)
      console.log('Error occurred, but showing verification screen as fallback');
      setPendingEmail(email);
      setShowVerification(true);
      toast.error("Please check your email for verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    toast.success("Email verified successfully!");
    navigate('/profile');
  };

  const handleBackToSignup = () => {
    setShowVerification(false);
    setPendingEmail('');
  };

  const handleGoBack = () => {
    navigate('/opportunities');
  };

  // Show verification screen if needed
  if (showVerification && pendingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sta-purple-dark to-sta-purple/20 p-4">
        <div className="w-full max-w-md">
          <EmailVerification 
            email={pendingEmail}
            onVerificationComplete={handleVerificationComplete}
            onBack={handleBackToSignup}
          />
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
                <strong>Demo Mode:</strong> No AWS Cognito configured. You can enter any details to create a mock account.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-sta-purple hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
