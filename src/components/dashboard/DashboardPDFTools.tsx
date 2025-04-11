
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PDFEditingTools from '../pdf/PDFEditingTools';

const DashboardPDFTools = () => {
  return (
    <div className="mt-6">
      <PDFEditingTools />
    </div>
  );
};

export default DashboardPDFTools;
