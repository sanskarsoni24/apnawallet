
import React, { useState } from "react";
import { Upload } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { toast } from "@/hooks/use-toast";

const DocumentUpload = () => {
  const [dragging, setDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = (files: File[]) => {
    // For demonstration purposes, we'll just show a toast notification
    toast({
      title: "Documents uploaded",
      description: `${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully.`,
    });
  };
  
  return (
    <BlurContainer 
      className={`border-2 border-dashed transition-all duration-300 ${
        dragging ? "border-primary bg-primary/5" : "border-border"
      } rounded-xl p-8 text-center`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
        <div className={`rounded-full p-3 ${
          dragging ? "bg-primary/20" : "bg-primary/10"
        } transition-colors duration-300`}>
          <Upload className={`h-6 w-6 ${
            dragging ? "text-primary" : "text-primary/80"
          } transition-colors duration-300`} />
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-medium">Upload documents</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your documents or click to browse
          </p>
        </div>
        
        <label className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
          Select documents
          <input 
            type="file" 
            className="sr-only" 
            multiple 
            onChange={handleInputChange} 
          />
        </label>
        
        <p className="text-xs text-muted-foreground">
          Supports PDF, JPG, PNG, TIFF
        </p>
      </div>
    </BlurContainer>
  );
};

export default DocumentUpload;
