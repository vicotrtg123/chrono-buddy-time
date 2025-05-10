
import { User } from '../contexts/AuthContext';
import { executeQuery } from './database/dbConnection';

// API functions for authentication
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Simulate network delay for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Durante o desenvolvimento, manteremos o modo de simulação para permitir login sem banco
      // Em ambiente de produção, isso será removido
      
      // Simulação para desenvolvimento (fallback temporário)
      const mockUsers = [
        { 
          id: 1, 
          name: "Admin User", 
          email: "admin@example.com", 
          password: "admin123", 
          role: "admin", 
          active: true 
        },
        { 
          id: 2, 
          name: "Employee One", 
          email: "employee@example.com", 
          password: "employee123", 
          role: "employee", 
          active: true 
        },
      ];
      
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password && u.active
      );

      if (!user) {
        throw new Error("Credenciais inválidas");
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
      
      /* Em produção, use este código:
      const result = await executeQuery(
        'SELECT id, name, email, role, active FROM users WHERE email = ? AND password = ? AND active = true',
        [email, password]
      );
      
      if (!result || result.length === 0) {
        throw new Error("Credenciais inválidas");
      }
      
      return result[0] as User;
      */
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
};
