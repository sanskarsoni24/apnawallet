
import React, { useState } from "react";
import BlurContainer from "../ui/BlurContainer";
import { Shield, LockKeyhole, Unlock, Fingerprint, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Badge } from "../ui/badge";
import DocumentCard from "../documents/DocumentCard";

const SurakshaLocker = () => {
  const { userSettings, updateUserSettings } = useUser();
  const { getSecureVaultDocuments, removeFromSecureVault } = useDocuments();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
  
  // Get documents in secure vault
  const secureVaultDocuments = getSecureVaultDocuments();

  // Check if biometric auth is available and enabled
  const biometricEnabled = userSettings?.biometricAuth?.enabled || false;
  const faceIdEnabled = userSettings?.biometricAuth?.faceIdEnabled || false;
  const fingerprintEnabled = userSettings?.biometricAuth?.fingerprintEnabled || false;
  
  // Placeholder master password - in a real app, this would be securely stored
  const correctMasterPassword = "secure123";
  
  const handleUnlock = () => {
    if (masterPassword === correctMasterPassword) {
      setIsUnlocked(true);
      setShowAuthDialog(false);
      setMasterPassword("");
      setIsPasswordIncorrect(false);
      toast({
        title: "Vault Unlocked",
        description: "You now have access to your secure documents."
      });
    } else {
      setIsPasswordIncorrect(true);
    }
  };
  
  const handleLock = () => {
    setIsUnlocked(false);
    setMasterPassword("");
    toast({
      title: "Vault Locked",
      description: "Your secure documents are now protected."
    });
  };
  
  const handleBiometricAuth = () => {
    // This would integrate with device biometric APIs in a real app
    // For now, we'll simulate successful authentication
    setIsUnlocked(true);
    setShowAuthDialog(false);
    toast({
      title: "Biometric Authentication Successful",
      description: "You now have access to your secure documents."
    });
  };
  
  const handleRemoveAllFromVault = () => {
    if (secureVaultDocuments.length === 0) return;
    
    secureVaultDocuments.forEach(doc => {
      removeFromSecureVault(doc.id);
    });
    
    toast({
      title: "Documents Removed",
      description: `${secureVaultDocuments.length} documents have been removed from the secure vault.`
    });
  };

  return (
    <BlurContainer className="p-5 animate-fade-in" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Suraksha Secure Vault</h3>
            <p className="text-sm text-muted-foreground">Store your most sensitive documents securely</p>
          </div>
        </div>
        
        {isUnlocked ? (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleLock}
          >
            <LockKeyhole className="h-4 w-4" />
            Lock Vault
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-1.5 bg-primary/90 hover:bg-primary"
            onClick={() => setShowAuthDialog(true)}
          >
            <Unlock className="h-4 w-4" />
            Unlock Vault
          </Button>
        )}
      </div>
      
      {!isUnlocked ? (
        <div className="bg-muted p-8 rounded-md text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Vault is Locked</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Your sensitive documents are securely protected. Unlock the vault to access them.
          </p>
          <Button 
            variant="default" 
            className="bg-primary/90 hover:bg-primary"
            onClick={() => setShowAuthDialog(true)}
          >
            Unlock Vault
          </Button>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              {secureVaultDocuments.length} Documents
            </Badge>
            in your secure vault
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Protected Documents</h4>
            {secureVaultDocuments.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleRemoveAllFromVault}
              >
                Remove All
              </Button>
            )}
          </div>
          
          {secureVaultDocuments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {secureVaultDocuments.map((doc) => (
                <DocumentCard key={doc.id} {...doc} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 p-8 rounded-md text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-medium">No Protected Documents</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                You haven't added any documents to your secure vault yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the <Shield className="h-3 w-3 inline mx-1" /> icon on any document to add it to your secure vault.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Authentication Dialog */}
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock Secure Vault</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your master password to access protected documents
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="masterPassword">Master Password</Label>
              <Input 
                id="masterPassword" 
                type="password" 
                placeholder="Enter your master password" 
                value={masterPassword}
                onChange={(e) => {
                  setMasterPassword(e.target.value);
                  setIsPasswordIncorrect(false);
                }}
                className={isPasswordIncorrect ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {isPasswordIncorrect && (
                <p className="text-sm text-red-500">Incorrect password. Please try again.</p>
              )}
            </div>
            
            {(biometricEnabled && (faceIdEnabled || fingerprintEnabled)) && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleBiometricAuth}
                >
                  <Fingerprint className="h-4 w-4" />
                  Use Biometric Authentication
                </Button>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnlock}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Unlock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BlurContainer>
  );
};

export default SurakshaLocker;
