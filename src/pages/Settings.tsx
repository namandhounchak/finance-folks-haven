
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Yen,
  IndianRupee 
} from "lucide-react";

// Define currency options
const currencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$", icon: DollarSign },
  { value: "EUR", label: "Euro (€)", symbol: "€", icon: Euro },
  { value: "GBP", label: "British Pound (£)", symbol: "£", icon: PoundSterling },
  { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥", icon: Yen },
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹", icon: IndianRupee },
];

const Settings = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Load saved currency preference from localStorage on component mount
  useEffect(() => {
    if (user?.id) {
      const savedCurrency = localStorage.getItem(`financetracker_currency_${user.id}`);
      if (savedCurrency) {
        setSelectedCurrency(savedCurrency);
      }
    }
  }, [user?.id]);

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    
    if (user?.id) {
      // Save to localStorage
      localStorage.setItem(`financetracker_currency_${user.id}`, value);
      
      // Show success toast
      toast({
        title: "Currency Updated",
        description: `Your default currency has been set to ${currencies.find(c => c.value === value)?.label}.`,
      });
    }
  };

  // If not logged in, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6">
          {/* Currency Settings Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">Currency Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium mb-1.5 block">
                    Select Your Preferred Currency
                  </Label>
                  <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => {
                        const Icon = currency.icon;
                        return (
                          <SelectItem key={currency.value} value={currency.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{currency.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will be used as your default currency for all financial calculations and displays.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Settings Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Additional settings for your account and application preferences will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
