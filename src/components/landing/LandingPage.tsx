
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  FileText, 
  ScanSearch, 
  Zap, 
  Brain,
  Bell,
  Download,
  Upload,
  Tag,
  Settings,
  Calendar
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
            DocuNinja with Suraksha Locker provides AI-powered document organization, secure storage, and smart reminders - all in one place.
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
                  { icon: Download, text: "Download documents anytime" },
                  { icon: Tag, text: "Custom categories & document types" },
                  { icon: Bell, text: "Personalized reminder settings" }
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

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 py-6">
        <FeatureCard 
          icon={<ScanSearch className="h-8 w-8 text-indigo-500" />}
          title="Scan & Auto-Extract"
          color="from-indigo-500 to-blue-500"
          delay={100}
          description="Scan documents with your camera and our AI extracts important details like due dates automatically!"
        />
        
        <FeatureCard
          icon={<Tag className="h-8 w-8 text-purple-500" />}
          title="Custom Document Types"
          color="from-purple-500 to-pink-500" 
          delay={200}
          description="Create and filter your own document types and categories for perfect organization."
        />
        
        <FeatureCard
          icon={<Bell className="h-8 w-8 text-pink-500" />}
          title="Custom Reminders"
          color="from-pink-500 to-rose-500"
          delay={300}
          description="Set different reminder days for each document based on importance and urgency."
        />
        
        <FeatureCard
          icon={<Calendar className="h-8 w-8 text-sky-500" />}
          title="Document Calendar"
          color="from-sky-500 to-teal-500"
          delay={400}
          description="Visualize all your document deadlines in a convenient calendar view."
        />
        
        <FeatureCard
          icon={<Settings className="h-8 w-8 text-teal-500" />}
          title="Voice Notifications"
          color="from-teal-500 to-emerald-500"
          delay={500}
          description="Configure voice settings for audible reminders with customizable voices."
        />
        
        <FeatureCard
          icon={<Shield className="h-8 w-8 text-emerald-500" />}
          title="Secure Storage"
          color="from-emerald-500 to-green-500"
          delay={600}
          description="End-to-end encrypted storage keeps your sensitive documents safe and private."
        />
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
            title="Stay Updated"
            description="Get reminders and manage documents with ease"
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
              {["Suraksha Locker", "Custom Reminders", "Document Types", "Voice Preview", "Calendar View"].map((tag, i) => (
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
