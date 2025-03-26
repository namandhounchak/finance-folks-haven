
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Greeting } from "@/components/dashboard/Greeting";
import { Search } from "@/components/dashboard/Search";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ExpenseCategories } from "@/components/dashboard/ExpenseCategories";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { FinancialGoals } from "@/components/dashboard/FinancialGoals";
import { UncategorizedTransactions } from "@/components/dashboard/UncategorizedTransactions";

const Dashboard = () => {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Greeting />
          <Search />
        </div>

        {/* Overview Cards */}
        <section className="mb-8">
          <FinancialOverview />
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ExpenseCategories />
            <BudgetProgress />
          </div>
          <div className="space-y-6">
            <FinancialGoals />
            <UncategorizedTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
