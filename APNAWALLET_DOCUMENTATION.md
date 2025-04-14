
# ApnaWallet Documentation

**Version:** 1.0.0  
**Last Updated:** April 14, 2025  
**Status:** Production

![ApnaWallet Logo](https://via.placeholder.com/200x200?text=ApnaWallet+Logo)

## Table of Contents

1. [Introduction](#introduction)
2. [Core Features](#core-features)
3. [Security Architecture](#security-architecture)
4. [Document Management](#document-management)
5. [Notification System](#notification-system)
6. [User Experience](#user-experience)
7. [Chrome Extension](#chrome-extension)
8. [Mobile Application](#mobile-application)
9. [Backup & Recovery](#backup-recovery)
10. [Subscription Plans](#subscription-plans)
11. [Technical Specifications](#technical-specifications)
12. [API Documentation](#api-documentation)
13. [Frequently Asked Questions](#frequently-asked-questions)

## Introduction

ApnaWallet is a secure document management and personal information storage platform designed to help users organize, manage, and protect their sensitive documents and information. With end-to-end encryption and a zero-knowledge architecture, ApnaWallet ensures that your data remains private and secure at all times.

### Key Benefits

- **Data Security:** Enterprise-grade security with AES-256 encryption
- **Document Organization:** Intuitive categorization and tagging system
- **Expiry Tracking:** Never miss important document deadlines
- **Cross-Platform:** Access your documents from web, mobile, or browser extension
- **Secure Sharing:** Share documents safely with trusted contacts

## Core Features

### Document Management

ApnaWallet provides comprehensive document management features:

| Feature | Description | Availability |
|---------|-------------|--------------|
| Document Upload | Upload documents in multiple formats (PDF, JPEG, PNG, etc.) | All Plans |
| Document Categories | Organize documents into customizable categories | All Plans |
| Tagging System | Add custom tags to documents for easy retrieval | All Plans |
| Multiple View Modes | Switch between grid, list, and calendar views | All Plans |
| Document Version Control | Track changes and maintain document history | Premium+ |
| Metadata Management | Add and edit custom metadata fields | Basic+ |
| Advanced Search | Full-text search across documents and metadata | All Plans |

![Document Management Interface](https://via.placeholder.com/800x450?text=Document+Management+Interface)

### Security Architecture

ApnaWallet employs a multi-layered security approach:

- **End-to-End Encryption:** AES-256 encryption for all stored data
- **Zero-Knowledge Architecture:** Server cannot access unencrypted data
- **Biometric Authentication:** Support for fingerprint and facial recognition
- **Two-Factor Authentication:** Additional security layer for account access
- **Secure Vault:** Extra protection for critical documents
- **Encryption Key Backup:** Secure backup options for encryption keys

![Security Features](https://via.placeholder.com/800x450?text=Security+Features)

#### Technical Details

- **Encryption Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **TLS Version:** TLS 1.3
- **Certificate Pinning:** Enabled for mobile applications
- **Audit Logging:** Comprehensive security event logging

### Expiry Tracking

Never miss important deadlines with our advanced expiry tracking system:

- **Visual Calendar:** Color-coded calendar showing upcoming expirations
- **Custom Reminders:** Set personalized reminder schedules
- **Multi-Channel Notifications:** Email, push, and SMS notifications
- **Renewal Guidance:** Step-by-step renewal workflows
- **Deadline Prioritization:** Automatic sorting by urgency

![Expiry Calendar](https://via.placeholder.com/800x450?text=Expiry+Calendar)

### Notification System

Stay informed with our flexible notification system:

- **Email Notifications:** Receive updates and reminders via email
- **Push Notifications:** Real-time alerts on desktop and mobile
- **Voice Reminders:** Optional spoken notifications
- **Smart Scheduling:** Intelligent notification timing
- **Batch Notifications:** Group similar notifications to reduce interruptions

```typescript
// Notification Configuration Example
interface NotificationPreferences {
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    voice: boolean;
  };
  frequency: 'immediately' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // 24h format: "22:00"
    end: string;   // 24h format: "07:00"
  };
}
```

## User Experience

ApnaWallet offers an intuitive, user-friendly experience across all platforms:

- **Responsive Design:** Optimized for desktop, tablet, and mobile
- **Dark & Light Modes:** Choose your preferred visual theme
- **Customizable Dashboard:** Personalize your workspace layout
- **Accessibility Features:** Screen reader support and keyboard navigation
- **Localization:** Support for multiple languages
- **Cross-Device Sync:** Seamless experience across all your devices

![User Interface](https://via.placeholder.com/800x450?text=User+Interface)

### UI Components

- Material design principles with custom ApnaWallet styling
- Fluid animations and transitions
- Consistent color palette across platforms
- Touch-optimized controls on mobile
- High-contrast mode for accessibility

## Chrome Extension

Enhance your browsing experience with the ApnaWallet Chrome Extension:

- **Quick Document Access:** Access your documents directly from the browser
- **Web Content Capture:** Save web pages and screenshots to your vault
- **Secure Form Autofill:** Safely autofill forms with your stored information
- **Privacy Controls:** Granular control over browser integration
- **One-Click Saving:** Save files directly from the web to ApnaWallet

![Chrome Extension](https://via.placeholder.com/800x450?text=Chrome+Extension)

### Extension Technical Details

- **Size:** 2.4MB
- **Permissions:** Storage, Identity, Notifications, ActiveTab
- **Manifest Version:** v3
- **Browser Compatibility:** Chrome, Edge, Brave, Opera
- **Update Frequency:** Automatic background updates

## Mobile Application

Take ApnaWallet with you on the go:

- **Native Apps:** Purpose-built for iOS and Android
- **Offline Access:** View documents even without internet connection
- **Document Scanner:** Scan physical documents with your device camera
- **QR Code Sharing:** Share documents securely via QR codes
- **Biometric Security:** Fingerprint and facial recognition login
- **Home Screen Widgets:** Quick access to important documents

![Mobile App](https://via.placeholder.com/800x450?text=Mobile+App)

### Mobile Technical Specifications

- **iOS Requirement:** iOS 14.0 or later
- **Android Requirement:** Android 8.0 (Oreo) or later
- **Size:** iOS: 45MB, Android: 38MB
- **Frameworks:** React Native with native modules
- **Camera Access:** Required for document scanning
- **Location Access:** Optional for document geo-tagging

## Backup & Recovery

Keep your data safe with comprehensive backup options:

- **Automatic Backups:** Schedule regular backups of your vault
- **Cloud Storage Export:** Export documents to third-party cloud storage
- **Recovery Key Management:** Generate and securely store recovery keys
- **Backup Status Tracking:** Monitor backup history and status
- **Encrypted Backups:** All backups are encrypted for maximum security

![Backup Center](https://via.placeholder.com/800x450?text=Backup+Center)

### Backup Technical Details

```typescript
interface BackupOptions {
  frequency: 'daily' | 'weekly' | 'monthly';
  encryptionLevel: 'standard' | 'enhanced';
  destinations: Array<'local' | 'cloud' | 'external'>;
  compressionEnabled: boolean;
  retentionPolicy: {
    keepVersions: number;
    maxAge: number; // days
  };
}
```

## Sharing & Collaboration

Share documents securely with trusted contacts:

- **Advanced Sharing Controls:** Granular permission settings
- **Permission Management:** Control who can view, edit, or download
- **Access Tracking:** Monitor when documents are accessed
- **Secure Links:** Time-limited, password-protected sharing links
- **Revocation:** Instantly revoke access to shared documents

![Sharing Interface](https://via.placeholder.com/800x450?text=Sharing+Interface)

## Subscription Plans

Choose the right plan for your needs:

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Document Limit | 10 | 50 | Unlimited | Unlimited |
| Document Size | 5MB | 15MB | 25MB | 100MB |
| Cloud Backup | ❌ | ✅ | ✅ | ✅ |
| Advanced Sharing | ❌ | ❌ | ✅ | ✅ |
| Team Management | ❌ | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Custom Categories | 5 | 15 | Unlimited | Unlimited |
| Custom Metadata | ❌ | ✅ | ✅ | ✅ |
| Monthly Price | Free | $4.99 | $9.99 | $24.99 |
| Annual Price | Free | $49.90 | $99.90 | $249.90 |

## Technical Specifications

### Front-End Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI library
- **State Management:** Context API + React Query
- **Build Tool:** Vite
- **Animation:** Framer Motion

### Security Implementation

- **Authentication Flow:**
  1. Password-based key derivation (PBKDF2)
  2. Generation of encryption key
  3. Two-factor verification (if enabled)
  4. Session token issuance

- **Document Encryption Process:**
  1. Generate unique document key
  2. Encrypt document with key using AES-256-GCM
  3. Encrypt document key with user's master key
  4. Store encrypted document and encrypted key

```typescript
// Simplified encryption flow pseudocode
function encryptDocument(document: File, masterKey: CryptoKey): EncryptedDocument {
  // Generate random document key
  const documentKey = generateRandomKey();
  
  // Encrypt document with document key
  const encryptedContent = aesGcmEncrypt(document.arrayBuffer, documentKey);
  
  // Encrypt document key with master key
  const encryptedDocumentKey = encryptDocumentKey(documentKey, masterKey);
  
  return {
    id: generateUUID(),
    encryptedContent,
    encryptedDocumentKey,
    metadata: { /* document metadata */ }
  };
}
```

## API Documentation

ApnaWallet provides a secure API for integrations:

### Authentication

```
POST /api/auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "hashed-password"
}

Response:
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 3600
}
```

### Document Operations

```
GET /api/documents
Authorization: Bearer <jwt-token>

Response:
{
  "documents": [
    {
      "id": "doc-uuid",
      "title": "Passport",
      "type": "identity",
      "createdAt": "2025-01-15T12:00:00Z",
      "updatedAt": "2025-01-15T12:00:00Z",
      "metadata": { /* encrypted metadata */ }
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 45
  }
}
```

## Frequently Asked Questions

### Security

**Q: Can ApnaWallet employees access my documents?**  
A: No. We employ a zero-knowledge architecture, meaning your documents are encrypted with keys that only you possess. Even our staff cannot access your unencrypted data.

**Q: What happens if I forget my password?**  
A: You can recover your account using your backup recovery key. Without either your password or recovery key, your encrypted data cannot be recovered.

**Q: Is my data encrypted during transmission?**  
A: Yes. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.

### Usage

**Q: Can I access my documents offline?**  
A: Yes. The mobile app supports offline access to documents you've previously viewed while online.

**Q: How many devices can I use with my account?**  
A: Free accounts can use up to 2 devices, Basic accounts up to 3 devices, and Premium/Enterprise accounts have unlimited device access.

**Q: Does ApnaWallet extract data from my documents?**  
A: Yes, with your permission. We can extract expiration dates and other relevant information to provide reminders and enhanced organization.

### Technical

**Q: Which document formats are supported?**  
A: ApnaWallet supports PDF, DOCX, JPG, PNG, GIF, TXT, and many other common formats. The complete list is available in our support center.

**Q: Is there a size limit for individual documents?**  
A: Yes. Free accounts: 5MB per document, Basic: 15MB, Premium: 25MB, Enterprise: 100MB.

**Q: Can I import documents from other services?**  
A: Yes. ApnaWallet supports direct import from Google Drive, Dropbox, and OneDrive.

## Contact & Support

- **Email:** support@apnawallet.com
- **Phone:** +1-800-APNA-123
- **Hours:** 24/7 support for Premium and Enterprise users, 9am-5pm EST for all other users
- **Website:** [https://www.apnawallet.com/support](https://www.apnawallet.com/support)

---

© 2025 ApnaWallet Technologies, Inc. All rights reserved.
