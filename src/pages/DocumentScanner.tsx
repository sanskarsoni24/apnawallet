
import React from 'react';
import Container from '@/components/layout/Container';
import DocumentScanner from '@/components/documents/DocumentScanner';
import { useIsMobileDevice } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const DocumentScannerPage: React.FC = () => {
  const isMobile = useIsMobileDevice();
  
  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Scanner</h1>
          <p className="text-muted-foreground">
            Scan documents with your device camera and save them as PDF
          </p>
        </div>
        
        {!isMobile && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Desktop detected</AlertTitle>
            <AlertDescription>
              For the best scanning experience, please use this feature on a mobile device.
            </AlertDescription>
          </Alert>
        )}
        
        <DocumentScanner />
      </div>
    </Container>
  );
};

export default DocumentScannerPage;
