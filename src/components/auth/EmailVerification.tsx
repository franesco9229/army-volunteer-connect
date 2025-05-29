
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Loader, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function EmailVerification({ email, onVerificationComplete, onBack }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      
      toast.success('Email verified successfully!');
      onVerificationComplete();
    } catch (error) {
      console.error('Verification failed:', error);
      if (error instanceof Error) {
        if (error.message.includes('CodeMismatchException')) {
          toast.error('Invalid verification code. Please check and try again.');
        } else if (error.message.includes('ExpiredCodeException')) {
          toast.error('Verification code has expired. Please request a new one.');
        } else {
          toast.error('Verification failed. Please try again.');
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await resendSignUpCode({
        username: email
      });
      toast.success('New verification code sent to your email');
      setVerificationCode('');
    } catch (error) {
      console.error('Resend failed:', error);
      toast.error('Failed to resend code. Please try again.');
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
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="verification-code">Enter verification code</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
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
          <p>Check your spam folder if you don't see the email.</p>
          <p>The code expires in 15 minutes.</p>
        </div>
      </CardContent>
    </Card>
  );
}
