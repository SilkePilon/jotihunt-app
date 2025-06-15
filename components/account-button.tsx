"use client"

import { useState } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    SignedIn,
    SignedOut,
    useUser,
} from "@clerk/nextjs"
import Image from "next/image"
import { CustomSignIn } from "./custom-sign-in-oauth"
import { ProfileSettingsPopover } from "./profile-settings-popover"

export function AccountButton() {
    const { user } = useUser()
    const [showSignIn, setShowSignIn] = useState(false)

    return (
        <div className="flex items-center flex-shrink-0">
            <SignedOut>
                <Button
                    variant="outline"
                    size="icon"
                    className="transition-transform hover:scale-105 active:scale-95"
                    onClick={() => setShowSignIn(true)}
                >
                    <User className="h-4 w-4" />
                    <span className="sr-only">Sign in</span>
                </Button>
                <CustomSignIn
                    open={showSignIn}
                    onOpenChange={setShowSignIn}
                />
            </SignedOut>
            <SignedIn>
                <ProfileSettingsPopover />
            </SignedIn>
        </div>
    )
}
