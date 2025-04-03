
import React, { useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";

interface AppearanceSettingsProps {
  theme: string;
  saveTheme: (theme: string) => void;
}

const AppearanceSettings = ({ theme, saveTheme }: AppearanceSettingsProps) => {
  // Apply theme when component mounts or theme changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    
    if (theme === "system") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDarkMode ? "dark" : "light");
      
      // Add listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <BlurContainer className="p-6 animate-fade-in bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-xl border border-indigo-100/50 dark:border-indigo-800/30 rounded-xl shadow-lg" style={{ animationDelay: "0.3s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Sun className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Appearance</h2>
      </div>
      
      <div className="grid gap-4 grid-cols-3">
        <button 
          className={`flex flex-col items-center gap-3 p-4 rounded-lg ${theme === 'light' 
            ? 'bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-md' 
            : 'bg-white/70 dark:bg-slate-900/70 border border-indigo-100/50 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-700'} 
            transition-all duration-300 group`}
          onClick={() => saveTheme('light')}
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-200 dark:to-amber-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Sun className={`h-7 w-7 ${theme === 'light' ? 'text-amber-600' : 'text-amber-500'}`} />
          </div>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>Light</span>
        </button>
        
        <button 
          className={`flex flex-col items-center gap-3 p-4 rounded-lg ${theme === 'dark' 
            ? 'bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-md' 
            : 'bg-white/70 dark:bg-slate-900/70 border border-indigo-100/50 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-700'} 
            transition-all duration-300 group`}
          onClick={() => saveTheme('dark')}
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Moon className={`h-7 w-7 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-200'}`} />
          </div>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>Dark</span>
        </button>
        
        <button 
          className={`flex flex-col items-center gap-3 p-4 rounded-lg ${theme === 'system' 
            ? 'bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-md' 
            : 'bg-white/70 dark:bg-slate-900/70 border border-indigo-100/50 dark:border-indigo-800/30 hover:border-indigo-200 dark:hover:border-indigo-700'} 
            transition-all duration-300 group`}
          onClick={() => saveTheme('system')}
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 dark:from-indigo-400 dark:to-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Monitor className={`h-7 w-7 ${theme === 'system' ? 'text-white' : 'text-indigo-100'}`} />
          </div>
          <span className={`text-sm font-medium ${theme === 'system' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>System</span>
        </button>
      </div>
    </BlurContainer>
  );
};

export default AppearanceSettings;
