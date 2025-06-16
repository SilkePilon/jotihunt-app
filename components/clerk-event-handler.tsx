"use client"

import { useEffect, useState } from "react"
import { useUser, useSession } from "@clerk/nextjs"
import { toast } from "sonner"

export function ClerkEventHandler() {
    const { user, isLoaded: userLoaded } = useUser()
    const { session, isLoaded: sessionLoaded } = useSession()
    const [lastSessionId, setLastSessionId] = useState<string | null>(null)
    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
        if (!userLoaded || !sessionLoaded) return

        const currentSessionId = session?.id || null

        // Initialize on first load
        if (!hasInitialized) {
            setLastSessionId(currentSessionId)
            setHasInitialized(true)

            // If there's already a session when the app loads, show welcome
            if (currentSessionId && user) {
                setTimeout(() => {
                    toast.success("Welcome back!", {
                        description: `You're signed in as ${user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}`,
                    })
                }, 1000) // Delay to ensure page has loaded
            }
            return
        }

        // Session created (user signed in)
        if (!lastSessionId && currentSessionId && user) {
            toast.success("Welcome!", {
                description: `Successfully signed in as ${user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}`,
            })
        }

        // Session destroyed (user signed out)
        if (lastSessionId && !currentSessionId) {
            toast.success("Signed out successfully", {
                description: "You have been securely signed out of your account",
            })
        }

        setLastSessionId(currentSessionId)
    }, [session, user, userLoaded, sessionLoaded, lastSessionId, hasInitialized])

    return null
}
