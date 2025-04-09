
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, X, VideoIcon, FileVideo, HelpCircle, Volume2, SkipBack, SkipForward } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface VideoFaqItem {
  id: string;
  question: string;
  answer: string;
  videoUrl?: string;
  thumbnail?: string;
  category: string;
}

// Updated FAQ data with real video URLs
const faqData: VideoFaqItem[] = [
  {
    id: "upload-doc",
    question: "How do I upload documents?",
    answer: "You can upload documents by dragging and dropping files onto the upload area or by clicking the upload button. The app supports various formats including PDF, JPG, and PNG.",
    videoUrl: "https://player.vimeo.com/external/449701035.sd.mp4?s=e5f8945f196d5ed81e63adfd3cb0db7716129df8&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXBsb2FkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Documents"
  },
  {
    id: "scan-doc",
    question: "How do I scan documents with my phone?",
    answer: "To scan documents, click the scan button in the upload area. This will activate your device camera. Position the document within the frame and tap Capture.",
    videoUrl: "https://player.vimeo.com/external/403891542.sd.mp4?s=5aa6613cf4a3c93e9cd2afdfc1c3997dce4e96ee&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2NhbiBkb2N1bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Documents"
  },
  {
    id: "manage-categories",
    question: "How do I create document categories?",
    answer: "When uploading a document, you can select from existing categories or create new ones by clicking the 'Add Type' button next to the document type dropdown.",
    videoUrl: "https://player.vimeo.com/external/370336675.sd.mp4?s=ce9e3ebea2ad805011813cec8d4447c2d82e1650&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhdGVnb3JpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Documents"
  },
  {
    id: "setup-notifications",
    question: "How do I set up email notifications?",
    answer: "Navigate to the Settings page and enable email notifications. You can verify your email by sending a test notification.",
    videoUrl: "https://player.vimeo.com/external/477294060.sd.mp4?s=fa3e8388ef8186123424d7494fc28887f186a5de&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bm90aWZpY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Notifications"
  },
  {
    id: "voice-settings",
    question: "How do I configure voice reminders?",
    answer: "Go to the Settings page and toggle on Voice Reminders. You can customize the voice, volume, speed and pitch to your preference.",
    videoUrl: "https://player.vimeo.com/external/457533983.sd.mp4?s=581ad6b1cc6c12e2154e071a8d039a76e843fba8&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1590065672897-8ca850fb3b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZvaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Notifications"
  },
  {
    id: "mobile-app",
    question: "How do I download the mobile app?",
    answer: "Visit the Mobile App page and scan the QR code with your device. For Android, you can directly download the APK file. For iOS, follow the installation instructions.",
    videoUrl: "https://player.vimeo.com/external/414980331.sd.mp4?s=9a8a3d13c6bde16a84a6a33c214fe8ac1d44223d&profile_id=164&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Mobile"
  }
];

const VideoFaq = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoFaqItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) {
      toast({
        title: "Video Error",
        description: "There was a problem playing this video. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Add error handling for play promise
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Play started successfully
              setIsPlaying(true);
            })
            .catch(error => {
              // Play failed
              console.error("Video playback failed:", error);
              toast({
                title: "Playback Error",
                description: "Could not play the video. The file may be missing or in an unsupported format.",
                variant: "destructive"
              });
            });
        }
      }
    } catch (error) {
      console.error("Video control error:", error);
      toast({
        title: "Video Error",
        description: "There was a problem controlling the video playback.",
        variant: "destructive"
      });
    }
  };

  const onVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const onVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video loading error:", e);
    setIsLoading(false);
    toast({
      title: "Video Not Available",
      description: "This tutorial video could not be loaded. Please try again later.",
      variant: "destructive"
    });
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const skipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const skipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-indigo-500" />
            Video Tutorials
          </CardTitle>
          <CardDescription>
            Watch video guides to help you navigate ApnaWallet
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
                            className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer aspect-video flex items-center justify-center group"
                            onClick={() => handleVideoClick(faq)}
                          >
                            {faq.thumbnail ? (
                              <img 
                                src={faq.thumbnail} 
                                alt={faq.question} 
                                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <FileVideo className="h-12 w-12 mb-2" />
                                <span className="text-sm">Video tutorial available</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                              <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg transform transition-transform group-hover:scale-110">
                                <Play className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              Tutorial Video
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
      
      {/* Enhanced Video Dialog */}
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
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}
            
            {selectedVideo?.videoUrl && (
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                onEnded={onVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={onVideoError}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1">
                  <span className="text-white text-xs">{formatTime(currentTime)}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 0} 
                    value={currentTime}
                    onChange={onSeek}
                    className="flex-1 h-1.5 appearance-none bg-gray-300 rounded-full overflow-hidden cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                  />
                  <span className="text-white text-xs">{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10 h-8 w-8"
                      onClick={skipBackward}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white text-black hover:bg-white/90 h-10 w-10 rounded-full"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10 h-8 w-8"
                      onClick={skipForward}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 appearance-none bg-gray-300 rounded-full cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%)`
                      }}
                    />
                  </div>
                </div>
              </div>
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
