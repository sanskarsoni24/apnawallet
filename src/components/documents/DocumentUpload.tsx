import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { format, differenceInDays } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, File, FilePlus, Upload, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Badge } from "@/components/ui/badge";
import { DocumentType } from "@/components/documents/DocumentType";
import { DocumentCategory } from "@/components/documents/DocumentCategory";
import { DocumentTag } from "@/components/documents/DocumentTag";
import { DocumentImportance } from "@/components/documents/DocumentImportance";

const DocumentUpload = () => {
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("id_card");
  const [category, setCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [importance, setImportance] = useState<string>("medium");
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderDays, setReminderDays] = useState<number>(7);
  const [notes, setNotes] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { addDocument } = useDocuments();
  const { toast } = useToast();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    
    // Generate a temporary URL for the file
    setFileUrl(URL.createObjectURL(file));
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})
  
  const thumbs = files.map((file) => (
    <div className="relative inline-flex rounded-md shadow-sm" key={file.name}>
      <div className="rounded-md overflow-hidden w-24 h-24">
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-full object-cover"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
      <span className="absolute top-0 right-0 p-1 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
        <X className="h-4 w-4 cursor-pointer" onClick={() => removeFile(file)} />
      </span>
    </div>
  ));
  
  // Remove file from preview
  const removeFile = (fileToRemove: File) => {
    setFiles((files) => files.filter((file) => file !== fileToRemove));
  };
  
  // Remove all files from preview
  const removeAllFiles = () => {
    setFiles([]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    const file = files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    
    // Generate a unique ID for the document
    const documentId = uuidv4();
    
    // Create a new document object
    const newDocument: Document = {
      id: documentId,
      userId: "current-user", // In a real app, this would be the actual user ID
      title: documentTitle || fileName,
      description: notes,
      type: documentType,
      issueDate: issueDate ? format(issueDate, "MMMM d, yyyy") : undefined,
      dueDate: dueDate ? format(dueDate, "MMMM d, yyyy") : undefined,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      fileURL: fileUrl, // Use fileURL instead of fileUrl
      tags: selectedTags,
      daysRemaining: dueDate ? differenceInDays(dueDate, new Date()) : undefined,
      reminderSet: reminderEnabled,
      customReminderDays: reminderEnabled ? reminderDays : undefined,
      // Summary is now a valid property in Document
      summary: aiSummary || "",
      category: category || undefined,
      status: "active",
      importance: "medium",
      inSecureVault: false
    };
    
    addDocument(newDocument);
    
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully.",
    });
    
    // Reset form fields
    setDocumentTitle("");
    setDocumentType("id_card");
    setCategory("");
    setSelectedTags([]);
    setImportance("medium");
    setIssueDate(undefined);
    setDueDate(undefined);
    setReminderEnabled(false);
    setReminderDays(7);
    setNotes("");
    setFiles([]);
    setFileUrl("");
    setAiSummary("");
  };
  
  const handleAiAnalysis = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setAiSummary(
      "This is a summary of the document generated by AI. It includes key information such as the document type, issue date, due date, and other relevant details."
    );
    
    setIsAnalyzing(false);
    
    toast({
      title: "AI analysis complete",
      description: "AI analysis of your document is complete.",
    });
  };
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Upload Document</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="documentType">Document Type</Label>
          <DocumentType value={documentType} onChange={setDocumentType} />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <DocumentCategory value={category} onChange={setCategory} />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <DocumentTag selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>
        
        <div>
          <Label htmlFor="importance">Importance</Label>
          <DocumentImportance value={importance} onChange={setImportance} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !issueDate && "text-muted-foreground"
                  )}
                >
                  {issueDate ? (
                    format(issueDate, "MMMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={issueDate}
                  onSelect={setIssueDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  {dueDate ? (
                    format(dueDate, "MMMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="reminder">Set Reminder</Label>
          <Switch id="reminder" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
        </div>
        
        {reminderEnabled && (
          <div>
            <Label htmlFor="reminderDays">Reminder Time</Label>
            <Slider
              id="reminderDays"
              defaultValue={[reminderDays]}
              max={30}
              step={1}
              onValueChange={(value) => setReminderDays(value[0])}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              Remind me {reminderDays} days before the due date.
            </p>
          </div>
        )}
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <div>
          <Label>Upload File</Label>
          <div {...getRootProps()} className="border-dashed border-2 rounded-md p-5 cursor-pointer bg-muted/50">
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p className="text-center text-muted-foreground">Drop the files here ...</p> :
                <div className="text-center">
                  <FilePlus className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
                </div>
            }
          </div>
          <aside className="flex flex-row flex-wrap mt-4">
            {thumbs}
          </aside>
          {files.length > 0 && (
            <div className="flex justify-between items-center mt-3">
              <Badge variant="outline">{files[0].name}</Badge>
              <Button type="button" variant="link" size="sm" onClick={removeAllFiles}>
                Remove All
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="aiSummary">AI Analysis</Label>
          <Textarea
            id="aiSummary"
            placeholder="AI generated summary of the document"
            value={aiSummary}
            readOnly
            className="resize-none"
          />
          <Button
            type="button"
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="mt-2"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </div>
        
        <Button type="submit">Upload Document</Button>
      </form>
    </div>
  );
};

export default DocumentUpload;
