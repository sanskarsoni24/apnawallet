import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  FileText, 
  ScanSearch, 
  Circle, 
  Brain, 
  Star, 
  Users, 
  CheckCircle2
} from "lucide-react";
import BlurContainer from "../ui/BlurContainer";

const LandingPage = () => {
  return (
    <div className="flex flex-col space-y-16 py-6 animate-fade-in">
      {/* Hero Section with wavy background */}
      <section className="text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
          <svg 
            className="absolute bottom-0 left-0 right-0 w-full opacity-20" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
          >
            <path 
              fill="#8B5CF6" 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,165.3C960,149,1056,139,1152,154.7C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        <div className="space-y-6 pt-10 z-10 relative">
          <div className="inline-block px-6 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 font-medium text-sm mb-4 animate-bounce">
            🚀 Never lose track of important documents again!
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Manage Your Documents
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent block mt-2">With Super Powers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6">
            DocuNinja helps you organize, scan, auto-categorize, and track all your important documents in one secure place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="font-medium text-lg group">
              <Link to="/sign-up" className="gap-2">
                Get Started 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with playful cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
        <FeatureCard 
          icon={<ScanSearch className="h-8 w-8 text-indigo-500" />}
          title="Scan & Auto-Extract"
          color="from-indigo-500 to-blue-500"
          delay={100}
          description="Scan documents with your camera and our AI extracts important details like due dates automatically!"
        />
        
        <FeatureCard
          icon={<Brain className="h-8 w-8 text-purple-500" />}
          title="Smart Categorization"
          color="from-purple-500 to-pink-500" 
          delay={200}
          description="Our AI analyzes your documents and automatically categorizes them so you don't have to."
        />
        
        <FeatureCard
          icon={<Circle className="h-8 w-8 text-pink-500" />}
          title="Priority Tracking"
          color="from-pink-500 to-rose-500"
          delay={300}
          description="Documents are ranked by importance based on due dates so you never miss what matters most."
        />
        
        <FeatureCard
          icon={<FileText className="h-8 w-8 text-sky-500" />}
          title="Document Management"
          color="from-sky-500 to-teal-500"
          delay={400}
          description="Easily upload, organize and access all your important documents in one secure location."
        />
        
        <FeatureCard
          icon={<Clock className="h-8 w-8 text-teal-500" />}
          title="Expiration Reminders"
          color="from-teal-500 to-emerald-500"
          delay={500}
          description="Get automatic reminders before your documents expire so you're always prepared."
        />
        
        <FeatureCard
          icon={<Shield className="h-8 w-8 text-emerald-500" />}
          title="Secure Storage"
          color="from-emerald-500 to-green-500"
          delay={600}
          description="Your documents are encrypted and stored securely, accessible only to you whenever you need them."
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
      
      {/* Testimonials */}
      <section className="py-8">
        <div className="text-center mb-12">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent text-xl font-medium">
            Loved by users
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">What Our Users Say</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="DocuNinja literally saved me from missing my passport renewal deadline. The auto-extraction feature is mind-blowing!"
            name="Alex K."
            role="Student"
          />
          
          <TestimonialCard
            quote="As someone who hates organizing papers, the smart categorization has been a game-changer for keeping my business docs in order."
            name="Jamie T."
            role="Small Business Owner"
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
              {["Smart AI", "Auto-Extraction", "Document Scanner", "Priority Tracking", "Secure"].map((tag, i) => (
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
            
            <Button asChild size="lg" className="text-lg px-8 py-6">
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

// Testimonial card component
const TestimonialCard = ({ quote, name, role }) => {
  return (
    <BlurContainer className="p-6 space-y-4">
      <div className="flex gap-2 mb-4">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="text-lg italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {name[0]}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </BlurContainer>
  );
};

export default LandingPage;
