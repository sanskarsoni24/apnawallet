import React, { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tag, Plus, X, Check, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CustomCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomCategoryManager = ({ isOpen, onClose }: CustomCategoryManagerProps) => {
  const { categories, addCustomCategory, removeCategory } = useDocuments();
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      toast({
        title: "Category name required",
        description: "Please enter a valid category name",
        variant: "destructive"
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Category already exists",
        description: "Please enter a unique category name",
        variant: "destructive"
      });
      return;
    }

    addCustomCategory(newCategory.trim());
    setNewCategory("");
    toast({
      title: "Category added",
      description: `"${newCategory.trim()}" has been added to your categories`
    });
  };

  const handleRemoveCategory = (category: string) => {
    removeCategory(category);
    toast({
      title: "Category removed",
      description: `"${category}" has been removed from your categories`
    });
  };

  const startEditing = (category: string) => {
    setEditingCategory(category);
    setUpdatedCategoryName(category);
  };

  const handleUpdateCategory = () => {
    if (updatedCategoryName.trim() === "") {
      toast({
        title: "Category name required",
        description: "Please enter a valid category name",
        variant: "destructive"
      });
      return;
    }

    if (categories.includes(updatedCategoryName.trim()) && updatedCategoryName.trim() !== editingCategory) {
      toast({
        title: "Category already exists",
        description: "Please enter a unique category name",
        variant: "destructive"
      });
      return;
    }

    // Remove old category and add the updated one
    if (editingCategory) {
      removeCategory(editingCategory);
      addCustomCategory(updatedCategoryName.trim());
      
      toast({
        title: "Category updated",
        description: `"${editingCategory}" has been updated to "${updatedCategoryName.trim()}"`
      });
      
      setEditingCategory(null);
    }
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>Manage Custom Categories</span>
          </DialogTitle>
          <DialogDescription className="dark:text-slate-300">
            Create and manage custom categories for your documents
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Add new category */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <Button
              onClick={handleAddCategory}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          
          {/* Existing categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium dark:text-white mb-2">Existing Categories</h4>
            
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground dark:text-slate-400 py-2">
                No custom categories yet. Add your first category above.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2 group">
                    {editingCategory === category ? (
                      <>
                        <Input
                          value={updatedCategoryName}
                          onChange={(e) => setUpdatedCategoryName(e.target.value)}
                          className="flex-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleUpdateCategory}
                          className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge 
                          variant="outline" 
                          className="flex-1 justify-start gap-1 py-1.5 px-3 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                          <Tag className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span className="truncate">{category}</span>
                        </Badge>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditing(category)}
                            className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveCategory(category)}
                            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              variant="outline"
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCategoryManager;
