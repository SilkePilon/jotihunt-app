"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only show after component has mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("system")
    } else {
      setTheme("dark")
    }
  }

  // Show default dark icon during SSR and before hydration
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative transition-transform hover:scale-105 active:scale-95"
        disabled
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative transition-transform hover:scale-105 active:scale-95"
    >
      {/* Dark mode icon */}
      <Moon className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ease-in-out ${theme === "dark"
        ? "scale-100 rotate-0 opacity-100"
        : "scale-0 rotate-90 opacity-0"
        }`} />

      {/* Light mode icon */}
      <Sun className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ease-in-out ${theme === "light"
        ? "scale-100 rotate-0 opacity-100"
        : "scale-0 -rotate-90 opacity-0"
        }`} />

      {/* System mode icon */}
      <Monitor className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ease-in-out ${theme === "system"
        ? "scale-100 rotate-0 opacity-100"
        : "scale-0 rotate-180 opacity-0"
        }`} />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
