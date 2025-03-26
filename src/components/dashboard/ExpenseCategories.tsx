import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryExpenses, defaultCategories } from "@/utils/mockFinanceData";
import { useAuth } from "@/hooks/useAuth";
import { convertCurrency, formatCurrency, getUserCurrency } from "@/utils/currencyUtils";

export function ExpenseCategories() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    if (user?.id) {
      const data = getCategoryExpenses(user.id);
      setChartData(data);
      
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      // Convert amount to user's preferred currency
      const convertedValue = convertCurrency(payload[0].value, currency);
      
      return (
        <div className="bg-white p-2 border rounded shadow-md text-sm">
          <p className="font-medium text-gray-900">{`${payload[0].name}`}</p>
          <p className="text-gray-600">{`${formatCurrency(convertedValue, currency)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Convert chart data values to user's preferred currency
  const convertedChartData = chartData.map(item => ({
    ...item,
    displayValue: convertCurrency(item.value, currency),
    // Keep original value for chart proportions
  }));

  return (
    <Card className="animate-scale-in stagger-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Top Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={convertedChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                animationBegin={200}
              >
                {convertedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
          {convertedChartData.slice(0, 4).map((category, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.fill }} />
              <div className="text-xs sm:text-sm text-gray-600 truncate">
                {category.name} ({formatCurrency(category.displayValue, currency)})
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
