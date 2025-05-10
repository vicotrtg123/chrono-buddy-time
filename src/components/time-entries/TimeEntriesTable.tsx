
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimeEntry } from "@/services/types";
import TimeEntryRow from "./TimeEntryRow";
import { AlertCircle } from "lucide-react";

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  onEditEntry: (entry: TimeEntry) => void;
}

export default function TimeEntriesTable({ entries, onEditEntry }: TimeEntriesTableProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum registro de ponto encontrado no período.</p>
      </div>
    );
  }

  // Validar se há alguma entrada com erro de formatação
  const hasInvalidEntries = entries.some(entry => 
    !entry.entrada || (entry.saida && new Date(entry.saida) < new Date(entry.entrada))
  );

  if (hasInvalidEntries) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md flex items-center">
        <AlertCircle className="text-yellow-600 mr-2" size={20} />
        <p className="text-yellow-700">
          Alguns registros contêm dados inválidos. Por favor, contate o administrador do sistema.
        </p>
      </div>
    );
  }

  return (
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
            <TimeEntryRow 
              key={entry.id} 
              entry={entry} 
              onEdit={onEditEntry} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
