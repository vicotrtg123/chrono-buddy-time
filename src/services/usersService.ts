
import { User } from '../contexts/AuthContext';
import { users, nextId } from './data/mockDatabase';

export const usersService = {
  // User management (Admin only)
  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return users.map(({ password, ...user }) => user as User);
  },

  createUser: async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "employee"
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      throw new Error("Este e-mail já está em uso");
    }

    const newUser = {
      id: nextId.users++,
      name,
      email,
      password,
      role,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  updateUser: async (
    userId: number,
    data: { name?: string; email?: string; active?: boolean }
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    // Check if email already exists and is not from the same user
    if (
      data.email &&
      data.email !== users[userIndex].email &&
      users.some((u) => u.email === data.email)
    ) {
      throw new Error("Este e-mail já está em uso");
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword as User;
  },

  changePassword: async (
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    if (users[userIndex].password !== currentPassword) {
      throw new Error("Senha atual incorreta");
    }

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword,
      updated_at: new Date().toISOString(),
    };

    return true;
  },
};
