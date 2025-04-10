
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Upload, 
  CheckCircle,
  Fingerprint,
  Users,
  Smartphone,
  Globe,
  Layers,
  ShieldCheck,
  Database,
  LockKeyhole,
  Bell,
  CloudCog
} from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="flex flex-col space-y-20 py-10 font-sans">
      {/* Hero Section with Premium Design */}
      <section className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-800/10 to-violet-900/20"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute bottom-10 left-[5%] w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"></div>
          
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `linear-gradient(to right, rgb(99, 102, 241, 0.05) 1px, transparent 1px), 
                               linear-gradient(to bottom, rgb(99, 102, 241, 0.05) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          ></div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-10 py-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-1.5 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Introducing SurakshitLocker Premium
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight"
            >
              Your Digital <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">Fortress</span> for Sensitive Data
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl"
            >
              Store, manage, and securely access your important documents and passwords with military-grade encryption and intelligent organization.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <Button asChild size="lg" className="font-medium text-lg group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-600/20">
                <Link to="/sign-up" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 max-w-3xl"
            >
              {["End-to-End Encryption", "Zero-Knowledge Architecture", "Biometric Authentication", "Cross-Platform"].map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 rounded-full text-sm backdrop-blur-sm border border-slate-200 dark:border-slate-800">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Floating Device Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative mx-auto max-w-5xl mt-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl transform -rotate-1"></div>
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Vault
                    </div>
                    <h3 className="text-2xl font-bold">Your Documents, Secured</h3>
                    <p className="text-slate-500 dark:text-slate-400">Access your most sensitive information with just a fingerprint or secure password.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: LockKeyhole, text: "Bank statements and financial documents" },
                      { icon: Database, text: "Passwords and secure notes" },
                      { icon: Fingerprint, text: "Identity documents and certificates" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-b-lg md:rounded-l-none md:rounded-r-lg shadow-lg">
                  <div className="h-full bg-slate-900 rounded-lg p-1 overflow-hidden">
                    {/* Mock UI */}
                    <div className="h-full rounded-lg bg-slate-800 p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 w-32 bg-slate-700 rounded"></div>
                        <div className="h-8 w-8 bg-slate-700 rounded-full"></div>
                      </div>
                      
                      <div className="h-10 w-full bg-slate-700 rounded mb-4"></div>
                      
                      <div className="space-y-3 flex-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/30"></div>
                            <div className="space-y-1.5 flex-1">
                              <div className="h-3 w-24 bg-slate-600 rounded"></div>
                              <div className="h-2 w-32 bg-slate-600/60 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Enterprise-Grade Security, Consumer-Friendly Interface</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We've engineered SurakshitLocker to provide the highest levels of security without sacrificing usability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuresList.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl transform group-hover:scale-[1.03] transition-transform duration-300"></div>
                <BlurContainer className="h-full p-8 flex flex-col items-center text-center space-y-4 backdrop-blur-sm border border-slate-200 dark:border-slate-800 group-hover:border-indigo-500/30 dark:group-hover:border-indigo-500/20 transition-colors duration-300">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-600 dark:text-indigo-400 mb-2">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </BlurContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Security Focus Section */}
      <section className="py-16 relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Security First Design
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">Your Data, Protected by Design</h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300">
                SurakshitLocker is built on a zero-knowledge architecture, meaning even we can't access your data. Your encrypted vault is only accessible with your master password.
              </p>
              
              <div className="space-y-4 pt-4">
                {securityFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mt-0.5">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Link to="/help?section=security">Learn More About Our Security</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-1">
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <LockKeyhole className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">Vault Encryption</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">AES-256, Argon2</p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700 p-2 flex flex-col justify-center items-center">
                            <div className="h-3 w-3/4 rounded-full bg-slate-300 dark:bg-slate-600 mb-2"></div>
                            <div className="h-3 w-1/2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Master password complexity</div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">Strong</div>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Weak</span>
                          <span>Medium</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Access Anywhere Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Access Your Vault Anywhere</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-4">
              Your secure data follows you across all your devices with perfect synchronization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PlatformCard 
              icon={<Smartphone className="h-6 w-6" />}
              title="Mobile App"
              description="Native iOS and Android apps with biometric authentication."
              cta="Download App"
              link="/mobile-app"
              gradient="from-blue-500 to-cyan-500"
            />
            
            <PlatformCard 
              icon={<Globe className="h-6 w-6" />}
              title="Web Access"
              description="Access your vault from any browser with our secure web app."
              cta="Open Web App"
              link="/dashboard"
              gradient="from-purple-500 to-indigo-500"
            />
            
            <PlatformCard 
              icon={<Layers className="h-6 w-6" />}
              title="Browser Extension"
              description="Auto-fill passwords and access documents right from your browser."
              cta="Get Extension"
              link="/settings?tab=extensions"
              gradient="from-amber-500 to-orange-500"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Thousands</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-4">
              See why people and businesses trust SurakshitLocker with their most sensitive information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <BlurContainer className="h-full p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 flex-1">"{testimonial.quote}"</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.date}
                  </div>
                </BlurContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Premium CTA Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <BlurContainer variant="dark" className="overflow-hidden rounded-2xl">
            <div className="relative px-6 py-16 md:p-16">
              {/* Background effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Experience Premium Protection Today</h2>
                  
                  <p className="text-xl text-indigo-100">
                    Join thousands of users who trust SurakshitLocker to safeguard their most sensitive information.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center mt-8">
                    {["End-to-End Encryption", "Cross-Platform Access", "Automated Backups", "Smart Notifications", "Document Scanning"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                        <CheckCircle className="h-4 w-4 text-indigo-300" />
                        <span className="text-white text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button asChild size="lg" className="font-medium text-lg bg-white text-indigo-700 hover:bg-white/90">
                      <Link to="/sign-up">Start Free Trial</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                      <Link to="/pricing">View Pricing</Link>
                    </Button>
                  </div>
                  
                  <p className="text-indigo-200 text-sm">
                    No credit card required • 14-day free trial • Cancel anytime
                  </p>
                </motion.div>
              </div>
            </div>
          </BlurContainer>
        </div>
      </section>
    </div>
  );
};

// Platform card component
const PlatformCard = ({ icon, title, description, cta, link, gradient }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group"
    >
      <BlurContainer className="h-full p-8 flex flex-col items-center text-center space-y-5 group-hover:shadow-lg transition-all duration-300">
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white mb-2 shadow-lg`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 flex-1">{description}</p>
        
        <Button asChild variant="outline" className="mt-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30">
          <Link to={link} className="flex items-center gap-2">
            {cta}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </BlurContainer>
    </motion.div>
  );
};

