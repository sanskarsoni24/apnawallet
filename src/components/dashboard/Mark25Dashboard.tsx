import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  FileText, 
  Bell, 
  Mic,
  Brain,
  Zap,
  Shield,
  Users,
  Camera,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Settings,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { createNotification, speakNotification, stopSpeaking } from "@/services/NotificationService";

const Mark25Dashboard = () => {
  const { userSettings, displayName } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dailyBrief, setDailyBrief] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Generate daily brief on load
    generateDailyBrief();
  }, []);

  const generateDailyBrief = () => {
    const brief = `Good morning ${displayName || 'there'}! Today is ${currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}. You have 3 meetings scheduled, 2 document renewals coming up, and light traffic on your usual route. Priority: Review quarterly reports before 2 PM meeting.`;
    
    setDailyBrief(brief);
    
    // Speak the brief if voice reminders are enabled
    if (userSettings?.voiceReminders) {
      speakBrief(brief);
    }
  };

  const speakBrief = (text: string) => {
    setIsSpeaking(true);
    const success = speakNotification(text, {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8
    });
    
    if (success) {
      // Stop speaking after estimated duration
      const words = text.split(' ').length;
      const duration = (words / 150) * 60 * 1000; // Approximate speaking time
      setTimeout(() => setIsSpeaking(false), duration);
    } else {
      setIsSpeaking(false);
    }
  };

  const stopSpeechSynthesis = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice command recognition
      createNotification("Voice Assistant", "I'm listening... What can I help you with?", { speak: true });
      
      // Auto-stop after 5 seconds (simulate)
      setTimeout(() => {
        setIsListening(false);
        createNotification("Voice Assistant", "I'm here when you need me!", { speak: false });
      }, 5000);
    }
  };

  const todaySchedule = [
    {
      time: "9:00 AM",
      title: "Team Standup",
      type: "meeting",
      location: "Conference Room A",
      priority: "medium",
      duration: "30 min"
    },
    {
      time: "11:30 AM", 
      title: "Client Proposal Review",
      type: "meeting",
      location: "Virtual - Zoom",
      priority: "high",
      duration: "1 hour"
    },
    {
      time: "2:00 PM",
      title: "Quarterly Business Review", 
      type: "meeting",
      location: "Boardroom",
      priority: "high",
      duration: "2 hours"
    },
    {
      time: "4:30 PM",
      title: "Doctor Appointment",
      type: "personal",
      location: "City Medical Center",
      priority: "medium",
      duration: "45 min"
    }
  ];

  const smartAlerts = [
    {
      id: 1,
      type: "traffic",
      title: "Route Update",
      message: "Light traffic on usual route to office. Leave 5 minutes earlier for doctor appointment.",
      priority: "medium",
      time: "7:30 AM"
    },
    {
      id: 2,
      type: "document",
      title: "Document Renewal",
      message: "Your driving license expires in 15 days. Renewal appointment suggested.",
      priority: "high",
      time: "8:00 AM"
    },
    {
      id: 3,
      type: "timezone",
      title: "Time Zone Alert",
      message: "Client call moved to 3 PM EST (12 PM your time) due to timezone conflict.",
      priority: "medium",
      time: "8:15 AM"
    }
  ];

  const recentDocuments = [
    { name: "Q4 Financial Report", type: "PDF", lastAccessed: "2 hours ago", importance: "high" },
    { name: "Insurance Policy", type: "PDF", lastAccessed: "1 day ago", importance: "medium" },
    { name: "Contract Agreement", type: "PDF", lastAccessed: "3 days ago", importance: "high" },
  ];

  const upcomingReminders = [
    { title: "Pay electricity bill", due: "Tomorrow", type: "bill" },
    { title: "Follow up with John", due: "2 days", type: "followup" },
    { title: "Submit tax documents", due: "1 week", type: "document" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with AI Assistant */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-indigo-500">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  M25
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Good morning, {displayName || 'there'}!</h1>
              <p className="text-muted-foreground">Mark-25 is ready to assist you</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? "default" : "outline"}
              size="sm"
              onClick={handleVoiceCommand}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isListening ? 'Listening...' : 'Voice Command'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={isSpeaking ? stopSpeechSynthesis : () => speakBrief(dailyBrief)}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Daily Brief Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Daily Brief - {currentTime.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100">{dailyBrief}</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentTime.toLocaleTimeString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                    >
                      <div className="text-center min-w-[60px]">
                        <div className="text-sm font-medium">{event.time}</div>
                        <div className="text-xs text-muted-foreground">{event.duration}</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge 
                            variant={event.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {event.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {event.type === 'meeting' && <Users className="h-4 w-4 text-blue-500" />}
                        {event.type === 'personal' && <Star className="h-4 w-4 text-amber-500" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smart Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-600" />
                  Smart Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smartAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + alert.id * 0.1 }}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                          {alert.type === 'traffic' && <MapPin className="h-3 w-3 text-amber-600" />}
                          {alert.type === 'document' && <FileText className="h-3 w-3 text-amber-600" />}
                          {alert.type === 'timezone' && <Clock className="h-3 w-3 text-amber-600" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">{alert.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                          <div className="text-xs text-muted-foreground mt-2">{alert.time}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Document Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium">{doc.name}</h5>
                        <p className="text-xs text-muted-foreground">{doc.lastAccessed}</p>
                      </div>
                      <Badge variant={doc.importance === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {doc.importance}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReminders.map((reminder, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        {reminder.type === 'bill' && <FileText className="h-4 w-4 text-purple-600" />}
                        {reminder.type === 'followup' && <Phone className="h-4 w-4 text-purple-600" />}
                        {reminder.type === 'document' && <FileText className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium">{reminder.title}</h5>
                        <p className="text-xs text-muted-foreground">Due: {reminder.due}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-2">
                    <Camera className="h-4 w-4" />
                    <span className="text-xs">Scan Document</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs">Schedule Call</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Mark25Dashboard;