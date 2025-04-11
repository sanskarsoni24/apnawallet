
import React from 'react';
import Container from '@/components/layout/Container';
import PDFEditingTools from '@/components/pdf/PDFEditingTools';
import { FileText } from 'lucide-react';

const PDFTools = () => {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              PDF Tools
            </h1>
            <p className="text-muted-foreground">
              Manage, edit, and organize your PDF documents with these powerful tools
            </p>
          </div>
        </div>
        
        <PDFEditingTools />
      </div>
    </Container>
  );
};

export default PDFTools;
