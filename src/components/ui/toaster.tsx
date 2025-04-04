
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
        // Customize toast style based on title or variant
        let customStyle = "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-100 dark:border-indigo-800/30";
        let titleStyle = "text-indigo-700 dark:text-indigo-300 font-medium";
        let progressStyle = "from-indigo-500 to-purple-500";
        
        // Add specific styles for document processing toasts
        if (title?.includes("Processing")) {
          customStyle = "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-100 dark:border-blue-800/30";
          titleStyle = "text-blue-700 dark:text-blue-300 font-medium";
          progressStyle = "from-blue-500 to-cyan-500";
        } else if (title?.includes("processed") || title?.includes("extracted")) {
          customStyle = "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-100 dark:border-green-800/30";
          titleStyle = "text-green-700 dark:text-green-300 font-medium";
          progressStyle = "from-green-500 to-emerald-500";
        } else if (props.variant === "destructive" || title?.includes("failed") || title?.includes("Error")) {
          customStyle = "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border border-red-100 dark:border-red-800/30";
          titleStyle = "text-red-700 dark:text-red-300 font-medium";
          progressStyle = "from-red-500 to-rose-500";
        }
        
        return (
          <Toast key={id} {...props} className={`${customStyle} group overflow-hidden`}>
            <div className="grid gap-1">
              {title && <ToastTitle className={titleStyle}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-slate-600 dark:text-slate-400">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-indigo-500 dark:text-indigo-400 opacity-70 transition-opacity hover:opacity-100" />
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${progressStyle} opacity-80`}></div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
