
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Merge, Split, FileSignature, FilePen, FileImage, Upload, Plus, Check, File, X } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const PDFEditingTools = () => {
  const [activeTab, setActiveTab] = useState('merge');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  
  const handleMergePDFs = () => {
    // This would normally call an API to merge PDFs
    toast({
      title: "PDFs Merged Successfully",
      description: `Merged ${selectedFiles.length} PDF files`
    });
    
    setSelectedFiles([]);
    setMergeDialogOpen(false);
  };
  
  const handleSplitPDF = () => {
    // This would normally call an API to split the PDF
    toast({
      title: "PDF Split Successfully",
      description: "The PDF has been split into individual pages"
    });
    
    setSplitDialogOpen(false);
  };
  
  const handleSignPDF = () => {
    // This would normally add a signature to the PDF
    toast({
      title: "Signature Added",
      description: "Your signature has been added to the document"
    });
    
    setSignDialogOpen(false);
  };
  
  const handleConvertToPDF = () => {
    // This would normally convert images to PDF
    toast({
      title: "Conversion Complete",
      description: "Your images have been converted to PDF"
    });
    
    setConvertDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Tools</CardTitle>
        <CardDescription>Tools to manage and edit your PDF documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="merge" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Split PDF</TabsTrigger>
            <TabsTrigger value="sign">Sign PDF</TabsTrigger>
            <TabsTrigger value="edit">Edit PDF</TabsTrigger>
            <TabsTrigger value="convert">JPG to PDF</TabsTrigger>
          </TabsList>
          
          <TabsContent value="merge" className="space-y-4 p-4">
            <div className="text-center py-10">
              <Merge className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Combine Multiple PDFs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select multiple PDF files to merge them into a single document
              </p>
              <Button onClick={() => setMergeDialogOpen(true)}>
                Merge PDFs
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="split" className="space-y-4 p-4">
            <div className="text-center py-10">
              <Split className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Split PDF into Pages</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Break a PDF into individual pages or custom ranges
              </p>
              <Button onClick={() => setSplitDialogOpen(true)}>
                Split PDF
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sign" className="space-y-4 p-4">
            <div className="text-center py-10">
              <FileSignature className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Add Signature to PDF</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Draw, type, or upload your signature to add to documents
              </p>
              <Button onClick={() => setSignDialogOpen(true)}>
                Sign Document
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4 p-4">
            <div className="text-center py-10">
              <FilePen className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Edit PDF Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Make changes to text, images, and organize pages
              </p>
              <Button disabled>
                Coming Soon
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="convert" className="space-y-4 p-4">
            <div className="text-center py-10">
              <FileImage className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Convert Images to PDF</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Turn JPG, PNG, and other image formats into a PDF document
              </p>
              <Button onClick={() => setConvertDialogOpen(true)}>
                Convert Images
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Merge PDFs Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Merge PDF Files</DialogTitle>
            <DialogDescription>
              Upload multiple PDF files to combine them into a single document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="pdf-files" className="sr-only">PDF Files</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                 onClick={() => document.getElementById('pdf-upload')?.click()}>
              <FileUp className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="border rounded-lg p-2 mt-2">
                <p className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setMergeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={selectedFiles.length < 2}
              onClick={handleMergePDFs}
            >
              Merge Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Split PDF Dialog */}
      <Dialog open={splitDialogOpen} onOpenChange={setSplitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Split PDF Document</DialogTitle>
            <DialogDescription>
              Upload a PDF file to split into individual pages or custom ranges.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="pdf-file">Upload PDF</Label>
            <Input id="pdf-file" type="file" accept=".pdf" />
            
            <Label htmlFor="split-method">Split Method</Label>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">All Pages</Button>
              <Button variant="outline" className="flex-1">Custom Range</Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setSplitDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSplitPDF}
            >
              Split PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sign PDF Dialog */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign PDF Document</DialogTitle>
            <DialogDescription>
              Add your signature to a PDF document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="pdf-file">Upload PDF</Label>
            <Input id="pdf-file" type="file" accept=".pdf" />
            
            <Label>Signature Method</Label>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" className="flex-1">
                Draw
              </Button>
              <Button variant="outline" className="flex-1">
                Type
              </Button>
              <Button variant="outline" className="flex-1">
                Upload
              </Button>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Signature drawing area
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setSignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSignPDF}
            >
              Apply Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Convert to PDF Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Images to PDF</DialogTitle>
            <DialogDescription>
              Upload images to convert them to a PDF document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="image-files" className="sr-only">Image Files</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                 onClick={() => document.getElementById('image-upload')?.click()}>
              <FileUp className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop image files here, or click to browse
              </p>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="border rounded-lg p-2 mt-2">
                <p className="text-sm font-medium mb-2">Selected Images ({selectedFiles.length})</p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <FileImage className="h-4 w-4" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setConvertDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={selectedFiles.length === 0}
              onClick={handleConvertToPDF}
            >
              Convert to PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PDFEditingTools;
