
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { 
  FileText, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Download, 
  RotateCw, 
  Highlighter,
  PenTool,
  Type,
  Scissors,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  SidebarClose,
  SidebarOpen
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onZoomChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onDownload: () => void;
  onPrint: () => void;
  onRotate: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  showThumbnails: boolean;
  onToggleThumbnails: () => void;
  annotationMode: "none" | "highlight" | "pen" | "text" | "select";
  onAnnotationModeChange: (mode: "none" | "highlight" | "pen" | "text" | "select") => void;
}

const PdfToolbar: React.FC<PdfToolbarProps> = ({
  currentPage,
  totalPages,
  zoom,
  onZoomChange,
  onPageChange,
  onDownload,
  onPrint,
  onRotate,
  fullscreen,
  onToggleFullscreen,
  showThumbnails,
  onToggleThumbnails,
  annotationMode,
  onAnnotationModeChange
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-background border-b shadow-sm">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleThumbnails}
          className="text-muted-foreground hover:text-foreground"
        >
          {showThumbnails ? <SidebarClose size={16} /> : <SidebarOpen size={16} />}
        </Button>
        
        <div className="flex items-center bg-muted/50 rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={annotationMode === "select"}
                onPressedChange={() => onAnnotationModeChange("select")}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Search size={16} />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select Text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={annotationMode === "highlight"}
                onPressedChange={() => onAnnotationModeChange("highlight")}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Highlighter size={16} />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Highlight Text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={annotationMode === "pen"}
                onPressedChange={() => onAnnotationModeChange("pen")}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <PenTool size={16} />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={annotationMode === "text"}
                onPressedChange={() => onAnnotationModeChange("text")}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Type size={16} />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="h-4 mx-1 border-l border-border"></span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onZoomChange(zoom - 0.1)}
                disabled={zoom <= 0.5}
                className="h-8 w-8 p-0"
              >
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-24">
          <Slider
            value={[zoom * 100]}
            min={50}
            max={200}
            step={10}
            onValueChange={(value) => onZoomChange(value[0] / 100)}
            className="h-3"
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onZoomChange(zoom + 0.1)}
                disabled={zoom >= 2}
                className="h-8 w-8 p-0"
              >
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="h-4 mx-1 border-l border-border"></span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRotate}
                className="h-8 w-8 p-0"
              >
                <RotateCw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rotate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrint}
                className="h-8 w-8 p-0"
              >
                <Printer size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="h-8 w-8 p-0"
              >
                <Download size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-8 w-8 p-0"
              >
                {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PdfToolbar;
