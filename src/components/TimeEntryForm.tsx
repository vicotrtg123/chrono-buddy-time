
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TimeEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isClockingIn, setIsClockingIn] = useState(true);
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeEntry, setActiveEntry] = useState<{ id: number; entrada: string } | null>(null);
  const { user } = useAuth();

  // Check for active entry on component mount
  useState(() => {
    const checkActiveEntry = async () => {
      if (!user) return;
      
      try {
        const entries = await api.getTimeEntries(user.id);
        const openEntry = entries.find(entry => entry.saida === null);
        
        if (openEntry) {
          setActiveEntry({ id: openEntry.id, entrada: openEntry.entrada });
          setIsClockingIn(false);
        }
      } catch (error) {
        console.error("Error checking active entry:", error);
      }
    };
    
    checkActiveEntry();
  });

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isClockingIn) {
        const result = await api.clockIn(user.id, observation);
        toast.success("Ponto de entrada registrado com sucesso!");
        setActiveEntry({ id: result.id, entrada: result.entrada });
        setIsClockingIn(false);
      } else if (activeEntry) {
        await api.clockOut(activeEntry.id, user.id, observation);
        toast.success("Ponto de saída registrado com sucesso!");
        setActiveEntry(null);
        setIsClockingIn(true);
      }
      
      setObservation("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error registering time:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao registrar o ponto");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Registro de Ponto</CardTitle>
        <CardDescription>
          {isClockingIn 
            ? "Registre seu horário de entrada"
            : "Registre seu horário de saída"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activeEntry && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-medium">Ponto ativo desde:</p>
              <p className="text-2xl font-bold">{formatTime(activeEntry.entrada)}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="observation" className="block mb-2 text-sm font-medium">
                Observação (opcional)
              </label>
              <Textarea
                id="observation"
                placeholder="Adicione uma observação se necessário..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                "Processando..."
              ) : (
                <>
                  <Clock className="mr-2" size={20} />
                  {isClockingIn ? "Registrar Entrada" : "Registrar Saída"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
