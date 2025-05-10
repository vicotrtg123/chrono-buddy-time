
import { EditRequest } from './types';
import { executeQuery } from './database/dbConnection';

export const editRequestsService = {
  requestEditTimeEntry: async (
    pontoId: number,
    userId: number,
    novaEntrada: string,
    novaSaida: string,
    observacaoMotivo: string
  ): Promise<EditRequest> => {
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
      
      const mockEditRequests = [
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
      
      const entry = mockTimeEntries.find(
        (entry) => entry.id === pontoId && entry.user_id === userId
      );
      
      if (!entry) {
        throw new Error("Ponto não encontrado");
      }
      
      if (entry.saida === null) {
        throw new Error("Não é possível editar um ponto que ainda não foi fechado");
      }
      
      // Create new edit request
      const newRequest: EditRequest = {
        id: mockEditRequests.length + 1,
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
      
      // In a real app, this would be stored in database
      mockEditRequests.push(newRequest);
      
      return newRequest;
      
      /* Em produção, use este código:
      // Check if entry exists and belongs to user
      const entry = await executeQuery(
        'SELECT * FROM time_entries WHERE id = ? AND user_id = ?',
        [pontoId, userId]
      );
      
      if (!entry || entry.length === 0) {
        throw new Error("Ponto não encontrado");
      }
      
      if (entry[0].saida === null) {
        throw new Error("Não é possível editar um ponto que ainda não foi fechado");
      }
      
      // Create edit request
      const result = await executeQuery(
        `INSERT INTO edit_requests 
         (ponto_id, user_id, nova_entrada, nova_saida, observacao_motivo) 
         VALUES (?, ?, ?, ?, ?)`,
        [pontoId, userId, novaEntrada, novaSaida, observacaoMotivo]
      );
      
      const requestId = result.insertId;
      
      // Get the created request
      const newRequest = await executeQuery(
        'SELECT * FROM edit_requests WHERE id = ?',
        [requestId]
      );
      
      return newRequest[0] as EditRequest;
      */
    } catch (error) {
      console.error("Error requesting edit:", error);
      throw error;
    }
  },

  getEditRequests: async (
    status?: "pending" | "approved" | "rejected"
  ): Promise<EditRequest[]> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
      const mockEditRequests = [
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
      
      let requests = [...mockEditRequests];
      
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
      
      /* Em produção, use este código:
      let query = 'SELECT * FROM edit_requests WHERE 1=1';
      const params: any[] = [];
      
      if (status === "pending") {
        query += ' AND aprovado IS NULL';
      } else if (status === "approved") {
        query += ' AND aprovado = true';
      } else if (status === "rejected") {
        query += ' AND aprovado = false';
      }
      
      query += ' ORDER BY created_at DESC';
      
      const requests = await executeQuery(query, params);
      return requests as EditRequest[];
      */
    } catch (error) {
      console.error("Error getting edit requests:", error);
      throw error;
    }
  },

  approveEditRequest: async (
    requestId: number,
    adminId: number,
    approved: boolean
  ): Promise<EditRequest> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Simulação para desenvolvimento
      const mockEditRequests = [
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
      ];
      
      const requestIndex = mockEditRequests.findIndex((req) => req.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error("Solicitação não encontrada");
      }
      
      if (mockEditRequests[requestIndex].aprovado !== null) {
        throw new Error("Esta solicitação já foi processada");
      }
      
      // Update the request
      mockEditRequests[requestIndex] = {
        ...mockEditRequests[requestIndex],
        aprovado: approved,
        aprovado_por: adminId,
        data_aprovacao: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // If approved, update the time entry
      if (approved) {
        const entryIndex = mockTimeEntries.findIndex(
          (entry) => entry.id === mockEditRequests[requestIndex].ponto_id
        );
        
        if (entryIndex !== -1) {
          mockTimeEntries[entryIndex] = {
            ...mockTimeEntries[entryIndex],
            entrada: mockEditRequests[requestIndex].nova_entrada,
            saida: mockEditRequests[requestIndex].nova_saida,
            updated_at: new Date().toISOString(),
          };
        }
      }
      
      return mockEditRequests[requestIndex];
      
      /* Em produção, use este código:
      // Check if request exists
      const request = await executeQuery(
        'SELECT * FROM edit_requests WHERE id = ?',
        [requestId]
      );
      
      if (!request || request.length === 0) {
        throw new Error("Solicitação não encontrada");
      }
      
      if (request[0].aprovado !== null) {
        throw new Error("Esta solicitação já foi processada");
      }
      
      const dataAprovacao = new Date().toISOString();
      
      // Update request status
      await executeQuery(
        'UPDATE edit_requests SET aprovado = ?, aprovado_por = ?, data_aprovacao = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [approved, adminId, dataAprovacao, requestId]
      );
      
      // If approved, update the time entry
      if (approved) {
        await executeQuery(
          'UPDATE time_entries SET entrada = ?, saida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [request[0].nova_entrada, request[0].nova_saida, request[0].ponto_id]
        );
      }
      
      // Get the updated request
      const updatedRequest = await executeQuery(
        'SELECT * FROM edit_requests WHERE id = ?',
        [requestId]
      );
      
      return updatedRequest[0] as EditRequest;
      */
    } catch (error) {
      console.error("Error approving edit request:", error);
      throw error;
    }
  },
};
