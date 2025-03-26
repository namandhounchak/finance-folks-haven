
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, BarChart, PieChart, LineChart, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">FinTracker</span>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 text-center md:py-24 md:text-left">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Take control of your <span className="text-blue-600">finances</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 md:text-xl">
              Track expenses, manage budgets, and achieve your financial goals with our intuitive personal finance tracker.
            </p>
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-start">
              <Button size="lg" onClick={() => navigate('/signup')} className="animate-pulse-once">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-scale-in">
            <div className="glass rounded-3xl p-6 shadow-lg flex items-center justify-center card-hover">
              <BarChart className="h-16 w-16 text-blue-500" />
            </div>
            <div className="glass rounded-3xl p-6 shadow-lg flex items-center justify-center card-hover">
              <PieChart className="h-16 w-16 text-blue-500" />
            </div>
            <div className="glass rounded-3xl p-6 shadow-lg flex items-center justify-center card-hover">
              <LineChart className="h-16 w-16 text-blue-500" />
            </div>
            <div className="glass rounded-3xl p-6 shadow-lg flex items-center justify-center card-hover">
              <Wallet className="h-16 w-16 text-blue-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in stagger-1">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
              <p className="text-gray-600">
                Easily log and categorize your expenses to understand where your money goes.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in stagger-2">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
              <p className="text-gray-600">
                Set budgets for different categories and track your spending against them.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in stagger-3">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Financial Goals</h3>
              <p className="text-gray-600">
                Set and track your financial goals with clear visualizations of your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are managing their money better with FinTracker.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Wallet className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-white">FinTracker</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} FinTracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
