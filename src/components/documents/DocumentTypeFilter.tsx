
import React, { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomCategoryManager from "./CustomCategoryManager";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DocumentTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const DocumentTypeFilter = ({ selectedType, onTypeChange }: DocumentTypeFilterProps) => {
  const { documents, categories, documentTypes, addDocumentType, addCategory } = useDocuments();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState("");
  
  // Handle category management
  const handleManageCategories = () => {
    setIsCategoryDialogOpen(true);
  };
  
  const handleCategoryDialogClose = () => {
    setIsCategoryDialogOpen(false);
    toast({
      title: "Categories updated",
      description: "Your document categories have been updated"
    });
  };
  
  // Handle adding a new document type
  const handleAddDocumentType = () => {
    if (!newDocumentType.trim()) {
      toast({
        title: "Type Required",
        description: "Please enter a document type name",
        variant: "destructive",
      });
      return;
    }
    
    if (documentTypes.includes(newDocumentType.trim())) {
      toast({
        title: "Type Already Exists",
        description: `"${newDocumentType.trim()}" already exists as a document type.`,
        variant: "destructive",
      });
      return;
    }
    
    addDocumentType(newDocumentType.trim());
    setNewDocumentType("");
    setIsTypeDialogOpen(false);
    
    toast({
      title: "Document Type Added",
      description: `"${newDocumentType.trim()}" has been added as a document type.`
    });
    
    // Automatically select the newly added type
    onTypeChange(newDocumentType.trim());
  };
  
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold dark:text-white">Filter by Type</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTypeDialogOpen(true)}
              className="text-xs dark:bg-slate-800 dark:border-slate-700"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageCategories}
              className="text-xs dark:bg-slate-800 dark:border-slate-700"
            >
              <Tag className="h-3.5 w-3.5 mr-1" /> Manage Categories
            </Button>
          </div>
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-1 flex-wrap">
            <Button
              key="All"
              variant={selectedType === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange("All")}
              className={selectedType === "All" 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                : "dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              }
            >
              All
            </Button>
            
            {/* Document Types - Fixed to use a distinct visual style */}
            {documentTypes.map(type => (
              <Button
                key={`type-${type}`}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(type)}
                className={selectedType === type 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                }
              >
                {type}
              </Button>
            ))}
            
            {/* Custom categories */}
            {categories.map(category => (
              <Button
                key={`category-${category}`}
                variant={selectedType === category ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(category)}
                className={`flex items-center gap-1 ${
                  selectedType === category 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "border-purple-300 dark:border-purple-800 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Tag className="h-3 w-3" />
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <CustomCategoryManager 
        isOpen={isCategoryDialogOpen} 
        onClose={handleCategoryDialogClose} 
      />
      
      {/* Add New Document Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Add New Document Type</DialogTitle>
            <DialogDescription>
              Create a custom document type to better organize your documents
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter new document type"
                value={newDocumentType}
                onChange={(e) => setNewDocumentType(e.target.value)}
                className="flex-1 dark:bg-slate-800 dark:border-slate-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newDocumentType.trim()) {
                    handleAddDocumentType();
                  }
                }}
              />
              <Button 
                onClick={handleAddDocumentType}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTypeDialogOpen(false)}
              className="dark:bg-slate-800 dark:border-slate-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentTypeFilter;
