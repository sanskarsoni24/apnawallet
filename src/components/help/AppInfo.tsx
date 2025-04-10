
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info, History, Globe, Users, Server } from "lucide-react";

const AppInfo = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle>About ApnaWallet</CardTitle>
        </div>
        <CardDescription>
          Learn more about our secure document management platform
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Our Mission
          </h3>
          <p className="text-muted-foreground">
            ApnaWallet was created with a simple yet powerful mission: to provide everyone with a secure, 
            private way to store their most important documents and information. We believe that personal 
            data should remain private, and that advanced security should be accessible to everyone.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5 text-amber-600" />
            Our Story
          </h3>
          <p className="text-muted-foreground">
            Founded in 2023, ApnaWallet began when our founders experienced the frustration of losing 
            critical documents during an emergency. Determined to create a better solution, they built 
            a platform that combines military-grade encryption with an intuitive user experience, making 
            document security accessible to everyone.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Our Team
          </h3>
          <p className="text-muted-foreground">
            ApnaWallet is built by a diverse team of security experts, developers, and privacy advocates. 
            Our team brings together expertise from cybersecurity, cloud infrastructure, and user experience 
            design to create a platform that's both highly secure and easy to use.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-600" />
            Our Technology
          </h3>
          <p className="text-muted-foreground">
            At the core of ApnaWallet is our zero-knowledge architecture and end-to-end encryption. 
            Documents are encrypted on your device before being stored, meaning that not even our team 
            can access your data. We use AES-256 encryption, the same standard trusted by governments 
            and financial institutions worldwide.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Our Commitment
          </h3>
          <p className="text-muted-foreground">
            We're committed to maintaining the highest standards of security and privacy. ApnaWallet 
            undergoes regular security audits, and we continually update our systems to protect against 
            emerging threats. Your trust is our top priority, and we work every day to earn and maintain it.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-xl text-primary">100K+</div>
              <div className="text-xs text-muted-foreground text-center">Users Protected</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-xl text-primary">2M+</div>
              <div className="text-xs text-muted-foreground text-center">Documents Secured</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-xl text-primary">256</div>
              <div className="text-xs text-muted-foreground text-center">Bit Encryption</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-xl text-primary">99.9%</div>
              <div className="text-xs text-muted-foreground text-center">Uptime</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">
          <p>
            ApnaWallet is available on web, iOS, and Android platforms. Our mobile apps offer additional 
            features like biometric security, offline access, and document scanning.
          </p>
          <p className="mt-2">
            Have more questions or need support? Contact our team at help@apnawallet.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppInfo;
