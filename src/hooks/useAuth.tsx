
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

// Mock database for demo purposes
const USERS_KEY = "financetracker_users";
const CURRENT_USER_KEY = "financetracker_current_user";

// Simulating database operations
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (user: User) => {
  const users = getUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
};

const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check if user already exists
      if (findUserByEmail(email)) {
        throw new Error("User with this email already exists");
      }

      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2),
        email,
        name,
      };

      // Save user to "database"
      saveUser({ ...newUser, id: newUser.id });

      // Set password (in a real app, this would be hashed)
      localStorage.setItem(`financetracker_password_${newUser.id}`, password);

      // Log the user in
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      toast({
        title: "Account created",
        description: "Welcome to Finance Tracker!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Find user
      const foundUser = findUserByEmail(email);
      
      if (!foundUser) {
        throw new Error("User not found");
      }

      // Check password (in a real app, this would compare hashed passwords)
      const storedPassword = localStorage.getItem(`financetracker_password_${foundUser.id}`);
      
      if (storedPassword !== password) {
        throw new Error("Invalid password");
      }

      // Log the user in
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));

      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // This would be a real Google Auth in a production app
      // For demo, we'll create a mock Google user
      const googleUser: User = {
        id: "google_" + Math.random().toString(36).substring(2),
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: "Google User",
        photoURL: "https://picsum.photos/200", // Random placeholder image
      };

      // Save user if not exists
      if (!findUserByEmail(googleUser.email)) {
        saveUser(googleUser);
      }

      // Log the user in
      setUser(googleUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(googleUser));

      toast({
        title: "Google login successful",
        description: `Welcome, ${googleUser.name}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google login failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
