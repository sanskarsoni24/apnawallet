
import React, { useState } from "react";
import { Plus, File, X, Tag, Text, BookText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/contexts/DocumentContext";
import { generateId } from "@/lib/utils";
import { Document } from "@/types/Document";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentType, setDocumentType] = useState<Document["type"]>("id_card");
  const [issueDate, setIssueDate] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [documentCategory, setDocumentCategory] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  
  const { addDocument } = useDocuments();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".svg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setDocumentTitle(uploadedFile.name.split(".")[0]);
      setDocumentType(uploadedFile.type.includes("image") ? "id_card" : "other");

      // Generate a preview URL for images and PDFs
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    },
  });

  const handleTagAdd = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a document",
        variant: "destructive",
      });
      return;
    }

    if (!documentTitle) {
      toast({
        title: "Error",
        description: "Please enter a document title",
        variant: "destructive",
      });
      return;
    }
    
    const newDocument: Omit<Document, "id"> = {
      userId: "user123",
      title: documentTitle,
      description: documentDescription,
      type: documentType,
      issueDate: issueDate || undefined,
      dueDate: expiryDate || undefined,
      fileName: file?.name,
      fileUrl: previewUrl || undefined,
      fileSize: file?.size,
      fileType: file?.type,
      tags: selectedTags,
      category: documentCategory || undefined,
      notes: notes || undefined,
      dateAdded: new Date().toISOString(),
      status: "active"
    };

    addDocument(newDocument);

    // Reset form
    setFile(null);
    setPreviewUrl(null);
    setDocumentTitle("");
    setDocumentDescription("");
    setDocumentType("id_card");
    setIssueDate(null);
    setExpiryDate(null);
    setSelectedTags([]);
    setNewTag("");
    setDocumentCategory(null);
    setNotes(null);
    
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-md font-medium mb-4">Upload New Document</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div {...getRootProps()} className="relative border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-secondary/50">
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Plus className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop your document here
                </p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="documentTitle">Document Title</Label>
            <Input
              type="text"
              id="documentTitle"
              placeholder="Enter document title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="documentDescription">Document Description</Label>
            <Textarea
              id="documentDescription"
              placeholder="Enter document description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id_card">ID Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                type="date"
                id="issueDate"
                value={issueDate || ""}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                type="date"
                id="expiryDate"
                value={expiryDate || ""}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button type="button" size="sm" onClick={handleTagAdd}>
                Add Tag
              </Button>
            </div>
            <ScrollArea className="h-24 w-full rounded-md border p-2 mt-2">
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleTagRemove(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div>
            <Label htmlFor="documentCategory">Category</Label>
            <Input
              type="text"
              id="documentCategory"
              placeholder="Enter document category"
              value={documentCategory || ""}
              onChange={(e) => setDocumentCategory(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Upload Document
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
