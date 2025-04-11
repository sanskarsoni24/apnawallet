import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Tag, MoreVertical, Shield, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/types/Document";
import { useDocuments } from "@/contexts/DocumentContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const DocumentCard = ({ 
  id,
  title,
  description,
  type,
  dueDate,
  fileUrl,
  tags,
  daysRemaining,
  inSecureVault,
  ...props
}: Document) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const { updateDocument } = useDocuments();
  
  // Function to move document to secure vault
  const moveToSecureVault = () => {
    updateDocument(id, { inSecureVault: true });
    toast({
      title: "Document secured",
      description: "Document has been moved to the secure vault",
    });
  };
  
  // Function to remove document from secure vault
  const removeFromSecureVault = () => {
    updateDocument(id, { inSecureVault: false });
    toast({
      title: "Document moved",
      description: "Document has been removed from the secure vault",
    });
  };
  
  // Determine if card should be rendered with secure styling
  const isSecure = inSecureVault === true;
  
  return (
    <Card className={`transition-all ${isSecure ? 'border-primary/50 bg-primary/5 shadow-primary/10' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-secondary">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => navigate(`/document/${id}`)} className="cursor-pointer">
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isSecure ? (
                <DropdownMenuItem onClick={moveToSecureVault}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Move to Secure Vault</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={removeFromSecureVault}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span>Remove from Vault</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 cursor-pointer">
                Delete Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{description || "No description provided"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{type}</span>
          </div>
          {dueDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">{new Date(dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {daysRemaining !== null && daysRemaining !== undefined ? (
            <span>
              {daysRemaining >= 0
                ? `Expires in ${daysRemaining} days`
                : `Expired ${Math.abs(daysRemaining)} days ago`}
            </span>
          ) : (
            <span>No due date</span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5 mr-1" />
            <span>{tags.join(", ")}</span>
          </div>
        )}
      </CardFooter>
      {isSecure && (
        <div className="absolute top-0 right-0 p-1">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secured
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default DocumentCard;
