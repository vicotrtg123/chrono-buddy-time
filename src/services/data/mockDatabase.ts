
import { DatabaseUser, TimeEntry, EditRequest, NextIdCounter } from '../types';

// Memory database for development
export const users: DatabaseUser[] = [
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

export const timeEntries: TimeEntry[] = [
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

export const editRequests: EditRequest[] = [
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

export const nextId: NextIdCounter = {
  users: 3,
  timeEntries: 3,
  editRequests: 2,
};
