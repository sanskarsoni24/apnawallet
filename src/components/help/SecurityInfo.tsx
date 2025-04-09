
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Key, Mail, Phone, FileKey } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SecurityInfo = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>How Our Security Works</CardTitle>
        </div>
        <CardDescription>
          Understanding our end-to-end encryption and security measures
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span>End-to-End Encryption</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                ApnaWallet uses advanced end-to-end encryption to protect your documents. 
                This means that your files are encrypted on your device before they're 
                uploaded to our servers.
              </p>
              <p>
                Your encryption key is derived from your password, which means that no one, 
                not even our team, can access your encrypted documents without your password.
              </p>
              <p>
                We use AES-256 encryption, the same standard used by governments and financial 
                institutions to secure sensitive data.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <span>Password Recovery</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                If you forget your password, you can use the "Forgot Password" feature on the 
                login page. However, due to our encryption system, we cannot recover your encrypted 
                documents if you lose your password without a recovery method.
              </p>
              <p>We recommend setting up these recovery methods:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A recovery email address</li>
                <li>A phone number for verification</li>
                <li>Storing a backup of your encryption key in a safe place (Premium feature)</li>
                <li>Using a trusted password manager</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Recovery Email</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Setting up a recovery email is essential for account security. Your recovery 
                email can be used to reset your password if you forget it.
              </p>
              <p>
                To set up or update your recovery email, go to Settings &gt; Account &gt; Recovery Options.
              </p>
              <p>
                Make sure to use an email address that you have reliable access to and keep it updated.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>Phone Recovery</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Adding a phone number provides an additional layer of security and recovery options.
                We can send verification codes to your phone for password resets.
              </p>
              <p>
                To add or update your phone number, go to Settings &gt; Account &gt; Recovery Options.
              </p>
              <p>
                Your phone number is only used for account recovery and is never shared with third parties.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <FileKey className="h-5 w-5 text-primary" />
                <span>Encryption Key Backup (Premium)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Premium users can create a secure backup of their encryption key, which provides
                an additional recovery option if you forget your password.
              </p>
              <p>
                This feature requires setting up a separate recovery password or security questions
                that are different from your main password.
              </p>
              <p>
                To set up encryption key backup, go to Settings &gt; Backup &amp; Export &gt; Encryption Key Backup.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SecurityInfo;
