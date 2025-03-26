
import { useEffect, useState } from "react";
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
import { convertCurrency, formatCurrency, getUserCurrency } from "@/utils/currencyUtils";

export function FinancialOverview() {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState<any>(null);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    if (user?.id) {
      const data = getFinancialData(user.id);
      setFinancialData(data);
      
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
  
  if (!financialData) {
    return <div className="animate-pulse">Loading financial data...</div>;
  }

  // Calculate percentage changes
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const balanceChange = getPercentageChange(financialData.balance, financialData.lastMonthBalance);
  const incomeChange = getPercentageChange(financialData.income, financialData.lastMonthIncome);
  const expensesChange = getPercentageChange(financialData.expenses, financialData.lastMonthExpenses);
  const savingsChange = getPercentageChange(financialData.savings, financialData.lastMonthSavings);

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

  // Convert all amounts to the user's preferred currency
  const convertedBalance = convertCurrency(financialData.balance, currency);
  const convertedIncome = convertCurrency(financialData.income, currency);
  const convertedExpenses = convertCurrency(financialData.expenses, currency);
  const convertedSavings = convertCurrency(financialData.savings, currency);

  const items = [
    {
      title: "Balance",
      amount: formatCurrency(convertedBalance, currency),
      change: balanceChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      stagger: "stagger-1",
    },
    {
      title: "Income",
      amount: formatCurrency(convertedIncome, currency),
      change: incomeChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      stagger: "stagger-2",
    },
    {
      title: "Expenses",
      amount: formatCurrency(convertedExpenses, currency),
      change: expensesChange,
      description: "from last month",
      bgColor: "bg-gradient-to-r from-rose-500 to-rose-600",
      stagger: "stagger-3",
    },
    {
      title: "Savings",
      amount: formatCurrency(convertedSavings, currency),
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
