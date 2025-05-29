
import { getCognitoConfig } from './cognitoConfig';

export interface OIDCConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  post_logout_redirect_uri?: string;
}

export const getOIDCConfig = (): OIDCConfig | null => {
  const cognitoConfig = getCognitoConfig();
  
  if (!cognitoConfig) {
    return null;
  }

  const currentOrigin = window.location.origin;
  
  return {
    authority: `https://cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`,
    client_id: cognitoConfig.userPoolWebClientId,
    redirect_uri: currentOrigin,
    response_type: "code",
    scope: "email openid phone profile",
    post_logout_redirect_uri: currentOrigin
  };
};

export const getCognitoDomain = (): string | null => {
  const cognitoConfig = getCognitoConfig();
  
  if (!cognitoConfig) {
    return null;
  }

  // This would need to be configured in your Cognito settings
  // Format: https://your-domain.auth.region.amazoncognito.com
  // For now, we'll construct a default domain
  return `https://${cognitoConfig.userPoolId}.auth.${cognitoConfig.region}.amazoncognito.com`;
};
