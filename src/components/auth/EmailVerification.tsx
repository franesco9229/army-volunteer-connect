
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Loader, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { getCognitoConfig } from '@/services/cognitoConfig';

interface EmailVerificationProps {
  email: string;
  username?: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function EmailVerification({ email, username, onVerificationComplete, onBack }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const hasCognitoConfig = !!getCognitoConfig();

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    // Mock verification if no Cognito config
    if (!hasCognitoConfig) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        toast.success('Email verified successfully! (Demo mode)');
        onVerificationComplete();
      }, 1000);
      return;
    }

    setIsVerifying(true);
    try {
      console.log('🔍 Starting verification process...');
      console.log('📧 Email being verified:', email);
      
      const cleanCode = verificationCode.trim();
      
      // Get the stored username from signup
      const storedUsername = localStorage.getItem('temp_cognito_username');
      const usernameForVerification = storedUsername || username || email;
      
      console.log('🚀 Calling confirmSignUp with:');
      console.log('   username:', usernameForVerification);
      console.log('   confirmationCode:', cleanCode);
      
      await confirmSignUp({
        username: usernameForVerification,
        confirmationCode: cleanCode
      });
      
      console.log('✅ Verification successful!');
      
      // Clean up temporary storage
      localStorage.removeItem('temp_cognito_username');
      localStorage.removeItem('temp_cognito_email');
      
      toast.success('Email verified successfully!');
      onVerificationComplete();
    } catch (error) {
      console.error('❌ Verification failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'CodeMismatchException' || error.message.includes('CodeMismatchException')) {
          toast.error('The verification code is incorrect. Please check your email and try again.');
        } else if (error.name === 'ExpiredCodeException' || error.message.includes('ExpiredCodeException')) {
          toast.error('The verification code has expired. Please request a new one.');
        } else if (error.name === 'AliasExistsException' || error.message.includes('AliasExistsException')) {
          toast.success('Email already verified! You can now sign in.');
          onVerificationComplete();
          return;
        } else {
          toast.error(`Verification failed: ${error.message}`);
        }
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    // Mock resend if no Cognito config
    if (!hasCognitoConfig) {
      setIsResending(true);
      setTimeout(() => {
        setIsResending(false);
        toast.success('New verification code sent! (Demo mode)');
        setVerificationCode('');
      }, 1000);
      return;
    }

    setIsResending(true);
    try {
      console.log('📬 Resending verification code for email:', email);
      
      // Get the stored username from signup
      const storedUsername = localStorage.getItem('temp_cognito_username');
      const usernameForResend = storedUsername || username || email;
      
      console.log('🚀 Resending with username:', usernameForResend);
      
      await resendSignUpCode({
        username: usernameForResend
      });
      
      console.log('✅ Code resent successfully');
      toast.success('New verification code sent to your email');
      setVerificationCode('');
    } catch (error) {
      console.error('❌ Resend failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('LimitExceededException')) {
          toast.error('Too many requests. Please wait before requesting another code.');
        } else if (error.message.includes('UserNotFoundException')) {
          toast.error('User not found. Please try signing up again.');
        } else if (error.message.includes('InvalidParameterException')) {
          toast.error('Invalid request. Please try signing up again.');
        } else {
          toast.error('Failed to resend code. Please try again.');
        }
      } else {
        toast.error('Failed to resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-sta-purple" />
          Verify Your Email
        </CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to:
          <br />
          <strong>{email}</strong>
          {!hasCognitoConfig && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
              <strong>Demo Mode:</strong> Enter any 6-digit code to proceed
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="verification-code">Enter verification code</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={(value) => {
                console.log('🔢 OTP input changed to:', value);
                setVerificationCode(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="w-full bg-sta-purple hover:bg-sta-purple/90"
          >
            {isVerifying ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleResendCode}
              disabled={isResending}
              className="flex-1"
            >
              {isResending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </Button>

            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex-1"
            >
              Back to Signup
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {hasCognitoConfig ? (
            <>
              <p>Check your spam folder if you don't see the email.</p>
              <p>The code expires in 15 minutes.</p>
            </>
          ) : (
            <p>Demo mode: Enter any 6-digit code to continue</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
