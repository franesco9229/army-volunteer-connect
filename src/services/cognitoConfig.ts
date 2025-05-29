
import { Amplify } from 'aws-amplify';

interface CognitoConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  apiGatewayUrl?: string;
}

export const configureCognito = (config: CognitoConfig) => {
  Amplify.configure({
    Auth: {
      Cognito: {
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolClientId: config.userPoolWebClientId,
      }
    },
    API: config.apiGatewayUrl ? {
      REST: {
        'api': {
          endpoint: config.apiGatewayUrl,
          region: config.region
        }
      }
    } : undefined
  });
};

export const getCognitoConfig = (): CognitoConfig | null => {
  const saved = localStorage.getItem('cognito_config');
  return saved ? JSON.parse(saved) : null;
};

export const saveCognitoConfig = (config: CognitoConfig) => {
  localStorage.setItem('cognito_config', JSON.stringify(config));
  configureCognito(config);
};
