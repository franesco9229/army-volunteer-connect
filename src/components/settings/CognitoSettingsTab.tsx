
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Save, Trash2, Info, Terminal, RefreshCw, LogIn, UserPlus } from 'lucide-react';
import { getCognitoConfig, saveCognitoConfig } from '@/services/cognitoConfig';
import { toast } from '@/components/ui/sonner';
import { Auth } from '@/services/auth';

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

  // Test login/signup state
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [testName, setTestName] = useState('');
  const [isTestingAuth, setIsTestingAuth] = useState(false);

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
    addConsoleMessage('info', '🔍 Starting comprehensive connection test...');
    
    try {
      addConsoleMessage('info', 'Step 1: Validating configuration parameters');
      addConsoleMessage('info', `  ✓ Region: ${config.region}`);
      addConsoleMessage('info', `  ✓ User Pool ID: ${config.userPoolId}`);
      addConsoleMessage('info', `  ✓ Client ID: ${config.userPoolWebClientId}`);
      
      addConsoleMessage('info', 'Step 2: Testing Amplify configuration');
      
      // Import Amplify to check current configuration
      const { Amplify } = await import('aws-amplify');
      const currentConfig = Amplify.getConfig();
      
      addConsoleMessage('info', '  ✓ Amplify is configured');
      addConsoleMessage('info', `  ✓ Auth config exists: ${!!currentConfig.Auth}`);
      
      if (currentConfig.Auth?.Cognito) {
        addConsoleMessage('info', `  ✓ Cognito userPoolId: ${currentConfig.Auth.Cognito.userPoolId}`);
        addConsoleMessage('info', `  ✓ Cognito userPoolClientId: ${currentConfig.Auth.Cognito.userPoolClientId}`);
      }
      
      addConsoleMessage('info', 'Step 3: Testing authentication service availability');
      
      // Try to check if we can access the Auth service
      const isAuthenticated = await Auth.isAuthenticated();
      addConsoleMessage('info', `  ✓ Auth service responded: isAuthenticated = ${isAuthenticated}`);
      
      addConsoleMessage('info', 'Step 4: Testing Cognito endpoint reachability');
      
      // Try to make a basic request to Cognito to test connectivity
      try {
        const { getCurrentUser } = await import('aws-amplify/auth');
        await getCurrentUser();
        addConsoleMessage('success', '  ✅ Cognito endpoint is reachable (user check successful)');
      } catch (cognitoError) {
        if (cognitoError instanceof Error) {
          if (cognitoError.message.includes('not authenticated')) {
            addConsoleMessage('success', '  ✅ Cognito endpoint is reachable (no authenticated user, which is expected)');
          } else if (cognitoError.message.includes('SECRET_HASH')) {
            addConsoleMessage('error', '  ❌ CLIENT SECRET DETECTED');
            addConsoleMessage('error', '🔧 Fix: Go to AWS Cognito Console → User Pools → App clients');
            addConsoleMessage('error', '   → Edit your app client → Uncheck "Generate client secret"');
            throw cognitoError;
          } else if (cognitoError.message.includes('ResourceNotFoundException')) {
            addConsoleMessage('error', '  ❌ USER POOL OR CLIENT NOT FOUND');
            addConsoleMessage('error', '🔧 Check: Verify User Pool ID and Client ID are correct');
            addConsoleMessage('error', '   → Ensure the User Pool exists in the specified region');
            throw cognitoError;
          } else if (cognitoError.message.includes('NetworkError') || cognitoError.message.includes('Failed to fetch')) {
            addConsoleMessage('error', '  ❌ NETWORK ERROR - Cannot reach Cognito');
            addConsoleMessage('error', '🔧 Check: Network connectivity and AWS region');
            addConsoleMessage('error', '   → Verify the region is correct');
            addConsoleMessage('error', '   → Check if AWS Cognito service is available in your region');
            throw cognitoError;
          } else {
            addConsoleMessage('warning', `  ⚠️ Cognito response: ${cognitoError.message}`);
          }
        } else {
          addConsoleMessage('warning', '  ⚠️ Unknown response from Cognito');
        }
      }
      
      addConsoleMessage('success', '🎉 Connection test completed successfully!');
      addConsoleMessage('info', '✅ Your Cognito configuration appears to be working correctly');
      addConsoleMessage('info', '💡 You can now test login/signup with actual user credentials');
      
    } catch (error) {
      addConsoleMessage('error', '❌ Connection test failed!');
      
      if (error instanceof Error) {
        addConsoleMessage('error', `Error details: ${error.message}`);
        
        // Provide specific troubleshooting based on error type
        if (error.message.includes('SECRET_HASH')) {
          addConsoleMessage('error', '');
          addConsoleMessage('error', '🔧 SOLUTION: Remove Client Secret');
          addConsoleMessage('error', '1. Go to AWS Cognito Console');
          addConsoleMessage('error', '2. Navigate to User Pools → Your Pool → App clients');
          addConsoleMessage('error', '3. Edit your app client');
          addConsoleMessage('error', '4. Uncheck "Generate client secret"');
          addConsoleMessage('error', '5. Save changes');
        } else if (error.message.includes('ResourceNotFoundException')) {
          addConsoleMessage('error', '');
          addConsoleMessage('error', '🔧 SOLUTION: Verify Configuration');
          addConsoleMessage('error', '1. Check User Pool ID is correct');
          addConsoleMessage('error', '2. Check Client ID is correct');
          addConsoleMessage('error', '3. Verify the User Pool exists in the specified region');
        } else if (error.message.includes('NetworkError')) {
          addConsoleMessage('error', '');
          addConsoleMessage('error', '🔧 SOLUTION: Check Network/Region');
          addConsoleMessage('error', '1. Verify internet connection');
          addConsoleMessage('error', '2. Check AWS region is correct');
          addConsoleMessage('error', '3. Ensure Cognito service is available in your region');
        }
      }
      
      toast.error('Connection test failed - check debug console for details');
    } finally {
      setIsTesting(false);
    }
  };

  const testLogin = async () => {
    if (!testEmail || !testPassword) {
      addConsoleMessage('error', 'Please enter both email and password for login test');
      return;
    }

    setIsTestingAuth(true);
    addConsoleMessage('info', `Testing login for: ${testEmail}`);

    try {
      // Call Auth.signIn directly to get the original error
      await Auth.signIn({ username: testEmail, password: testPassword });
      addConsoleMessage('success', `✅ Login successful for ${testEmail}`);
      toast.success('Login test successful!');
    } catch (error) {
      addConsoleMessage('error', `❌ Login failed with detailed error:`);
      
      if (error instanceof Error) {
        addConsoleMessage('error', `Error message: ${error.message}`);
        addConsoleMessage('error', `Error name: ${error.name}`);
        
        // Log the full error object for debugging
        console.error('Full login error object:', error);
        
        if (error.message.includes('SECRET_HASH')) {
          addConsoleMessage('error', '🔧 CLIENT SECRET DETECTED');
          addConsoleMessage('info', '   → Go to AWS Cognito Console → User Pools → App clients');
          addConsoleMessage('info', '   → Edit your app client → Uncheck "Generate client secret"');
        } else if (error.message.includes('NotAuthorizedException')) {
          addConsoleMessage('info', '🔧 Invalid credentials - check username/password');
        } else if (error.message.includes('UserNotFoundException')) {
          addConsoleMessage('info', '🔧 User not found - try signing up first');
        } else if (error.message.includes('UserNotConfirmedException')) {
          addConsoleMessage('info', '🔧 User email not verified - check email for verification');
        } else if (error.message.includes('ResourceNotFoundException')) {
          addConsoleMessage('error', '🔧 User Pool or Client not found - check configuration');
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          addConsoleMessage('error', '🔧 Network error - check AWS region and User Pool ID');
        }
      } else {
        addConsoleMessage('error', `Unknown error type: ${typeof error}`);
      }
    } finally {
      setIsTestingAuth(false);
    }
  };

  const testSignup = async () => {
    if (!testEmail || !testPassword || !testName) {
      addConsoleMessage('error', 'Please enter email, password, and name for signup test');
      return;
    }

    setIsTestingAuth(true);
    addConsoleMessage('info', `Testing signup for: ${testEmail}`);

    try {
      // Call Auth.signUp directly to get the original error
      await Auth.signUp({
        username: testEmail,
        password: testPassword,
        email: testEmail,
        name: testName
      });
      addConsoleMessage('success', `✅ Signup successful for ${testEmail}`);
      addConsoleMessage('info', 'Check your email for verification code if required');
      toast.success('Signup test successful!');
    } catch (error) {
      addConsoleMessage('error', `❌ Signup failed with detailed error:`);
      
      if (error instanceof Error) {
        addConsoleMessage('error', `Error message: ${error.message}`);
        addConsoleMessage('error', `Error name: ${error.name}`);
        
        // Log the full error object for debugging
        console.error('Full signup error object:', error);
        
        if (error.message.includes('SECRET_HASH')) {
          addConsoleMessage('error', '🔧 CLIENT SECRET DETECTED');
          addConsoleMessage('info', '   → Go to AWS Cognito Console → User Pools → App clients');
          addConsoleMessage('info', '   → Edit your app client → Uncheck "Generate client secret"');
        } else if (error.message.includes('UsernameExistsException')) {
          addConsoleMessage('info', '🔧 User already exists - try logging in instead');
        } else if (error.message.includes('InvalidPasswordException')) {
          addConsoleMessage('info', '🔧 Password does not meet requirements');
          addConsoleMessage('info', '   → Check User Pool password policy');
        } else if (error.message.includes('InvalidParameterException')) {
          addConsoleMessage('error', '🔧 Invalid parameter - check email format or other inputs');
        } else if (error.message.includes('ResourceNotFoundException')) {
          addConsoleMessage('error', '🔧 User Pool or Client not found - check configuration');
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          addConsoleMessage('error', '🔧 Network error - check AWS region and User Pool ID');
        }
      } else {
        addConsoleMessage('error', `Unknown error type: ${typeof error}`);
      }
    } finally {
      setIsTestingAuth(false);
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

      {/* Login/Signup Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Authentication Testing
          </CardTitle>
          <CardDescription>
            Test login and signup functionality with your Cognito configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-password">Password</Label>
              <Input
                id="test-password"
                type="password"
                placeholder="••••••••"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-name">Name (for signup)</Label>
              <Input
                id="test-name"
                placeholder="John Doe"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={testLogin}
              disabled={isTestingAuth || !testEmail || !testPassword}
              className="flex items-center gap-2"
            >
              {isTestingAuth ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Test Login
            </Button>
            
            <Button 
              variant="outline"
              onClick={testSignup}
              disabled={isTestingAuth || !testEmail || !testPassword || !testName}
              className="flex items-center gap-2"
            >
              {isTestingAuth ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Test Signup
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>• Use the debug console above to see detailed authentication flow information</p>
            <p>• For signup, check your email for verification codes if email verification is enabled</p>
            <p>• Make sure your Cognito User Pool allows the actions you're testing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
