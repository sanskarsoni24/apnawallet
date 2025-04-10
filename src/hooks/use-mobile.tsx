
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Function to check if a media query matches
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial state
    setMatches(media.matches)
    
    // Define callback for media query change events
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Add event listener
    media.addEventListener("change", listener)
    
    // Cleanup
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// Add an alias export to prevent future imports from breaking
export const useMobile = useIsMobile;
