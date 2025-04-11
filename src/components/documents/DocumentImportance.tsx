
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DocumentImportanceProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocumentImportance: React.FC<DocumentImportanceProps> = ({ value, onChange }) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      className="flex gap-6"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="low" id="importance-low" />
        <Label htmlFor="importance-low" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          Low
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="medium" id="importance-medium" />
        <Label htmlFor="importance-medium" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          Medium
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="high" id="importance-high" />
        <Label htmlFor="importance-high" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          High
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="critical" id="importance-critical" />
        <Label htmlFor="importance-critical" className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          Critical
        </Label>
      </div>
    </RadioGroup>
  );
};
