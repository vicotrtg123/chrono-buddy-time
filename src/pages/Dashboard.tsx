
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import TimeEntryForm from "@/components/TimeEntryForm";
import TimeEntriesList from "@/components/TimeEntriesList";
import DateRangePicker from "@/components/DateRangePicker";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
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
          <h1 className="text-3xl font-bold mb-2">Ponto Digital</h1>
          <p className="text-muted-foreground">
            Registre seus pontos e acompanhe seu histórico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TimeEntryForm onSuccess={handleRefresh} />
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pontos</CardTitle>
                <CardDescription>
                  Visualize e gerencie seus registros de ponto
                </CardDescription>
                <div className="mt-4">
                  <DateRangePicker onRangeChange={handleRangeChange} />
                </div>
              </CardHeader>
              <CardContent>
                {user && (
                  <TimeEntriesList
                    key={refreshKey}
                    userId={user.id}
                    startDate={format(startDate, "yyyy-MM-dd")}
                    endDate={format(endDate, "yyyy-MM-dd")}
                    onRefresh={handleRefresh}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
