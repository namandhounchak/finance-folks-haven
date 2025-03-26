
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFinancialData } from "@/utils/mockFinanceData";
import { useAuth } from "@/hooks/useAuth";
import { convertCurrency, formatCurrency, getUserCurrency } from "@/utils/currencyUtils";

export function FinancialGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    if (user?.id) {
      const data = getFinancialData(user.id);
      setGoals(data.goals);
      
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

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="animate-scale-in stagger-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Financial Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isUrgent = daysRemaining < 30;
            
            // Convert amounts to user's preferred currency
            const convertedCurrentAmount = convertCurrency(goal.currentAmount, currency);
            const convertedTargetAmount = convertCurrency(goal.targetAmount, currency);
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium">{goal.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(convertedCurrentAmount, currency)} of {formatCurrency(convertedTargetAmount, currency)}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                    {daysRemaining} days left
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {percentage}% completed
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
