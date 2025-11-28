// Shared authentication store for development
// In production, this should be replaced with a proper database

export interface User {
  userId: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  createdAt: string;
}

// In-memory users store (shared between registration and login)
const users: User[] = [];

// Get all users
export const getUsers = (): User[] => {
  return users;
};

// Add a new user
export const addUser = (user: User): void => {
  users.push(user);
};

// Find user by email
export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

// Mock users for initial testing (with pre-hashed passwords)
// Password for test@example.com: "password123"
// Password for admin@socteamup.com: "admin123"
const mockUsers: User[] = [
  {
    userId: 'user_1',
    email: 'socteam@gmail.com',
    name: 'SocTeam User',
    password_hash: '$2b$12$cCcPnMl4waXbKBpDcVNvZuUc60GZKt1CxvF7IYhb4VxodfwLrJsRG', // Sudipdas123
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    userId: 'user_2',
    email: 'admin@socteamup.com',
    name: 'Admin User',
    password_hash: '$2b$12$KLsWIDfiDLPeodHYgkbt0.2PeOeJ8VueiBrd33i/pZYQn4cS5bvXe', // admin123
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Initialize with mock users on first load
if (users.length === 0) {
  mockUsers.forEach(user => users.push(user));
} 