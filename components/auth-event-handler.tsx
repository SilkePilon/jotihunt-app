"use client"

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { toast } from "sonner"

export function AuthEventHandler() {
    const { isSignedIn, user, isLoaded } = useUser()
    const { isLoaded: authLoaded } = useAuth()
    const [previousSignedInState, setPreviousSignedInState] = useState<boolean | null>(null)
    const [hasShownWelcome, setHasShownWelcome] = useState(false)

    useEffect(() => {
        // Only proceed if both user and auth are loaded
        if (!isLoaded || !authLoaded) return

        // Initialize the state on first load
        if (previousSignedInState === null) {
            setPreviousSignedInState(isSignedIn)

            // If user is already signed in when the app loads, show welcome message
            if (isSignedIn && user && !hasShownWelcome) {
                // Small delay to ensure the app has fully loaded
                setTimeout(() => {
                    toast.success("Welcome back!", {
                        description: `Signed in as ${user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}`,
                    })
                    setHasShownWelcome(true)
                }, 500)
            }
            return
        }

        // User just signed in (transition from signed out to signed in)
        if (!previousSignedInState && isSignedIn && user && !hasShownWelcome) {
            toast.success("Welcome!", {
                description: `Successfully signed in as ${user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}`,
            })
            setHasShownWelcome(true)
        }

        // User just signed out (transition from signed in to signed out)
        if (previousSignedInState && !isSignedIn) {
            toast.success("Signed out successfully", {
                description: "You have been securely signed out of your account",
            })
            setHasShownWelcome(false)
        }

        // Update the previous state
        setPreviousSignedInState(isSignedIn)
    }, [isSignedIn, isLoaded, authLoaded, user, previousSignedInState, hasShownWelcome])

    // This component doesn't render anything
    return null
}
