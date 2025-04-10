
import webSocketService from "./WebSocketService";
import { toast } from "@/hooks/use-toast";

export interface ScannedDocument {
  id: string;
  name: string;
  type: string;
  content: string; // Base64 encoded content
  timestamp: string;
  thumbnailUrl?: string;
  size?: number;
  preview?: string;
}

class DocumentScanService {
  // Store scanned documents in memory
  private scannedDocuments: ScannedDocument[] = [];
  private documentListeners: Array<(docs: ScannedDocument[]) => void> = [];
  private newDocumentListeners: Array<(doc: ScannedDocument) => void> = [];

  constructor() {
    // Initialize WebSocket connection when document service is initialized
    this.setupWebSocketListeners();
  }

  // Set up WebSocket event listeners for document-related events
  private setupWebSocketListeners(): void {
    webSocketService.on('documentReceived', (documentData) => {
      this.handleReceivedDocument(documentData);
    });

    webSocketService.on('connectionChange', (data) => {
      if (data.status === 'connected') {
        console.log('Document service connected to WebSocket', data.sessionId);
      } else {
        console.log('Document service disconnected from WebSocket');
      }
    });
  }

  // Create a new scanning session
  async createScanSession(): Promise<string | null> {
    const sessionId = this.generateSessionId();
    const connected = await webSocketService.connect(sessionId);
    
    if (connected) {
      return sessionId;
    }
    
    return null;
  }

  // Process a scanned document
  processScannedDocument(imageData: string, fileName: string = 'Scanned Document'): ScannedDocument {
    const doc: ScannedDocument = {
      id: this.generateDocumentId(),
      name: fileName,
      type: 'scan',
      content: imageData,
      timestamp: new Date().toISOString(),
      thumbnailUrl: imageData,
      preview: imageData
    };

    // Add to local cache
    this.scannedDocuments.push(doc);
    
    // Notify listeners
    this.notifyDocumentListeners();
    this.notifyNewDocumentListeners(doc);
    
    // Send via WebSocket
    this.sendDocumentViaWebSocket(doc);
    
    return doc;
  }

  // Send document data via WebSocket
  private sendDocumentViaWebSocket(doc: ScannedDocument): void {
    try {
      // For the demo, we'll use the simulation
      webSocketService.simulateSendMessage('documentScanned', doc);
      
      // In a real implementation, use:
      // webSocketService.sendMessage('documentScanned', doc);
    } catch (error) {
      console.error('Error sending document via WebSocket:', error);
      toast({
        title: "Connection error",
        description: "Could not send document to browser. Retrying...",
        variant: "destructive"
      });
      
      // Retry after delay
      setTimeout(() => {
        this.sendDocumentViaWebSocket(doc);
      }, 3000);
    }
  }

  // Handle a document received via WebSocket
  private handleReceivedDocument(documentData: ScannedDocument): void {
    // Check if document already exists
    const existingDocIndex = this.scannedDocuments.findIndex(doc => doc.id === documentData.id);
    
    if (existingDocIndex >= 0) {
      // Update existing document
      this.scannedDocuments[existingDocIndex] = documentData;
    } else {
      // Add new document
      this.scannedDocuments.push(documentData);
    }
    
    // Notify listeners
    this.notifyDocumentListeners();
    this.notifyNewDocumentListeners(documentData);
    
    // Show toast notification
    toast({
      title: "Document received",
      description: `"${documentData.name}" has been received from mobile device`,
    });
  }

  // Get all scanned documents
  getScannedDocuments(): ScannedDocument[] {
    return [...this.scannedDocuments];
  }

  // Listen for document list changes
  onDocumentsChanged(callback: (docs: ScannedDocument[]) => void): void {
    this.documentListeners.push(callback);
    // Immediately call with current documents
    callback(this.getScannedDocuments());
  }

  // Listen for new documents
  onNewDocument(callback: (doc: ScannedDocument) => void): void {
    this.newDocumentListeners.push(callback);
  }

  // Remove document listener
  removeDocumentsChangedListener(callback: (docs: ScannedDocument[]) => void): void {
    this.documentListeners = this.documentListeners.filter(cb => cb !== callback);
  }

  // Remove new document listener
  removeNewDocumentListener(callback: (doc: ScannedDocument) => void): void {
    this.newDocumentListeners = this.newDocumentListeners.filter(cb => cb !== callback);
  }

  // Notify all document list listeners
  private notifyDocumentListeners(): void {
    const docs = this.getScannedDocuments();
    this.documentListeners.forEach(callback => callback(docs));
  }

  // Notify all new document listeners
  private notifyNewDocumentListeners(doc: ScannedDocument): void {
    this.newDocumentListeners.forEach(callback => callback(doc));
  }

  // Generate a session ID
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Generate a document ID
  private generateDocumentId(): string {
    return 'doc_' + new Date().getTime() + '_' + 
           Math.random().toString(36).substring(2, 9);
  }

  // Convert scanned image to PDF (simplified for demo)
  convertToPdf(imageData: string): Promise<string> {
    return new Promise((resolve) => {
      // In a real implementation, this would use a PDF generation library
      // For this demo, we'll just simulate it
      setTimeout(() => {
        resolve(`pdf_${imageData}`);
      }, 1000);
    });
  }

  // Clear all documents
  clearDocuments(): void {
    this.scannedDocuments = [];
    this.notifyDocumentListeners();
  }
}

// Create a singleton instance
const documentScanService = new DocumentScanService();

export default documentScanService;
