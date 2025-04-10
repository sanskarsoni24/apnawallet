import { format, parseISO, differenceInDays, addDays, parse, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Function to check if a document is due soon
export const isDocumentDueSoon = (expiryDate: string, reminderDays: number = 3): boolean => {
  try {
    const expiry = parseISO(expiryDate);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const timeZoneFormattedNow = formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
    const today = parseISO(timeZoneFormattedNow);
    const diffInDays = differenceInDays(expiry, today);
    return diffInDays <= reminderDays && diffInDays >= 0;
  } catch (error) {
    console.error("Error processing expiry date:", error);
    return false;
  }
};

// Function to format the expiry date
export const formatExpiryDate = (expiryDate: string): string => {
  try {
    return format(parseISO(expiryDate), 'MMMM dd, yyyy');
  } catch (error) {
    console.error("Error formatting expiry date:", error);
    return 'Invalid Date';
  }
};

// Function to calculate the days remaining until expiry
export const getDaysUntilExpiry = (expiryDate: string): number => {
  try {
    const expiry = parseISO(expiryDate);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const timeZoneFormattedNow = formatInTimeZone(now, timeZone, 'yyyy-MM-dd');
    const today = parseISO(timeZoneFormattedNow);
    return differenceInDays(expiry, today);
  } catch (error) {
    console.error("Error calculating days until expiry:", error);
    return -1;
  }
};

// Function to add a specified number of days to a date
export const addDaysToDate = (startDate: string, daysToAdd: number): string => {
  try {
    const parsedDate = parseISO(startDate);
    const newDate = addDays(parsedDate, daysToAdd);
    return format(newDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error adding days to date:", error);
    return 'Invalid Date';
  }
};

// Function to process document and extract information
export const processDocument = async (file: File): Promise<{
  title?: string;
  category?: string;
  dueDate?: string;
  description?: string;
}> => {
  // Here we would normally use OCR or other document processing APIs
  // For now, we'll implement a simple simulation with improved accuracy
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract filename without extension as potential title
      const fileName = file.name.split('.')[0];
      
      // Create more accurate extraction results based on filename patterns
      let result: {
        title?: string;
        category?: string;
        dueDate?: string;
        description?: string;
      } = {};
      
      // Improved document type detection based on common keywords
      const lowerFileName = fileName.toLowerCase();
      
      // Document type detection with improved accuracy
      if (lowerFileName.includes('invoice') || lowerFileName.includes('bill')) {
        result.category = 'Invoice';
        result.description = 'Payment document that requires attention';
      } else if (lowerFileName.includes('passport') || lowerFileName.includes('visa')) {
        result.category = 'Identity Document';
        result.description = 'Important personal identification document';
      } else if (lowerFileName.includes('insurance') || lowerFileName.includes('policy')) {
        result.category = 'Insurance';
        result.description = 'Insurance policy document';
      } else if (lowerFileName.includes('license') || lowerFileName.includes('permit')) {
        result.category = 'License';
        result.description = 'Official permission or authorization document';
      } else if (lowerFileName.includes('tax') || lowerFileName.includes('return')) {
        result.category = 'Tax Document';
        result.description = 'Tax-related document';
      } else if (lowerFileName.includes('certificate') || lowerFileName.includes('diploma')) {
        result.category = 'Certificate';
        result.description = 'Achievement or qualification document';
      } else {
        result.category = 'Other';
        result.description = 'General document';
      }

      // Set a more sensible title based on the filename
      result.title = fileName.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Generate plausible due date based on document type
      const today = new Date();
      let dueDate = new Date();
      
      if (result.category === 'Invoice') {
        // Invoices typically due in 2-4 weeks
        dueDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 14);
      } else if (result.category === 'Identity Document' || result.category === 'License') {
        // IDs and licenses typically expire in 1-5 years
        dueDate.setFullYear(today.getFullYear() + Math.floor(Math.random() * 4) + 1);
      } else if (result.category === 'Insurance') {
        // Insurance typically renews annually
        dueDate.setMonth(today.getMonth() + 11 + Math.floor(Math.random() * 2));
      } else if (result.category === 'Tax Document') {
        // Tax documents often due quarterly or annually
        dueDate.setMonth(today.getMonth() + 3);
      } else {
        // Default expiry in 1-3 months
        dueDate.setMonth(today.getMonth() + Math.floor(Math.random() * 2) + 1);
      }
      
      result.dueDate = format(dueDate, 'yyyy-MM-dd');
      
      resolve(result);
    }, 1500); // Simulate processing time
  });
};

