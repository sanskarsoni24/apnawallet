
import React, { useState } from "react";
import { Shield, LockKeyhole, Plus, FileText, Key, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlurContainer from "@/components/ui/BlurContainer";
import MobileQRCodeModal from "@/components/mobile/MobileQRCodeModal";
import PasswordRecovery from "@/components/security/PasswordRecovery";

interface SecretItem {
  id: string;
  title: string;
  value: string;
  type: "password" | "note" | "key";
  dateAdded: string;
}

const SurakshaLocker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("passwords");
  const [secrets, setSecrets] = useState<SecretItem[]>([
    {
      id: "1",
      title: "Gmail Password",
      value: "••••••••••••",
      type: "password",
      dateAdded: "2023-10-15",
    },
    {
      id: "2",
      title: "Backup Recovery Key",
      value: "XXXX-XXXX-XXXX-XXXX",
      type: "key",
      dateAdded: "2023-09-22",
    },
    {
      id: "3",
      title: "Travel Notes",
      value: "Passport Number: A123456789\nEmergency Contact: +1-555-123-4567",
      type: "note",
      dateAdded: "2023-10-01",
    },
  ]);
  
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  
  const handleAddItem = () => {
    if (newItemTitle && newItemValue) {
      const newItem: SecretItem = {
        id: Date.now().toString(),
        title: newItemTitle,
        value: newItemValue,
        type: activeTab === "passwords" ? "password" : activeTab === "notes" ? "note" : "key",
        dateAdded: new Date().toISOString().split("T")[0],
      };
      
      setSecrets([...secrets, newItem]);
      setNewItemTitle("");
      setNewItemValue("");
    }
  };
  
  const handleDeleteItem = (id: string) => {
    setSecrets(secrets.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Secure Vault</h2>
        </div>
        <div className="flex items-center gap-2">
          <MobileQRCodeModal deviceName="Chrome Mobile" />
        </div>
      </div>
      
      <BlurContainer className="overflow-hidden p-0">
        <Tabs 
          defaultValue="passwords" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="flex justify-start px-6 pt-4 w-full border-b border-gray-100 dark:border-gray-800 gap-1 bg-transparent">
            <TabsTrigger 
              value="passwords" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <LockKeyhole className="h-4 w-4 mr-2" />
              Passwords
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <FileText className="h-4 w-4 mr-2" />
              Secure Notes
            </TabsTrigger>
            <TabsTrigger 
              value="keys" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Key className="h-4 w-4 mr-2" />
              Recovery Keys
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-2">
              <Input
                placeholder={`New ${activeTab === "passwords" ? "password title" : activeTab === "notes" ? "note title" : "recovery key name"}`}
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={`${activeTab === "passwords" ? "Password value" : activeTab === "notes" ? "Note content" : "Recovery key"}`}
                type={activeTab === "passwords" ? "password" : "text"}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-4">
              {secrets
                .filter(item => 
                  (activeTab === "passwords" && item.type === "password") ||
                  (activeTab === "notes" && item.type === "note") ||
                  (activeTab === "keys" && item.type === "key")
                )
                .map(item => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.type === "password" && <LockKeyhole className="h-5 w-5 text-blue-500" />}
                        {item.type === "note" && <FileText className="h-5 w-5 text-green-500" />}
                        {item.type === "key" && <Key className="h-5 w-5 text-amber-500" />}
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="ml-7">
                      <p className={`text-sm ${item.type === "password" ? "font-mono" : ""}`}>
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added: {item.dateAdded}
                      </p>
                    </div>
                  </div>
                ))}
                
              {secrets.filter(item => 
                (activeTab === "passwords" && item.type === "password") ||
                (activeTab === "notes" && item.type === "note") ||
                (activeTab === "keys" && item.type === "key")
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No {activeTab === "passwords" ? "passwords" : activeTab === "notes" ? "notes" : "recovery keys"} found.
                    Add one to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </BlurContainer>
      
      <div className="space-y-1">
        <PasswordRecovery />
      </div>
    </div>
  );
};

export default SurakshaLocker;
