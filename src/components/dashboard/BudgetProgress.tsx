
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

export function BudgetProgress() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      const data = getFinancialData(user.id);
      setBudgets(data.budgets);
    }
  }, [user?.id]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            
            let statusColor = "bg-success-500";
            if (percentage > 75) statusColor = "bg-warning-500";
            if (percentage > 90) statusColor = "bg-destructive";
            
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{categoryMap[budget.category]}</div>
                  <div className="text-muted-foreground">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </div>
                </div>
                <Progress value={percentage} className={statusColor} />
                <div className="flex justify-between text-xs">
                  <div className="text-muted-foreground">{percentage}% used</div>
                  <div className="font-medium text-success-600">
                    {formatCurrency(remaining)} remaining
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
