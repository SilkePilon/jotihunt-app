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
    <ClerkProvider      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          // Primary colors - using exact values from your design system
          colorPrimary: isDark ? "#ebebeb" : "#353535", // primary
          colorText: isDark ? "#fbfbfb" : "#252525", // foreground  
          colorTextSecondary: isDark ? "#b5b5b5" : "#8e8e8e", // muted-foreground
          colorTextOnPrimaryBackground: isDark ? "#353535" : "#fbfbfb", // primary-foreground
          
          // Background colors
          colorBackground: isDark ? "#252525" : "#ffffff", // background
          colorInputBackground: isDark ? "#444444" : "#f7f7f7", // muted/input
          colorInputText: isDark ? "#fbfbfb" : "#252525", // foreground
          
          // State colors
          colorDanger: isDark ? "#e74c3c" : "#dc2626", // destructive
          colorSuccess: "#22c55e", // success green
          colorWarning: "#f59e0b", // warning amber
          colorNeutral: isDark ? "#b5b5b5" : "#8e8e8e", // muted-foreground
          
          // UI properties
          borderRadius: "0.625rem", // matches your --radius exactly
          fontFamily: "var(--font-geist-sans)",
          fontSize: "0.875rem",
        },
        elements: {
          // Card styling - using your exact card colors
          card: isDark 
            ? "bg-[#353535] text-[#fbfbfb] border border-[rgba(255,255,255,0.1)]" 
            : "bg-white text-[#252525] border border-[#ebebeb]",
          
          // Header styling
          headerTitle: isDark ? "text-[#fbfbfb]" : "text-[#252525]",
          headerSubtitle: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",
          
          // Button styling - matching your button variants
          socialButtonsBlockButton: isDark 
            ? "border border-[rgba(255,255,255,0.15)] bg-[#252525] text-[#fbfbfb] hover:bg-[#444444] transition-colors" 
            : "border border-[#ebebeb] bg-white text-[#252525] hover:bg-[#f7f7f7] transition-colors",
          
          formButtonPrimary: isDark 
            ? "bg-[#ebebeb] text-[#353535] hover:bg-[#d4d4d4] transition-colors" 
            : "bg-[#353535] text-[#fbfbfb] hover:bg-[#252525] transition-colors",
          
          // Input styling - matching your input styles
          formFieldInput: isDark 
            ? "border border-[rgba(255,255,255,0.15)] bg-[#252525] text-[#fbfbfb] focus:border-[rgba(255,255,255,0.3)]" 
            : "border border-[#ebebeb] bg-white text-[#252525] focus:border-[#8e8e8e]",
          
          // Link styling
          footerActionLink: isDark 
            ? "text-[#ebebeb] hover:text-[#fbfbfb] transition-colors" 
            : "text-[#353535] hover:text-[#252525] transition-colors",
          
          // Modal/popover styling - using your popover colors
          modalContent: isDark 
            ? "bg-[#353535] border border-[rgba(255,255,255,0.1)]" 
            : "bg-white border border-[#ebebeb]",
          
          // Avatar styling
          avatarBox: isDark 
            ? "bg-[#444444]" 
            : "bg-[#f7f7f7]",
            
          // Form field labels
          formFieldLabel: isDark ? "text-[#fbfbfb]" : "text-[#252525]",
          
          // Form field hints/descriptions
          formFieldHintText: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",
          
          // Error messages
          formFieldErrorText: isDark ? "text-[#e74c3c]" : "text-[#dc2626]",
          
          // Dividers
          dividerLine: isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-[#ebebeb]",
          dividerText: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
