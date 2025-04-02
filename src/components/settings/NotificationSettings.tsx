// Ensure Button is properly imported
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUser } from "@/contexts/UserContext";
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(false),
  voiceReminders: z.boolean().default(false),
  reminderDays: z.number().min(1).max(30).default(3),
  theme: z.string().default("system"),
  voiceType: z.string().default("default"),
})

const NotificationSettings = () => {
  const { toast } = useToast()
  const { userSettings, updateProfile, updateUserSettings } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: userSettings.displayName || "",
      email: userSettings.email || "",
      emailNotifications: userSettings.emailNotifications !== false,
      pushNotifications: userSettings.pushNotifications || false,
      voiceReminders: userSettings.voiceReminders || false,
      reminderDays: userSettings.reminderDays || 3,
      theme: userSettings.theme || "system",
      voiceType: userSettings.voiceType || "default",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile(values.displayName, values.email);
    updateUserSettings({
      emailNotifications: values.emailNotifications,
      pushNotifications: values.pushNotifications,
      voiceReminders: values.voiceReminders,
      reminderDays: values.reminderDays,
      theme: values.theme,
      voiceType: values.voiceType,
    });
    
    toast({
      title: "Settings updated.",
      description: "Your notification settings have been updated.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Display Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  This is the email that will be used to send you notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Notifications</h2>
          <p className="text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications via email.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pushNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Push Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications via push notifications.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voiceReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Voice Reminders</FormLabel>
                  <FormDescription>
                    Receive voice reminders for upcoming deadlines.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reminderDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder Days</FormLabel>
                <FormDescription>
                  Set the number of days before a deadline to receive a reminder.
                </FormDescription>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    max={30}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage>{field.value} days</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the theme for the application.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the voice for voice reminders.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update Settings</Button>
      </form>
    </Form>
  )
}

export default NotificationSettings
