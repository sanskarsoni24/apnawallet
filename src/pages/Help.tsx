
import React from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoFaq from "@/components/faq/VideoFaq";
import { 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle, 
  Share2, 
  Upload, 
  Download, 
  Clock, 
  Info, 
  BookOpen, 
  GitMerge, 
  FileText, 
  Shield, 
  Bell, 
  Smartphone,
  Cpu,
  FileCode,
  CloudOff,
  FolderSync,
  Database,
  KeyRound,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecurityInfo from "@/components/help/SecurityInfo";
import DocumentSharing from "@/components/documents/DocumentSharing";

const Help = () => {
  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and learn how to use our features
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="faq" className="text-sm flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="text-sm flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-sm flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
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
                        <FileText className="h-5 w-5 text-primary" />
                        <span>What is document summarization?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Document summarization is a Premium feature that automatically creates a concise 
                        summary of your document's content using AI technology.
                      </p>
                      <p className="my-2">
                        This feature helps you quickly understand the key points of your documents without 
                        having to read through the entire content.
                      </p>
                      <p>Benefits of document summarization:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Save time by quickly understanding document contents</li>
                        <li>Identify important dates, amounts, and other key information</li>
                        <li>Get reminders about document purpose and importance</li>
                        <li>Easier document organization and searchability</li>
                      </ul>
                      <p className="mt-2">
                        You can view the document summary in the document details page after uploading.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span>How do I use the mobile app?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Our mobile app provides convenient access to your documents on the go:
                      </p>
                      <p className="my-2">To get started with the mobile app:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Download the app from the App Store or Google Play</li>
                        <li>Log in with your SurakshitLocker account</li>
                        <li>Scan the QR code from the web app to link your devices</li>
                      </ol>
                      <p className="mt-2">Key mobile app features:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Scan physical documents using your phone's camera</li>
                        <li>Convert multiple scanned images to PDF</li>
                        <li>Access your documents offline</li>
                        <li>Receive notification reminders</li>
                        <li>Quick document sharing</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <span>How do notifications work?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        SurakshitLocker offers several types of notifications:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 my-2">
                        <li><span className="font-medium">Email notifications:</span> Sent to your registered email address</li>
                        <li><span className="font-medium">Push notifications:</span> Delivered to your browser or mobile app</li>
                        <li><span className="font-medium">Voice reminders:</span> Automated voice calls for critical reminders (Premium)</li>
                      </ul>
                      <p>To manage your notification settings:</p>
                      <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Go to Settings → Notifications</li>
                        <li>Toggle on/off the notification types you want to receive</li>
                        <li>Set your preferred notification timing and frequency</li>
                      </ol>
                      <p className="mt-2">
                        Note that some notification types are only available on specific subscription plans.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <CloudOff className="h-5 w-5 text-primary" />
                        <span>Can I use SurakshitLocker offline?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, SurakshitLocker has offline capabilities:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 my-2">
                        <li>The web app can work in offline mode using Progressive Web App (PWA) technology</li>
                        <li>The mobile app has built-in offline support</li>
                        <li>You can download documents for offline access</li>
                      </ul>
                      <p>To enable offline access:</p>
                      <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>For web: Add SurakshitLocker to your home screen when prompted</li>
                        <li>For mobile: Toggle "Enable Offline Mode" in the app settings</li>
                        <li>Download important documents by clicking the "Available Offline" toggle</li>
                      </ol>
                      <p className="mt-2 text-sm italic">
                        Note: Some features like document sharing require an internet connection.
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
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About SurakshitLocker</CardTitle>
                  <CardDescription>
                    Your secure document management solution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    SurakshitLocker is a comprehensive document management system designed to 
                    help individuals and businesses securely store, organize, and access their 
                    important documents anytime, anywhere.
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Security First Approach</h4>
                        <p className="text-sm text-muted-foreground">
                          Built with industry-leading security standards including end-to-end 
                          encryption, zero-knowledge architecture, and multi-factor authentication.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Cpu className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Intelligent Document Processing</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI-powered system automatically extracts key information from your 
                          documents, creates summaries, and helps you stay on top of important deadlines.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Multi-Platform Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Access your documents from any device with our web app, mobile apps, 
                          and browser extensions. Scan documents directly using your smartphone.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FolderSync className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Seamless Organization</h4>
                        <p className="text-sm text-muted-foreground">
                          Organize documents with custom categories, tags, and smart folders. 
                          Powerful search helps you find what you need instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                    <CardDescription>
                      System requirements and technical information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Web Application</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-medium text-foreground">Supported browsers:</span> Chrome, Firefox, Safari, Edge (latest 2 versions)</li>
                          <li><span className="font-medium text-foreground">Minimum screen resolution:</span> 320px width (responsive design)</li>
                          <li><span className="font-medium text-foreground">Optimized for:</span> Desktop, tablet, and mobile devices</li>
                          <li><span className="font-medium text-foreground">Internet connection:</span> Required for full functionality</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Mobile Application</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-medium text-foreground">iOS:</span> iOS 14.0 or later (iPhone, iPad)</li>
                          <li><span className="font-medium text-foreground">Android:</span> Android 8.0 or later</li>
                          <li><span className="font-medium text-foreground">Camera:</span> Required for document scanning</li>
                          <li><span className="font-medium text-foreground">Storage:</span> Minimum 100MB free space recommended</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">File Support</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-medium text-foreground">Document formats:</span> PDF, DOCX, DOC, TXT, RTF, ODT</li>
                          <li><span className="font-medium text-foreground">Image formats:</span> JPG, JPEG, PNG, TIFF, BMP, WEBP</li>
                          <li><span className="font-medium text-foreground">Spreadsheet formats:</span> XLSX, XLS, CSV, ODS (Premium)</li>
                          <li><span className="font-medium text-foreground">Maximum file size:</span> 25MB (100MB for Enterprise)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>
                      Current system performance and service availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Document Storage</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Authentication Services</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Document Processing</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Mobile Applications</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-green-500" />
                          <span className="text-sm">API Services</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Last updated: April 10, 2025 07:05 UTC</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          View history
                        </Button>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Help;
