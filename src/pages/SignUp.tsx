
import { Navigate } from "react-router-dom";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuth } from "@/hooks/useAuth";
import { Wallet } from "lucide-react";

const SignUp = () => {
  const { user, loading } = useAuth();

  // If already logged in, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet size={36} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-600">FinTracker</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Get started</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
