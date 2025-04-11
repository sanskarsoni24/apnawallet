
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PDFEditingTools from '../pdf/PDFEditingTools';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BlurContainer from '../ui/BlurContainer';
import { Button } from '../ui/button';
import { ArrowRight, File, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPDFTools = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 mb-10">
      <BlurContainer variant="default">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PDF Tools</h2>
                <p className="text-muted-foreground">
                  Powerful tools to manage and edit your PDF documents
                </p>
              </div>
            </div>
            <Link to="/pdf-tools">
              <Button variant="outline" className="flex items-center gap-2">
                <File className="h-4 w-4" />
                All PDF Tools
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <PDFEditingTools />
        </div>
      </BlurContainer>
    </div>
  );
};

export default DashboardPDFTools;
