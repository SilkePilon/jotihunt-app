"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClerk } from "@clerk/nextjs"
import Image from "next/image"

export function AccountButton() {
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button 
            variant="outline" 
            size="icon"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <User className="h-4 w-4" />
            <span className="sr-only">Sign in</span>
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
              <span className="sr-only">Account menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="font-medium">
              {user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="text-red-600 focus:text-red-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  )
}
