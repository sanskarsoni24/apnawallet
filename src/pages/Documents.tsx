
import React, { useState, useEffect } from "react";
import { FileText, Filter, Search, SlidersHorizontal } from "lucide-react";
import Container from "@/components/layout/Container";
import BlurContainer from "@/components/ui/BlurContainer";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/contexts/DocumentContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const documentTypes = ["All", "Invoice", "Warranty", "Subscription", "Boarding Pass"];

const Documents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');
  
  const [activeFilter, setActiveFilter] = useState(filterParam || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { documents, filteredDocuments } = useDocuments();

  useEffect(() => {
    // Update the active filter when the URL parameter changes
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, [filterParam]);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Update URL with the new filter
    navigate(`/documents?filter=${filter}`);
  };
  
  // Filter documents based on active filter and search term
  const getFilteredDocs = () => {
    let filtered = [];
    
    if (activeFilter === "upcoming") {
      // Filter for upcoming deadlines (docs with due date in next 7 days)
      filtered = documents.filter(doc => 
        doc.daysRemaining >= 0 && doc.daysRemaining <= 7
      );
    } else {
      // Use the regular filter by document type
      filtered = filteredDocuments(activeFilter);
    }
    
    // Apply search term filter
    return filtered.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const displayedDocuments = getFilteredDocs();
  
  return (
    <Container>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              View and manage all your documents in one place.
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <BlurContainer className="p-3">
              <div className="flex flex-wrap gap-2">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeFilter === type 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => handleFilterChange(type)}
                  >
                    {type}
                  </button>
                ))}
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeFilter === "upcoming" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => handleFilterChange("upcoming")}
                >
                  Upcoming
                </button>
              </div>
            </BlurContainer>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-input hover:bg-secondary transition-colors">
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => {
                    toast({
                      title: "Sort by Date",
                      description: "Documents sorted by due date"
                    });
                  }}>
                    Sort by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast({
                      title: "Sort by Name",
                      description: "Documents sorted alphabetically"
                    });
                  }}>
                    Sort by Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast({
                      title: "Show All Documents",
                      description: "All documents are now visible"
                    });
                    handleFilterChange("All");
                  }}>
                    Show All Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {displayedDocuments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {displayedDocuments.map((doc) => (
                  <DocumentCard key={doc.id} {...doc} />
                ))}
              </div>
            ) : (
              <BlurContainer className="p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchTerm 
                    ? `No documents matching "${searchTerm}" in ${activeFilter === "All" ? "any category" : activeFilter}`
                    : `You don't have any ${activeFilter === "All" ? "" : activeFilter} documents yet.`
                  }
                </p>
              </BlurContainer>
            )}
          </div>
          
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <DocumentUpload />
            
            <BlurContainer className="p-5">
              <h3 className="text-base font-medium mb-4">Document Types</h3>
              <div className="space-y-3">
                {documentTypes.filter(type => type !== "All").map((type) => {
                  const count = documents.filter(doc => doc.type === type).length;
                  return (
                    <div 
                      key={type} 
                      className="flex items-center justify-between cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-colors"
                      onClick={() => handleFilterChange(type)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </BlurContainer>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Documents;
