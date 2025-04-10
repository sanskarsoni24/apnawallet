
import { ReactNode } from 'react';

declare module '@yudiel/react-qr-scanner' {
  export interface IScannerProps {
    onDecode?: (result: any) => void;
    onError?: (error: any) => void;
    containerStyle?: React.CSSProperties;
    scanDelay?: number;
    constraints?: MediaStreamConstraints;
    stopDecoding?: boolean;
    facingMode?: string;
    children?: ReactNode;
  }
  
  export const Scanner: React.FC<IScannerProps>;
}
