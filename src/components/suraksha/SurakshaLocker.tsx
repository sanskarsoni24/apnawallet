
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Save, Plus, Trash2, FileText, Check } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface SecureDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const SurakshaLocker = () => {
  const { email } = useUser();
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [secureDocuments, setSecureDocuments] = useState<SecureDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<SecureDocument | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load stored password and documents from localStorage
  useEffect(() => {
    const savedPassword = localStorage.getItem(`suraksha_password_${email}`);
    if (savedPassword) {
      setStoredPassword(savedPassword);
    }
    
    // Only load documents if user is authenticated
    if (!isLocked) {
      loadSecureDocuments();
    }
  }, [email, isLocked]);
  
  // Load secure documents from localStorage
  const loadSecureDocuments = () => {
    try {
      const encryptedDocs = localStorage.getItem(`suraksha_documents_${email}`);
      if (encryptedDocs) {
        // In a real app, you would decrypt the data here
        const decryptedDocs = JSON.parse(encryptedDocs);
        setSecureDocuments(decryptedDocs);
      }
    } catch (error) {
      console.error('Error loading secure documents:', error);
    }
  };
  
  // Save secure documents to localStorage
  const saveSecureDocuments = (docs: SecureDocument[]) => {
    try {
      // In a real app, you would encrypt the data here
      const encryptedDocs = JSON.stringify(docs);
      localStorage.setItem(`suraksha_documents_${email}`, encryptedDocs);
    } catch (error) {
      console.error('Error saving secure documents:', error);
    }
  };
  
  // Handle password setup or validation
  const handleUnlock = () => {
    if (!storedPassword) {
      // First time setup - create password
      if (password !== confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      if (password.length < 6) {
        toast({
          title: 'Password Too Short',
          description: 'Password must be at least 6 characters.',
          variant: 'destructive',
        });
        return;
      }
      
      // In a real app, you would hash the password
      localStorage.setItem(`suraksha_password_${email}`, password);
      setStoredPassword(password);
      setIsLocked(false);
      
      toast({
        title: 'Suraksha Locker Created',
        description: 'Your secure locker is now set up and unlocked.',
      });
    } else {
      // Validate existing password
      if (password !== storedPassword) {
        toast({
          title: 'Incorrect Password',
          description: 'The password you entered is incorrect.',
          variant: 'destructive',
        });
        return;
      }
      
      setIsLocked(false);
      loadSecureDocuments();
      
      toast({
        title: 'Suraksha Locker Unlocked',
        description: 'You now have access to your secure documents.',
      });
    }
    
    // Reset password fields
    setPassword('');
    setConfirmPassword('');
  };
  
  // Lock the secure locker
  const handleLock = () => {
    setIsLocked(true);
    setCurrentDocument(null);
    setIsCreating(false);
    setIsEditing(false);
    
    toast({
      title: 'Suraksha Locker Locked',
      description: 'Your secure locker has been locked.',
    });
  };
  
  // Start creating a new document
  const startCreatingDocument = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentDocument(null);
    setNewTitle('');
    setNewContent('');
  };
  
  // Save a new document
  const saveNewDocument = () => {
    if (!newTitle.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a title for your document.',
        variant: 'destructive',
      });
      return;
    }
    
    const now = new Date().toISOString();
    const newDoc: SecureDocument = {
      id: `doc_${Date.now()}`,
      title: newTitle,
      content: newContent,
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedDocs = [...secureDocuments, newDoc];
    setSecureDocuments(updatedDocs);
    saveSecureDocuments(updatedDocs);
    
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
    
    toast({
      title: 'Document Saved',
      description: 'Your secure document has been saved.',
    });
  };
  
  // View a document
  const viewDocument = (doc: SecureDocument) => {
    setCurrentDocument(doc);
    setNewTitle(doc.title);
    setNewContent(doc.content);
    setIsEditing(false);
    setIsCreating(false);
  };
  
  // Start editing a document
  const startEditingDocument = () => {
    setIsEditing(true);
  };
  
  // Save edited document
  const saveEditedDocument = () => {
    if (!currentDocument) return;
    
    if (!newTitle.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a title for your document.',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedDoc = {
      ...currentDocument,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedDocs = secureDocuments.map(doc => 
      doc.id === currentDocument.id ? updatedDoc : doc
    );
    
    setSecureDocuments(updatedDocs);
    saveSecureDocuments(updatedDocs);
    setCurrentDocument(updatedDoc);
    setIsEditing(false);
    
    toast({
      title: 'Document Updated',
      description: 'Your secure document has been updated.',
    });
  };
  
  // Delete a document
  const deleteDocument = (id: string) => {
    const updatedDocs = secureDocuments.filter(doc => doc.id !== id);
    setSecureDocuments(updatedDocs);
    saveSecureDocuments(updatedDocs);
    
    if (currentDocument?.id === id) {
      setCurrentDocument(null);
      setIsEditing(false);
    }
    
    toast({
      title: 'Document Deleted',
      description: 'Your secure document has been deleted.',
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <BlurContainer className="p-6 animate-fade-in dark:bg-slate-800/70 dark:border-slate-700">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Suraksha Locker</h2>
          <p className="text-sm text-muted-foreground dark:text-slate-300">
            Securely store your confidential information
          </p>
        </div>
      </div>
      
      {isLocked ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              {!storedPassword ? "Create Password" : "Enter Password"}
            </h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              {!storedPassword 
                ? "Create a password to secure your personal information. Make sure it's strong and you remember it."
                : "Enter your password to unlock your secure locker."}
            </p>
            
            <div className="w-full max-w-xs space-y-4">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {!storedPassword && (
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}
              
              <Button 
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {!storedPassword ? "Create Locker" : "Unlock"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium">Your Secure Documents</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLock}
                className="text-xs"
              >
                <Lock className="h-3.5 w-3.5 mr-1" /> Lock
              </Button>
              <Button
                size="sm"
                onClick={startCreatingDocument}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> New Document
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border rounded-lg h-[500px] overflow-y-auto p-2">
              {secureDocuments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mb-2" />
                  <h4 className="text-sm font-medium">No secure documents yet</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click 'New Document' to create your first secure document.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {secureDocuments.map((doc) => (
                    <li 
                      key={doc.id} 
                      className={`px-3 py-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-center ${
                        currentDocument?.id === doc.id ? 'bg-slate-100 dark:bg-slate-700/50' : ''
                      }`}
                      onClick={() => viewDocument(doc)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="lg:col-span-2 border rounded-lg h-[500px] flex flex-col">
              {isCreating ? (
                <div className="p-4 flex flex-col h-full">
                  <div className="mb-4">
                    <Input
                      placeholder="Document Title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <Textarea
                    placeholder="Enter your secure content here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="flex-1 resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveNewDocument}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save Document
                    </Button>
                  </div>
                </div>
              ) : currentDocument ? (
                <div className="p-4 flex flex-col h-full">
                  {isEditing ? (
                    <>
                      <div className="mb-4">
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="font-medium"
                        />
                      </div>
                      <Textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="flex-1 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setNewTitle(currentDocument.title);
                            setNewContent(currentDocument.content);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={saveEditedDocument}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-1" /> Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{currentDocument.title}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={startEditingDocument}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex-1 overflow-y-auto whitespace-pre-wrap">
                        {currentDocument.content}
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        <p>Last updated: {formatDate(currentDocument.updatedAt)}</p>
                        <p>Created: {formatDate(currentDocument.createdAt)}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select or Create a Document</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select an existing document from the list or create a new one to securely store your personal information.
                  </p>
                  <Button
                    onClick={startCreatingDocument}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Create New Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </BlurContainer>
  );
};

export default SurakshaLocker;
