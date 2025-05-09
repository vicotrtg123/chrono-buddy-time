
import { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import TimeEntriesList from "@/components/TimeEntriesList";
import DateRangePicker from "@/components/DateRangePicker";
import { useAuth } from "@/contexts/AuthContext";

export default function History() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(1)) // First day of current month
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate())) // Today
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Histórico de Pontos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus registros de ponto
          </p>
        </div>

        <div className="mb-6">
          <DateRangePicker onRangeChange={handleRangeChange} />
        </div>

        {user && (
          <TimeEntriesList
            key={refreshKey}
            userId={user.id}
            startDate={format(startDate, "yyyy-MM-dd")}
            endDate={format(endDate, "yyyy-MM-dd")}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </Layout>
  );
}
