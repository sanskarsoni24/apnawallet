
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/contexts/DocumentContext";

interface DocumentCategoryProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentCategory = ({ value, onChange }: DocumentCategoryProps) => {
  const { categories } = useDocuments();
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
        <SelectItem value="none">None</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DocumentCategory;
