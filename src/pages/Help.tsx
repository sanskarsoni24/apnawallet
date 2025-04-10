
import React from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoOff, Video, HelpCircle, File, Clock, Shield, Info } from "lucide-react";
import VideoFaq from "@/components/faq/VideoFaq";
import SecurityInfo from "@/components/help/SecurityInfo";
import AppInfo from "@/components/help/AppInfo";

const Help: React.FC = () => {
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and learn how to use the platform effectively
        </p>
      </div>
      
      <Tabs defaultValue="faq" className="mb-8">
        <TabsList className="grid grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>About</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <CardTitle>Video Guides</CardTitle>
                </div>
                <CardDescription>
                  Watch short videos explaining how to use key features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoFaq />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" />
                  <CardTitle>Document Management</CardTitle>
                </div>
                <CardDescription>
                  Common questions about managing your documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">How do I upload documents?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to the Documents page and click the "Upload" button. You can upload PDFs, images, and other document types. All documents are encrypted before being stored.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">What document formats are supported?</h3>
                  <p className="text-sm text-muted-foreground">
                    We support PDF, DOCX, JPG, PNG, and many other common file formats. All documents are automatically encrypted for security.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How can I organize my documents?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can create custom categories, add tags, and use filters to organize your documents. You can also favorite important documents for quick access.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How do I share documents securely?</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a document and click the "Share" button. You can generate a secure link with an expiration date and password protection for additional security.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Can I scan documents with my phone?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! You can scan documents using our mobile app, which has built-in document scanning features. You can also use the "Scan to PDF" feature in the web app when using a mobile device.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Reminders and Notifications</CardTitle>
                </div>
                <CardDescription>
                  How to set up and manage document reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">How do I set document reminders?</h3>
                  <p className="text-sm text-muted-foreground">
                    When viewing a document, click on the "Set Reminder" button. You can choose the reminder date and how you want to be notified.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">What notification types are available?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can receive notifications via email, browser notifications, or in the mobile app. Premium users can also set up SMS and voice reminders.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Can I set recurring reminders?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can set recurring reminders for documents that need periodic review or renewal, like licenses, certifications, or insurance policies.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How do I manage notification preferences?</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings > Notifications to configure your notification preferences, including notification types, timing, and frequency.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityInfo />
        </TabsContent>
        
        <TabsContent value="about">
          <AppInfo />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Help;
