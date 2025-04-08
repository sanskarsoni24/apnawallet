import React from 'react';
import DocumentReminderSettingsWrapper from './DocumentReminderSettingsWrapper';
import { Document } from "@/contexts/DocumentContext";

interface DocumentReminderSettingsProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

// This is a wrapper component that allows us to keep backward compatibility
// while using our new implementation
const DocumentReminderSettings: React.FC<DocumentReminderSettingsProps> = ({ document, isOpen, onClose }) => {
  return (
    <DocumentReminderSettingsWrapper document={document} isOpen={isOpen} onClose={onClose} />
  );
};

export default DocumentReminderSettings;
