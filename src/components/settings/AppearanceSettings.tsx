
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
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sun className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Appearance</h2>
      </div>
      
      <div className="grid gap-4 grid-cols-3">
        <button 
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-border hover:border-primary/50'} transition-all bg-background`}
          onClick={() => saveTheme('light')}
        >
          <div className="h-10 w-10 rounded-md bg-background border shadow-sm flex items-center justify-center">
            <Sun className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">Light</span>
        </button>
        
        <button 
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-border hover:border-primary/50'} transition-all bg-background`}
          onClick={() => saveTheme('dark')}
        >
          <div className="h-10 w-10 rounded-md bg-slate-900 text-white shadow-sm flex items-center justify-center">
            <Moon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">Dark</span>
        </button>
        
        <button 
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'system' ? 'border-primary' : 'border-border hover:border-primary/50'} transition-all bg-background`}
          onClick={() => saveTheme('system')}
        >
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-white to-slate-900 shadow-sm flex items-center justify-center">
            <Monitor className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">System</span>
        </button>
      </div>
    </BlurContainer>
  );
};

export default AppearanceSettings;
