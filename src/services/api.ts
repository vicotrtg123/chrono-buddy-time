
import { User } from '../contexts/AuthContext';

// Mock database tables
interface TimeEntry {
  id: number;
  user_id: number;
  entrada: string;
  saida: string | null;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

interface EditRequest {
  id: number;
  ponto_id: number;
  user_id: number;
  nova_entrada: string;
  nova_saida: string;
  observacao_motivo: string;
  aprovado: boolean | null;
  aprovado_por: number | null;
  data_aprovacao: string | null;
  created_at: string;
  updated_at: string;
}

// Memory database for development
let users: Array<{
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  active: boolean;
  created_at: string;
  updated_at: string;
}> = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Employee One",
    email: "employee@example.com",
    password: "employee123",
    role: "employee",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let timeEntries: TimeEntry[] = [
  {
    id: 1,
    user_id: 2,
    entrada: "2023-05-08T09:00:00.000Z",
    saida: "2023-05-08T17:00:00.000Z",
    observacao: "Dia normal de trabalho",
    created_at: "2023-05-08T09:00:00.000Z",
    updated_at: "2023-05-08T17:00:00.000Z",
  },
  {
    id: 2,
    user_id: 2,
    entrada: "2023-05-09T08:45:00.000Z",
    saida: "2023-05-09T16:30:00.000Z",
    observacao: null,
    created_at: "2023-05-09T08:45:00.000Z",
    updated_at: "2023-05-09T16:30:00.000Z",
  },
];

let editRequests: EditRequest[] = [
  {
    id: 1,
    ponto_id: 1,
    user_id: 2,
    nova_entrada: "2023-05-08T08:30:00.000Z",
    nova_saida: "2023-05-08T17:30:00.000Z",
    observacao_motivo: "Esqueci de bater o ponto na entrada correta",
    aprovado: null,
    aprovado_por: null,
    data_aprovacao: null,
    created_at: "2023-05-09T10:00:00.000Z",
    updated_at: "2023-05-09T10:00:00.000Z",
  },
];

let nextId = {
  users: 3,
  timeEntries: 3,
  editRequests: 2,
};

// API mock functions
export const api = {
  // Auth
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

  // Time entries
  getTimeEntries: async (
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<TimeEntry[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let entries = timeEntries.filter((entry) => entry.user_id === userId);

    if (startDate) {
      entries = entries.filter(
        (entry) => new Date(entry.entrada) >= new Date(startDate)
      );
    }

    if (endDate) {
      entries = entries.filter(
        (entry) => new Date(entry.entrada) <= new Date(endDate)
      );
    }

    return entries.sort(
      (a, b) => new Date(b.entrada).getTime() - new Date(a.entrada).getTime()
    );
  },

  getAllTimeEntries: async (
    startDate?: string,
    endDate?: string,
    userId?: number
  ): Promise<TimeEntry[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let entries = [...timeEntries];

    if (userId) {
      entries = entries.filter((entry) => entry.user_id === userId);
    }

    if (startDate) {
      entries = entries.filter(
        (entry) => new Date(entry.entrada) >= new Date(startDate)
      );
    }

    if (endDate) {
      entries = entries.filter(
        (entry) => new Date(entry.entrada) <= new Date(endDate)
      );
    }

    return entries.sort(
      (a, b) => new Date(b.entrada).getTime() - new Date(a.entrada).getTime()
    );
  },

  clockIn: async (userId: number, observacao?: string): Promise<TimeEntry> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if there's an open entry (without saida)
    const hasOpenEntry = timeEntries.some(
      (entry) => entry.user_id === userId && entry.saida === null
    );

    if (hasOpenEntry) {
      throw new Error("Você já tem um ponto aberto. Feche-o antes de bater um novo ponto.");
    }

    const newEntry: TimeEntry = {
      id: nextId.timeEntries++,
      user_id: userId,
      entrada: new Date().toISOString(),
      saida: null,
      observacao: observacao || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    timeEntries.push(newEntry);
    return newEntry;
  },

  clockOut: async (
    entryId: number,
    userId: number,
    observacao?: string
  ): Promise<TimeEntry> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const entryIndex = timeEntries.findIndex(
      (entry) => entry.id === entryId && entry.user_id === userId
    );

    if (entryIndex === -1) {
      throw new Error("Ponto não encontrado");
    }

    if (timeEntries[entryIndex].saida !== null) {
      throw new Error("Este ponto já foi fechado");
    }

    timeEntries[entryIndex] = {
      ...timeEntries[entryIndex],
      saida: new Date().toISOString(),
      observacao: observacao || timeEntries[entryIndex].observacao,
      updated_at: new Date().toISOString(),
    };

    return timeEntries[entryIndex];
  },

  requestEditTimeEntry: async (
    pontoId: number,
    userId: number,
    novaEntrada: string,
    novaSaida: string,
    observacaoMotivo: string
  ): Promise<EditRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const entry = timeEntries.find(
      (entry) => entry.id === pontoId && entry.user_id === userId
    );

    if (!entry) {
      throw new Error("Ponto não encontrado");
    }

    if (entry.saida === null) {
      throw new Error("Não é possível editar um ponto que ainda não foi fechado");
    }

    const newRequest: EditRequest = {
      id: nextId.editRequests++,
      ponto_id: pontoId,
      user_id: userId,
      nova_entrada: novaEntrada,
      nova_saida: novaSaida,
      observacao_motivo: observacaoMotivo,
      aprovado: null,
      aprovado_por: null,
      data_aprovacao: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    editRequests.push(newRequest);
    return newRequest;
  },

  getEditRequests: async (
    status?: "pending" | "approved" | "rejected"
  ): Promise<EditRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let requests = [...editRequests];

    if (status === "pending") {
      requests = requests.filter((req) => req.aprovado === null);
    } else if (status === "approved") {
      requests = requests.filter((req) => req.aprovado === true);
    } else if (status === "rejected") {
      requests = requests.filter((req) => req.aprovado === false);
    }

    return requests.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  approveEditRequest: async (
    requestId: number,
    adminId: number,
    approved: boolean
  ): Promise<EditRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const requestIndex = editRequests.findIndex((req) => req.id === requestId);

    if (requestIndex === -1) {
      throw new Error("Solicitação não encontrada");
    }

    if (editRequests[requestIndex].aprovado !== null) {
      throw new Error("Esta solicitação já foi processada");
    }

    // Update the request
    editRequests[requestIndex] = {
      ...editRequests[requestIndex],
      aprovado: approved,
      aprovado_por: adminId,
      data_aprovacao: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If approved, update the time entry
    if (approved) {
      const entryIndex = timeEntries.findIndex(
        (entry) => entry.id === editRequests[requestIndex].ponto_id
      );

      if (entryIndex !== -1) {
        timeEntries[entryIndex] = {
          ...timeEntries[entryIndex],
          entrada: editRequests[requestIndex].nova_entrada,
          saida: editRequests[requestIndex].nova_saida,
          updated_at: new Date().toISOString(),
        };
      }
    }

    return editRequests[requestIndex];
  },

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
