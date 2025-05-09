
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";
import { TimeEntry } from "@/services/types";
import { formatTime, formatDate } from "@/utils/timeFormatters";
import { format, parseISO } from "date-fns";

interface EditTimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntry: TimeEntry | null;
  userId: number;
  onSuccess: () => void;
}

export default function EditTimeEntryDialog({
  open,
  onOpenChange,
  selectedEntry,
  userId,
  onSuccess,
}: EditTimeEntryDialogProps) {
  const [editReason, setEditReason] = useState("");
  const [newEntrada, setNewEntrada] = useState("");
  const [newSaida, setNewSaida] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens with new entry
  useEffect(() => {
    if (selectedEntry && open) {
      setNewEntrada(
        selectedEntry.entrada 
          ? format(parseISO(selectedEntry.entrada), "yyyy-MM-dd'T'HH:mm")
          : ""
      );
      setNewSaida(
        selectedEntry.saida 
          ? format(parseISO(selectedEntry.saida), "yyyy-MM-dd'T'HH:mm")
          : ""
      );
      setEditReason("");
    }
  }, [selectedEntry, open]);

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
      onOpenChange(false);
      setEditReason("");
      onSuccess();
    } catch (error) {
      console.error("Error submitting edit request:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar edição");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
}