// Feature list data
const featuresList = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "Your data is encrypted before it leaves your device, ensuring only you can access it."
  },
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description: "Quickly and securely access your vault with fingerprint or face recognition."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Never miss important deadlines with intelligent reminders for document renewals."
  },
  {
    icon: Upload,
    title: "Document Scanning",
    description: "Scan physical documents with your camera and organize them automatically."
  },
  {
    icon: CloudCog,
    title: "Secure Cloud Backup",
    description: "Keep your data safe with encrypted backups to your preferred cloud storage."
  },
  {
    icon: Users,
    title: "Secure Sharing",
    description: "Share selected documents with family or colleagues without compromising security."
  }
];

// Security features data
const securityFeatures = [
  {
    title: "Zero-Knowledge Architecture",
    description: "We cannot see or access your data, ever. All encryption happens locally on your device."
  },
  {
    title: "AES-256 Encryption",
    description: "Military-grade encryption that would take billions of years to crack with current technology."
  },
  {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security with 2FA using authenticator apps or security keys."
  },
  {
    title: "Automatic Timeout",
    description: "Your vault locks automatically after a period of inactivity for added protection."
  }
];

// Testimonial data
const testimonials = [
  {
    name: "Priya Sharma",
    title: "Small Business Owner",
    quote: "SurakshitLocker has completely transformed how I manage my business documents. The automatic reminders for license renewals alone have saved me thousands in potential lapsed permits.",
    date: "June 2024"
  },
  {
    name: "Raj Mehta",
    title: "Financial Advisor",
    quote: "As someone who handles sensitive financial information daily, security is my top priority. SurakshitLocker provides the perfect balance of robust security and ease of use.",
    date: "May 2024"
  },
  {
    name: "Anika Patel",
    title: "Healthcare Professional",
    quote: "The document scanning feature is incredible. I can quickly digitize patient records and store them securely with proper HIPAA compliance. Game changer for my practice.",
    date: "April 2024"
  }
];

export default LandingPage;
