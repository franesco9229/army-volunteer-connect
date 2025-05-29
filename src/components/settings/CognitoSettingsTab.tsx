
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveCognitoConfig, getCognitoConfig, configureCognito } from '@/services/cognitoConfig';

interface CognitoConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  apiGatewayUrl?: string;
}

export function CognitoSettingsTab() {
  const [config, setConfig] = useState<CognitoConfig>({
    region: 'us-east-1',
    userPoolId: '',
    userPoolWebClientId: '',
    apiGatewayUrl: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configuration
    const savedConfig = getCognitoConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!config.region || !config.userPoolId || !config.userPoolWebClientId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Save configuration
      saveCognitoConfig(config);
      setIsConfigured(true);

      toast({
        title: "Cognito Configuration Saved",
        description: "Your AWS Cognito settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (field: keyof CognitoConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AWS Cognito Configuration
          </CardTitle>
          <CardDescription>
            Configure your AWS Cognito User Pool for authentication. You can find these values in your AWS Console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Region */}
          <div className="space-y-2">
            <Label htmlFor="region">AWS Region *</Label>
            <Input
              id="region"
              placeholder="us-east-1"
              value={config.region}
              onChange={(e) => handleConfigChange('region', e.target.value)}
            />
          </div>

          {/* User Pool ID */}
          <div className="space-y-2">
            <Label htmlFor="user-pool-id">User Pool ID *</Label>
            <Input
              id="user-pool-id"
              placeholder="us-east-1_xxxxxxxxx"
              value={config.userPoolId}
              onChange={(e) => handleConfigChange('userPoolId', e.target.value)}
            />
          </div>

          {/* App Client ID */}
          <div className="space-y-2">
            <Label htmlFor="client-id">App Client ID *</Label>
            <Input
              id="client-id"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.userPoolWebClientId}
              onChange={(e) => handleConfigChange('userPoolWebClientId', e.target.value)}
            />
          </div>

          {/* API Gateway URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="api-gateway-url">API Gateway URL (Optional)</Label>
            <Input
              id="api-gateway-url"
              type="url"
              placeholder="https://your-api-id.execute-api.region.amazonaws.com/stage"
              value={config.apiGatewayUrl || ''}
              onChange={(e) => handleConfigChange('apiGatewayUrl', e.target.value)}
            />
          </div>

          <Separator />

          {/* Action Button */}
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Cognito Configuration"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            Current AWS Cognito configuration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {isConfigured ? 'Cognito Configured' : 'Cognito Not Configured'}
              </span>
            </div>
            
            {isConfigured && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <span className="text-sm font-medium">{config.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User Pool:</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {config.userPoolId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Client ID:</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {config.userPoolWebClientId}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>1. Go to AWS Console</strong> → Cognito → User Pools</p>
            <p><strong>2. Create or select your User Pool</strong></p>
            <p><strong>3. Copy the User Pool ID</strong> from the General settings</p>
            <p><strong>4. Go to App Integration</strong> → App clients</p>
            <p><strong>5. Copy the Client ID</strong> from your app client</p>
            <p><strong>6. Enter the values above</strong> and save</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
