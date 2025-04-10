
declare module '@yudiel/react-qr-scanner' {
  import React from 'react';
  
  export interface IScannerProps {
    onDecode: (result: string) => void;
    onError: (err: any) => void;
    containerStyle?: Record<string, string>;
    // Add any other props the Scanner component accepts
  }
  
  export const Scanner: React.FC<IScannerProps>;
}
