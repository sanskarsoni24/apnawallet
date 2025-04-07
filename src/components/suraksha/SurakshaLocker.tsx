
import React, { useState, useEffect } from "react";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, Shield, Eye, EyeOff, Plus, File, FileX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BlurContainer from "@/components/ui/BlurContainer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Password schema
const passwordSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

const SurakshaLocker = () => {
  const { documents, getProtectedDocuments, setDocumentProtection } = useDocuments();
  const { userSettings } = useUser();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(true);
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [protectedDocuments, setProtectedDocuments] = useState<Document[]>([]);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form for setting or changing password
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const savedPassword = localStorage.getItem("surakshaLockerPassword");
    setStoredPassword(savedPassword);
    
    if (!savedPassword) {
      setShowPasswordInput(true);
      setPasswordDialogOpen(true);
    } else {
      setShowPasswordInput(true);
    }
    
    // Load protected documents
    setProtectedDocuments(getProtectedDocuments());
  }, [getProtectedDocuments]);

  useEffect(() => {
    // Update protected documents when documents change
    setProtectedDocuments(getProtectedDocuments());
  }, [documents, getProtectedDocuments]);

  const handlePasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    if (!storedPassword) {
      // First time setting password
      localStorage.setItem("surakshaLockerPassword", values.password);
      setStoredPassword(values.password);
      setPasswordDialogOpen(false);
      toast({
        title: "Password set successfully",
        description: "You can now unlock your Suraksha Locker",
      });
    } else {
      // Changing password
      localStorage.setItem("surakshaLockerPassword", values.password);
      setStoredPassword(values.password);
      setPasswordDialogOpen(false);
      toast({
        title: "Password changed successfully",
        description: "Your Suraksha Locker password has been updated",
      });
    }
  };

  const handleUnlock = () => {
    if (password === storedPassword) {
      setIsUnlocked(true);
      setPasswordError("");
      setPassword("");
      toast({
        title: "Suraksha Locker unlocked",
        description: "You now have access to your protected documents",
      });
    } else {
      setPasswordError("Incorrect password");
      toast({
        title: "Access denied",
        description: "The password you entered is incorrect",
        variant: "destructive",
      });
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    toast({
      title: "Suraksha Locker locked",
      description: "Your protected documents are now secure",
    });
  };

  const openDocumentSelector = () => {
    setDocumentDialogOpen(true);
  };

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const addToLocker = () => {
    if (selectedDocument) {
      setDocumentProtection(selectedDocument.id, true);
      setDocumentDialogOpen(false);
      setSelectedDocument(null);
      toast({
        title: "Document protected",
        description: `"${selectedDocument.title}" has been added to Suraksha Locker`,
      });
    }
  };

  const removeFromLocker = (docId: string, title: string) => {
    setDocumentProtection(docId, false);
    toast({
      title: "Document removed from protection",
      description: `"${title}" is no longer protected`,
    });
  };

  const changePassword = () => {
    setPasswordDialogOpen(true);
  };

  return (
    <BlurContainer className="p-6 col-span-full dark:bg-slate-800/70 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold dark:text-white">Suraksha Locker</h2>
          <p className="text-muted-foreground text-sm dark:text-slate-300">Password-protected storage for your sensitive documents</p>
        </div>
      </div>
      
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-slate-100 dark:bg-slate-900/70 p-8 rounded-lg w-full max-w-md shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="mb-6 flex flex-col items-center">
              <Lock size={48} className="text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-medium mb-2 dark:text-white">Unlock Suraksha Locker</h3>
              <p className="text-sm text-center text-muted-foreground dark:text-slate-400">
                Enter your password to access your protected documents
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="pr-10 dark:bg-slate-800 dark:border-slate-700"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              
              <Button 
                onClick={handleUnlock}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                <Lock className="mr-2 h-4 w-4" /> Unlock
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  onClick={changePassword}
                  className="text-sm text-indigo-600 dark:text-indigo-400"
                >
                  Change password
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Unlock className="text-green-500 h-5 w-5" />
              <span className="text-sm font-medium dark:text-white">Locker Unlocked</span>
            </div>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={changePassword}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Change Password
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLock}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Lock className="mr-2 h-4 w-4" /> Lock
              </Button>
              
              <Button
                onClick={openDocumentSelector}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Document
              </Button>
            </div>
          </div>
          
          {protectedDocuments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <File className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium dark:text-white">No protected documents</h3>
              <p className="mt-2 text-sm text-muted-foreground dark:text-slate-400">
                Add documents to protect them with your password
              </p>
              <Button
                onClick={openDocumentSelector}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protectedDocuments.map((doc) => (
                <Card key={doc.id} className="dark:bg-slate-900 dark:border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center dark:text-white">
                      <span className="truncate mr-2">{doc.title}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded">
                        {doc.customCategory || doc.type}
                      </span>
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400 line-clamp-1">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm py-2">
                    <div className={`text-sm font-medium ${
                      doc.daysRemaining < 0 ? 'text-red-600 dark:text-red-400' :
                      doc.daysRemaining <= 3 ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {doc.daysRemaining < 0 
                        ? `Overdue by ${Math.abs(doc.daysRemaining)} days` 
                        : doc.daysRemaining === 0 
                          ? 'Due today'
                          : doc.daysRemaining === 1 
                            ? 'Due tomorrow'
                            : `${doc.daysRemaining} days remaining`}
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-slate-500 mt-1">
                      Due date: {doc.dueDate}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromLocker(doc.id, doc.title)}
                      className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <FileX className="mr-2 h-4 w-4" /> Remove Protection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Document selection dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add Document to Suraksha Locker</DialogTitle>
            <DialogDescription className="dark:text-slate-300">
              Select a document to add to your password-protected locker.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto py-4">
            {documents
              .filter(doc => !doc.isProtected)
              .map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center gap-3 ${
                    selectedDocument?.id === doc.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-800' 
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <File className={`h-5 w-5 ${
                    selectedDocument?.id === doc.id 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm dark:text-white truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{doc.description}</p>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {doc.customCategory || doc.type}
                  </span>
                </div>
              ))}
              
            {documents.filter(doc => !doc.isProtected).length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No available documents to protect.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDocumentDialogOpen(false);
                setSelectedDocument(null);
              }}
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={addToLocker}
              disabled={!selectedDocument}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Add to Locker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Password setting/changing dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={(open) => {
        // Only allow closing if we have a password set
        if (!open && storedPassword) {
          setPasswordDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {storedPassword ? 'Change Password' : 'Set Password'}
            </DialogTitle>
            <DialogDescription className="dark:text-slate-300">
              {storedPassword 
                ? 'Enter a new password for your Suraksha Locker'
                : 'Create a password to protect your Suraksha Locker'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="dark:bg-slate-800 dark:border-slate-700"
                          {...field}
                        />
                      </FormControl>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                {storedPassword && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPasswordDialogOpen(false)}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  {storedPassword ? 'Update Password' : 'Set Password'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </BlurContainer>
  );
};

export default SurakshaLocker;
