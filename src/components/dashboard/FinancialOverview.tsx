
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFinancialData } from "@/utils/mockFinanceData";
import { useAuth } from "@/hooks/useAuth";

export function FinancialOverview() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const financialData = getFinancialData(userId);

  // Calculate percentage changes
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const balanceChange = getPercentageChange(financialData.balance, financialData.lastMonthBalance);
  const incomeChange = getPercentageChange(financialData.income, financialData.lastMonthIncome);
  const expensesChange = getPercentageChange(financialData.expenses, financialData.lastMonthExpenses);
  const savingsChange = getPercentageChange(financialData.savings, financialData.lastMonthSavings);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Badge component for changes
  const ChangeBadge = ({ percentage }: { percentage: number }) => {
    const isPositive = percentage > 0;
    const isNeutral = percentage === 0;
    
    let bgColor = isNeutral 
      ? "bg-gray-100 text-gray-600" 
      : isPositive 
        ? "bg-success-50 text-success-600" 
        : "bg-red-50 text-red-600";
    
    // For expenses, we invert the colors (down is good)
    if (percentage === expensesChange) {
      bgColor = isNeutral 
        ? "bg-gray-100 text-gray-600" 
        : !isPositive 
          ? "bg-success-50 text-success-600" 
          : "bg-red-50 text-red-600";
    }
    
    return (
      <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${bgColor}`}>
        {!isNeutral && (
          isPositive ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : (
            <ArrowDownIcon className="h-3 w-3" />
          )
        )}
        <span>{Math.abs(percentage)}%</span>
      </div>
    );
  };

  const items = [
    {
      title: "Balance",
      amount: formatCurrency(financialData.balance),
      change: balanceChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      stagger: "stagger-1",
    },
    {
      title: "Income",
      amount: formatCurrency(financialData.income),
      change: incomeChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      stagger: "stagger-2",
    },
    {
      title: "Expenses",
      amount: formatCurrency(financialData.expenses),
      change: expensesChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-rose-500 to-rose-600",
      stagger: "stagger-3",
    },
    {
      title: "Savings",
      amount: formatCurrency(financialData.savings),
      change: savingsChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-amber-500 to-amber-600",
      stagger: "stagger-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className={`overflow-hidden animate-scale-in ${item.stagger}`}>
          <div className={`h-2 ${item.bgColor}`} />
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{item.amount}</div>
              <ChangeBadge percentage={item.change} />
            </div>
            <CardDescription className="mt-2 text-xs">
              {item.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
