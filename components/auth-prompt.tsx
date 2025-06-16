"use client"

import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Lock, Save, FolderOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/animate-ui/base/popover"

export function AuthPrompt() {
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded || isSignedIn) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Popover>                <PopoverTrigger
                    render={
                        <Button
                            variant="outline"
                            size="icon"
                            className="transition-transform hover:scale-105 active:scale-95 border-dashed border-2 hover:bg-muted/50"
                        >
                            <Lock className="h-4 w-4" />
                            <span className="sr-only">Locked features</span>
                        </Button>
                    }
                /><PopoverContent
                align="center"
                side="bottom"
                sideOffset={8}
                className="w-[280px] p-3"
            >
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-full bg-primary/10">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-sm">Premium Features</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Sign in to unlock these powerful MCP server management features:
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                                <Save className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium">Save Presets</p>
                                    <p className="text-xs text-muted-foreground">Save your MCP server configurations</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium">Load Presets</p>
                                    <p className="text-xs text-muted-foreground">Quick access to saved configurations</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t">
                            <p className="text-xs text-center text-muted-foreground">
                                Click the account button to sign in →
                            </p>                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </motion.div>
    )
}
