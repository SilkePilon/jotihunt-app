"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ClerkThemeProviderProps {
  children: React.ReactNode
}

export function ClerkThemeProvider({ children }: ClerkThemeProviderProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Default to dark theme on server side since your default is dark
    return (
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        {children}
      </ClerkProvider>
    )
  }

  // Use resolvedTheme which gives the actual theme being used
  const isDark = resolvedTheme === "dark"
  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: isDark ? "#ffffff" : "#000000",
          colorBackground: isDark ? "#020817" : "#ffffff",
          colorText: isDark ? "#f8fafc" : "#020817",
          colorInputBackground: isDark ? "#020817" : "#ffffff",
          colorInputText: isDark ? "#f8fafc" : "#020817",
          colorNeutral: isDark ? "#64748b" : "#64748b",
          borderRadius: "0.5rem",
        },
        elements: {
          card: isDark 
            ? "bg-slate-950 text-slate-50 border border-slate-800" 
            : "bg-white text-slate-950 border border-slate-200",
          headerTitle: isDark ? "text-slate-50" : "text-slate-950",
          headerSubtitle: isDark ? "text-slate-400" : "text-slate-600",
          socialButtonsBlockButton: isDark 
            ? "border border-slate-700 bg-slate-950 text-slate-50 hover:bg-slate-800" 
            : "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50",
          formButtonPrimary: isDark 
            ? "bg-slate-50 text-slate-950 hover:bg-slate-200" 
            : "bg-slate-950 text-slate-50 hover:bg-slate-800",
          formFieldInput: isDark 
            ? "border border-slate-700 bg-slate-950 text-slate-50" 
            : "border border-slate-200 bg-white text-slate-950",
          footerActionLink: isDark 
            ? "text-slate-50 hover:text-slate-200" 
            : "text-slate-950 hover:text-slate-700",
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
