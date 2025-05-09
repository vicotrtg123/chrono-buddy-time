
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { TimeEntry } from "@/services/types";
import { formatDate, formatTime, calculateDuration } from "@/utils/timeFormatters";

interface TimeEntryRowProps {
  entry: TimeEntry;
  onEdit: (entry: TimeEntry) => void;
}

export default function TimeEntryRow({ entry, onEdit }: TimeEntryRowProps) {
  return (
    <TableRow>
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
          onClick={() => onEdit(entry)}
          disabled={!entry.saida}
        >
          <Pencil size={14} className="mr-1" />
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
}
