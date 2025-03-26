
import { useAuth } from "@/hooks/useAuth";

export function Greeting() {
  const { user } = useAuth();
  const name = user?.name?.split(" ")[0] || "there";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {getGreeting()}, {name}
      </h1>
      <p className="mt-1.5 text-muted-foreground">
        Track your finances and plan for your future
      </p>
    </div>
  );
}
