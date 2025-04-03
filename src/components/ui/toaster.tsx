
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-100 dark:border-indigo-800/30 group overflow-hidden">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-indigo-700 dark:text-indigo-300 font-medium">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-slate-600 dark:text-slate-400">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-indigo-500 dark:text-indigo-400 opacity-70 transition-opacity hover:opacity-100" />
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80"></div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