// Function to parse dates in multiple formats
export const parseMultiFormatDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Try direct Date parsing first
  let parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  
  // List of common date formats to try
  const dateFormats = [
    'yyyy-MM-dd',    // 2023-04-25
    'MM/dd/yyyy',    // 04/25/2023
    'dd/MM/yyyy',    // 25/04/2023
    'MMMM d, yyyy',  // April 25, 2023
    'MMM d, yyyy',   // Apr 25, 2023
    'dd-MMM-yyyy',   // 25-Apr-2023
    'd MMMM yyyy',   // 25 April 2023
    'yyyy.MM.dd',    // 2023.04.25
  ];
  
  // Try each format
  for (const dateFormat of dateFormats) {
    try {
      parsedDate = parse(dateString, dateFormat, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      // Continue trying other formats
    }
  }
  
  // If no format worked, return null
  return null;
};

// Function to extract text from document image (simulation)
export const extractTextFromImage = async (file: File): Promise<string> => {
  // This would normally use Tesseract.js or a cloud OCR service
  // For now, just simulate the process
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return simulated text based on file name
      const fileName = file.name.toLowerCase();
      
      if (fileName.includes('invoice')) {
        resolve("INVOICE\nDate: 2023-10-15\nAmount: $250.00\nDue Date: 2023-11-15\nThank you for your business!");
      } else if (fileName.includes('passport')) {
        resolve("PASSPORT\nName: John Doe\nDate of Birth: 1980-01-15\nExpiration: 2030-01-15\nPassport Number: AB123456");
      } else if (fileName.includes('license')) {
        resolve("DRIVER'S LICENSE\nName: Jane Smith\nIssue Date: 2020-05-10\nExpiration Date: 2025-05-10\nLicense Number: DL9876543");
      } else if (fileName.includes('certificate')) {
        resolve("CERTIFICATE\nThis certifies that John Doe\nhas successfully completed\nAdvanced Course\nDate of Issue: 2023-09-01");
      } else {
        resolve("Document content extraction simulation.\nThis is placeholder text that would normally be extracted using OCR technology.\nDate: 2023-10-20\nRef: DOC-12345\nExpiry: 2024-10-20");
      }
    }, 2000);
  });
};

// Function to generate a summary of a document
export const generateDocumentSummary = async (text: string, category?: string): Promise<string> => {
  // This would normally use AI/NLP to generate a summary
  // For now, we'll simulate with predefined summaries based on document type
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      if (category === 'Invoice' || lowerText.includes('invoice')) {
        resolve("This is an invoice document that contains payment details and requires action by the due date. Please review the amount and payment method.");
      } else if (category === 'Identity Document' || lowerText.includes('passport') || lowerText.includes('license')) {
        resolve("This is an identification document containing personal information. It has an expiration date and should be kept secure.");
      } else if (category === 'Insurance' || lowerText.includes('insurance') || lowerText.includes('policy')) {
        resolve("This insurance document outlines coverage details, policy period, and conditions. Check the renewal date and coverage limits.");
      } else if (category === 'Tax Document' || lowerText.includes('tax')) {
        resolve("This tax-related document contains important financial information. Please verify all numbers and keep for your records.");
      } else if (category === 'Certificate' || lowerText.includes('certificate')) {
        resolve("This certificate verifies an achievement, qualification, or participation. Note the issuing authority and date of issue.");
      } else if (lowerText.includes('agreement') || lowerText.includes('contract')) {
        resolve("This document appears to be a legal agreement outlining terms and conditions between parties. Review the obligations and termination clauses.");
      } else if (lowerText.includes('report') || lowerText.includes('analysis')) {
        resolve("This report contains data analysis and findings. Check the methodology section and key conclusions.");
      } else {
        // Generic summary
        resolve("This document contains important information. Key details include dates, names, and possibly amounts. Review the document for specific actions required.");
      }
    }, 1000);
  });
};

