
import { TimeEntry } from './types';
import { timeEntries, nextId } from './data/mockDatabase';

export const timeEntriesService = {
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
};
