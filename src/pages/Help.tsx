
import React from "react";
import Container from "@/components/layout/Container";
import VideoFaq from "@/components/faq/VideoFaq";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, FileQuestion, VideoIcon, ShieldCheck, Smartphone } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  
  // Redirect mobile users to the mobile app page
  useEffect(() => {
    if (isMobile && !localStorage.getItem('mobile_redirect_dismissed')) {
      const timer = setTimeout(() => {
        navigate("/mobile-app");
        localStorage.setItem('mobile_redirect_dismissed', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, navigate]);

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-6">
        {isMobile && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 animate-fade-in shadow-sm">
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile Detected
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              We recommend using our mobile app for a better experience on your device. 
              <button
                onClick={() => navigate("/mobile-app")}
                className="font-medium underline ml-2"
              >
                Download now
              </button>
            </p>
          </div>
        )}
        
        <BlurContainer className="p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-indigo-500" />
            Help Center
          </h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions and watch video tutorials to help you get the most out of ApnaWallet.
          </p>
          
          <Tabs defaultValue="video-faqs" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="video-faqs" className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4" />
                <span>Video Tutorials</span>
              </TabsTrigger>
              <TabsTrigger value="text-faqs" className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                <span>Text FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="video-faqs">
              <VideoFaq />
            </TabsContent>
            
            <TabsContent value="text-faqs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-indigo-500" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Common questions about using ApnaWallet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="general-1">
                      <AccordionTrigger className="text-lg font-medium">What is ApnaWallet?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          ApnaWallet is a secure document management system that helps you keep track of your important documents,
                          their expiry dates, and sends you timely reminders.
                        </p>
                        <p className="text-muted-foreground">
                          It provides end-to-end encryption, secure storage, expiry date monitoring, and notifications to ensure
                          you never miss important deadlines for your documents.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="security-1">
                      <AccordionTrigger className="text-lg font-medium">Is my data secure?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Yes, ApnaWallet uses end-to-end encryption to ensure that your documents are secure and can only be accessed by you.
                        </p>
                        <p className="text-muted-foreground">
                          Your data is encrypted both in transit and at rest using AES-256 encryption. This means even if someone gained unauthorized
                          access to our servers, they couldn't read your documents without your encryption key, which is derived from your password.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="access-1">
                      <AccordionTrigger className="text-lg font-medium">Can I access my documents offline?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Yes, with the ApnaWallet mobile app, you can access your documents even when you're offline.
                          Download the app from the Mobile App page.
                        </p>
                        <p className="text-muted-foreground">
                          The mobile app includes an offline mode that saves a secure, encrypted copy of your documents on your device,
                          allowing you to access them even without an internet connection.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reminders-1">
                      <AccordionTrigger className="text-lg font-medium">How do I set up reminders for my documents?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          When you upload a document, you can set a due date and choose when you want to be reminded.
                          You can also configure your notification preferences in the Settings page.
                        </p>
                        <p className="text-muted-foreground">
                          Available notification options include:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Email notifications (1 day, 7 days, 30 days, or custom days before expiry)</li>
                          <li>Push notifications on mobile devices</li>
                          <li>In-app notifications when you log in</li>
                          <li>Optional SMS alerts (premium feature)</li>
                          <li>Voice call reminders for critical documents (premium feature)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="limits-1">
                      <AccordionTrigger className="text-lg font-medium">How many documents can I upload?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          The number of documents you can upload depends on your subscription plan.
                        </p>
                        <p className="text-muted-foreground mb-2">Plan limits:</p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Free users: Up to 10 documents with a maximum size of 5MB each</li>
                          <li>Basic plan: Up to 50 documents with a maximum size of 15MB each</li>
                          <li>Premium plan: Unlimited documents with a maximum size of 25MB each</li>
                          <li>Enterprise plan: Unlimited documents with a maximum size of 100MB each</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="upload-1">
                      <AccordionTrigger className="text-lg font-medium">How do I upload multiple documents at once?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          You can upload multiple documents by selecting multiple files when clicking the "Upload" button,
                          or by dragging and dropping multiple files at once.
                        </p>
                        <p className="text-muted-foreground">
                          When uploading multiple files at once, you can apply bulk settings like categories, tags, 
                          and expiry notifications to save time.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="formats-1">
                      <AccordionTrigger className="text-lg font-medium">What document formats are supported?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          ApnaWallet supports a wide range of document formats including:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1 grid grid-cols-1 md:grid-cols-2">
                          <li>PDF files (.pdf)</li>
                          <li>Images (.jpg, .jpeg, .png)</li>
                          <li>Microsoft Office documents (.doc, .docx, .xls, .xlsx, .ppt, .pptx)</li>
                          <li>Text files (.txt)</li>
                          <li>Rich Text Format (.rtf)</li>
                          <li>Open Document formats (.odt, .ods, .odp)</li>
                          <li>Archive files (.zip, .rar) - Premium only</li>
                          <li>Adobe Illustrator (.ai) - Premium only</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sharing-1">
                      <AccordionTrigger className="text-lg font-medium">Can I share documents with others?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Yes, you can share documents with specific people while maintaining security. There are several ways to share:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Send a secure link with optional password protection</li>
                          <li>Share directly with other ApnaWallet users via their email</li>
                          <li>Set an expiration date for shared links</li>
                          <li>Control permissions (view only, download, edit) - Premium feature</li>
                          <li>Track who has accessed your shared documents - Premium feature</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="recovery-1">
                      <AccordionTrigger className="text-lg font-medium">What happens if I forget my password?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          If you forget your password, you can use the "Forgot Password" feature on the login page.
                        </p>
                        <p className="text-muted-foreground">
                          However, because of our end-to-end encryption system, if you lose your password and don't have a recovery method set up,
                          we cannot recover your encrypted documents. We recommend:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Setting up a recovery email</li>
                          <li>Adding a phone number for recovery</li>
                          <li>Storing a backup of your encryption key in a safe place (Premium feature)</li>
                          <li>Using a trusted password manager</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mobile-1">
                      <AccordionTrigger className="text-lg font-medium">How do I use the mobile app?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Our mobile app provides all the features of the web version plus additional mobile-specific capabilities:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Scan physical documents directly using your camera</li>
                          <li>Use fingerprint or Face ID for quick secure access</li>
                          <li>Access documents offline</li>
                          <li>Receive push notifications for document expiry</li>
                          <li>Share documents via other mobile apps</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                          Download the app from the <a href="/mobile-app" className="text-indigo-600 hover:underline">Mobile App page</a>.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="export-1">
                      <AccordionTrigger className="text-lg font-medium">Can I export or backup my documents?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-2">
                          Yes, you can export individual documents or create a full backup of all your documents:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          <li>Individual documents can be downloaded at any time</li>
                          <li>Full backup option available under Settings → Data Management</li>
                          <li>Schedule regular automatic backups (Premium feature)</li>
                          <li>Export to cloud storage providers like Google Drive, Dropbox (Premium feature)</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                          Exported documents can be encrypted with a password for additional security.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                    Security & Encryption
                  </CardTitle>
                  <CardDescription>
                    How we keep your documents secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-300">How Document Encryption Works</h3>
                    <p className="text-muted-foreground mb-3">
                      ApnaWallet uses advanced end-to-end encryption to protect your sensitive documents:
                    </p>
                    <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                      <li>
                        <strong>Your Password Creates a Key:</strong> When you set up your account, a unique encryption key is derived from your password 
                        using a process called PBKDF2 (Password-Based Key Derivation Function).
                      </li>
                      <li>
                        <strong>Every Document is Encrypted:</strong> Before any document leaves your device, it's encrypted with AES-256 
                        (Advanced Encryption Standard) using your unique key.
                      </li>
                      <li>
                        <strong>Secure Transmission:</strong> The encrypted document is sent to our servers over a secure HTTPS connection.
                      </li>
                      <li>
                        <strong>Stored Encrypted:</strong> Your documents remain encrypted while stored on our servers. Even our staff cannot access the contents.
                      </li>
                      <li>
                        <strong>Decryption Happens Locally:</strong> When you access your documents, they're downloaded in encrypted form and only decrypted 
                        on your device using your password-derived key.
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Additional Security Features</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Two-Factor Authentication (2FA)</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security by requiring both your password and a temporary code 
                          from your mobile device to access your account.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Secure Password Recovery</h4>
                        <p className="text-sm text-muted-foreground">
                          Our password reset process is designed with security in mind, allowing you to regain 
                          access without compromising the encryption of your documents.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Session Management</h4>
                        <p className="text-sm text-muted-foreground">
                          View and manage all devices currently logged into your account. Remotely log out 
                          from any active session if needed.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-2">Activity Logs</h4>
                        <p className="text-sm text-muted-foreground">
                          Monitor all activity on your account including logins, document access, and changes 
                          to help identify any unauthorized access.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Best Practices for Maximum Security</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                      <li>Use a strong, unique password that you don't use for other services</li>
                      <li>Enable two-factor authentication</li>
                      <li>Log out when using shared or public devices</li>
                      <li>Keep your recovery email and phone number up to date</li>
                      <li>Regularly review your account activity for suspicious behavior</li>
                      <li>Keep your device's operating system and browser updated</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default Help;
