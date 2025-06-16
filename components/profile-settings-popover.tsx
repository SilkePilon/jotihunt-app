"use client"

import { User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/animate-ui/base/popover"
import { Separator } from "@/components/ui/separator"
import { useUser, useClerk } from "@clerk/nextjs"
import Image from "next/image"

interface ProfileSettingsPopoverProps {
    trigger?: React.ReactElement
}

export function ProfileSettingsPopover({ trigger }: ProfileSettingsPopoverProps) {
    const { user } = useUser()
    const { signOut, openUserProfile } = useClerk()

    const handleSignOut = () => {
        // Set flag that sign-out is happening
        localStorage.setItem('clerk-sign-out-pending', 'true')
        signOut()
    }

    const handleOpenProfile = () => {
        openUserProfile()
    }

    if (!user) return null

    return (
        <Popover>
            <PopoverTrigger
                render={
                    trigger || (
                        <Button
                            variant="outline"
                            size="icon"
                            className="transition-transform hover:scale-105 active:scale-95 p-0 overflow-hidden"
                        >
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={user.fullName || user.username || "Profile"}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-4 w-4" />
                            )}
                            <span className="sr-only">Profile settings</span>
                        </Button>
                    )
                }
            />
            <PopoverContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-[280px] p-3"
            >
                <div className="space-y-3">
                    {/* User Info Header */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                            {user.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={user.fullName || user.username || "Profile"}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user.fullName || user.username || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.emailAddresses?.[0]?.emailAddress}
                            </p>
                        </div>
                    </div>

                    <Separator />          {/* Menu Items */}
                    <div className="space-y-2">                        <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleOpenProfile}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                    </Button>                        <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                    >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
