import React, { useState, useEffect } from "react";
import { FileText, Filter, Search, SlidersHorizontal, ArrowDown, ArrowUp } from "lucide-react";
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

const documentTypes = ["All", "Invoice", "Warranty", "Subscription", "Boarding Pass", "Other"];

const Documents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');
  
  const [activeFilter, setActiveFilter] = useState(filterParam || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "importance" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { documents, filterDocumentsByType } = useDocuments();

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
  
  const handleSort = (type: "date" | "name" | "importance") => {
    if (sortBy === type) {
      // Toggle direction if clicking the same sort type
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort type with default direction
      setSortBy(type);
      setSortDirection(type === "importance" ? "desc" : "asc"); // Default high to low for importance
    }
    
    toast({
      title: `Sort by ${type === "date" ? "Due Date" : type === "name" ? "Name" : "Priority"}`,
      description: `Documents sorted ${sortDirection === "asc" ? "ascending" : "descending"}`
    });
  };
  
  // Filter documents based on active filter, search term, and sort
  const getFilteredDocs = () => {
    let filtered = [];
    
    if (activeFilter === "upcoming") {
      // Filter for upcoming deadlines (docs with due date in next 7 days)
      filtered = documents.filter(doc => 
        doc.daysRemaining >= 0 && doc.daysRemaining <= 7
      );
    } else if (activeFilter === "completed") {
      // Filter for completed documents
      filtered = documents.filter(doc => doc.status === 'completed');
    } else if (activeFilter === "expired") {
      // Filter for expired documents
      filtered = documents.filter(doc => doc.status === 'expired');
    } else if (activeFilter === "pending") {
      // Filter for pending documents
      filtered = documents.filter(doc => doc.status === 'pending');
    } else {
      // Use the regular filter by document type
      filtered = filterDocumentsByType(activeFilter);
    }
    
    // Apply search term filter
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.type && doc.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === "name") {
          const comparison = a.title.localeCompare(b.title);
          return sortDirection === "asc" ? comparison : -comparison;
        } else if (sortBy === "date") {
          const comparison = a.daysRemaining - b.daysRemaining;
          return sortDirection === "asc" ? comparison : -comparison;
        } else if (sortBy === "importance") {
          // Map importance to numeric values for sorting
          const importanceValues = { "critical": 3, "high": 2, "medium": 1, "low": 0 };
          const aValue = importanceValues[(a.importance || "medium") as keyof typeof importanceValues];
          const bValue = importanceValues[(b.importance || "medium") as keyof typeof importanceValues];
          const comparison = bValue - aValue; // Default higher priority first
          return sortDirection === "asc" ? -comparison : comparison;
        }
        return 0;
      });
    }
    
    return filtered;
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
                {/* New filter buttons for document status */}
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeFilter === "completed" 
                      ? "bg-green-600 text-white" 
                      : "hover:bg-green-100"
                  }`}
                  onClick={() => handleFilterChange("completed")}
                >
                  Completed
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeFilter === "pending" 
                      ? "bg-amber-600 text-white" 
                      : "hover:bg-amber-100"
                  }`}
                  onClick={() => handleFilterChange("pending")}
                >
                  Pending
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeFilter === "expired" 
                      ? "bg-red-600 text-white" 
                      : "hover:bg-red-100"
                  }`}
                  onClick={() => handleFilterChange("expired")}
                >
                  Expired
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
                  <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-input hover:bg-secondary transition-colors relative">
                    <SlidersHorizontal className="h-4 w-4" />
                    {sortBy && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => handleSort("date")} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>Sort by Date</span>
                      {sortBy === "date" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("name")} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>Sort by Name</span>
                      {sortBy === "name" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("importance")} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>Sort by Priority</span>
                      {sortBy === "importance" && (
                        sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSortBy("");
                    toast({
                      title: "Show All Documents",
                      description: "All documents are now visible"
                    });
                    handleFilterChange("All");
                  }} className="cursor-pointer">
                    Show All Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {sortBy && (
              <div className="px-2 py-1 bg-muted rounded-md text-sm flex items-center">
                <span className="mr-1">Sorted by:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  {sortBy === "date" ? "Due Date" : sortBy === "name" ? "Name" : "Priority"}
                  {sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                </Badge>
                <button 
                  className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setSortBy("")}
                >
                  Clear
                </button>
              </div>
            )}
            
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
            
            {/* Document Status Overview */}
            <BlurContainer className="p-5">
              <h3 className="text-base font-medium mb-4">Document Status</h3>
              <div className="space-y-3">
                {["active", "pending", "completed", "expired"].map((status) => {
                  const count = documents.filter(doc => doc.status === status || (!doc.status && status === "active")).length;
                  const statusColors = {
                    active: "bg-blue-100 text-blue-600",
                    pending: "bg-amber-100 text-amber-600",
                    completed: "bg-green-100 text-green-600",
                    expired: "bg-red-100 text-red-600",
                  };
                  const statusIcons = {
                    active: <Clock className="h-4 w-4" />,
                    pending: <Clock className="h-4 w-4" />,
                    completed: <CheckCircle className="h-4 w-4" />,
                    expired: <AlertTriangle className="h-4 w-4" />,
                  };
                  return (
                    <div 
                      key={status} 
                      className="flex items-center justify-between cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-colors"
                      onClick={() => handleFilterChange(status)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${statusColors[status]}`}>
                          {statusIcons[status]}
                        </div>
                        <span className="text-sm capitalize">{status}</span>
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
