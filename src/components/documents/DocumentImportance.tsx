
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, AlertCircle, CircleAlert } from "lucide-react";

interface DocumentImportanceProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentImportance = ({ value, onChange }: DocumentImportanceProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select importance" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low" className="flex items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Low</span>
          </div>
        </SelectItem>
        <SelectItem value="medium" className="flex items-center">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Medium</span>
          </div>
        </SelectItem>
        <SelectItem value="high" className="flex items-center">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 text-orange-500" />
            <span>High</span>
          </div>
        </SelectItem>
        <SelectItem value="critical" className="flex items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Critical</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DocumentImportance;
