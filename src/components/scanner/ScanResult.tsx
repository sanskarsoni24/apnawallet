
import React from "react";
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ScanResultProps {
  document: {
    id: string;
    name: string;
    url: string;
    createdAt?: string;
  };
  onDelete?: (id: string) => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ document, onDelete }) => {
  const handleDownload = () => {
    // In a real app, this would trigger a download of the actual file
    toast({
      title: "Download started",
      description: `Downloading ${document.name}`,
    });
    
    // Simulate successful download
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${document.name} has been saved to your downloads folder`,
      });
    }, 1500);
  };

  const handleView = () => {
    // In a real app, this would open a PDF viewer
    toast({
      title: "Opening document",
      description: `Opening ${document.name} for preview`,
    });
    
    // Here you could implement a document viewer or open a new window
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document.id);
      
      toast({
        title: "Document deleted",
        description: `${document.name} has been removed`,
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-indigo-600" />
        <div>
          <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{document.name}</p>
          <p className="text-xs text-muted-foreground">
            {document.createdAt || new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleView}
          className="hidden sm:flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button 
          variant="outline"
          size="sm" 
          onClick={handleView}
          className="sm:hidden"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleDownload}
          className="hidden sm:flex items-center"
        >
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        <Button 
          size="sm" 
          onClick={handleDownload}
          className="sm:hidden"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScanResult;
