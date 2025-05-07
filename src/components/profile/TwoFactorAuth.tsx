
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Smartphone, Loader } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export function TwoFactorAuth() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const handleToggle2FA = async (checked: boolean) => {
    if (checked) {
      setIsLoading(true);
      // Simulate API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowVerification(true);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      // Simulate API call to disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(false);
      setShowVerification(false);
      setIsLoading(false);
      toast.success("Two-factor authentication disabled");
    }
  };
  
  const handleVerifyCode = async () => {
    setIsLoading(true);
    // Simulate API call to verify code
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIs2FAEnabled(true);
    setShowVerification(false);
    setIsLoading(false);
    toast.success("Two-factor authentication enabled");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-sta-purple" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable 2FA</h3>
            <p className="text-sm text-muted-foreground">
              Protect your account with two-factor authentication
            </p>
          </div>
          <Switch 
            checked={is2FAEnabled} 
            disabled={isLoading}
            onCheckedChange={handleToggle2FA} 
          />
        </div>
        
        {showVerification && (
          <div className="border rounded-md p-4 mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-sta-purple mt-0.5" />
              <div>
                <h3 className="font-medium">Verify your phone</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We've sent a verification code to your registered phone number. Please enter it below.
                </p>
                <div className="flex gap-3 items-center">
                  <Input 
                    type="text" 
                    placeholder="Enter verification code" 
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-40"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleVerifyCode} 
                    disabled={verificationCode.length < 6 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {is2FAEnabled && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md p-3">
            <p className="text-green-700 dark:text-green-400 text-sm">
              Two-factor authentication is enabled. Your account is now more secure.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
