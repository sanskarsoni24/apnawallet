
import React from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoFaq from "@/components/faq/VideoFaq";
import { Mail, MessageCircle, ShieldCheck, HelpCircle, Share2, Upload, Download, Clock } from "lucide-react";
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
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="faq" className="text-sm flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Security</span>
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
