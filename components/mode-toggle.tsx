"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Only show after component has mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (event: React.MouseEvent) => {
    const newTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark"

    // Check if browser supports View Transitions API
    if (!document.startViewTransition || !buttonRef.current) {
      setTheme(newTheme)
      return
    }

    // Get button position for circular reveal animation
    const rect = buttonRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Calculate radius to cover entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Start view transition with circular reveal
    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    // Wait for pseudo-elements to be ready, then animate
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        { clipPath },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)"
        }
      )
    })
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
  } return (
    <Button
      ref={buttonRef}
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
