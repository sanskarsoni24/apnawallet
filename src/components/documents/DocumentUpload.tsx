
import React, { useState } from "react";
import { Upload } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";

const documentTypes = ["Invoice", "Warranty", "Subscription", "Boarding Pass"];

const DocumentUpload = () => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addDocument } = useDocuments();
  
  const form = useForm({
    defaultValues: {
      title: "",
      type: "Invoice",
      dueDate: "",
    }
  });
  
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
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setIsDialogOpen(true);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsDialogOpen(true);
    }
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate days remaining
    const dueDate = new Date(data.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Create file URL for preview
    const fileURL = URL.createObjectURL(selectedFile);
    
    addDocument({
      title: data.title,
      type: data.type,
      dueDate: data.dueDate,
      daysRemaining: diffDays,
      file: selectedFile,
      fileURL,
    });
    
    toast({
      title: "Document uploaded",
      description: `${data.title} has been uploaded successfully.`,
    });
    
    setSelectedFile(null);
    form.reset();
    setIsDialogOpen(false);
  });
  
  return (
    <>
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
              onChange={handleInputChange} 
            />
          </label>
          
          <p className="text-xs text-muted-foreground">
            Supports PDF, JPG, PNG, TIFF
          </p>
        </div>
      </BlurContainer>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Car Insurance" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFile(null);
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Document</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUpload;
