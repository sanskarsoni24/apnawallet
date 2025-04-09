
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, X, VideoIcon, FileVideo, HelpCircle } from "lucide-react";

export interface VideoFaqItem {
  id: string;
  question: string;
  answer: string;
  videoUrl?: string;
  thumbnail?: string;
  category: string;
}

const faqData: VideoFaqItem[] = [
  {
    id: "upload-doc",
    question: "How do I upload documents?",
    answer: "You can upload documents by dragging and dropping files onto the upload area or by clicking the select documents button. The app supports various formats including PDF, JPG, and PNG.",
    videoUrl: "/videos/upload-document.mp4",
    thumbnail: "/images/upload-thumbnail.jpg",
    category: "Documents"
  },
  {
    id: "scan-doc",
    question: "How do I scan documents with my phone?",
    answer: "To scan documents, click the scan button in the upload area. This will activate your device camera. Position the document within the frame and tap Capture.",
    videoUrl: "/videos/scan-document.mp4",
    thumbnail: "/images/scan-thumbnail.jpg",
    category: "Documents"
  },
  {
    id: "manage-categories",
    question: "How do I create document categories?",
    answer: "When uploading a document, you can select from existing categories or create new ones by clicking the 'Add Type' button next to the document type dropdown.",
    videoUrl: "/videos/categories.mp4",
    thumbnail: "/images/categories-thumbnail.jpg",
    category: "Documents"
  },
  {
    id: "setup-notifications",
    question: "How do I set up email notifications?",
    answer: "Navigate to the Settings page and enable email notifications. You can verify your email by sending a test notification.",
    videoUrl: "/videos/notifications.mp4",
    thumbnail: "/images/notifications-thumbnail.jpg",
    category: "Notifications"
  },
  {
    id: "voice-settings",
    question: "How do I configure voice reminders?",
    answer: "Go to the Settings page and toggle on Voice Reminders. You can customize the voice, volume, speed and pitch to your preference.",
    videoUrl: "/videos/voice-settings.mp4",
    thumbnail: "/images/voice-thumbnail.jpg",
    category: "Notifications"
  },
  {
    id: "mobile-app",
    question: "How do I download the mobile app?",
    answer: "Visit the Mobile App page and scan the QR code with your device. For Android, you can directly download the APK file. For iOS, follow the installation instructions.",
    videoUrl: "/videos/mobile-app.mp4",
    thumbnail: "/images/mobile-thumbnail.jpg",
    category: "Mobile"
  }
];

const VideoFaq = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoFaqItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Get unique categories
  const categories = ["all", ...new Set(faqData.map(faq => faq.category))];
  
  // Filter FAQs by category
  const filteredFaqs = activeTab === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeTab);

  const handleVideoClick = (faq: VideoFaqItem) => {
    setSelectedVideo(faq);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const onVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-indigo-500" />
            Video Assisted FAQs
          </CardTitle>
          <CardDescription>
            Watch video guides to help you navigate SurakshitLocker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-indigo-500 mt-0.5" />
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p>{faq.answer}</p>
                        
                        {faq.videoUrl && (
                          <div 
                            className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer aspect-video flex items-center justify-center"
                            onClick={() => handleVideoClick(faq)}
                          >
                            {faq.thumbnail ? (
                              <img 
                                src={faq.thumbnail} 
                                alt={faq.question} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <FileVideo className="h-12 w-12 mb-2" />
                                <span className="text-sm">Video tutorial available</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <div className="bg-white dark:bg-gray-800 rounded-full p-3">
                                <Play className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => {
        if (!open) {
          setSelectedVideo(null);
          setIsPlaying(false);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.question}</DialogTitle>
          </DialogHeader>
          
          <div className="relative aspect-video rounded-md overflow-hidden bg-black">
            {selectedVideo?.videoUrl && (
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                onEnded={onVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm">{selectedVideo?.answer}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoFaq;
