
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
import { Eye, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiCredentials {
  apiUrl: string;
  apiKey: string;
  region?: string;
  authType: 'bearer' | 'api-key' | 'aws-signature';
  additionalHeaders?: Record<string, string>;
}

interface BackendConfig {
  name: string;
  defaultUrl: string;
  requiredFields: string[];
  authTypes: string[];
}

const BACKEND_CONFIGS: Record<string, BackendConfig> = {
  aws: {
    name: 'AWS API Gateway',
    defaultUrl: 'https://api.amazonaws.com',
    requiredFields: ['apiUrl', 'apiKey', 'region'],
    authTypes: ['aws-signature', 'bearer']
  },
  express: {
    name: 'Express.js API',
    defaultUrl: 'http://localhost:3000/api',
    requiredFields: ['apiUrl', 'apiKey'],
    authTypes: ['bearer', 'api-key']
  },
  django: {
    name: 'Django REST API',
    defaultUrl: 'http://localhost:8000/api',
    requiredFields: ['apiUrl', 'apiKey'],
    authTypes: ['bearer', 'api-key']
  },
  flask: {
    name: 'Flask API',
    defaultUrl: 'http://localhost:5000/api',
    requiredFields: ['apiUrl', 'apiKey'],
    authTypes: ['bearer', 'api-key']
  },
  fastapi: {
    name: 'FastAPI',
    defaultUrl: 'http://localhost:8000',
    requiredFields: ['apiUrl', 'apiKey'],
    authTypes: ['bearer', 'api-key']
  },
  custom: {
    name: 'Custom Backend',
    defaultUrl: '',
    requiredFields: ['apiUrl', 'apiKey'],
    authTypes: ['bearer', 'api-key', 'aws-signature']
  }
};

export function ApiSettingsTab() {
  const [selectedBackend, setSelectedBackend] = useState<string>('aws');
  const [credentials, setCredentials] = useState<ApiCredentials>({
    apiUrl: '',
    apiKey: '',
    region: '',
    authType: 'bearer',
    additionalHeaders: {}
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved credentials from localStorage
    const savedCredentials = localStorage.getItem(`api_credentials_${selectedBackend}`);
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    } else {
      // Set default values for selected backend
      const config = BACKEND_CONFIGS[selectedBackend];
      setCredentials({
        apiUrl: config.defaultUrl,
        apiKey: '',
        region: selectedBackend === 'aws' ? 'us-east-1' : '',
        authType: config.authTypes[0] as any,
        additionalHeaders: {}
      });
    }
  }, [selectedBackend]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      const config = BACKEND_CONFIGS[selectedBackend];
      const missingFields = config.requiredFields.filter(field => 
        !credentials[field as keyof ApiCredentials]
      );

      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Save to localStorage
      localStorage.setItem(`api_credentials_${selectedBackend}`, JSON.stringify(credentials));
      localStorage.setItem('active_backend', selectedBackend);

      // Test connection
      await testConnection();

      toast({
        title: "API Credentials Saved",
        description: "Your API configuration has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      // Import the API service dynamically to avoid circular dependencies
      const { GenericApiClient } = await import('@/services/genericApiClient');
      const client = new GenericApiClient(credentials);
      await client.testConnection();
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your backend API.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to API",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleCredentialChange = (field: keyof ApiCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const config = BACKEND_CONFIGS[selectedBackend];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Backend Configuration
          </CardTitle>
          <CardDescription>
            Configure your backend API connection. Choose your backend type and enter the required credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Backend Selection */}
          <div className="space-y-2">
            <Label htmlFor="backend-select">Backend Type</Label>
            <select
              id="backend-select"
              value={selectedBackend}
              onChange={(e) => setSelectedBackend(e.target.value)}
              className="w-full p-2 border border-input bg-background rounded-md"
            >
              {Object.entries(BACKEND_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {/* API URL */}
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL *</Label>
            <Input
              id="api-url"
              type="url"
              placeholder={config.defaultUrl || "https://your-api.com"}
              value={credentials.apiUrl}
              onChange={(e) => handleCredentialChange('apiUrl', e.target.value)}
            />
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key *</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your API key"
                value={credentials.apiKey}
                onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Region (for AWS) */}
          {selectedBackend === 'aws' && (
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region *</Label>
              <Input
                id="region"
                placeholder="us-east-1"
                value={credentials.region || ''}
                onChange={(e) => handleCredentialChange('region', e.target.value)}
              />
            </div>
          )}

          {/* Auth Type */}
          <div className="space-y-2">
            <Label htmlFor="auth-type">Authentication Type</Label>
            <select
              id="auth-type"
              value={credentials.authType}
              onChange={(e) => handleCredentialChange('authType', e.target.value as any)}
              className="w-full p-2 border border-input bg-background rounded-md"
            >
              {config.authTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={!credentials.apiUrl || !credentials.apiKey}
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Current backend configuration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Backend:</span>
              <span className="text-sm font-medium">{config.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">API URL:</span>
              <span className="text-sm font-medium truncate max-w-[200px]">
                {credentials.apiUrl || 'Not configured'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Auth Type:</span>
              <span className="text-sm font-medium">{credentials.authType}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
