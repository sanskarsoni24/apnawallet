
import React, { useState, useEffect } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CustomCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomCategoryManager = ({ isOpen, onClose }: CustomCategoryManagerProps) => {
  const { categories, addCategory, removeCategory } = useDocuments();
  const [newCategory, setNewCategory] = useState("");
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Initialize local categories with existing categories
    setLocalCategories([...categories]);
  }, [categories, isOpen]);
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Empty Category",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }
    
    if (localCategories.includes(newCategory)) {
      toast({
        title: "Duplicate Category",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }
    
    setLocalCategories([...localCategories, newCategory]);
    setNewCategory("");
  };
  
  const handleRemoveCategory = (category: string) => {
    setLocalCategories(localCategories.filter(cat => cat !== category));
  };
  
  const handleSave = () => {
    // Find categories to add and remove
    const categoriesToAdd = localCategories.filter(cat => !categories.includes(cat));
    const categoriesToRemove = categories.filter(cat => !localCategories.includes(cat));
    
    // Add new categories
    categoriesToAdd.forEach(category => {
      addCategory(category);
    });
    
    // Remove deleted categories
    categoriesToRemove.forEach(category => {
      removeCategory(category);
    });
    
    // Show success toast
    if (categoriesToAdd.length > 0 || categoriesToRemove.length > 0) {
      toast({
        title: "Categories Updated",
        description: `Added ${categoriesToAdd.length} and removed ${categoriesToRemove.length} categories`,
      });
    }
    
    // Close the dialog
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Document Categories</DialogTitle>
          <DialogDescription>
            Create custom categories to better organize your documents
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCategory} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border rounded-md p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
            {localCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {localCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
                  >
                    <Tag className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-sm">{category}</span>
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 text-slate-500 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Tag className="h-5 w-5 mb-2" />
                <p className="text-sm">No custom categories yet</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="h-4 w-4 mr-2" /> Save Categories
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCategoryManager;
