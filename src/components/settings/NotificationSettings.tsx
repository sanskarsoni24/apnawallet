
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Slider } from "@/components/ui/slider";
import { getVoiceSettings, updateVoiceSettings, testVoiceSettings, getAvailableVoices, verifyEmailNotifications, sendEmailNotification } from "@/services/NotificationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, Mail } from "lucide-react";

export default function NotificationSettings() {
  const { userSettings, updateUserSettings, email } = useUser();
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [voiceVolume, setVoiceVolume] = useState<number>(80);
  const [voiceRate, setVoiceRate] = useState<number>(100);
  const [voicePitch, setVoicePitch] = useState<number>(100);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [isTestingEmail, setIsTestingEmail] = useState<boolean>(false);
  const [testEmailInput, setTestEmailInput] = useState<string>("");

  useEffect(() => {
    // Initialize values from userSettings
    if (userSettings) {
      setReminderDays(userSettings.reminderDays || 3);
      
      const voiceSettings = getVoiceSettings();
      setVoiceVolume(voiceSettings.volume * 100);
      setVoiceRate(voiceSettings.rate * 100);
      setVoicePitch(voiceSettings.pitch * 50);
      setSelectedVoice(voiceSettings.voiceName || "");

      // Check if voice synthesis is supported
      setVoiceSupported(typeof window !== "undefined" && window.speechSynthesis !== undefined);
      
      // Load available voices
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const loadVoices = () => {
          const voices = getAvailableVoices();
          setAvailableVoices(voices);
          
          // If we have voices and none is selected, select the first one
          if (voices.length > 0 && !voiceSettings.voiceName) {
            setSelectedVoice(voices[0].name);
            updateVoiceSettings({ voiceName: voices[0].name });
          }
        };
        
        loadVoices();
        
        // Chrome loads voices asynchronously, so we need this event
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }
      }
      
      // Check email verification status
      if (email && userSettings.emailNotifications) {
        const emailStatus = verifyEmailNotifications(email);
        setEmailVerified(emailStatus.configured && emailStatus.enabled);
      }
    }
  }, [userSettings, email]);

  const handleEmailToggle = (checked: boolean) => {
    updateUserSettings({
      ...userSettings,
      emailNotifications: checked,
    });
    
    if (checked && email) {
      // Set a small delay so the user sees the loading state
      setTimeout(() => {
        const emailStatus = verifyEmailNotifications(email);
        setEmailVerified(emailStatus.configured);
        
        if (emailStatus.configured) {
          toast({
            title: "Email notifications enabled",
            description: "You will receive notifications about your documents via email."
          });
        }
      }, 500);
    }
  };

  const handlePushToggle = (checked: boolean) => {
    updateUserSettings({
      ...userSettings,
      pushNotifications: checked,
    });
    
    if (checked && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast({
            title: "Push notifications enabled",
            description: "You will receive notifications about your documents."
          });
        } else {
          updateUserSettings({
            ...userSettings,
            pushNotifications: false,
          });
          
          toast({
            title: "Permission denied",
            description: "You need to allow notifications in your browser settings.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleVoiceToggle = (checked: boolean) => {
    updateUserSettings({
      ...userSettings,
      voiceReminders: checked,
    });
    
    if (checked && voiceSupported) {
      // Test the voice
      const testResult = testVoiceSettings();
      
      if (!testResult) {
        toast({
          title: "Voice synthesis not available",
          description: "Your browser may not support voice synthesis.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleReminderDaysChange = (days: number) => {
    setReminderDays(days);
    updateUserSettings({
      ...userSettings,
      reminderDays: days,
    });
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    updateVoiceSettings({ voiceName: voice });
    updateUserSettings({
      ...userSettings,
      voiceType: voice,
    });
    
    // Test the new voice
    if (userSettings.voiceReminders) {
      testVoiceSettings();
    }
  };

  const handleVoiceVolumeChange = (value: number[]) => {
    const volumeValue = value[0];
    setVoiceVolume(volumeValue);
    updateVoiceSettings({ volume: volumeValue / 100 });
  };

  const handleVoiceRateChange = (value: number[]) => {
    const rateValue = value[0];
    setVoiceRate(rateValue);
    updateVoiceSettings({ rate: rateValue / 100 });
  };

  const handleVoicePitchChange = (value: number[]) => {
    const pitchValue = value[0];
    setVoicePitch(pitchValue);
    updateVoiceSettings({ pitch: pitchValue / 50 });
  };
  
  const testVoice = () => {
    testVoiceSettings();
  };
  
  const sendTestEmail = async () => {
    if (!testEmailInput && !email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send a test notification.",
        variant: "destructive"
      });
      return;
    }
    
    const targetEmail = testEmailInput || email;
    
    setIsTestingEmail(true);
    
    try {
      const result = sendEmailNotification(
        targetEmail,
        "SurakshitLocker - Test Notification",
        `Hello,\n\nThis is a test email notification from SurakshitLocker.\n\nYou will receive notifications about your documents at this email address.\n\nThank you for using SurakshitLocker!`
      );
      
      if (result) {
        toast({
          title: "Test email sent",
          description: `A test notification was sent to ${targetEmail}`
        });
        
        setEmailVerified(true);
      } else {
        toast({
          title: "Failed to send test email",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error sending email",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you want to be notified about your documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your documents via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={userSettings.emailNotifications !== false}
                onCheckedChange={handleEmailToggle}
              />
            </div>
            
            {/* Email verification alert */}
            {userSettings.emailNotifications && email && !emailVerified && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Email notifications are not verified. Please send a test email to verify.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Test email section */}
            {userSettings.emailNotifications && (
              <div className="pt-2 space-y-3">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="test-email">Send test notification to:</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="test-email"
                      placeholder={email || "Enter email address"}
                      value={testEmailInput}
                      onChange={(e) => setTestEmailInput(e.target.value)}
                    />
                    <Button 
                      onClick={sendTestEmail}
                      disabled={isTestingEmail}
                      size="sm"
                    >
                      {isTestingEmail ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail className="mr-1 h-4 w-4" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your documents in your browser
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={userSettings.pushNotifications || false}
              onCheckedChange={handlePushToggle}
            />
          </div>
          
          {/* Voice Reminders */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voice-reminders">Voice Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Enable voice notifications for document reminders
                </p>
              </div>
              <Switch
                id="voice-reminders"
                checked={userSettings.voiceReminders || false}
                onCheckedChange={handleVoiceToggle}
                disabled={!voiceSupported}
              />
            </div>
            
            {!voiceSupported && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Voice reminders are not supported in your current browser.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Reminder Days in Advance */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="reminder-days">Reminder Days in Advance: {reminderDays} {reminderDays === 1 ? 'day' : 'days'}</Label>
              <p className="text-sm text-muted-foreground">
                How many days before due date to send reminders
              </p>
            </div>
            <Slider
              id="reminder-days"
              min={1}
              max={30}
              step={1}
              value={[reminderDays]}
              onValueChange={(value) => handleReminderDaysChange(value[0])}
            />
          </div>
          
          {/* Voice Settings */}
          {userSettings.voiceReminders && voiceSupported && (
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-medium">Voice Settings</h3>
              
              {/* Voice Selection */}
              <div className="space-y-2">
                <Label htmlFor="voice-selection">Voice</Label>
                <Select
                  value={selectedVoice}
                  onValueChange={handleVoiceChange}
                >
                  <SelectTrigger id="voice-selection">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-volume">Volume: {voiceVolume}%</Label>
                </div>
                <Slider
                  id="voice-volume"
                  min={0}
                  max={100}
                  step={5}
                  value={[voiceVolume]}
                  onValueChange={handleVoiceVolumeChange}
                />
              </div>
              
              {/* Rate Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-rate">Speed: {voiceRate}%</Label>
                </div>
                <Slider
                  id="voice-rate"
                  min={50}
                  max={200}
                  step={10}
                  value={[voiceRate]}
                  onValueChange={handleVoiceRateChange}
                />
              </div>
              
              {/* Pitch Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-pitch">Pitch: {voicePitch}%</Label>
                </div>
                <Slider
                  id="voice-pitch"
                  min={50}
                  max={150}
                  step={10}
                  value={[voicePitch]}
                  onValueChange={handleVoicePitchChange}
                />
              </div>
              
              <Button onClick={testVoice} variant="outline" size="sm">
                Test Voice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
