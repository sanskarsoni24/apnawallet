
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/contexts/DocumentContext";

interface DocumentTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentType: React.FC<DocumentTypeProps> = ({ value, onChange }) => {
  const { documentTypes } = useDocuments();
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select document type" />
      </SelectTrigger>
      <SelectContent>
        {documentTypes.map((type) => (
          <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
            {type}
          </SelectItem>
        ))}
        <SelectItem value="id_card">ID Card</SelectItem>
        <SelectItem value="passport">Passport</SelectItem>
        <SelectItem value="driving_license">Driving License</SelectItem>
        <SelectItem value="insurance">Insurance</SelectItem>
        <SelectItem value="certificate">Certificate</SelectItem>
        <SelectItem value="invoice">Invoice</SelectItem>
        <SelectItem value="contract">Contract</SelectItem>
        <SelectItem value="tax">Tax Document</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  );
};
