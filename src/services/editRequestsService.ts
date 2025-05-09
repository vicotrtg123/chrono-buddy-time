
import { EditRequest } from './types';
import { editRequests, nextId, timeEntries } from './data/mockDatabase';

export const editRequestsService = {
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
};
