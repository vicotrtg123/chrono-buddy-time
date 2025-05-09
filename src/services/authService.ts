
import { User } from '../contexts/AuthContext';
import { users } from './data/mockDatabase';

// API mock functions for authentication
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = users.find(
      (u) => u.email === email && u.password === password && u.active
    );

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },
};
