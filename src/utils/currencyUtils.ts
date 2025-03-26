
// Define exchange rates (simplified for demonstration)
// In a real application, these would be fetched from an API
export const exchangeRates: Record<string, number> = {
  USD: 1,       // Base currency
  EUR: 0.92,    // 1 USD = 0.92 EUR
  GBP: 0.79,    // 1 USD = 0.79 GBP
  JPY: 151.42,  // 1 USD = 151.42 JPY
  INR: 83.51,   // 1 USD = 83.51 INR
};

// Define currency symbols
export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};

// Get currency preference for a user
export const getUserCurrency = (userId: string): string => {
  const savedCurrency = localStorage.getItem(`financetracker_currency_${userId}`);
  return savedCurrency || "USD"; // Default to USD if no preference is set
};

// Set currency preference for a user
export const setUserCurrency = (userId: string, currency: string): void => {
  localStorage.setItem(`financetracker_currency_${userId}`, currency);
  // Dispatch storage event for components to detect the change
  window.dispatchEvent(new Event('storage'));
};

// Convert amount from USD to the target currency
export const convertCurrency = (amount: number, targetCurrency: string): number => {
  const rate = exchangeRates[targetCurrency] || 1;
  return amount * rate;
};

// Format currency according to locale and currency code
export const formatCurrency = (amount: number, currencyCode: string): string => {
  let localeMap: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    INR: "en-IN",
  };
  
  // Handle special cases (JPY doesn't use decimal places)
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "JPY" ? 0 : 0,
    maximumFractionDigits: currencyCode === "JPY" ? 0 : 0,
  };

  return new Intl.NumberFormat(localeMap[currencyCode] || "en-US", options).format(amount);
};
