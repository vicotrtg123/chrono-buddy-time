
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import DateRangePicker from "@/components/DateRangePicker";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInMinutes, parseISO } from "date-fns";
import { BarChart2 } from "lucide-react";

interface TimeEntry {
  id: number;
  user_id: number;
  entrada: string;
  saida: string | null;
  observacao: string | null;
}

interface User {
  id: number;
  name: string;
}

export default function Reports() {
  const { isAdmin } = useAuth();
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(1)) // First day of current month
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate())) // Today
  );
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [startDate, endDate, selectedUserId]);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Erro ao carregar usuários");
    }
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      const userId = selectedUserId !== "all" ? parseInt(selectedUserId) : undefined;
      const data = await api.getAllTimeEntries(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        userId
      );
      setEntries(data);
    } catch (error) {
      console.error("Failed to load time entries:", error);
      toast.error("Erro ao carregar registros de ponto");
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const calculateDuration = (entrada: string, saida: string | null) => {
    if (!saida) return "Em aberto";
    
    const mins = differenceInMinutes(new Date(saida), new Date(entrada));
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    
    return `${hours}h ${minutes}min`;
  };

  // Group entries by user
  const entriesByUser = entries.reduce((acc, entry) => {
    if (!acc[entry.user_id]) {
      acc[entry.user_id] = [];
    }
    acc[entry.user_id].push(entry);
    return acc;
  }, {} as Record<number, TimeEntry[]>);

  // Calculate total hours by user
  const totalHoursByUser = Object.entries(entriesByUser).map(([userId, userEntries]) => {
    const numUserId = parseInt(userId);
    const user = users.find(u => u.id === numUserId);
    
    let totalMinutes = 0;
    let completedEntries = 0;
    
    userEntries.forEach(entry => {
      if (entry.saida) {
        totalMinutes += differenceInMinutes(parseISO(entry.saida), parseISO(entry.entrada));
        completedEntries++;
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return {
      userId: numUserId,
      userName: user?.name || `Usuário #${userId}`,
      totalTime: `${hours}h ${minutes}min`,
      entryCount: completedEntries,
    };
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize relatórios de horas trabalhadas por funcionário
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <DateRangePicker onRangeChange={handleRangeChange} />
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Funcionário:</span>
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-medium">
                <BarChart2 className="mr-2" size={18} />
                Resumo de Horas por Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Carregando dados...</p>
                </div>
              ) : totalHoursByUser.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Nenhum registro encontrado no período selecionado
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Total de Horas</TableHead>
                      <TableHead>Registros Completos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {totalHoursByUser.map((userData) => (
                      <TableRow key={userData.userId}>
                        <TableCell>{userData.userName}</TableCell>
                        <TableCell>{userData.totalTime}</TableCell>
                        <TableCell>{userData.entryCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {selectedUserId !== "all" && !loading && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">
                  Detalhes dos Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Nenhum registro encontrado para este funcionário
                    </p>
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatDate(entry.entrada)}</TableCell>
                            <TableCell>{formatTime(entry.entrada)}</TableCell>
                            <TableCell>
                              {entry.saida ? formatTime(entry.saida) : "Em aberto"}
                            </TableCell>
                            <TableCell>
                              {calculateDuration(entry.entrada, entry.saida)}
                            </TableCell>
                            <TableCell>{entry.observacao || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
