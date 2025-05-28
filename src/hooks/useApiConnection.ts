
import { useState, useEffect } from 'react';
import { modernApi } from '@/services/modernApiService';
import { useToast } from '@/hooks/use-toast';

interface ApiConnectionState {
  isConfigured: boolean;
  isConnected: boolean;
  isLoading: boolean;
  lastChecked: Date | null;
  error: string | null;
}

export function useApiConnection() {
  const [state, setState] = useState<ApiConnectionState>({
    isConfigured: false,
    isConnected: false,
    isLoading: true,
    lastChecked: null,
    error: null
  });
  const { toast } = useToast();

  const checkConnection = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const isConfigured = modernApi.isConfigured();
      
      if (!isConfigured) {
        setState({
          isConfigured: false,
          isConnected: false,
          isLoading: false,
          lastChecked: new Date(),
          error: 'API not configured'
        });
        return;
      }

      const isConnected = await modernApi.healthCheck();
      
      setState({
        isConfigured: true,
        isConnected,
        isLoading: false,
        lastChecked: new Date(),
        error: isConnected ? null : 'Connection failed'
      });

      if (!isConnected) {
        toast({
          title: "API Connection Failed",
          description: "Unable to connect to your backend API. Please check your settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        isConfigured: modernApi.isConfigured(),
        isConnected: false,
        isLoading: false,
        lastChecked: new Date(),
        error: errorMessage
      });
    }
  };

  const retryConnection = () => {
    checkConnection();
  };

  const getConfiguration = () => {
    try {
      return modernApi.getConfiguration();
    } catch (error) {
      return null;
    }
  };

  // Check connection on mount and when configuration changes
  useEffect(() => {
    checkConnection();

    // Listen for storage changes (when credentials are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('api_credentials_') || e.key === 'active_backend') {
        checkConnection();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    ...state,
    checkConnection,
    retryConnection,
    getConfiguration,
    api: modernApi
  };
}
