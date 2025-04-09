
import React from "react";
import Container from "@/components/layout/Container";
import VideoFaq from "@/components/faq/VideoFaq";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, FileQuestion, VideoIcon } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";

const Help = () => {
  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-6">
        <BlurContainer className="p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-indigo-500" />
            Help Center
          </h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions and watch video tutorials to help you get the most out of ApnaWallet.
          </p>
          
          <Tabs defaultValue="video-faqs" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="video-faqs" className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4" />
                <span>Video Tutorials</span>
              </TabsTrigger>
              <TabsTrigger value="text-faqs" className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4" />
                <span>Text FAQs</span>
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
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">What is ApnaWallet?</h3>
                      <p className="text-muted-foreground">
                        ApnaWallet is a secure document management system that helps you keep track of your important documents,
                        their expiry dates, and sends you timely reminders.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Is my data secure?</h3>
                      <p className="text-muted-foreground">
                        Yes, ApnaWallet uses end-to-end encryption to ensure that your documents are secure and can only be accessed by you.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Can I access my documents offline?</h3>
                      <p className="text-muted-foreground">
                        Yes, with the ApnaWallet mobile app, you can access your documents even when you're offline.
                        Download the app from the Mobile App page.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">How do I set up reminders for my documents?</h3>
                      <p className="text-muted-foreground">
                        When you upload a document, you can set a due date and choose when you want to be reminded.
                        You can also configure your notification preferences in the Settings page.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">How many documents can I upload?</h3>
                      <p className="text-muted-foreground">
                        The number of documents you can upload depends on your subscription plan.
                        Free users can upload up to 10 documents, while premium users have unlimited uploads.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">How do I upload multiple documents at once?</h3>
                      <p className="text-muted-foreground">
                        You can upload multiple documents by selecting multiple files when clicking the "Upload" button,
                        or by dragging and dropping multiple files at once.
                      </p>
                    </div>
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
