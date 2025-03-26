
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUncategorizedTransactions, updateTransactionCategory, defaultCategories } from "@/utils/mockFinanceData";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function UncategorizedTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      const data = getUncategorizedTransactions(user.id);
      setTransactions(data);
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Handle category selection
  const handleCategoryChange = (transactionId: string, categoryId: string) => {
    if (user?.id) {
      updateTransactionCategory(user.id, transactionId, categoryId);
      
      // Update local state to remove the categorized transaction
      setTransactions(transactions.filter(t => t.id !== transactionId));
      
      toast({
        title: "Transaction categorized",
        description: "The transaction has been updated successfully.",
      });
    }
  };

  return (
    <Card className="animate-scale-in stagger-5">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Uncategorized Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No uncategorized transactions. Great job!
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
                <Select onValueChange={(value) => handleCategoryChange(transaction.id, value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