// Function to generate a summary of a document with improved accuracy
export const generateDocumentSummary = async (text: string, category?: string): Promise<string> => {
  // This would normally use AI/NLP to generate a summary
  // For now, we'll create more accurate summaries based on document content and type
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Extract key information from text
      const dateMatches = text.match(/\b(date|issued|expiry|expiration|due):\s*([^\n,]+)/gi);
      const amountMatches = text.match(/\b(amount|total|sum|payment):\s*([^\n,]+)/gi);
      const nameMatches = text.match(/\b(name|issued to|holder|owner):\s*([^\n,]+)/gi);
      const idMatches = text.match(/\b(id|number|reference|ref):\s*([^\n,]+)/gi);
      
      // Prepare data extracted fragments
      const keyData = [];
      if (dateMatches) keyData.push(...dateMatches);
      if (amountMatches) keyData.push(...amountMatches);
      if (nameMatches) keyData.push(...nameMatches);
      if (idMatches) keyData.push(...idMatches);
      
      let extractedDataSummary = "";
      if (keyData.length > 0) {
        extractedDataSummary = `Key information extracted: ${keyData.join(', ')}.`;
      }
      
      // Generate category-specific summaries with the extracted data
      if (category === 'Invoice' || lowerText.includes('invoice')) {
        resolve(`This invoice document requires payment attention by the specified due date. ${extractedDataSummary} Please review the payment details and ensure timely processing.`);
      } else if (category === 'Identity Document' || lowerText.includes('passport') || lowerText.includes('license')) {
        resolve(`This identification document contains personal information with an expiration date. ${extractedDataSummary} Keep this document secure and note when renewal is needed.`);
      } else if (category === 'Insurance' || lowerText.includes('insurance') || lowerText.includes('policy')) {
        resolve(`This insurance document outlines coverage details and policy period. ${extractedDataSummary} Verify coverage limits and renewal requirements.`);
      } else if (category === 'Tax Document' || lowerText.includes('tax')) {
        resolve(`This tax-related document contains important financial information. ${extractedDataSummary} Verify all numerical data and maintain for your records.`);
      } else if (category === 'Certificate' || lowerText.includes('certificate')) {
        resolve(`This certificate verifies a qualification or achievement. ${extractedDataSummary} Note the issuing authority and any expiration dates.`);
      } else if (lowerText.includes('agreement') || lowerText.includes('contract')) {
        resolve(`This legal agreement outlines terms and conditions between parties. ${extractedDataSummary} Review obligations, termination clauses, and important dates.`);
      } else if (lowerText.includes('report') || lowerText.includes('analysis')) {
        resolve(`This document contains analytical findings and data. ${extractedDataSummary} Check the methodology section and key conclusions.`);
      } else {
        // Generate a more specific generic summary based on extracted text
        const textSnippet = text.substring(0, 100).replace(/\n/g, ' ').trim();
        resolve(`This document appears to contain important information. ${extractedDataSummary} The document begins with: "${textSnippet}...". Review for any required actions or important dates.`);
      }
    }, 1000);
  });
};

