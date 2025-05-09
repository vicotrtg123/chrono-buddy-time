
import { User } from '../../contexts/AuthContext';

// Database types
export interface TimeEntry {
  id: number;
  user_id: number;
  entrada: string;
  saida: string | null;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface EditRequest {
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

export interface DatabaseUser extends User {
  password: string;
  created_at: string;
  updated_at: string;
}

// IDs counter
export interface NextIdCounter {
  users: number;
  timeEntries: number;
  editRequests: number;
}
