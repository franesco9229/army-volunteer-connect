
import { Amplify } from 'aws-amplify';

interface CognitoConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  apiGatewayUrl?: string;
  hostedUiDomain?: string;
}

export const configureCognito = (config: CognitoConfig) => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.userPoolId,
        userPoolClientId: config.userPoolWebClientId,
        loginWith: {
          email: true,
          username: true
        },
        signUpVerificationMethod: 'code',
        userAttributes: {
          email: {
            required: true,
          },
        },
        allowGuestAccess: false,
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        }
      }
    },
    ...(config.apiGatewayUrl && {
      API: {
        REST: {
          'charity-api': {
            endpoint: config.apiGatewayUrl,
            region: config.region
          }
        }
      }
    })
  });
};

// Your specific charity backend configuration
export const CHARITY_BACKEND_CONFIG: CognitoConfig = {
  region: 'eu-west-2',
  userPoolId: 'eu-west-2_kQrUuZhh9',
  userPoolWebClientId: '5uasj2k09h4mlfqj6btopne207',
  apiGatewayUrl: 'https://ve4jnzoz45.execute-api.eu-west-2.amazonaws.com/prod',
  hostedUiDomain: 'https://eu-west-2kqruuzhh9.auth.eu-west-2.amazoncognito.com'
};

export const getCognitoConfig = (): CognitoConfig | null => {
  const saved = localStorage.getItem('cognito_config');
  return saved ? JSON.parse(saved) : CHARITY_BACKEND_CONFIG;
};

export const saveCognitoConfig = (config: CognitoConfig) => {
  localStorage.setItem('cognito_config', JSON.stringify(config));
  configureCognito(config);
};

// Initialize with charity backend config by default
export const initializeCharityBackend = () => {
  configureCognito(CHARITY_BACKEND_CONFIG);
  saveCognitoConfig(CHARITY_BACKEND_CONFIG);
};
