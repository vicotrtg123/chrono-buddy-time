
import { differenceInMinutes, format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { TimeEntry } from "@/services/types";

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: pt });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), "HH:mm", { locale: pt });
  } catch (error) {
    console.error("Error formatting time:", error);
    return dateString;
  }
};

export const calculateDuration = (entrada: string, saida: string | null) => {
  if (!saida) return "Em aberto";
  
  try {
    const mins = differenceInMinutes(parseISO(saida), parseISO(entrada));
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    
    return `${hours}h ${minutes}min`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "Erro no cálculo";
  }
};

export const calculateTotalHours = (entries: TimeEntry[]) => {
  try {
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
  } catch (error) {
    console.error("Error calculating total hours:", error);
    return "Erro no cálculo";
  }
};
