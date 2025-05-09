
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface User {
  id: number;
  name: string;
}

export default function EditRequestsList() {
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EditRequest | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadRequests();
    loadUsers();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Load pending requests by default
      const data = await api.getEditRequests("pending");
      setRequests(data);
    } catch (error) {
      console.error("Failed to load edit requests:", error);
      toast.error("Erro ao carregar solicitações de edição");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await api.getUsers();
      const usersMap: Record<number, User> = {};
      usersData.forEach((user) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: pt });
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "HH:mm", { locale: pt });
  };

  const handleRequestAction = async (requestId: number, approve: boolean) => {
    if (!user) return;
    
    setProcessingAction(true);
    try {
      await api.approveEditRequest(requestId, user.id, approve);
      toast.success(
        approve ? "Solicitação aprovada com sucesso!" : "Solicitação recusada com sucesso!"
      );
      setDetailDialogOpen(false);
      loadRequests(); // Reload after action
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao processar solicitação");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleViewDetails = (request: EditRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <p>Carregando solicitações...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="p-4 bg-muted">
          <div className="flex items-center">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="mr-2" size={18} />
              Solicitações Pendentes
            </h3>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma solicitação pendente encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Solicitação</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Nova Entrada</TableHead>
                  <TableHead>Nova Saída</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {formatDate(request.created_at)}
                    </TableCell>
                    <TableCell>
                      {users[request.user_id]?.name || `Usuário #${request.user_id}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(request.nova_entrada)} {formatTime(request.nova_entrada)}
                    </TableCell>
                    <TableCell>
                      {formatDate(request.nova_saida)} {formatTime(request.nova_saida)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pendente
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        {selectedRequest && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação</DialogTitle>
              <DialogDescription>
                Revise os detalhes da solicitação antes de aprovar ou recusar.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funcionário:</p>
                  <p className="font-medium">
                    {users[selectedRequest.user_id]?.name || `Usuário #${selectedRequest.user_id}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data da Solicitação:</p>
                  <p className="font-medium">
                    {formatDate(selectedRequest.created_at)} {formatTime(selectedRequest.created_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nova Entrada:</p>
                  <p className="font-medium">
                    {formatDate(selectedRequest.nova_entrada)} {formatTime(selectedRequest.nova_entrada)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nova Saída:</p>
                  <p className="font-medium">
                    {formatDate(selectedRequest.nova_saida)} {formatTime(selectedRequest.nova_saida)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Motivo da Edição:</p>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p>{selectedRequest.observacao_motivo}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="destructive" 
                onClick={() => handleRequestAction(selectedRequest.id, false)}
                disabled={processingAction}
              >
                <X className="mr-2 h-4 w-4" />
                Recusar
              </Button>
              <Button 
                variant="default"
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => handleRequestAction(selectedRequest.id, true)}
                disabled={processingAction}
              >
                <Check className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
