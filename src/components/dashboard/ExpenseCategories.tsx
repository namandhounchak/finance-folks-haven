
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

export function ExpenseCategories() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      const data = getCategoryExpenses(user.id);
      setChartData(data);
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md text-sm">
          <p className="font-medium text-gray-900">{`${payload[0].name}`}</p>
          <p className="text-gray-600">{`${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

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
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                animationBegin={200}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          {chartData.slice(0, 4).map((category, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.fill }} />
              <div className="text-sm text-gray-600 truncate">{category.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
