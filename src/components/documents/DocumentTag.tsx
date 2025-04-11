
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/contexts/DocumentContext";

interface DocumentTagProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const DocumentTag = ({ selectedTags, onChange }: DocumentTagProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { tags: availableTags } = useDocuments();
  
  const handleAddTag = () => {
    if (inputValue.trim() && !selectedTags.includes(inputValue.trim())) {
      const newTags = [...selectedTags, inputValue.trim()];
      onChange(newTags);
      setInputValue('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    onChange(newTags);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSelectExistingTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };
  
  // Filter out already selected tags from suggestions
  const filteredTags = availableTags.filter(tag => !selectedTags.includes(tag));
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddTag}
          size="sm"
          variant="outline"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 hover:bg-secondary/80 transition-colors">
              <span>{tag}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
      
      {/* Suggested tags if there are any */}
      {filteredTags.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"
                onClick={() => handleSelectExistingTag(tag)}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTag;