// Function to extract text from document image with improved OCR simulation
export const extractTextFromImage = async (file: File): Promise<string> => {
  // This would normally use Tesseract.js or a cloud OCR service
  // For now, just simulate the process with more detailed text extraction
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return simulated text based on file name and type
      const fileName = file.name.toLowerCase();
      const fileType = file.type.split('/').pop()?.toLowerCase();
      
      // Generate more realistic OCR text based on document type
      if (fileName.includes('invoice')) {
        resolve(
          "INVOICE #INV-2023-1045\n" +
          "Date: 2023-10-15\n" +
          "Due Date: 2023-11-15\n\n" +
          "Bill To: John Smith\n" +
          "Company: Acme Corporation\n" +
          "Address: 123 Business St, Suite 100\n\n" +
          "Item Description: Professional Services\n" +
          "Quantity: 1\n" +
          "Rate: $250.00\n" +
          "Amount: $250.00\n\n" +
          "Subtotal: $250.00\n" +
          "Tax (8%): $20.00\n" +
          "Total: $270.00\n\n" +
          "Payment Terms: Net 30\n" +
          "Thank you for your business!"
        );
      } else if (fileName.includes('passport')) {
        resolve(
          "PASSPORT\n" +
          "Type: P\n" +
          "Country Code: USA\n" +
          "Passport No: AB123456\n" +
          "Surname: DOE\n" +
          "Given Names: JOHN MICHAEL\n" +
          "Nationality: UNITED STATES OF AMERICA\n" +
          "Date of Birth: 15 JAN 1980\n" +
          "Place of Birth: NEW YORK, USA\n" +
          "Date of Issue: 10 JAN 2020\n" +
          "Date of Expiry: 09 JAN 2030\n" +
          "Authority: UNITED STATES DEPARTMENT OF STATE"
        );
      } else if (fileName.includes('license')) {
        resolve(
          "DRIVER LICENSE\n" +
          "License No: DL9876543\n" +
          "Class: C\n" +
          "Endorsements: NONE\n" +
          "Restrictions: CORRECTIVE LENSES\n" +
          "Name: SMITH, JANE A\n" +
          "Address: 456 RESIDENTIAL DR, ANYTOWN, CA 90210\n" +
          "Sex: F\n" +
          "Height: 5'-5"\n" +
          "Eyes: BRN\n" +
          "Hair: BRN\n" +
          "Date of Birth: 07/15/1985\n" +
          "Issue Date: 05/10/2020\n" +
          "Expiration Date: 07/15/2025\n" +
          "DD: 12345678901234567890"
        );
      } else if (fileName.includes('certificate')) {
        resolve(
          "CERTIFICATE OF COMPLETION\n" +
          "This certifies that\n\n" +
          "JOHN DOE\n\n" +
          "has successfully completed\n" +
          "ADVANCED PROFESSIONAL DEVELOPMENT COURSE\n" +
          "40 Credit Hours\n\n" +
          "Date of Issue: September 1, 2023\n" +
          "Certificate ID: CERT-2023-78901\n\n" +
          "Issued by: Professional Training Institute\n" +
          "Accreditation: National Education Board\n" +
          "Verified by: Jane Smith, Director of Education"
        );
      } else if (fileName.includes('insurance')) {
        resolve(
          "INSURANCE POLICY\n" +
          "Policy Number: POL-2023-45678\n" +
          "Policyholder: Robert Johnson\n" +
          "Effective Date: January 1, 2023\n" +
          "Expiration Date: December 31, 2023\n\n" +
          "Coverage Type: Comprehensive\n" +
          "Coverage Limits: $500,000\n" +
          "Deductible: $1,000\n\n" +
          "Insured Property: 789 Home Avenue, Hometown, ST 12345\n" +
          "Premium: $1,200.00 annually\n" +
          "Payment Schedule: Monthly ($100.00)\n\n" +
          "Special Provisions: Flood coverage included\n" +
          "Claims Contact: 1-800-555-1234"
        );
      } else if (fileName.includes('tax')) {
        resolve(
          "TAX DOCUMENT\n" +
          "Form: 1099-MISC\n" +
          "Tax Year: 2022\n\n" +
          "Payer: XYZ Corporation\n" +
          "Payer TIN: 12-3456789\n" +
          "Payer Address: 555 Corporate Way, Business City, ST 67890\n\n" +
          "Recipient: Michael Brown\n" +
          "Recipient TIN: 987-65-4321\n" +
          "Recipient Address: 321 Personal St, Hometown, ST 12345\n\n" +
          "Box 1: Rents - $0.00\n" +
          "Box 2: Royalties - $0.00\n" +
          "Box 3: Other Income - $12,500.00\n" +
          "Box 4: Federal Tax Withheld - $1,250.00\n\n" +
          "This information is being furnished to the Internal Revenue Service."
        );
      } else {
        // More detailed generic text for any other document type
        resolve(
          "DOCUMENT: " + (fileName.split('.')[0] || "Untitled") + "\n" +
          "Reference: DOC-" + Math.floor(10000 + Math.random() * 90000) + "\n" +
          "Date: " + new Date().toISOString().split('T')[0] + "\n" +
          "Page: 1 of 3\n\n" +
          "This document contains important information regarding your account and services.\n\n" +
          "Account Number: ACCT-" + Math.floor(100000 + Math.random() * 900000) + "\n" +
          "Customer ID: CUST-" + Math.floor(10000 + Math.random() * 90000) + "\n" +
          "Status: Active\n\n" +
          "Important Information:\n" +
          "Please review all details carefully and retain this document for your records.\n" +
          "For any questions or concerns, please contact customer service at the number\n" +
          "listed on the back of your card or visit our website.\n\n" +
          "Expiry: " + new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] + "\n" +
          "Authorization Code: AUTH-" + Math.floor(1000 + Math.random() * 9000) + "\n\n" +
          "Thank you for choosing our services."
        );
      }
    }, 2000);
  });
};
