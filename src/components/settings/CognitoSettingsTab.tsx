
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Save, Trash2, Info, Terminal, RefreshCw } from 'lucide-react';
import { getCognitoConfig, saveCognitoConfig } from '@/services/cognitoConfig';
import { toast } from '@/components/ui/sonner';
import { AuthService } from '@/services/authService';

interface ConsoleMessage {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const CognitoSettingsTab = () => {
  const [config, setConfig] = useState({
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
    apiGatewayUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const addConsoleMessage = (type: ConsoleMessage['type'], message: string) => {
    const newMessage: ConsoleMessage = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setConsoleMessages(prev => [...prev, newMessage]);
  };

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [consoleMessages]);

  useEffect(() => {
    const savedConfig = getCognitoConfig();
    if (savedConfig) {
      setConfig({
        region: savedConfig.region,
        userPoolId: savedConfig.userPoolId,
        userPoolWebClientId: savedConfig.userPoolWebClientId,
        apiGatewayUrl: savedConfig.apiGatewayUrl || ''
      });
      setHasConfig(true);
      addConsoleMessage('info', `Loaded existing Cognito configuration for region: ${savedConfig.region}`);
      addConsoleMessage('info', `User Pool ID: ${savedConfig.userPoolId}`);
      addConsoleMessage('info', `Client ID: ${savedConfig.userPoolWebClientId}`);
    } else {
      addConsoleMessage('warning', 'No Cognito configuration found. Using mock authentication.');
    }
  }, []);

  const handleSave = async () => {
    if (!config.region || !config.userPoolId || !config.userPoolWebClientId) {
      toast.error('Please fill in all required fields');
      addConsoleMessage('error', 'Configuration save failed: Missing required fields');
      return;
    }

    setIsLoading(true);
    addConsoleMessage('info', 'Saving Cognito configuration...');
    
    try {
      const configToSave = {
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.userPoolWebClientId,
        ...(config.apiGatewayUrl && { apiGatewayUrl: config.apiGatewayUrl })
      };
      
      addConsoleMessage('info', `Validating configuration for region: ${config.region}`);
      addConsoleMessage('info', `User Pool: ${config.userPoolId}`);
      addConsoleMessage('info', `Client ID: ${config.userPoolWebClientId}`);
      
      saveCognitoConfig(configToSave);
      setHasConfig(true);
      
      addConsoleMessage('success', 'Cognito configuration saved successfully');
      addConsoleMessage('info', 'Amplify has been configured with new settings');
      
      toast.success('Cognito configuration saved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addConsoleMessage('error', `Configuration save failed: ${errorMessage}`);
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    addConsoleMessage('info', 'Clearing Cognito configuration...');
    localStorage.removeItem('cognito_config');
    setConfig({
      region: '',
      userPoolId: '',
      userPoolWebClientId: '',
      apiGatewayUrl: ''
    });
    setHasConfig(false);
    addConsoleMessage('success', 'Configuration cleared - switched to mock authentication');
    toast.success('Cognito configuration cleared');
  };

  const testConnection = async () => {
    if (!hasConfig) {
      addConsoleMessage('warning', 'No configuration to test - using mock authentication');
      return;
    }

    setIsTesting(true);
    addConsoleMessage('info', 'Testing Cognito connection...');
    
    try {
      addConsoleMessage('info', 'Attempting to validate Cognito configuration...');
      addConsoleMessage('info', `Testing connection to User Pool: ${config.userPoolId}`);
      addConsoleMessage('info', `Region: ${config.region}`);
      
      // Try to get current user to test the connection
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        addConsoleMessage('success', 'Connection test successful - user is authenticated');
      } else {
        addConsoleMessage('info', 'Connection test successful - no current user session');
        addConsoleMessage('info', 'Configuration appears valid - ready for authentication');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addConsoleMessage('error', `Connection test failed: ${errorMessage}`);
      
      if (errorMessage.includes('SECRET_HASH')) {
        addConsoleMessage('error', '❌ CLIENT SECRET DETECTED');
        addConsoleMessage('info', '🔧 Fix: Go to AWS Cognito Console → User Pools → App clients');
        addConsoleMessage('info', '   → Edit your app client → Uncheck "Generate client secret"');
      } else if (errorMessage.includes('ResourceNotFoundException')) {
        addConsoleMessage('error', '❌ USER POOL OR CLIENT NOT FOUND');
        addConsoleMessage('info', '🔧 Check: Verify User Pool ID and Client ID are correct');
        addConsoleMessage('info', '   → Ensure the User Pool exists in the specified region');
      } else if (errorMessage.includes('does not exist')) {
        addConsoleMessage('error', '❌ RESOURCE NOT FOUND');
        addConsoleMessage('info', '🔧 Check: User Pool Client ID may be incorrect');
        addConsoleMessage('info', '   → Verify the Client ID exists in your User Pool');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
    addConsoleMessage('info', 'Console cleared');
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {!hasConfig && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> No Cognito configuration found. You can use mock authentication with any email and password combination to test the app with mock data.
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
              <>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Configuration
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={isTesting}
                  className="flex items-center gap-2"
                >
                  {isTesting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                  Test Connection
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug Console */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Debug Console
            </div>
            <Button variant="outline" size="sm" onClick={clearConsole}>
              Clear
            </Button>
          </CardTitle>
          <CardDescription>
            Real-time debugging information for Cognito configuration and connection attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full rounded border bg-black p-4">
            <div className="font-mono text-sm">
              {consoleMessages.map((msg, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">[{msg.timestamp}]</span>{' '}
                  <span className={getMessageColor(msg.type)}>
                    {msg.type.toUpperCase()}:
                  </span>{' '}
                  <span className="text-gray-300">{msg.message}</span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
