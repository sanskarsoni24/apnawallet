
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface DocumentTagProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const DocumentTag: React.FC<DocumentTagProps> = ({ selectedTags, onChange }) => {
  const [tagInput, setTagInput] = useState("");
  
  const commonTags = [
    "important", "urgent", "family", "work", "travel", "finance", "insurance", "home"
  ];
  
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !selectedTags.includes(tagInput.trim())) {
      onChange([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const addCommonTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={handleKeyDown}
        />
        <Button type="button" size="sm" onClick={handleAddTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex gap-1 items-center">
            {tag}
            <button 
              type="button" 
              onClick={() => handleRemoveTag(tag)}
              className="rounded-full hover:bg-muted/60 h-4 w-4 inline-flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      {selectedTags.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No tags selected
        </div>
      )}
      
      <div className="pt-2">
        <div className="text-sm font-medium mb-2">Suggested tags:</div>
        <div className="flex flex-wrap gap-2">
          {commonTags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary"
              onClick={() => addCommonTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
