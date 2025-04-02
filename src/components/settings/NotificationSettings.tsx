
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUser } from "@/contexts/UserContext";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Volume2 } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";

const formSchema = z.object({
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(false),
  voiceReminders: z.boolean().default(false),
  reminderDays: z.number().min(1).max(30).default(3),
  voiceType: z.string().default("default"),
});

const NotificationSettings = () => {
  const { userSettings, updateUserSettings } = useUser();
  const [previewVoice, setPreviewVoice] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: userSettings.emailNotifications !== false,
      pushNotifications: userSettings.pushNotifications || false,
      voiceReminders: userSettings.voiceReminders || false,
      reminderDays: userSettings.reminderDays || 3,
      voiceType: userSettings.voiceType || "default",
    },
  });

  // Re-initialize form when userSettings change
  useEffect(() => {
    form.reset({
      emailNotifications: userSettings.emailNotifications !== false,
      pushNotifications: userSettings.pushNotifications || false,
      voiceReminders: userSettings.voiceReminders || false,
      reminderDays: userSettings.reminderDays || 3,
      voiceType: userSettings.voiceType || "default",
    });
  }, [userSettings, form]);

  // Speech synthesis for previewing voice
  const speakPreview = (voiceType: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      
      // Cancel any previous speech
      synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance("This is a preview of the voice reminder.");
      
      // Get available voices
      const voices = synth.getVoices();
      
      // Set voice based on type
      switch(voiceType) {
        case "male":
          // Find first male voice (usually deeper voices)
          const maleVoice = voices.find(voice => voice.name.includes("Male") || voice.name.includes("male"));
          if (maleVoice) utterance.voice = maleVoice;
          break;
        case "female":
          // Find first female voice
          const femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("female"));
          if (femaleVoice) utterance.voice = femaleVoice;
          break;
        default:
          // Use default voice
          break;
      }
      
      synth.speak(utterance);
      setPreviewVoice("");
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUserSettings({
      emailNotifications: values.emailNotifications,
      pushNotifications: values.pushNotifications,
      voiceReminders: values.voiceReminders,
      reminderDays: values.reminderDays,
      voiceType: values.voiceType,
    });
    
    toast({
      title: "Settings updated",
      description: "Your notification settings have been updated.",
    });
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Push Notifications Unavailable",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        form.setValue("pushNotifications", true);
        
        // Send a test notification
        new Notification("DocuNinja Notifications", {
          body: "You have successfully enabled push notifications!",
          icon: "/favicon.ico"
        });
        
        toast({
          title: "Notifications enabled",
          description: "You will now receive push notifications.",
        });
      } else {
        form.setValue("pushNotifications", false);
        
        toast({
          title: "Permission Denied",
          description: "You need to allow notifications in your browser settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "There was an error enabling push notifications.",
        variant: "destructive"
      });
    }
  };

  return (
    <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Notification Settings</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription className="text-xs">
                      Receive notifications via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Push Notifications</FormLabel>
                    <FormDescription className="text-xs">
                      Receive notifications in your browser
                    </FormDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={(checked) => {
                        if (checked && 'Notification' in window && Notification.permission !== 'granted') {
                          requestNotificationPermission();
                        } else {
                          field.onChange(checked);
                        }
                      }} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="voiceReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Voice Reminders</FormLabel>
                    <FormDescription className="text-xs">
                      Receive voice reminders for upcoming deadlines
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("voiceReminders") && (
              <FormField
                control={form.control}
                name="voiceType"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-3">
                    <FormLabel>Voice Type</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setPreviewVoice(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default Voice</SelectItem>
                            <SelectItem value="male">Male Voice</SelectItem>
                            <SelectItem value="female">Female Voice</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {form.watch("voiceType") && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => speakPreview(form.watch("voiceType"))}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                    {previewVoice && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Click preview to hear the {previewVoice} voice.
                      </div>
                    )}
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="reminderDays"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-3">
                  <FormLabel>Reminder Days</FormLabel>
                  <FormDescription className="text-xs">
                    Set how many days before a deadline to receive reminders
                  </FormDescription>
                  <div className="pt-2">
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </div>
                  <div className="text-xs text-end mt-1">
                    {field.value} {field.value === 1 ? 'day' : 'days'} before deadline
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit">Save Notification Settings</Button>
        </form>
      </Form>
    </BlurContainer>
  );
};

export default NotificationSettings;
