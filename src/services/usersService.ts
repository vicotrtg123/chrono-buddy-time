
import { User } from '../contexts/AuthContext';
import { executeQuery } from './database/dbConnection';

export const usersService = {
  // User management (Admin only)
  getUsers: async (): Promise<User[]> => {
    try {
      // Simulate network delay for development
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento (fallback temporário)
      const mockUsers = [
        { 
          id: 1, 
          name: "Admin User", 
          email: "admin@example.com", 
          role: "admin", 
          active: true 
        },
        { 
          id: 2, 
          name: "Employee One", 
          email: "employee@example.com", 
          role: "employee", 
          active: true 
        },
      ];
      
      return mockUsers as User[];
      
      /* Em produção, use este código:
      const result = await executeQuery(
        'SELECT id, name, email, role, active FROM users',
        []
      );
      
      return result as User[];
      */
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  },

  createUser: async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee"
  ): Promise<User> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Durante o desenvolvimento, manteremos o modo de simulação
      // Em produção, ativar código real
      
      // Simulação para desenvolvimento
      const mockUsers = [
        { 
          id: 1, 
          name: "Admin User", 
          email: "admin@example.com", 
          role: "admin", 
          active: true 
        },
        { 
          id: 2, 
          name: "Employee One", 
          email: "employee@example.com", 
          role: "employee", 
          active: true 
        },
      ];
      
      // Check if email exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("Este e-mail já está em uso");
      }
      
      const newId = mockUsers.length + 1;
      const newUser = {
        id: newId,
        name,
        email,
        role,
        active: true
      };
      
      // Return user without password
      return newUser as User;
      
      /* Em produção, use este código:
      // Check if email already exists
      const existingUsers = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Este e-mail já está em uso");
      }
      
      // Insert new user
      const result = await executeQuery(
        'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, role, true]
      );
      
      const newUserId = result.insertId;
      
      // Get the created user
      const createdUser = await executeQuery(
        'SELECT id, name, email, role, active FROM users WHERE id = ?',
        [newUserId]
      );
      
      return createdUser[0] as User;
      */
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (
    userId: number,
    data: { name?: string; email?: string; active?: boolean }
  ): Promise<User> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
      const mockUsers = [
        { 
          id: 1, 
          name: "Admin User", 
          email: "admin@example.com", 
          role: "admin", 
          active: true 
        },
        { 
          id: 2, 
          name: "Employee One", 
          email: "employee@example.com", 
          role: "employee", 
          active: true 
        },
      ];
      
      const userIndex = mockUsers.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      // Check email uniqueness
      if (data.email && data.email !== mockUsers[userIndex].email) {
        if (mockUsers.some((u) => u.email === data.email)) {
          throw new Error("Este e-mail já está em uso");
        }
      }
      
      // Update user data
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data
      };
      
      return mockUsers[userIndex] as User;
      
      /* Em produção, use este código:
      // Check if user exists
      const userExists = await executeQuery(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );
      
      if (!userExists || userExists.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      
      // Check email uniqueness if changing email
      if (data.email) {
        const existingEmail = await executeQuery(
          'SELECT id FROM users WHERE email = ? AND id <> ?',
          [data.email, userId]
        );
        
        if (existingEmail && existingEmail.length > 0) {
          throw new Error("Este e-mail já está em uso");
        }
      }
      
      // Prepare update fields
      const updateFields = [];
      const updateValues = [];
      
      if (data.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(data.name);
      }
      
      if (data.email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(data.email);
      }
      
      if (data.active !== undefined) {
        updateFields.push('active = ?');
        updateValues.push(data.active);
      }
      
      updateValues.push(userId);
      
      // Update user
      await executeQuery(
        `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );
      
      // Get updated user
      const updatedUser = await executeQuery(
        'SELECT id, name, email, role, active FROM users WHERE id = ?',
        [userId]
      );
      
      return updatedUser[0] as User;
      */
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  changePassword: async (
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
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
      
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      if (user.password !== currentPassword) {
        throw new Error("Senha atual incorreta");
      }
      
      // Aqui seria atualizada a senha, mas na simulação apenas retornamos true
      return true;
      
      /* Em produção, use este código:
      // Verify current password
      const user = await executeQuery(
        'SELECT id FROM users WHERE id = ? AND password = ?',
        [userId, currentPassword]
      );
      
      if (!user || user.length === 0) {
        throw new Error("Usuário não encontrado ou senha atual incorreta");
      }
      
      // Update password
      await executeQuery(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPassword, userId]
      );
      
      return true;
      */
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};
