
import React, { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomCategoryManager from "./CustomCategoryManager";
import { toast } from "@/hooks/use-toast";

interface DocumentTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const DocumentTypeFilter = ({ selectedType, onTypeChange }: DocumentTypeFilterProps) => {
  const { documents, categories } = useDocuments();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Get unique document types from documents
  const documentTypes = ["All", ...new Set(documents.map(doc => doc.type))];
  
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
  
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold dark:text-white">Filter by Type</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageCategories}
            className="text-xs dark:bg-slate-800 dark:border-slate-700"
          >
            <Tag className="h-3.5 w-3.5 mr-1" /> Manage Categories
          </Button>
        </div>
        
        <ScrollArea className="w-full" orientation="horizontal">
          <div className="flex gap-2 pb-1">
            {documentTypes.map(type => (
              <Button
                key={type}
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
    </>
  );
};

export default DocumentTypeFilter;
