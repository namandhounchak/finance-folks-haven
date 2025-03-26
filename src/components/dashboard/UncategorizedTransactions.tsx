
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
import { convertCurrency, formatCurrency, getUserCurrency } from "@/utils/currencyUtils";

export function UncategorizedTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    if (user?.id) {
      const data = getUncategorizedTransactions(user.id);
      setTransactions(data);
      
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
          <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
            {transactions.map((transaction) => {
              // Convert amount to user's preferred currency
              const convertedAmount = convertCurrency(transaction.amount, currency);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs sm:text-sm font-medium truncate">
                        {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base line-clamp-1">{transaction.description}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {formatCurrency(convertedAmount, currency)}
                      </div>
                    </div>
                  </div>
                  <Select onValueChange={(value) => handleCategoryChange(transaction.id, value)}>
                    <SelectTrigger className="w-[100px] sm:w-[140px]">
                      <SelectValue placeholder="Category" />
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
