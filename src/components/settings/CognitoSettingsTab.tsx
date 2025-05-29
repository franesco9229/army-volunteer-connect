
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Save, Trash2, Info } from 'lucide-react';
import { getCognitoConfig, saveCognitoConfig } from '@/services/cognitoConfig';
import { toast } from '@/components/ui/sonner';

export const CognitoSettingsTab = () => {
  const [config, setConfig] = useState({
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
    apiGatewayUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    const savedConfig = getCognitoConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setHasConfig(true);
    }
  }, []);

  const handleSave = async () => {
    if (!config.region || !config.userPoolId || !config.userPoolWebClientId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      saveCognitoConfig(config);
      setHasConfig(true);
      toast.success('Cognito configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('cognito_config');
    setConfig({
      region: '',
      userPoolId: '',
      userPoolWebClientId: '',
      apiGatewayUrl: ''
    });
    setHasConfig(false);
    toast.success('Cognito configuration cleared');
  };

  return (
    <div className="space-y-6">
      {!hasConfig && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> No Cognito configuration found. You can use mock authentication:
            <br />
            • User: demo@example.com / demo123
            <br />
            • Admin: admin@example.com / admin123
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AWS Cognito Configuration
          </CardTitle>
          <CardDescription>
            Configure your AWS Cognito User Pool settings for authentication.
            Leave empty to use mock authentication for testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region *</Label>
              <Input
                id="region"
                placeholder="us-east-1"
                value={config.region}
                onChange={(e) => setConfig(prev => ({ ...prev, region: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userPoolId">User Pool ID *</Label>
              <Input
                id="userPoolId"
                placeholder="us-east-1_xxxxxxxxx"
                value={config.userPoolId}
                onChange={(e) => setConfig(prev => ({ ...prev, userPoolId: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userPoolWebClientId">User Pool Web Client ID *</Label>
              <Input
                id="userPoolWebClientId"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={config.userPoolWebClientId}
                onChange={(e) => setConfig(prev => ({ ...prev, userPoolWebClientId: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiGatewayUrl">API Gateway URL (Optional)</Label>
              <Input
                id="apiGatewayUrl"
                placeholder="https://api.example.com"
                value={config.apiGatewayUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, apiGatewayUrl: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            
            {hasConfig && (
              <Button 
                variant="outline" 
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Configuration
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
