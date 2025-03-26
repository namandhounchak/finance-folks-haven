
import { User } from "@/types/user";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string | null;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type FinancialGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
};

export type FinancialData = {
  balance: number;
  lastMonthBalance: number;
  income: number;
  lastMonthIncome: number;
  expenses: number;
  lastMonthExpenses: number;
  savings: number;
  lastMonthSavings: number;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: FinancialGoal[];
};

// Standard categories for all users
export const defaultCategories: Category[] = [
  { id: "cat_1", name: "Housing", color: "#4A6FFF" },
  { id: "cat_2", name: "Food", color: "#FF6B6B" },
  { id: "cat_3", name: "Transportation", color: "#FFD166" },
  { id: "cat_4", name: "Entertainment", color: "#118AB2" },
  { id: "cat_5", name: "Shopping", color: "#06D6A0" },
  { id: "cat_6", name: "Utilities", color: "#4D6CFA" },
  { id: "cat_7", name: "Healthcare", color: "#EF476F" },
  { id: "cat_8", name: "Personal", color: "#073B4C" },
  { id: "cat_9", name: "Travel", color: "#9370DB" },
  { id: "cat_10", name: "Salary", color: "#2EC4B6" },
  { id: "cat_11", name: "Investments", color: "#2EC4B6" },
  { id: "cat_12", name: "Gifts", color: "#FF9F1C" },
];

// Map category ID to names for easy lookup
export const categoryMap = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.name;
  return acc;
}, {} as Record<string, string>);

// Generate random transactions
const generateTransactions = (userId: string): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const types: ("income" | "expense")[] = ["income", "expense"];

  // Generate 30 transactions spanning the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const categoryId = i % 5 === 0 
      ? null // Make some transactions uncategorized
      : defaultCategories[Math.floor(Math.random() * defaultCategories.length)].id;
    
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = type === "income" 
      ? Math.floor(Math.random() * 1000) + 500 
      : Math.floor(Math.random() * 200) + 10;

    const descriptions = type === "income" 
      ? ["Salary payment", "Freelance work", "Investment dividend", "Client payment", "Refund"] 
      : ["Grocery shopping", "Restaurant bill", "Gas station", "Online purchase", "Movie tickets", "Utility bill"];

    transactions.push({
      id: `trans_${userId}_${i}`,
      date: date.toISOString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount,
      type,
      category: categoryId,
    });
  }

  // Sort by date, newest first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate random budgets
const generateBudgets = (): Budget[] => {
  return [
    { id: "budget_1", category: "cat_1", amount: 1500, spent: 1200 },
    { id: "budget_2", category: "cat_2", amount: 500, spent: 350 },
    { id: "budget_3", category: "cat_3", amount: 300, spent: 250 },
    { id: "budget_4", category: "cat_4", amount: 200, spent: 180 },
    { id: "budget_5", category: "cat_5", amount: 400, spent: 200 },
  ];
};

// Generate financial goals
const generateGoals = (): FinancialGoal[] => {
  const now = new Date();
  const sixMonthsLater = new Date(now);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  return [
    {
      id: "goal_1",
      title: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 5000,
      deadline: sixMonthsLater.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: "goal_2",
      title: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: oneYearLater.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: "goal_3",
      title: "New Laptop",
      targetAmount: 2000,
      currentAmount: 800,
      deadline: sixMonthsLater.toISOString(),
      createdAt: now.toISOString(),
    },
  ];
};

// Calculate summary metrics
const calculateSummary = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const calculateMetrics = (trans: Transaction[]) => {
    const income = trans.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = trans.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses,
      savings: income * 0.2, // Assuming 20% of income goes to savings
    };
  };

  const currentMetrics = calculateMetrics(currentMonthTransactions);
  const lastMetrics = calculateMetrics(lastMonthTransactions);

  return {
    balance: currentMetrics.balance,
    lastMonthBalance: lastMetrics.balance,
    income: currentMetrics.income,
    lastMonthIncome: lastMetrics.income,
    expenses: currentMetrics.expenses,
    lastMonthExpenses: lastMetrics.expenses,
    savings: currentMetrics.savings,
    lastMonthSavings: lastMetrics.savings,
  };
};

// Get or create financial data for a user
export const getFinancialData = (userId: string): FinancialData => {
  const storageKey = `financetracker_data_${userId}`;
  const storedData = localStorage.getItem(storageKey);

  if (storedData) {
    return JSON.parse(storedData);
  }

  // Create new data for first-time users
  const transactions = generateTransactions(userId);
  const summary = calculateSummary(transactions);
  const budgets = generateBudgets();
  const goals = generateGoals();

  const financialData: FinancialData = {
    ...summary,
    transactions,
    categories: defaultCategories,
    budgets,
    goals,
  };

  // Save to localStorage
  localStorage.setItem(storageKey, JSON.stringify(financialData));

  return financialData;
};

// Update a transaction's category
export const updateTransactionCategory = (
  userId: string, 
  transactionId: string, 
  categoryId: string
): FinancialData => {
  const data = getFinancialData(userId);
  
  const updatedTransactions = data.transactions.map(t => 
    t.id === transactionId ? { ...t, category: categoryId } : t
  );

  const updatedData = {
    ...data,
    transactions: updatedTransactions,
  };

  // Save changes
  localStorage.setItem(`financetracker_data_${userId}`, JSON.stringify(updatedData));

  return updatedData;
};

// Get uncategorized transactions
export const getUncategorizedTransactions = (userId: string): Transaction[] => {
  const data = getFinancialData(userId);
  return data.transactions.filter(t => t.category === null).slice(0, 5);
};

// Get category expense breakdown
export const getCategoryExpenses = (userId: string) => {
  const data = getFinancialData(userId);
  
  // Get all expense transactions
  const expenses = data.transactions.filter(t => t.type === "expense");
  
  // Group by category and calculate total
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(transaction => {
    if (!transaction.category) return;
    
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    
    categoryTotals[transaction.category] += transaction.amount;
  });
  
  // Format for pie chart
  return Object.entries(categoryTotals).map(([categoryId, amount]) => {
    const category = data.categories.find(c => c.id === categoryId);
    return {
      name: category?.name || "Uncategorized",
      value: amount,
      fill: category?.color || "#CCCCCC",
    };
  }).sort((a, b) => b.value - a.value); // Sort by amount desc
};
