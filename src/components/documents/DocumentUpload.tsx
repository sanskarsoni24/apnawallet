import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FilePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useDocuments } from "@/contexts/DocumentsContext";
import { Document } from "@/types/Document";
import { useCategories } from "@/contexts/CategoriesContext";
import { useTags } from "@/contexts/TagsContext";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadProps {
  onDocumentUploaded?: (document: Document) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUploaded }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addDocument } = useDocuments();
  const { categories } = useCategories();
	const { tags } = useTags();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFileDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileDescription(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

	const handleTagChange = (tag: string) => {
		setSelectedTags((prevTags) => {
			if (prevTags.includes(tag)) {
				return prevTags.filter((t) => t !== tag);
			} else {
				return [...prevTags, tag];
			}
		});
	};

  const handleFileUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    const file = files[0];

    const generateId = () => {
      return uuidv4();
    };

    const getDocumentType = (fileName: string): string => {
      const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
      return fileExtension.toUpperCase();
    };

    const newDoc = {
      id: generateId(),
      name: fileName || file.name,
      type: getDocumentType(file.name),
      path: URL.createObjectURL(file),
      size: file.size,
      lastModified: new Date().toISOString(),
      tags: selectedTags,
      categories: selectedCategory,
      favorite: false,
      reminders: [],
    };

    addDocument(newDoc);

    toast({
      title: "File uploaded",
      description: `${fileName || file.name} has been uploaded successfully.`,
    });

    setFiles([]);
    setFileName("");
    setFileDescription("");
    setSelectedCategory("");
		setSelectedTags([]);

    if (onDocumentUploaded) {
      onDocumentUploaded(newDoc);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setFileName("");
    setFileDescription("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Upload a new document to your library</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="name">File name</Label>
          <Input
            id="name"
            placeholder="Document name"
            value={fileName}
            onChange={handleFileNameChange}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Document description"
            value={fileDescription}
            onChange={handleFileDescriptionChange}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={handleCategoryChange} defaultValue={selectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
				<div className="flex flex-col space-y-1">
					<Label>Tags</Label>
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<Badge
								key={tag.id}
								variant={selectedTags.includes(tag.id) ? "default" : "outline"}
								onClick={() => handleTagChange(tag.id)}
								className="cursor-pointer"
							>
								{tag.name}
							</Badge>
						))}
					</div>
				</div>
        <div {...getRootProps()} className="rounded-md border-2 border-dashed p-4 text-center">
          <input {...getInputProps()} />
          {files.length === 0 ? (
            isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <FilePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-sm mt-2 text-muted-foreground">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </>
            )
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {files[0].name} - {(files[0].size / 1024).toFixed(2)} KB
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the selected file from the upload queue.
                      Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveFile}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={handleFileUpload} disabled={files.length === 0}>
          <Upload className="h-4 w-4 mr-2" />
          Upload file
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;
