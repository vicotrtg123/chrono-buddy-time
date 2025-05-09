
import { differenceInMinutes, format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { TimeEntry } from "@/services/types";

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "dd/MM/yyyy", { locale: pt });
};

export const formatTime = (dateString: string) => {
  return format(parseISO(dateString), "HH:mm", { locale: pt });
};

export const calculateDuration = (entrada: string, saida: string | null) => {
  if (!saida) return "Em aberto";
  
  const mins = differenceInMinutes(parseISO(saida), parseISO(entrada));
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  
  return `${hours}h ${minutes}min`;
};

export const calculateTotalHours = (entries: TimeEntry[]) => {
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
