import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";

interface ThemeToggleProps {
  variant?: "light" | "dark";
  as?: string; // Additional prop for styling flexibility
}

export function ThemeToggle({ variant = "light" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark"); // Default to dark

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to dark mode instead of checking system preference
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    // Apply theme changes
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  const getButtonStyles = () => {
    if (variant === "dark") {
      return "p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none";
    }
    return "p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={getButtonStyles()}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" && (
        variant === "dark" 
          ? <Moon className="h-5 w-5" /> 
          : <i className="far fa-moon text-lg"></i>
      )}
      {theme === "dark" && (
        variant === "dark" 
          ? <Sun className="h-5 w-5" /> 
          : <i className="far fa-sun text-lg"></i>
      )}
      {theme === "system" && (
        variant === "dark" 
          ? <Laptop className="h-5 w-5" /> 
          : <i className="fas fa-desktop text-lg"></i>
      )}
    </Button>
  );
}
