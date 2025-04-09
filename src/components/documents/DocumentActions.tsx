
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Download, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DocumentActionsProps {
  documentId: string;
  documentName: string;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  isPremium?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentId,
  documentName,
  onEdit,
  onDelete,
  onDownload,
  isPremium = false
}) => {
  const { userSettings } = useUser();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [allowEdit, setAllowEdit] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<{email: string, access: string}[]>([]);
  
  const userIsPremium = isPremium || userSettings?.subscriptionPlan === 'premium' || userSettings?.subscriptionPlan === 'enterprise';
  
  const handleShare = () => {
    if (!shareEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with",
        variant: "destructive"
      });
      return;
    }
    
    setShareLoading(true);
    
    // Simulate API call to share document
    setTimeout(() => {
      // Add user to shared users list
      setSharedUsers([
        ...sharedUsers,
        {
          email: shareEmail, 
          access: allowEdit ? "edit" : "view"
        }
      ]);
      
      toast({
        title: "Document shared",
        description: `${documentName} has been shared with ${shareEmail}${allowEdit ? ' with edit permissions' : ''}`,
      });
      
      setShareEmail("");
      setAllowEdit(false);
      setShareLoading(false);
    }, 1000);
  };

  const removeSharedUser = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
    
    toast({
      title: "Access revoked",
      description: `${email} no longer has access to this document`,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2" onClick={onDownload}>
        <Download className="h-4 w-4" />
        Download
      </Button>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share "{documentName}"</DialogTitle>
            <DialogDescription>
              Share this document with others via email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <Button 
                  onClick={handleShare} 
                  disabled={!shareEmail || shareLoading}
                >
                  {shareLoading ? "Sharing..." : "Share"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-edit"
                checked={allowEdit}
                onCheckedChange={setAllowEdit}
                disabled={!userIsPremium}
              />
              <div>
                <Label htmlFor="allow-edit" className="cursor-pointer">Allow editing</Label>
                {!userIsPremium && (
                  <p className="text-xs text-muted-foreground">
                    Requires Premium subscription
                  </p>
                )}
              </div>
            </div>
            
            {sharedUsers.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-3">People with access</h4>
                <div className="space-y-3">
                  {sharedUsers.map((user) => (
                    <div key={user.email} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.access === "edit" ? "Can edit" : "Can view"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeSharedUser(user.email)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {userIsPremium && (
              <div className="rounded-md bg-muted p-4">
                <div className="text-sm font-medium">Premium sharing options</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  As a premium user, you can share documents with edit permissions and track document access.
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShowShareDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/30" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default DocumentActions;
