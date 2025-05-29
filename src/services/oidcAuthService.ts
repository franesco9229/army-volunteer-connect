
import { User } from 'oidc-client-ts';
import { AuthUser } from '@/contexts/AuthContext';

export class OIDCAuthService {
  static convertOIDCUserToAuthUser(oidcUser: User): AuthUser {
    return {
      id: oidcUser.profile.sub || '',
      username: oidcUser.profile.email || '',
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || oidcUser.profile.email || '',
      groups: oidcUser.profile['cognito:groups'] as string[] || ['users'],
      isAdmin: ((oidcUser.profile['cognito:groups'] as string[]) || []).includes('admins')
    };
  }

  static async signOut(cognitoDomain: string, clientId: string, logoutUri: string): Promise<void> {
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    window.location.href = logoutUrl;
  }
}
