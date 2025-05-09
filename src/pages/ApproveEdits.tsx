
import Layout from "@/components/Layout";
import EditRequestsList from "@/components/EditRequestsList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ApproveEdits() {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Aprovação de Edições</h1>
          <p className="text-muted-foreground">
            Gerencie solicitações de edição de ponto dos funcionários
          </p>
        </div>

        <EditRequestsList />
      </div>
    </Layout>
  );
}
