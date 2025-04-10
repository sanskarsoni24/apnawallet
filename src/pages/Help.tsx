
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoFaq from "@/components/faq/VideoFaq";
import { 
  Mail, MessageCircle, ShieldCheck, HelpCircle, Share2, Upload, Download, 
  Clock, Bell, Lock, Smartphone, CloudOff, Database, FileWarning, Key, 
  FileEdit, FileSearch, Tags, Layers, PieChart, FileBox, Languages,
  Wallet, Fingerprint, History, Calendar, CreditCard, Binary
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecurityInfo from "@/components/help/SecurityInfo";
import DocumentSharing from "@/components/documents/DocumentSharing";
import { useUser } from "@/contexts/UserContext";
import HelpContextCard from "@/components/help/HelpContextCard";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const isPremium = user?.subscriptionPlan && ['premium', 'enterprise'].includes(user.subscriptionPlan);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and learn how to use our features
          </p>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
          <Input 
            type="text" 
            placeholder="Search for help..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
          <Button type="submit">
            <HelpCircle className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Context-aware help card */}
        <HelpContextCard />

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="faq" className="text-xs md:text-sm flex items-center gap-1">
              <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs md:text-sm flex items-center gap-1">
              <Smartphone className="h-3 w-3 md:h-4 md:w-4" />
              <span>Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs md:text-sm flex items-center gap-1">
              <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <VideoFaq />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        <span>How do I upload documents?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">You can upload documents in several ways:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>From the Dashboard, click the "Upload Document" button</li>
                        <li>Drag and drop files directly into the document area</li>
                        <li>Use our mobile app to scan physical documents with your camera</li>
                        <li>Import from cloud storage (Premium feature)</li>
                      </ol>
                      <p className="mt-2">
                        We support various file formats including PDF, JPG, PNG, DOCX, and more.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-primary" />
                        <span>How do I download or export my documents?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>To download a document:</p>
                      <ol className="list-decimal pl-5 space-y-2 my-2">
                        <li>Open the document you want to download</li>
                        <li>Click the "Download" button in the top-right corner</li>
                        <li>Select your preferred format (if available)</li>
                      </ol>
                      <p>For Premium users, you can also export directly to cloud storage:</p>
                      <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Go to Settings → Backup & Export</li>
                        <li>Connect to your preferred cloud service</li>
                        <li>Select documents to export</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" />
                        <span>How do I share documents securely?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>You can share documents securely in several ways:</p>
                      <ol className="list-decimal pl-5 space-y-2 my-2">
                        <li>Generate a secure link with optional password protection</li>
                        <li>Share directly with other ApnaWallet users via email</li>
                        <li>Set an expiration date for shared links</li>
                        <li>Control permissions (view, download, edit) - Premium feature</li>
                      </ol>
                      <p>To share a document:</p>
                      <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Open the document or select it from your document list</li>
                        <li>Click the "Share" button</li>
                        <li>Configure your sharing options</li>
                        <li>Copy the link or enter the recipient's email</li>
                      </ol>
                      
                      <div className="mt-4 mb-2">Example of the sharing dialog:</div>
                      <DocumentSharing documentId="123" documentName="Sample Document" />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>How do I set document reminders?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>To set reminders for document expiration or renewal:</p>
                      <ol className="list-decimal pl-5 space-y-2 my-2">
                        <li>Open the document details</li>
                        <li>Click "Set Reminder" or find the reminder section</li>
                        <li>Choose the expiration/renewal date</li>
                        <li>Select how many days before to be notified</li>
                        <li>Choose notification methods (email, push, etc.)</li>
                      </ol>
                      <p>
                        You can view all upcoming reminders on your Dashboard in the 
                        "Upcoming Deadlines" section.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span>What if I forget my password?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        If you forget your password, you can use the "Forgot Password" 
                        feature on the login page.
                      </p>
                      <p className="my-2">
                        However, due to our end-to-end encryption system, if you lose your 
                        password and don't have a recovery method set up, we cannot recover 
                        your encrypted documents.
                      </p>
                      <p>We recommend:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Setting up a recovery email</li>
                        <li>Adding a phone number for recovery</li>
                        <li>Storing a backup of your encryption key in a safe place (Premium feature)</li>
                        <li>Using a trusted password manager</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        <span>Is there a limit to how many documents I can upload?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, the number of documents you can upload depends on your subscription plan:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 my-2">
                        <li>Free users: Up to 10 documents with a maximum size of 5MB each</li>
                        <li>Basic plan: Up to 50 documents with a maximum size of 15MB each</li>
                        <li>Premium plan: Unlimited documents with a maximum size of 25MB each</li>
                        <li>Enterprise plan: Unlimited documents with a maximum size of 100MB each</li>
                      </ul>
                      <p>
                        You can view your current usage and limits in the Account section of your settings.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <span>How do I customize my notification preferences?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>To customize notification preferences:</p>
                      <ol className="list-decimal pl-5 space-y-2 my-2">
                        <li>Go to Settings → Notifications</li>
                        <li>Toggle email, push, or voice notifications</li>
                        <li>Set how many days before expiry you want to be notified</li>
                        <li>Configure quiet hours if needed</li>
                        <li>Select which document types require notifications</li>
                      </ol>
                      <p>
                        Premium users have access to additional notification channels and more
                        granular control over frequency and timing.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Tags className="h-5 w-5 text-primary" />
                        <span>How do I organize documents with categories and tags?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">For better document organization:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <strong>Categories:</strong> When uploading a document, select or create a category from the dropdown
                        </li>
                        <li>
                          <strong>Custom Categories:</strong> Create your own categories by clicking "Add Type" next to the document type dropdown
                        </li>
                        <li>
                          <strong>Tags:</strong> Add multiple tags to each document for more specific filtering
                        </li>
                        <li>
                          <strong>Filtering:</strong> Use the search and filter options on the Documents page to find specific documents
                        </li>
                        <li>
                          <strong>Bulk Organization:</strong> Select multiple documents to categorize or tag them at once
                        </li>
                      </ol>
                      <p className="mt-2">
                        Well-organized documents make it easier to find what you need quickly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <FileEdit className="h-5 w-5 text-primary" />
                        <span>Can I edit documents after uploading them?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Yes, you can edit document metadata and in some cases the content:</p>
                      <ul className="list-disc pl-5 space-y-1 my-2">
                        <li>You can update document name, category, tags, and description anytime</li>
                        <li>You can rotate, crop, and enhance image-based documents</li>
                        <li>For PDF documents, you can add annotations and highlights (Premium feature)</li>
                        <li>To replace a document completely, you can upload a new version</li>
                      </ul>
                      <p>
                        Note that document edit history is maintained for Premium and Enterprise users,
                        allowing you to view and restore previous versions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <CloudOff className="h-5 w-5 text-primary" />
                        <span>Can I access my documents offline?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Yes, there are several ways to access your documents offline:</p>
                      <ol className="list-decimal pl-5 space-y-2 my-2">
                        <li>
                          <strong>Mobile App:</strong> Our mobile app has offline access capabilities. 
                          Mark important documents for offline access in the app.
                        </li>
                        <li>
                          <strong>Download:</strong> Download documents to your device before going offline.
                        </li>
                        <li>
                          <strong>Automated Sync:</strong> Premium users can enable automatic syncing 
                          of important documents for offline access.
                        </li>
                        <li>
                          <strong>Security Notice:</strong> Documents available offline are still 
                          encrypted on your device and require authentication to access.
                        </li>
                      </ol>
                      <p>
                        When you regain internet connection, any changes made offline will sync with your account.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <SecurityInfo />
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Commitment</CardTitle>
                    <CardDescription>
                      Our commitment to keeping your documents private and secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      At ApnaWallet, we take your privacy and security seriously. We have 
                      implemented multiple layers of protection to ensure your sensitive 
                      documents remain private.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Our Privacy Promises:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>We never access your encrypted documents</li>
                        <li>Your documents are encrypted before they leave your device</li>
                        <li>We use zero-knowledge encryption principles</li>
                        <li>We do not sell or share your data with third parties</li>
                        <li>You maintain complete control of your documents</li>
                        <li>Regular security audits and updates</li>
                      </ul>
                    </div>
                    
                    <p className="text-sm">
                      Our end-to-end encryption ensures that only you can access your documents, 
                      even in the unlikely event of a data breach.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security FAQ</CardTitle>
                    <CardDescription>
                      Common questions about our security features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm">
                          Can ApnaWallet staff access my documents?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          No. Due to our end-to-end encryption, our staff cannot access the contents 
                          of your encrypted documents. Your encryption key is derived from your password, 
                          which we do not store in its original form.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-sm">
                          What encryption standard do you use?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          We use AES-256 encryption for document storage and TLS 1.3 for 
                          all data transfers. AES-256 is a military-grade encryption standard 
                          used by financial institutions and governments worldwide.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-sm">
                          Are my documents encrypted during upload?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Yes. Your documents are encrypted on your device before being transmitted 
                          to our servers. This means your documents are never transmitted in their 
                          original form, even temporarily.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-sm">
                          How secure are shared documents?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Shared documents maintain their encryption and can be further protected 
                          with passwords, expiration dates, and access controls. All access to 
                          shared documents is logged and can be monitored.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5">
                        <AccordionTrigger className="text-sm">
                          What is two-factor authentication and how do I set it up?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Two-factor authentication (2FA) adds an extra layer of security by requiring 
                          a second verification method in addition to your password. To set up 2FA:
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Go to Settings → Account → Security</li>
                            <li>Click "Enable Two-Factor Authentication"</li>
                            <li>Choose your preferred 2FA method (authenticator app, SMS, or email)</li>
                            <li>Follow the setup instructions</li>
                            <li>Save your backup codes in a secure location</li>
                          </ol>
                          We strongly recommend enabling 2FA for maximum account security.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6">
                        <AccordionTrigger className="text-sm">
                          How do I create and store an encryption key backup?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Premium users can create an encryption key backup:
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Go to Settings → Backup & Export → Encryption Key Backup</li>
                            <li>Create a separate recovery password (different from your login)</li>
                            <li>Choose your backup storage method (downloadable file or secure cloud)</li>
                            <li>Complete the verification process</li>
                            <li>Store your recovery information in a secure location</li>
                          </ol>
                          This backup allows you to recover your documents if you forget your password.
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-7">
                        <AccordionTrigger className="text-sm">
                          What should I do if I detect unauthorized access?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          If you suspect unauthorized access:
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Immediately change your password</li>
                            <li>Enable two-factor authentication if not already enabled</li>
                            <li>Check activity logs in Settings → Account → Security</li>
                            <li>Review and revoke any shared document links</li>
                            <li>Contact support with details of the suspected breach</li>
                            <li>Consider revoking all active sessions</li>
                          </ol>
                          We monitor for suspicious activity, but your vigilance helps protect your account.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Security Features</CardTitle>
                    <CardDescription>
                      Premium security features to enhance your protection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span>Dual-layer encryption (Premium)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Premium users benefit from dual-layer encryption, which adds a second 
                          encryption layer with a separate key. This provides protection against 
                          advanced decryption attempts and quantum computing threats.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="h-4 w-4 text-primary" />
                            <span>Biometric authentication</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Enable fingerprint or face recognition on supported devices for quick, 
                          secure access to your documents. Biometric data never leaves your device 
                          and is used only to unlock your local encryption key.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-primary" />
                            <span>Access logs and monitoring</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Review detailed logs of all account activities, including login attempts, 
                          document access, and sharing events. Set up alerts for suspicious activities 
                          like logins from new locations or multiple failed login attempts.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-primary" />
                            <span>Document watermarking (Enterprise)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          Enterprise users can apply digital watermarks to shared documents. These 
                          watermarks can include recipient information, access restrictions, and 
                          usage tracking to prevent unauthorized distribution.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Mobile App Features
                  </CardTitle>
                  <CardDescription>
                    Learn about our mobile app capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base">
                        How do I download the mobile app?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-3">
                        <p>
                          Our mobile app is available for both iOS and Android devices:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Visit the Mobile App page on our website</li>
                          <li>Scan the QR code with your device</li>
                          <li>Follow the link to your device's app store</li>
                          <li>Download and install the app</li>
                        </ol>
                        <p>
                          Alternatively, you can search for "ApnaWallet" directly in the Apple App Store 
                          or Google Play Store.
                        </p>
                        <div className="flex justify-center space-x-4 mt-3">
                          <Button variant="outline" size="sm">
                            <img src="/placeholder.svg" alt="App Store" className="h-5 mr-2" />
                            App Store
                          </Button>
                          <Button variant="outline" size="sm">
                            <img src="/placeholder.svg" alt="Play Store" className="h-5 mr-2" />
                            Play Store
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base">
                        How do I scan documents with my phone?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          Our mobile app includes a powerful document scanner:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Open the ApnaWallet mobile app</li>
                          <li>Tap the "+" button and select "Scan Document"</li>
                          <li>Position your document within the frame</li>
                          <li>The app will automatically detect edges and optimize lighting</li>
                          <li>Tap the capture button or use auto-capture</li>
                          <li>Review the scan, crop if needed, and tap "Continue"</li>
                          <li>Add document details and save</li>
                        </ol>
                        <p>
                          The scanned document will immediately sync to your account and be available on all your devices.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-base">
                        How do I link my mobile app to my web account?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          To link your mobile app with your existing web account:
                        </p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Install and open the ApnaWallet mobile app</li>
                          <li>At the login screen, select "Login to existing account"</li>
                          <li>Enter your email and password, or use the QR code option</li>
                          <li>For QR code login:
                            <ul className="list-disc pl-5 mt-1">
                              <li>On the web app, go to Settings → Mobile Devices</li>
                              <li>Click "Add New Device" to generate a QR code</li>
                              <li>Scan this QR code with your mobile app</li>
                            </ul>
                          </li>
                          <li>Complete the verification process</li>
                          <li>Give your device a name for easy identification</li>
                        </ol>
                        <p>
                          Once linked, your documents will sync automatically between devices.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-base">
                        Is the mobile app secure?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          Yes, our mobile app uses the same security standards as our web platform:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>End-to-end encryption for all documents</li>
                          <li>Biometric authentication support (fingerprint, Face ID)</li>
                          <li>App-level password protection</li>
                          <li>Data is encrypted locally before syncing</li>
                          <li>Option to require authentication for each session</li>
                          <li>Ability to remotely revoke access from lost devices</li>
                        </ul>
                        <p>
                          For additional security, you can enable automatic lock after a period of inactivity
                          and set up remote wipe capabilities for lost devices.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-base">
                        What mobile-specific features are available?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          Our mobile app offers several features specifically designed for mobile use:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Document scanning with edge detection and enhancement</li>
                          <li>Offline access to marked documents</li>
                          <li>Camera integration for ID cards and receipts</li>
                          <li>Push notifications for document reminders</li>
                          <li>Quick share via messaging apps and email</li>
                          <li>QR code scanning for quick document access</li>
                          <li>Biometric authentication</li>
                          <li>Background syncing</li>
                          <li>Battery optimization</li>
                          <li>Widgets for quick document access (Premium)</li>
                        </ul>
                        <p>
                          Premium users get additional features like OCR text recognition, 
                          advanced scanning filters, and unlimited offline documents.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileWarning className="h-5 w-5 text-primary" />
                      Troubleshooting Mobile Issues
                    </CardTitle>
                    <CardDescription>
                      Common mobile app issues and solutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm">
                          My documents aren't syncing to my mobile device
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          <p>If your documents aren't syncing:</p>
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Check your internet connection</li>
                            <li>Verify you're signed in with the same account</li>
                            <li>Pull down to manually refresh the document list</li>
                            <li>Go to Settings → Sync → "Force Sync"</li>
                            <li>Check if background data is restricted for the app</li>
                            <li>Ensure your device has sufficient storage space</li>
                            <li>Restart the app and device if needed</li>
                          </ol>
                          <p className="mt-2">
                            If problems persist, try unlinking and relinking your device.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-sm">
                          The document scanner isn't working properly
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          <p>For scanner issues:</p>
                          <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Ensure you have given the app camera permissions</li>
                            <li>Use good lighting conditions when scanning</li>
                            <li>Place the document on a contrasting background</li>
                            <li>Hold your device steady and parallel to the document</li>
                            <li>Try manual mode if auto-detection fails</li>
                            <li>Update to the latest app version</li>
                            <li>Restart your device if scanner is unresponsive</li>
                          </ul>
                          <p className="mt-2">
                            You can also take a regular photo and import it if the scanner continues to have issues.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-sm">
                          The app is using too much battery
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          <p>To reduce battery consumption:</p>
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Go to Settings → Sync → "Battery Optimization"</li>
                            <li>Reduce sync frequency to "Manual" or "Wi-Fi Only"</li>
                            <li>Disable background refresh when not needed</li>
                            <li>Reduce the number of offline documents</li>
                            <li>Update to the latest app version</li>
                            <li>Check if other processes are active in the background</li>
                          </ol>
                          <p className="mt-2">
                            The app is designed to be battery-efficient, but scanning and syncing 
                            operations can temporarily increase power usage.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-sm">
                          I'm not receiving mobile notifications
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          <p>To fix notification issues:</p>
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Check device notification settings for the app</li>
                            <li>In the app, go to Settings → Notifications</li>
                            <li>Verify that the notification types you want are enabled</li>
                            <li>Check if Do Not Disturb mode is active</li>
                            <li>Ensure you have an active internet connection</li>
                            <li>Try reinstalling the app if issues persist</li>
                          </ol>
                          <p className="mt-2">
                            Different device manufacturers handle notifications differently. 
                            Check your device-specific battery optimization settings, as these 
                            can sometimes restrict background notifications.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger className="text-sm">
                          How do I remove a linked mobile device?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                          <p>To remove a linked device:</p>
                          <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>Log in to the web app</li>
                            <li>Go to Settings → Mobile Devices</li>
                            <li>Find the device you want to remove</li>
                            <li>Click the "Remove" or "Unlink" button</li>
                            <li>Confirm the action</li>
                          </ol>
                          <p className="mt-2">
                            This will immediately revoke the device's access to your account. 
                            Any offline cached documents on that device will become inaccessible. 
                            If you've lost your device, you should also change your password.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Mobile App Tips</CardTitle>
                    <CardDescription>
                      Get the most out of the mobile experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <Database className="h-4 w-4 text-primary" />
                          Manage Offline Storage
                        </h3>
                        <p className="text-sm">
                          Mark important documents for offline access to view them without an internet connection.
                          Manage storage in Settings → Offline Documents.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          Multi-Page Scanning
                        </h3>
                        <p className="text-sm">
                          Create multi-page documents by tapping "Add Page" after scanning the first page.
                          All pages will be combined into a single PDF.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <FileSearch className="h-4 w-4 text-primary" />
                          OCR & Search
                        </h3>
                        <p className="text-sm">
                          Premium users can extract text from scanned documents with OCR,
                          making documents searchable by content.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-primary" />
                          Storage Dashboard
                        </h3>
                        <p className="text-sm">
                          Monitor storage usage and get recommendations for optimization
                          from the storage dashboard in Settings.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  We're here to help with any questions or issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center space-y-3 p-6 bg-muted/50 rounded-lg">
                    <Mail className="h-8 w-8 text-primary" />
                    <h3 className="text-lg font-medium">Email Support</h3>
                    <p className="text-center text-sm">
                      Our support team is available Monday-Friday, 9am-5pm (IST).
                    </p>
                    <Button variant="secondary" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      support@apnawallet.com
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3 p-6 bg-muted/50 rounded-lg">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    <h3 className="text-lg font-medium">Live Chat</h3>
                    <p className="text-center text-sm">
                      Chat with our support team in real-time (Premium users only).
                    </p>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start Chat
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Frequently Contacted for:</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium">Account Issues</p>
                      <p className="text-muted-foreground">
                        Login problems, account recovery, subscription changes
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Technical Support</p>
                      <p className="text-muted-foreground">
                        Upload errors, download issues, sharing problems
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Billing Inquiries</p>
                      <p className="text-muted-foreground">
                        Payment issues, refunds, subscription questions
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Feature Requests</p>
                      <p className="text-muted-foreground">
                        Suggest new features or improvements
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Support Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Email Support:</p>
                        <p>24/7 (Response within 24 hours)</p>
                      </div>
                      <div>
                        <p className="font-medium">Live Chat:</p>
                        <p>Mon-Fri: 9 AM - 8 PM (IST)</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone Support (Premium):</p>
                        <p>Mon-Fri: 10 AM - 6 PM (IST)</p>
                      </div>
                      <div>
                        <p className="font-medium">Holiday Schedule:</p>
                        <p>Limited support on national holidays</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>Enterprise customers have access to priority support with dedicated response times.</p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileBox className="h-5 w-5 text-primary" />
                    User Guides & Resources
                  </CardTitle>
                  <CardDescription>
                    Self-help resources to solve common issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileBox className="mr-2 h-4 w-4" />
                      Getting Started Guide
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Languages className="mr-2 h-4 w-4" />
                      Document Type Guide
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendar & Reminder Setup
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Binary className="mr-2 h-4 w-4" />
                      Data Export & Import Guide
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Wallet className="mr-2 h-4 w-4" />
                      Subscription Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
                            
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Billing Support
                  </CardTitle>
                  <CardDescription>
                    Get help with subscription and payment issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm">
                        How do I update my payment method?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <p>To update your payment method:</p>
                        <ol className="list-decimal pl-5 space-y-1 mt-2">
                          <li>Go to Settings → Account → Billing</li>
                          <li>Click "Update Payment Method"</li>
                          <li>Enter your new payment details</li>
                          <li>Save the changes</li>
                        </ol>
                        <p className="mt-2">
                          Your next billing cycle will use the new payment method.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm">
                        How do I get a receipt for my subscription?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <p>You can access all receipts and invoices:</p>
                        <ol className="list-decimal pl-5 space-y-1 mt-2">
                          <li>Go to Settings → Account → Billing</li>
                          <li>Scroll down to "Billing History"</li>
                          <li>Click "View Receipt" next to any transaction</li>
                          <li>Download or print the receipt</li>
                        </ol>
                        <p className="mt-2">
                          Receipts are also automatically emailed to your registered email address.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm">
                        How do I cancel my subscription?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <p>To cancel your subscription:</p>
                        <ol className="list-decimal pl-5 space-y-1 mt-2">
                          <li>Go to Settings → Account → Billing</li>
                          <li>Click "Manage Subscription"</li>
                          <li>Select "Cancel Subscription"</li>
                          <li>Follow the prompts to confirm</li>
                        </ol>
                        <p className="mt-2">
                          You'll continue to have access to premium features until the end of your current billing period.
                          After cancellation, your account will be downgraded to the free plan.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="bg-muted/50 p-4 rounded-lg mt-3">
                    <p className="text-sm">
                      For billing-specific inquiries, please email our dedicated billing support team at:
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-1 text-primary">
                      billing@apnawallet.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Help;
