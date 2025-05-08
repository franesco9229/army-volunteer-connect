
import { User } from '@/types';
import { fetchUser } from '@/data/mockUsers';

/**
 * Converts an AuthUser from the authentication context to a User type
 * by fetching additional user data from the mock data or providing defaults
 */
export const authUserToUser = (authUser: any | null): User | null => {
  if (!authUser) return null;
  
  // Try to fetch complete user data from mock data first
  const userFromMock = authUser.id ? fetchUser(authUser.id) : null;
  
  if (userFromMock) {
    return userFromMock;
  }
  
  // If not found in mock data, create a user with default values
  return {
    id: authUser.id || '',
    name: authUser.name || authUser.username || '',
    email: authUser.email || '',
    photoUrl: null,
    totalVolunteerHours: 0,
    isAdmin: authUser.isAdmin || false
  };
};
