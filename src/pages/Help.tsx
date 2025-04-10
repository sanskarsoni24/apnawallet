
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, PhoneCall, Mail, ArrowRight, BookOpen, Shield, Info } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import VideoFaq from "@/components/faq/VideoFaq";
import SecurityInfo from "@/components/help/SecurityInfo";
import AppInfo from "@/components/help/AppInfo";

interface FAQ {
  question: string;
  answer: string;
}

interface HelpSection {
  title: string;
  faqs: FAQ[];
}

const Help = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const helpSections: HelpSection[] = [
    {
      title: "General",
      faqs: [
        {
          question: "What is ApnaWallet?",
          answer: "ApnaWallet is a secure document management system that helps you organize, store, and protect your important documents and sensitive information. It offers end-to-end encryption, secure sharing, and document expiry notifications."
        },
        {
          question: "How secure is ApnaWallet?",
          answer: "ApnaWallet uses industry-standard encryption to protect your data. All documents are encrypted using AES-256 encryption, and we employ a zero-knowledge architecture, which means we cannot access your documents. Your data is only decrypted on your device with your personal key."
        },
        {
          question: "Can I access my documents offline?",
          answer: "Yes, you can access previously viewed documents offline. ApnaWallet caches encrypted versions of your documents locally for offline access. However, new uploads or changes to documents require an internet connection."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Yes, ApnaWallet is available on mobile devices through our responsive web application. You can scan the QR code in the application to quickly access your secure vault on your mobile device."
        },
        {
          question: "How do I recover my account if I forget my password?",
          answer: "You can use the 'Recover vault' option in the security vault to initiate the recovery process. We offer email-based recovery as well as recovery through backup keys if you've set those up previously."
        }
      ]
    },
    {
      title: "Documents",
      faqs: [
        {
          question: "What types of documents can I store?",
          answer: "You can store various document types including PDFs, images (JPG, PNG), text files, spreadsheets, and more. The platform supports most common document formats."
        },
        {
          question: "How do I organize my documents?",
          answer: "You can organize documents using folders, tags, and categories. You can also create custom categories and set reminders for important dates related to your documents."
        },
        {
          question: "Can I share documents with others?",
          answer: "Yes, you can securely share documents with other ApnaWallet users or via secure links with expiration dates. Shared documents maintain their encryption and you can revoke access at any time."
        },
        {
          question: "What is document summarization?",
          answer: "Document summarization is a premium feature that uses AI to automatically generate concise summaries of your documents, making it easier to understand and manage your information without reading the entire document."
        },
        {
          question: "How do I scan physical documents?",
          answer: "You can use our built-in document scanner to capture physical documents using your device's camera. The scan-to-PDF feature allows you to convert these captures directly to PDF format for better organization."
        }
      ]
    },
    {
      title: "Security",
      faqs: [
        {
          question: "How is my data protected?",
          answer: "Your data is protected with end-to-end encryption, meaning it's encrypted before leaving your device and can only be decrypted by you. We use AES-256 encryption, which is a military-grade encryption standard."
        },
        {
          question: "Do you offer two-factor authentication?",
          answer: "Yes, we offer two-factor authentication (2FA) for additional security. You can enable this in your account settings to require a second verification step when logging in from a new device."
        },
        {
          question: "What happens to my data if I cancel my subscription?",
          answer: "If you cancel your premium subscription, you'll still have access to your data but with the limitations of the free tier. We never delete your documents unless you explicitly request it."
        },
        {
          question: "Can ApnaWallet employees access my documents?",
          answer: "No, our zero-knowledge architecture means that not even ApnaWallet employees can access your documents. Your encryption keys are never stored on our servers."
        },
        {
          question: "How can I recover my vault if I lose access?",
          answer: "We provide multiple recovery options: email-based recovery, recovery keys, and backup codes. We recommend setting up at least two recovery methods in your security settings."
        }
      ]
    },
    {
      title: "Subscription & Pricing",
      faqs: [
        {
          question: "What features are included in the free tier?",
          answer: "The free tier includes basic document storage, organization features, and standard security. You can store up to 100 documents with a maximum size of 10MB each."
        },
        {
          question: "What additional features do I get with a premium subscription?",
          answer: "Premium subscriptions include advanced features such as document summarization, OCR (text recognition), unlimited storage, larger file sizes, advanced sharing options, and priority customer support."
        },
        {
          question: "How do I upgrade to a premium plan?",
          answer: "You can upgrade to a premium plan by visiting the 'Pricing' section in your account. We offer monthly and annual subscription options with various payment methods."
        },
        {
          question: "Is there a family or team plan available?",
          answer: "Yes, we offer family plans for up to 5 users and team plans for businesses. These plans include shared storage space and admin controls for managing team access."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period."
        }
      ]
    }
  ];

  return (
    <Container>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:support@surakshitlocker.com">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-100 dark:bg-slate-800/70 w-full grid grid-cols-3">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="video">Video Tutorials</TabsTrigger>
              <TabsTrigger value="info">About App</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="space-y-8">
              {helpSections.map((section, index) => (
                <BlurContainer key={index} className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {section.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </BlurContainer>
              ))}
            </TabsContent>
            
            <TabsContent value="video" className="space-y-6">
              <VideoFaq />
            </TabsContent>
            
            <TabsContent value="info" className="space-y-6">
              <AppInfo />
              <SecurityInfo />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <BlurContainer className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat with our support team (Premium)
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Start Chat
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Available Mon-Fri, 9am-5pm
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    +1 (800) 123-4567
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Usually responds within 24 hours
                  </p>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <a href="mailto:support@surakshitlocker.com">
                      Send Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </BlurContainer>
          
          <BlurContainer className="p-6">
            <h2 className="text-xl font-semibold mb-4">Help Resources</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">
                  <BookOpen className="h-4 w-4 mr-2" />
                  User Manual
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Guide
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">
                  <Info className="h-4 w-4 mr-2" />
                  API Documentation
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </a>
              </Button>
            </div>
          </BlurContainer>
        </div>
      </div>
    </Container>
  );
};

export default Help;
