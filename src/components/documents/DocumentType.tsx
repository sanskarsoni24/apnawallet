
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/contexts/DocumentContext";

interface DocumentTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentType = ({ value, onChange }: DocumentTypeProps) => {
  const { documentTypes } = useDocuments();
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select document type" />
      </SelectTrigger>
      <SelectContent>
        {documentTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DocumentType;
