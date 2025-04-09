
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Upload, 
  FileText, 
  ScanSearch, 
  Zap, 
  CloudCog,
  Bell,
  Download,
  Share2,
  Tag,
  Settings,
  Calendar,
  Lock,
  Smartphone
} from "lucide-react";
import BlurContainer from "../ui/BlurContainer";

const LandingPage = () => {
  return (
    <div className="flex flex-col space-y-16 py-6 animate-fade-in">
      {/* Hero Section with orbital background */}
      <section className="text-center relative overflow-hidden py-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-500/10 to-pink-500/20"></div>
          {/* Animated orbit circles */}
          <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] border border-indigo-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute top-1/4 left-1/2 w-[300px] h-[300px] border border-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
          <div className="absolute top-1/4 left-1/2 w-[150px] h-[150px] border border-pink-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]"></div>
        </div>
        
        <div className="space-y-8 pt-10 z-10 relative">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-800 dark:text-indigo-300 font-medium text-sm mb-4">
            🔒 Your documents, secure and organized
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Document Management
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">Reimagined</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6">
            DocuNinja with Suraksha Locker provides AI-powered document organization, secure storage, smart reminders, and cross-platform access - all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="font-medium text-lg group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link to="/sign-up" className="gap-2">
                Get Started 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg border-indigo-200 dark:border-indigo-800">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
        
        {/* Floating icons for visual interest */}
        <div className="absolute top-20 right-[15%] h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-[10%] h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-70 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-40 left-[20%] h-6 w-6 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-70 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
      </section>

      {/* Featured App Section */}
      <section className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Introducing Suraksha Locker</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your private vault for securing sensitive information
          </p>
        </div>
        
        <BlurContainer className="p-6 md:p-10 rounded-xl bg-gradient-to-br from-indigo-600/10 to-purple-500/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>End-to-End Encrypted</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold">Secure Document Storage</h3>
              <p className="text-muted-foreground text-lg">
                Store passwords, notes, and documents with military-grade encryption. Your data never leaves your device unprotected.
              </p>
              
              <div className="space-y-3">
                {[
                  { icon: Upload, text: "Drag & drop document uploads" },
                  { icon: CloudCog, text: "Automated backups & cloud export" },
                  { icon: Share2, text: "Secure document sharing" },
                  { icon: Lock, text: "Two-factor authentication" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 mt-4">
                <Link to="/sign-up">Try Suraksha Locker Now</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-lg blur-xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-md border border-white/10 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-indigo-400" />
                      <h4 className="text-white font-medium">Suraksha Vault</h4>
                    </div>
                    <div className="flex space-x-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-2 w-2 rounded-full bg-indigo-400/60"></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="h-10 bg-white/10 rounded"></div>
                    <div className="h-24 bg-white/5 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-24 bg-indigo-500/50 rounded"></div>
                      <div className="h-8 w-24 bg-purple-500/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurContainer>
      </section>

      {/* New Multi-platform Access */}
      <section className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Access Anywhere</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your documents are always with you, no matter what device you're using
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Mobile App</h3>
            <p className="text-muted-foreground">
              Native app for iOS and Android with document scanning and offline access
            </p>
            <Button asChild variant="outline">
              <Link to="/mobile-app">Download App</Link>
            </Button>
          </BlurContainer>
          
          <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white">
                <path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2 0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Web Application</h3>
            <p className="text-muted-foreground">
              Access your documents from any browser with our responsive web app
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard">Open Web App</Link>
            </Button>
          </BlurContainer>
          
          <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white">
                <path fill="currentColor" d="M4 9.5V4c0-.55.45-1 1-1h5.5c.55 0 1 .45 1 1v5.5c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1m14 0c0 .55-.45 1-1 1h-5.5c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1H17c.55 0 1 .45 1 1v5.5m0 10.5c0 .55-.45 1-1 1h-5.5c-.55 0-1-.45-1-1v-5.5c0-.55.45-1 1-1H17c.55 0 1 .45 1 1V20M4 20v-5.5c0-.55.45-1 1-1h5.5c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Browser Extension</h3>
            <p className="text-muted-foreground">
              Quick access to your documents with our Chrome browser extension
            </p>
            <Button asChild variant="outline">
              <Link to="/settings?tab=extensions">Get Extension</Link>
            </Button>
          </BlurContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature Highlights</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for complete document management
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 py-6">
          <FeatureCard 
            icon={<ScanSearch className="h-8 w-8 text-indigo-500" />}
            title="Scan & Auto-Extract"
            color="from-indigo-500 to-blue-500"
            delay={100}
            description="Scan documents with your camera and our AI extracts important details like due dates automatically!"
          />
          
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-purple-500" />}
            title="Secure Document Sharing"
            color="from-purple-500 to-pink-500" 
            delay={200}
            description="Share documents with colleagues and family while maintaining privacy and security."
          />
          
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-pink-500" />}
            title="Smart Notifications"
            color="from-pink-500 to-rose-500"
            delay={300}
            description="Get timely reminders about upcoming deadlines and renewals across all your devices."
          />
          
          <FeatureCard
            icon={<CloudCog className="h-8 w-8 text-sky-500" />}
            title="Cloud Backup & Export"
            color="from-sky-500 to-teal-500"
            delay={400}
            description="Automatically backup your documents to Google Drive, Dropbox, or OneDrive."
          />
          
          <FeatureCard
            icon={<Lock className="h-8 w-8 text-teal-500" />}
            title="Enhanced Security"
            color="from-teal-500 to-emerald-500"
            delay={500}
            description="Two-factor authentication, encryption keys, and secure backup to protect your sensitive information."
          />
          
          <FeatureCard
            icon={<Smartphone className="h-8 w-8 text-emerald-500" />}
            title="Cross-Platform Access"
            color="from-emerald-500 to-green-500"
            delay={600}
            description="Access your documents from any device with our web app, mobile app, and browser extension."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How DocuNinja Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to document management nirvana
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <StepCard 
            step={1}
            title="Scan or Upload"
            description="Use our document scanner or upload your files directly"
          />
          
          <StepCard
            step={2} 
            title="Auto-Processing"
            description="Our AI extracts and organizes key information"
          />
          
          <StepCard 
            step={3}
            title="Access Anywhere"
            description="Use our web app, mobile app, or browser extension"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <BlurContainer className="p-8 md:p-12 rounded-xl relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 z-0"
            aria-hidden="true"
          />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {["Two-Factor Auth", "Cloud Export", "Document Sharing", "Chrome Extension", "Calendar View"].map((tag, i) => (
                <span 
                  key={i}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to get your documents under control?
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Join thousands of users who trust DocuNinja to manage their important documents.
              Get started today for free and experience document management with superpowers.
            </p>
            
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link to="/sign-up" className="gap-2">
                Create Your Free Account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <p className="text-muted-foreground text-sm mt-4">
              No credit card required • Free plan available • Cancel anytime
            </p>
          </div>
        </BlurContainer>
      </section>
    </div>
  );
};

// Feature card component with playful gradient border
const FeatureCard = ({ icon, title, description, color, delay }) => {
  return (
    <BlurContainer 
      className={`p-6 flex flex-col items-center text-center space-y-4 animate-fade-in border-t-4 bg-white/5 dark:bg-white/2 border-gradient-${color} animation-delay-${delay} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="h-16 w-16 rounded-full bg-gradient-to-br bg-white/10 dark:bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </BlurContainer>
  );
};

// Step card component
const StepCard = ({ step, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className={`h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold z-10`}>
        {step}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default LandingPage;
