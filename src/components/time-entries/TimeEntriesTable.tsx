
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimeEntry } from "@/services/types";
import TimeEntryRow from "./TimeEntryRow";

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  onEditEntry: (entry: TimeEntry) => void;
}

export default function TimeEntriesTable({ entries, onEditEntry }: TimeEntriesTableProps) {
  if (entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum registro de ponto encontrado no período.</p>
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
