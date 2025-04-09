
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Copy, Mail, Calendar as CalendarIcon, Lock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface DocumentSharingProps {
  documentId: string;
  documentName: string;
  isPremium?: boolean;
}

const DocumentSharing = ({ documentId, documentName, isPremium = false }: DocumentSharingProps) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [permission, setPermission] = useState("view");
  const [shareLink, setShareLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const linkId = Math.random().toString(36).substring(2, 10);
    
    // In a real app, this would store the sharing settings in a database
    const link = `${baseUrl}/shared/${linkId}`;
    setShareLink(link);
    
    toast({
      title: "Link generated",
      description: "Share link has been generated successfully",
    });
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    });
  };
  
  const shareViaEmail = () => {
    if (!shareEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send an email with the sharing link
    toast({
      title: "Document shared",
      description: `Document has been shared with ${shareEmail}`,
    });
    
    setShareEmail("");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog is closed
      setIsPasswordProtected(false);
      setPassword("");
      setShareEmail("");
      setDate(undefined);
      setPermission("view");
      setShareLink("");
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{documentName}" securely with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Generate Secure Link</h4>
            <div className="flex items-center gap-2">
              <Button 
                onClick={generateShareLink} 
                className="flex-shrink-0"
                variant="secondary"
              >
                Generate Link
              </Button>
              {shareLink && (
                <div className="flex items-center gap-2 w-full">
                  <Input 
                    value={shareLink} 
                    readOnly 
                    className="flex-grow text-xs"
                  />
                  <Button 
                    size="icon"
                    variant="ghost"
                    onClick={copyLinkToClipboard}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Share Directly</h4>
            <div className="flex items-center gap-2">
              <Input
                placeholder="recipient@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={shareViaEmail} 
                size="icon"
                variant="secondary"
                className="flex-shrink-0"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-protection" className="text-sm">
                Password Protection
              </Label>
              <Switch
                id="password-protection"
                checked={isPasswordProtected}
                onCheckedChange={setIsPasswordProtected}
              />
            </div>
            
            {isPasswordProtected && (
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "No expiration"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Permissions</Label>
              {!isPremium && (
                <Badge variant="outline" className="text-xs">Premium Required</Badge>
              )}
            </div>
            <RadioGroup 
              value={permission} 
              onValueChange={setPermission}
              className="flex flex-col space-y-1"
              disabled={!isPremium}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="text-sm cursor-pointer">View Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="text-sm cursor-pointer">Allow Download</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="text-sm cursor-pointer">Allow Editing</Label>
              </div>
            </RadioGroup>
          </div>
          
          {!isPremium && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                Upgrade to Premium for advanced sharing controls, including permissions management 
                and access tracking.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSharing;
