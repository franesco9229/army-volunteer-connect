
import { User } from '@/types';

// Mock current user
export const mockCurrentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  photoUrl: "/placeholder.svg",
  totalVolunteerHours: 120,
  isAdmin: true
};

// Mock other users
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    photoUrl: null,
    totalVolunteerHours: 85,
    isAdmin: false
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    photoUrl: null,
    totalVolunteerHours: 164,
    isAdmin: false
  }
];

export const fetchUser = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};
