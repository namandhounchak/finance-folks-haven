
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";

const Accounts = () => {
  const { user, loading } = useAuth();

  // If not logged in, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Accounts</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This is the accounts page where you will be able to manage your financial accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
