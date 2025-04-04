
import { Document } from "@/contexts/DocumentContext";
import { toast } from "@/hooks/use-toast";

export type ExtractedDocumentInfo = {
  title?: string;
  dueDate?: string;
  category?: string;
  description?: string;
  extractedText: string;
};

// Mock OCR extraction function - in a real app, this would use Tesseract.js or a cloud API
export const extractTextFromImage = async (file: File): Promise<string> => {
  // In a real implementation, we would use OCR like Tesseract.js
  // For now, we'll simulate text extraction with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate extracted text based on file name
      const filename = file.name.toLowerCase();
      if (filename.includes("invoice")) {
        resolve("INVOICE\nDate: May 15, 2025\nDue Date: June 15, 2025\nAmount: $250.00\nFor: Professional Services");
      } else if (filename.includes("warranty")) {
        resolve("WARRANTY CERTIFICATE\nProduct: Samsung TV\nPurchase Date: April 1, 2025\nWarranty Valid Until: April 1, 2027");
      } else if (filename.includes("subscription")) {
        resolve("SUBSCRIPTION\nService: Netflix\nBilling Date: Monthly on the 20th\nAmount: $15.99");
      } else {
        resolve("Document content extracted. Please fill in the details manually if needed.");
      }
    }, 1000);
  });
};

// Function to extract text from PDF files
export const extractTextFromPdf = async (file: File): Promise<string> => {
  // In a real implementation, we would use pdf.js or a similar library
  return new Promise((resolve) => {
    setTimeout(() => {
      const filename = file.name.toLowerCase();
      if (filename.includes("invoice")) {
        resolve("INVOICE\nDate: May 15, 2025\nDue Date: June 15, 2025\nAmount: $250.00\nFor: Professional Services");
      } else {
        resolve("PDF content extracted. Please fill in the details manually if needed.");
      }
    }, 1000);
  });
};

// Process document file and extract information
export const processDocument = async (file: File): Promise<ExtractedDocumentInfo> => {
  try {
    toast({
      title: "Processing document",
      description: "Extracting text and information...",
    });
    
    let extractedText = "";
    
    if (file.type === "application/pdf") {
      extractedText = await extractTextFromPdf(file);
    } else if (file.type.startsWith("image/")) {
      extractedText = await extractTextFromImage(file);
    } else {
      extractedText = "File type not supported for text extraction";
    }
    
    // Extract key information from text
    const info = extractDocumentInfo(extractedText);
    
    toast({
      title: "Document processed",
      description: "Information extracted successfully",
    });
    
    return {
      ...info,
      extractedText
    };
  } catch (error) {
    console.error("Document processing error:", error);
    toast({
      title: "Processing failed",
      description: "Could not extract information from document",
      variant: "destructive",
    });
    return { extractedText: "" };
  }
};

// Extract information from document text using pattern matching
export const extractDocumentInfo = (text: string): Omit<ExtractedDocumentInfo, "extractedText"> => {
  let title = "";
  let dueDate = "";
  let category = "";
  let description = "";
  
  // Extract title - typically first line or line with "invoice", "warranty", etc.
  const firstLine = text.split('\n')[0];
  if (firstLine) {
    title = firstLine.trim();
  }
  
  // Extract due date
  const dueDateMatch = text.match(/due\s*date:?\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i) || 
                       text.match(/valid\s*until:?\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i) ||
                       text.match(/expires?:?\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i) ||
                       text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
                       
  if (dueDateMatch && dueDateMatch[1]) {
    dueDate = dueDateMatch[1];
  }
  
  // Determine category based on content
  if (text.toLowerCase().includes("invoice") || text.toLowerCase().includes("payment") || text.toLowerCase().includes("bill")) {
    category = "Invoice";
  } else if (text.toLowerCase().includes("warranty") || text.toLowerCase().includes("guarantee")) {
    category = "Warranty";
  } else if (text.toLowerCase().includes("subscription") || text.toLowerCase().includes("membership")) {
    category = "Subscription";
  } else if (text.toLowerCase().includes("ticket") || text.toLowerCase().includes("boarding") || text.toLowerCase().includes("flight")) {
    category = "Boarding Pass";
  } else {
    category = "Other";
  }
  
  // Extract description - use content after title or specific labeled section
  const descriptionMatch = text.match(/description:?\s*([^\n]+)/i) || 
                          text.match(/details:?\s*([^\n]+)/i) ||
                          text.match(/for:?\s*([^\n]+)/i);
                          
  if (descriptionMatch && descriptionMatch[1]) {
    description = descriptionMatch[1].trim();
  } else {
    // Use second line as description if nothing else found
    const lines = text.split('\n');
    if (lines.length > 1) {
      description = lines[1].trim();
    }
  }
  
  return { title, dueDate, category, description };
};
