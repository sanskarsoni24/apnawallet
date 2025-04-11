
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileMerge, FileSplit, FileSignature, FileEdit, FileImage, Upload, ArrowRight, Check, Pen, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PDFEditingTools = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  const tools = [
    { id: "merge", name: "Merge PDFs", icon: FileMerge, description: "Combine multiple PDF files into one document" },
    { id: "split", name: "Split PDF", icon: FileSplit, description: "Divide a PDF into separate files" },
    { id: "sign", name: "Sign PDF", icon: FileSignature, description: "Add your signature to PDF documents" },
    { id: "edit", name: "Edit PDF", icon: FileEdit, description: "Modify text and images in your PDF" },
    { id: "jpg-to-pdf", name: "JPG to PDF", icon: FileImage, description: "Convert image files to PDF format" }
  ];

  const handleToolSelect = (toolId: string) => {
    setCurrentTool(toolId);
    setSelectedFiles([]);
    setConvertedFile(null);
    setOpenDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const processFiles = () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      if (currentTool === "jpg-to-pdf" && selectedFiles.length > 0) {
        // Simulated PDF conversion result
        setConvertedFile("converted_document.pdf");
        toast({
          title: "Conversion Complete",
          description: "Your images have been converted to PDF format."
        });
      } else if (currentTool === "merge" && selectedFiles.length > 1) {
        // Simulated PDF merging result
        setConvertedFile("merged_document.pdf");
        toast({
          title: "PDFs Merged",
          description: `${selectedFiles.length} PDFs have been merged successfully.`
        });
      } else if (currentTool === "split" && selectedFiles.length > 0) {
        // Simulated PDF splitting result
        toast({
          title: "PDF Split Complete",
          description: "Your PDF has been split into multiple files."
        });
        setOpenDialog(false);
      } else if (currentTool === "sign" && selectedFiles.length > 0 && signatureData) {
        // Simulated PDF signing result
        setConvertedFile("signed_document.pdf");
        toast({
          title: "Document Signed",
          description: "Your signature has been added to the document."
        });
      } else if (currentTool === "edit" && selectedFiles.length > 0) {
        // Simulated PDF editing result
        setConvertedFile("edited_document.pdf");
        toast({
          title: "Document Edited",
          description: "Your PDF has been edited successfully."
        });
      } else {
        toast({
          title: "Action Required",
          description: "Please select the required files to proceed.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your processed PDF is being downloaded."
    });
    setOpenDialog(false);
    setConvertedFile(null);
    setSelectedFiles([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    setLastPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.stroke();
    
    setLastPosition(currentPosition);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef) {
      setSignatureData(canvasRef.toDataURL());
    }
  };

  const clearSignature = () => {
    if (!canvasRef) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      setCanvasRef(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          PDF Tools
        </CardTitle>
        <CardDescription>
          Edit, merge, and manage your PDF documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              className="border bg-card hover:bg-accent/10 cursor-pointer transition-colors"
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-base mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentTool === "merge" && "Merge PDFs"}
                {currentTool === "split" && "Split PDF"}
                {currentTool === "sign" && "Sign PDF"}
                {currentTool === "edit" && "Edit PDF"}
                {currentTool === "jpg-to-pdf" && "Convert Images to PDF"}
              </DialogTitle>
              <DialogDescription>
                {currentTool === "merge" && "Select multiple PDF files to combine them into a single document."}
                {currentTool === "split" && "Upload a PDF file to split into separate documents."}
                {currentTool === "sign" && "Add your signature to a PDF document."}
                {currentTool === "edit" && "Modify the content of your PDF document."}
                {currentTool === "jpg-to-pdf" && "Convert your JPG images to PDF format."}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                {currentTool === "sign" && (
                  <TabsTrigger value="signature">Create Signature</TabsTrigger>
                )}
                {currentTool !== "sign" && (
                  <TabsTrigger value="options">Options</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-lg">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentTool === "merge" && "Drag and drop multiple PDF files"}
                      {currentTool === "split" && "Drag and drop a PDF file"}
                      {currentTool === "sign" && "Drag and drop a PDF to sign"}
                      {currentTool === "edit" && "Drag and drop a PDF to edit"}
                      {currentTool === "jpg-to-pdf" && "Drag and drop image files"}
                    </p>
                    
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm">
                        Choose Files
                      </span>
                      <Input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        multiple={currentTool === "merge" || currentTool === "jpg-to-pdf"}
                        accept={
                          currentTool === "merge" ? ".pdf" : 
                          currentTool === "split" ? ".pdf" :
                          currentTool === "sign" ? ".pdf" :
                          currentTool === "edit" ? ".pdf" :
                          ".jpg,.jpeg,.png"
                        }
                        onChange={handleFileChange}
                      />
                    </Label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-accent/30 rounded-md p-2 text-sm">
                            <span className="truncate">{file.name}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {currentTool === "sign" && (
                <TabsContent value="signature">
                  <div className="space-y-4">
                    <div className="border rounded-md p-2">
                      <canvas 
                        width={500} 
                        height={200} 
                        ref={initializeCanvas}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        className="border w-full cursor-crosshair"
                        style={{ touchAction: 'none' }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={clearSignature} 
                        type="button"
                      >
                        Clear Signature
                      </Button>
                      {signatureData && (
                        <Button variant="default" className="gap-2">
                          <Check className="h-4 w-4" /> Signature Created
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="options">
                <div className="space-y-4">
                  {currentTool === "merge" && (
                    <div>
                      <Label htmlFor="merge-order">Arrange Files</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag files to rearrange their order in the final document
                      </p>
                      <div className="border rounded-lg p-2 min-h-32">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 bg-accent/20 p-2 mb-2 rounded-md cursor-move">
                            <span>{index + 1}</span>
                            <ArrowRight className="h-4 w-4" />
                            <span className="truncate flex-1">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentTool === "split" && (
                    <div>
                      <Label htmlFor="split-options">Split Options</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button variant="outline" className="justify-start">By Page Number</Button>
                        <Button variant="outline" className="justify-start">Extract All Pages</Button>
                        <Button variant="outline" className="justify-start">By Bookmarks</Button>
                        <Button variant="outline" className="justify-start">Custom Range</Button>
                      </div>
                    </div>
                  )}
                  
                  {currentTool === "edit" && (
                    <div>
                      <Label htmlFor="edit-text">Edit Text</Label>
                      <Textarea 
                        id="edit-text" 
                        placeholder="Not available in this preview. In a real application, this would allow editing PDF text."
                        disabled
                        className="mt-2"
                      />
                      
                      <div className="mt-4">
                        <Label>Tools</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button variant="outline" className="justify-start gap-2">
                            <Pen className="h-4 w-4" /> Text
                          </Button>
                          <Button variant="outline" className="justify-start gap-2" disabled>
                            <FileEdit className="h-4 w-4" /> Annotate
                          </Button>
                          <Button variant="outline" className="justify-start gap-2" disabled>
                            <FileImage className="h-4 w-4" /> Images
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentTool === "jpg-to-pdf" && (
                    <div>
                      <Label htmlFor="page-options">Page Options</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="page-size" className="text-sm">Page Size</Label>
                          <select 
                            id="page-size" 
                            className="w-full p-2 border rounded-md mt-1"
                            defaultValue="a4"
                          >
                            <option value="a4">A4</option>
                            <option value="letter">Letter</option>
                            <option value="legal">Legal</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="orientation" className="text-sm">Orientation</Label>
                          <select 
                            id="orientation" 
                            className="w-full p-2 border rounded-md mt-1"
                            defaultValue="portrait"
                          >
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="image-quality" className="text-sm">Image Quality</Label>
                        <select 
                          id="image-quality" 
                          className="w-full p-2 border rounded-md mt-1"
                          defaultValue="medium"
                        >
                          <option value="low">Low (faster)</option>
                          <option value="medium">Medium</option>
                          <option value="high">High (larger file)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {convertedFile && (
              <div className="mt-4 p-4 bg-accent/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Processed File:</span>
                  <span>{convertedFile}</span>
                </div>
                <Button 
                  onClick={handleDownload} 
                  className="mt-2 w-full"
                >
                  Download
                </Button>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={processFiles} 
                disabled={isProcessing || (selectedFiles.length === 0 && currentTool !== "sign") || (currentTool === "sign" && !signatureData)}
                loading={isProcessing}
              >
                {isProcessing ? "Processing..." : "Process Files"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PDFEditingTools;
