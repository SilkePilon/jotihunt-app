"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

export function SimpleAuthHandler() {
    const { user, isSignedIn, isLoaded } = useUser()

    useEffect(() => {
        if (!isLoaded) return

        // Check if this is the first time loading after sign in
        const hasJustSignedIn = localStorage.getItem('clerk-sign-in-pending')

        if (hasJustSignedIn && isSignedIn && user) {
            // Clear the flag
            localStorage.removeItem('clerk-sign-in-pending')

            // Show welcome toast
            toast.success("Welcome!", {
                description: `Successfully signed in as ${user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}`,
            })
        }

        // Check if user just signed out
        const hasJustSignedOut = localStorage.getItem('clerk-sign-out-pending')

        if (hasJustSignedOut && !isSignedIn) {
            // Clear the flag
            localStorage.removeItem('clerk-sign-out-pending')

            // Show sign out toast
            toast.success("Signed out successfully", {
                description: "You have been securely signed out of your account",
            })
        }

    }, [user, isSignedIn, isLoaded])

    return null
}
