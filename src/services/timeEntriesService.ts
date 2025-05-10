
import { TimeEntry } from './types';
import { executeQuery } from './database/dbConnection';

export const timeEntriesService = {
  getTimeEntries: async (
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<TimeEntry[]> => {
    try {
      // Simulate network delay for development
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento (fallback temporário)
      const mockTimeEntries = [
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
      
      let entries = mockTimeEntries.filter((entry) => entry.user_id === userId);
      
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
      
      /* Em produção, use este código:
      let query = 'SELECT * FROM time_entries WHERE user_id = ?';
      const params: any[] = [userId];
      
      if (startDate) {
        query += ' AND DATE(entrada) >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        query += ' AND DATE(entrada) <= ?';
        params.push(endDate);
      }
      
      query += ' ORDER BY entrada DESC';
      
      const entries = await executeQuery(query, params);
      return entries as TimeEntry[];
      */
    } catch (error) {
      console.error("Error getting time entries:", error);
      throw error;
    }
  },

  getAllTimeEntries: async (
    startDate?: string,
    endDate?: string,
    userId?: number
  ): Promise<TimeEntry[]> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento (fallback temporário)
      const mockTimeEntries = [
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
      
      let entries = [...mockTimeEntries];
      
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
      
      /* Em produção, use este código:
      let query = 'SELECT * FROM time_entries WHERE 1=1';
      const params: any[] = [];
      
      if (userId) {
        query += ' AND user_id = ?';
        params.push(userId);
      }
      
      if (startDate) {
        query += ' AND DATE(entrada) >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        query += ' AND DATE(entrada) <= ?';
        params.push(endDate);
      }
      
      query += ' ORDER BY entrada DESC';
      
      const entries = await executeQuery(query, params);
      return entries as TimeEntry[];
      */
    } catch (error) {
      console.error("Error getting all time entries:", error);
      throw error;
    }
  },

  clockIn: async (userId: number, observacao?: string): Promise<TimeEntry> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
      const mockTimeEntries = [
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
      
      // Check for open entries
      const hasOpenEntry = mockTimeEntries.some(
        (entry) => entry.user_id === userId && entry.saida === null
      );
      
      if (hasOpenEntry) {
        throw new Error("Você já tem um ponto aberto. Feche-o antes de bater um novo ponto.");
      }
      
      // Create new entry
      const newEntry: TimeEntry = {
        id: mockTimeEntries.length + 1,
        user_id: userId,
        entrada: new Date().toISOString(),
        saida: null,
        observacao: observacao || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // In a real app, this would be stored in database
      mockTimeEntries.push(newEntry);
      
      return newEntry;
      
      /* Em produção, use este código:
      // Check for open entries
      const openEntries = await executeQuery(
        'SELECT id FROM time_entries WHERE user_id = ? AND saida IS NULL',
        [userId]
      );
      
      if (openEntries && openEntries.length > 0) {
        throw new Error("Você já tem um ponto aberto. Feche-o antes de bater um novo ponto.");
      }
      
      // Insert new entry
      const result = await executeQuery(
        'INSERT INTO time_entries (user_id, entrada, observacao) VALUES (?, ?, ?)',
        [userId, new Date().toISOString(), observacao || null]
      );
      
      const entryId = result.insertId;
      
      // Get the created entry
      const newEntry = await executeQuery(
        'SELECT * FROM time_entries WHERE id = ?',
        [entryId]
      );
      
      return newEntry[0] as TimeEntry;
      */
    } catch (error) {
      console.error("Error clocking in:", error);
      throw error;
    }
  },

  clockOut: async (
    entryId: number,
    userId: number,
    observacao?: string
  ): Promise<TimeEntry> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
      const mockTimeEntries = [
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
      
      const entryIndex = mockTimeEntries.findIndex(
        (entry) => entry.id === entryId && entry.user_id === userId
      );
      
      if (entryIndex === -1) {
        throw new Error("Ponto não encontrado");
      }
      
      if (mockTimeEntries[entryIndex].saida !== null) {
        throw new Error("Este ponto já foi fechado");
      }
      
      // Update entry with clock out time
      mockTimeEntries[entryIndex] = {
        ...mockTimeEntries[entryIndex],
        saida: new Date().toISOString(),
        observacao: observacao || mockTimeEntries[entryIndex].observacao,
        updated_at: new Date().toISOString(),
      };
      
      return mockTimeEntries[entryIndex];
      
      /* Em produção, use este código:
      // Check if entry exists and belongs to user
      const entry = await executeQuery(
        'SELECT * FROM time_entries WHERE id = ? AND user_id = ?',
        [entryId, userId]
      );
      
      if (!entry || entry.length === 0) {
        throw new Error("Ponto não encontrado");
      }
      
      if (entry[0].saida !== null) {
        throw new Error("Este ponto já foi fechado");
      }
      
      // Update with clock out time
      await executeQuery(
        'UPDATE time_entries SET saida = ?, observacao = COALESCE(?, observacao), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [new Date().toISOString(), observacao, entryId]
      );
      
      // Get updated entry
      const updatedEntry = await executeQuery(
        'SELECT * FROM time_entries WHERE id = ?',
        [entryId]
      );
      
      return updatedEntry[0] as TimeEntry;
      */
    } catch (error) {
      console.error("Error clocking out:", error);
      throw error;
    }
  },
};
