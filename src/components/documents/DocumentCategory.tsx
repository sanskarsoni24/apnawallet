
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/contexts/DocumentContext";

interface DocumentCategoryProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentCategory: React.FC<DocumentCategoryProps> = ({ value, onChange }) => {
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
        <SelectItem value="personal">Personal</SelectItem>
        <SelectItem value="financial">Financial</SelectItem>
        <SelectItem value="legal">Legal</SelectItem>
        <SelectItem value="medical">Medical</SelectItem>
        <SelectItem value="educational">Educational</SelectItem>
        <SelectItem value="professional">Professional</SelectItem>
      </SelectContent>
    </Select>
  );
};
