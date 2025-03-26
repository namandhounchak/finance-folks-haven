
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFinancialData, categoryMap } from "@/utils/mockFinanceData";
import { useAuth } from "@/hooks/useAuth";
import { convertCurrency, formatCurrency, getUserCurrency } from "@/utils/currencyUtils";

export function BudgetProgress() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    if (user?.id) {
      const data = getFinancialData(user.id);
      setBudgets(data.budgets);
      
      // Get user currency preference
      const userCurrency = getUserCurrency(user.id);
      setCurrency(userCurrency);
      
      // Listen for currency changes
      const handleStorageChange = () => {
        const updatedCurrency = getUserCurrency(user.id);
        setCurrency(updatedCurrency);
      };
      
      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [user?.id]);

  return (
    <Card className="animate-scale-in stagger-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min(100, Math.round((budget.spent / budget.amount) * 100));
            const remaining = budget.amount - budget.spent;
            
            // Convert amounts to user's preferred currency
            const convertedSpent = convertCurrency(budget.spent, currency);
            const convertedAmount = convertCurrency(budget.amount, currency);
            const convertedRemaining = convertCurrency(remaining, currency);
            
            let statusColor = "bg-success-500";
            if (percentage > 75) statusColor = "bg-warning-500";
            if (percentage > 90) statusColor = "bg-destructive";
            
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{categoryMap[budget.category]}</div>
                  <div className="text-muted-foreground">
                    {formatCurrency(convertedSpent, currency)} / {formatCurrency(convertedAmount, currency)}
                  </div>
                </div>
                <Progress value={percentage} className={statusColor} />
                <div className="flex justify-between text-xs">
                  <div className="text-muted-foreground">{percentage}% used</div>
                  <div className="font-medium text-success-600">
                    {formatCurrency(convertedRemaining, currency)} remaining
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
