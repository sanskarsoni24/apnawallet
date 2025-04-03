
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
      let voices = synth.getVoices();
      
      // If voices array is empty, wait for them to load
      if (voices.length === 0) {
        // Wait for voices to be loaded
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          setVoiceBasedOnType(utterance, voices, voiceType);
          synth.speak(utterance);
        };
      } else {
        setVoiceBasedOnType(utterance, voices, voiceType);
        synth.speak(utterance);
      }
      
      setPreviewVoice("");
    }
  };
  
  // Helper function to set voice based on type
  const setVoiceBasedOnType = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], voiceType: string) => {
    switch(voiceType) {
      case "male":
        // Find first male voice (usually deeper voices)
        const maleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes("male") || 
          voice.name.includes("David") || 
          voice.name.includes("Mark") || 
          voice.name.includes("Tom")
        );
        if (maleVoice) utterance.voice = maleVoice;
        break;
      case "female":
        // Find first female voice
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes("female") || 
          voice.name.includes("Samantha") || 
          voice.name.includes("Victoria") || 
          voice.name.includes("Karen")
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        break;
      default:
        // Use default voice
        break;
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
    <BlurContainer className="p-6 animate-fade-in bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-xl border border-indigo-100/50 dark:border-indigo-800/30 rounded-xl shadow-lg" style={{ animationDelay: "0.2s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Notification Settings</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-indigo-100/80 dark:border-indigo-800/30 p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium text-indigo-800 dark:text-indigo-300">Email Notifications</FormLabel>
                    <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
                      Receive notifications via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-indigo-100/80 dark:border-indigo-800/30 p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium text-indigo-800 dark:text-indigo-300">Push Notifications</FormLabel>
                    <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
                      Receive notifications in your browser
                    </FormDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={(checked) => {
                          if (checked && 'Notification' in window && Notification.permission !== 'granted') {
                            requestNotificationPermission();
                          } else {
                            field.onChange(checked);
                          }
                        }}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="voiceReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-indigo-100/80 dark:border-indigo-800/30 p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium text-indigo-800 dark:text-indigo-300">Voice Reminders</FormLabel>
                    <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
                      Receive voice reminders for upcoming deadlines
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("voiceReminders") && (
              <FormField
                control={form.control}
                name="voiceType"
                render={({ field }) => (
                  <FormItem className="rounded-lg border border-indigo-100/80 dark:border-indigo-800/30 p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                    <FormLabel className="text-base font-medium text-indigo-800 dark:text-indigo-300">Voice Type</FormLabel>
                    <div className="flex items-center gap-2 mt-2">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setPreviewVoice(value);
                          }}
                        >
                          <SelectTrigger className="w-full border-indigo-200 dark:border-indigo-800/30 focus:ring-indigo-500">
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
                          className="border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800/30 dark:hover:bg-indigo-900/30"
                        >
                          <Volume2 className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                          Preview
                        </Button>
                      )}
                    </div>
                    {previewVoice && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
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
                <FormItem className="rounded-lg border border-indigo-100/80 dark:border-indigo-800/30 p-4 bg-white/50 dark:bg-slate-900/50 shadow-sm">
                  <FormLabel className="text-base font-medium text-indigo-800 dark:text-indigo-300">Reminder Days</FormLabel>
                  <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
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
                        className="[&_[role=slider]]:bg-indigo-600"
                      />
                    </FormControl>
                  </div>
                  <div className="text-xs text-right mt-1 text-indigo-600 dark:text-indigo-400 font-medium">
                    {field.value} {field.value === 1 ? 'day' : 'days'} before deadline
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">Save Notification Settings</Button>
        </form>
      </Form>
    </BlurContainer>
  );
};

export default NotificationSettings;
