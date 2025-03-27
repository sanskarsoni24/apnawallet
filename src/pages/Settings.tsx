
import React, { useState, useEffect } from "react";
import { Bell, Moon, Sun, User } from "lucide-react";
import Container from "@/components/layout/Container";
import BlurContainer from "@/components/ui/BlurContainer";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("1 day before");
  const [theme, setTheme] = useState("light");

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDisplayName(settings.displayName || "");
        setEmail(settings.email || "");
        setEmailNotifications(settings.emailNotifications !== false);
        setPushNotifications(settings.pushNotifications || false);
        setReminderFrequency(settings.reminderFrequency || "1 day before");
        setTheme(settings.theme || "light");
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
  }, []);

  // Save account settings
  const saveAccountSettings = () => {
    const settings = {
      displayName,
      email
    };
    
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    localStorage.setItem("userSettings", JSON.stringify({
      ...existingSettings,
      ...settings
    }));
    
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully."
    });
  };

  // Save notification settings
  const saveNotificationSettings = (key, value) => {
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    const updatedSettings = {
      ...existingSettings,
      [key]: value
    };
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    
    toast({
      title: "Settings updated",
      description: `Your ${key} setting has been updated.`
    });
  };

  // Save theme setting
  const saveTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    localStorage.setItem("userSettings", JSON.stringify({
      ...existingSettings,
      theme: selectedTheme
    }));
    
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(selectedTheme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 
      : selectedTheme);
    
    toast({
      title: "Theme updated",
      description: `Application theme set to ${selectedTheme}.`
    });
  };

  return (
    <Container>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account settings.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-medium">Account Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Display Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button 
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                onClick={saveAccountSettings}
              >
                Save Changes
              </button>
            </div>
          </BlurContainer>
          
          <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-medium">Notification Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive email notifications for upcoming deadlines.
                  </p>
                </div>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={() => {
                      setEmailNotifications(!emailNotifications);
                      saveNotificationSettings("emailNotifications", !emailNotifications);
                    }}
                  />
                  <div className="relative h-5 w-10 cursor-pointer rounded-full bg-muted peer-checked:bg-primary">
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-5" />
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive push notifications on your devices.
                  </p>
                </div>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={pushNotifications}
                    onChange={() => {
                      setPushNotifications(!pushNotifications);
                      saveNotificationSettings("pushNotifications", !pushNotifications);
                    }}
                  />
                  <div className="relative h-5 w-10 cursor-pointer rounded-full bg-muted peer-checked:bg-primary">
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-5" />
                  </div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium">Reminder Frequency</h3>
                  <p className="text-xs text-muted-foreground">
                    How often should we send you reminders?
                  </p>
                </div>
                <select 
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={reminderFrequency}
                  onChange={(e) => {
                    setReminderFrequency(e.target.value);
                    saveNotificationSettings("reminderFrequency", e.target.value);
                  }}
                >
                  <option>1 day before</option>
                  <option>3 days before</option>
                  <option>7 days before</option>
                </select>
              </div>
            </div>
          </BlurContainer>
          
          <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-medium">Appearance</h2>
            </div>
            
            <div className="grid gap-4 grid-cols-3">
              <button 
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-transparent hover:border-primary'} transition-all`}
                onClick={() => saveTheme('light')}
              >
                <div className="h-10 w-10 rounded-md bg-background shadow-sm" />
                <span className="text-xs font-medium">Light</span>
              </button>
              <button 
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-transparent hover:border-primary'} transition-all`}
                onClick={() => saveTheme('dark')}
              >
                <div className="h-10 w-10 rounded-md bg-slate-900 shadow-sm" />
                <span className="text-xs font-medium">Dark</span>
              </button>
              <button 
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme === 'system' ? 'border-primary' : 'border-transparent hover:border-primary'} transition-all`}
                onClick={() => saveTheme('system')}
              >
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-white to-slate-900 shadow-sm" />
                <span className="text-xs font-medium">System</span>
              </button>
            </div>
          </BlurContainer>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
