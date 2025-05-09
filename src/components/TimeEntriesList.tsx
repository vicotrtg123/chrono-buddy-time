
import { useState, useEffect } from "react";
import { format, parseISO, differenceInMinutes } from "date-fns";
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
import { Calendar, Clock, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/services/api";

interface TimeEntry {
  id: number;
  user_id: number;
  entrada: string;
  saida: string | null;
  observacao: string | null;
}

interface TimeEntriesListProps {
  userId: number;
  startDate?: string;
  endDate?: string;
  onRefresh?: () => void;
}

export default function TimeEntriesList({
  userId,
  startDate,
  endDate,
  onRefresh,
}: TimeEntriesListProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [newEntrada, setNewEntrada] = useState("");
  const [newSaida, setNewSaida] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [userId, startDate, endDate]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await api.getTimeEntries(userId, startDate, endDate);
      setEntries(data);
    } catch (error) {
      console.error("Failed to load time entries:", error);
      toast.error("Erro ao carregar registros de ponto");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: pt });
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "HH:mm", { locale: pt });
  };

  const calculateDuration = (entrada: string, saida: string | null) => {
    if (!saida) return "Em aberto";
    
    const mins = differenceInMinutes(parseISO(saida), parseISO(entrada));
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    
    return `${hours}h ${minutes}min`;
  };

  const handleOpenEditDialog = (entry: TimeEntry) => {
    if (!entry.saida) {
      toast.error("Não é possível editar um ponto que ainda não foi fechado");
      return;
    }
    
    setSelectedEntry(entry);
    setNewEntrada(format(parseISO(entry.entrada), "yyyy-MM-dd'T'HH:mm"));
    setNewSaida(entry.saida ? format(parseISO(entry.saida), "yyyy-MM-dd'T'HH:mm") : "");
    setEditDialogOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!selectedEntry || !editReason.trim()) {
      toast.error("Por favor, informe o motivo da edição");
      return;
    }

    setSubmitting(true);
    try {
      await api.requestEditTimeEntry(
        selectedEntry.id,
        userId,
        newEntrada,
        newSaida,
        editReason
      );
      
      toast.success("Solicitação de edição enviada com sucesso!");
      setEditDialogOpen(false);
      setEditReason("");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error submitting edit request:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar edição");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalHours = () => {
    let totalMinutes = 0;
    
    entries.forEach(entry => {
      if (entry.saida) {
        totalMinutes += differenceInMinutes(
          parseISO(entry.saida),
          parseISO(entry.entrada)
        );
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}min`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <p>Carregando registros...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="p-4 bg-muted">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="mr-2" size={18} />
              Registros de Ponto
            </h3>
            <div className="text-sm font-medium">
              Total de horas no período: <span className="text-primary">{calculateTotalHours()}</span>
            </div>
          </div>
        </div>
        
        {entries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum registro de ponto encontrado no período.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {formatDate(entry.entrada)}
                    </TableCell>
                    <TableCell>
                      {formatTime(entry.entrada)}
                    </TableCell>
                    <TableCell>
                      {entry.saida ? (
                        formatTime(entry.saida)
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Em aberto
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {calculateDuration(entry.entrada, entry.saida)}
                    </TableCell>
                    <TableCell>
                      {entry.observacao ? entry.observacao : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenEditDialog(entry)}
                        disabled={!entry.saida}
                      >
                        <Pencil size={14} className="mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicitar Edição de Ponto</DialogTitle>
            <DialogDescription>
              Essa solicitação precisará ser aprovada por um administrador.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="entrada" className="text-sm font-medium">
                  Nova Entrada
                </label>
                <input
                  id="entrada"
                  type="datetime-local"
                  value={newEntrada}
                  onChange={(e) => setNewEntrada(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="saida" className="text-sm font-medium">
                  Nova Saída
                </label>
                <input
                  id="saida"
                  type="datetime-local"
                  value={newSaida}
                  onChange={(e) => setNewSaida(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Motivo da Edição <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Explique o motivo da edição..."
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitEdit} 
              disabled={submitting || !editReason.trim()}
            >
              {submitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
