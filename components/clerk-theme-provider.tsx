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
                    // Card styling - using your exact card colors with consistent border radius
                    card: isDark
                        ? "bg-[#353535] text-[#fbfbfb] border border-[rgba(255,255,255,0.1)] rounded-[0.625rem] overflow-hidden"
                        : "bg-white text-[#252525] border border-[#ebebeb] rounded-[0.625rem] overflow-hidden",

                    // Header styling
                    headerTitle: isDark ? "text-[#fbfbfb]" : "text-[#252525]",
                    headerSubtitle: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",

                    // Button styling - matching your button variants with consistent border radius
                    socialButtonsBlockButton: isDark
                        ? "border border-[rgba(255,255,255,0.15)] bg-[#252525] text-[#fbfbfb] hover:bg-[#444444] transition-colors rounded-[0.625rem]"
                        : "border border-[#ebebeb] bg-white text-[#252525] hover:bg-[#f7f7f7] transition-colors rounded-[0.625rem]",

                    formButtonPrimary: isDark
                        ? "bg-[#ebebeb] text-[#353535] hover:bg-[#d4d4d4] transition-colors rounded-[0.625rem]"
                        : "bg-[#353535] text-[#fbfbfb] hover:bg-[#252525] transition-colors rounded-[0.625rem]",

                    // Input styling - matching your input styles with consistent border radius
                    formFieldInput: isDark
                        ? "border border-[rgba(255,255,255,0.15)] bg-[#252525] text-[#fbfbfb] focus:border-[rgba(255,255,255,0.3)] rounded-[0.625rem]"
                        : "border border-[#ebebeb] bg-white text-[#252525] focus:border-[#8e8e8e] rounded-[0.625rem]",

                    // Link styling
                    footerActionLink: isDark
                        ? "text-[#ebebeb] hover:text-[#fbfbfb] transition-colors"
                        : "text-[#353535] hover:text-[#252525] transition-colors",

                    // Modal/popover styling - using your popover colors with consistent border radius
                    modalContent: isDark
                        ? "bg-[#353535] border border-[rgba(255,255,255,0.1)] rounded-[0.625rem] overflow-hidden"
                        : "bg-white border border-[#ebebeb] rounded-[0.625rem] overflow-hidden",

                    // Modal close button
                    modalCloseButton: isDark
                        ? "text-[#b5b5b5] hover:text-[#fbfbfb] transition-colors"
                        : "text-[#8e8e8e] hover:text-[#252525] transition-colors",

                    // Card box to prevent inner border radius conflicts
                    cardBox: isDark
                        ? "bg-[#353535] text-[#fbfbfb]"
                        : "bg-white text-[#252525]",

                    // Avatar styling with consistent border radius
                    avatarBox: isDark
                        ? "bg-[#444444] rounded-[0.625rem]"
                        : "bg-[#f7f7f7] rounded-[0.625rem]",

                    // Form field labels
                    formFieldLabel: isDark ? "text-[#fbfbfb]" : "text-[#252525]",

                    // Form field hints/descriptions
                    formFieldHintText: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",

                    // Error messages
                    formFieldErrorText: isDark ? "text-[#e74c3c]" : "text-[#dc2626]",

                    // Dividers
                    dividerLine: isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-[#ebebeb]",
                    dividerText: isDark ? "text-[#b5b5b5]" : "text-[#8e8e8e]",

                    // Main content area inside modals - remove any conflicting border radius
                    main: "rounded-none",

                    // Footer actions
                    footerAction: isDark
                        ? "text-[#b5b5b5] hover:text-[#fbfbfb]"
                        : "text-[#8e8e8e] hover:text-[#252525]",
                }
            }}
        >
            {children}
        </ClerkProvider>
    )
}
