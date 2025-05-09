
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { TimeEntry } from "@/services/types";
import TimeEntriesTable from "./time-entries/TimeEntriesTable";
import EditTimeEntryDialog from "./time-entries/EditTimeEntryDialog";
import { calculateTotalHours } from "@/utils/timeFormatters";

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

  const handleOpenEditDialog = (entry: TimeEntry) => {
    if (!entry.saida) {
      toast.error("Não é possível editar um ponto que ainda não foi fechado");
      return;
    }
    
    setSelectedEntry(entry);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    loadEntries(); // Refresh the list after edit request
    if (onRefresh) onRefresh();
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
              Total de horas no período: <span className="text-primary">{calculateTotalHours(entries)}</span>
            </div>
          </div>
        </div>
        
        <TimeEntriesTable entries={entries} onEditEntry={handleOpenEditDialog} />
      </Card>

      <EditTimeEntryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedEntry={selectedEntry}
        userId={userId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
