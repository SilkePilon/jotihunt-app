"use client"

import React, { useEffect, useState } from "react"
import { Star, ExternalLink, X } from "lucide-react"
import { motion, Transition, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GitHubStarsButtonProps {
    username: string
    repo: string
    formatted?: boolean
    transition?: Transition
    className?: string
    showDismiss?: boolean
    onDismiss?: () => void
}

export function GitHubStarsButton({
    username,
    repo,
    formatted = false,
    transition = { stiffness: 90, damping: 50 },
    className,
    showDismiss = false,
    onDismiss,
}: GitHubStarsButtonProps) {
    const [stars, setStars] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const fetchStars = async () => {
            try {
                setLoading(true)
                const response = await fetch(`https://api.github.com/repos/${username}/${repo}`)
                const data = await response.json()
                setStars(data.stargazers_count || 0)
            } catch (error) {
                console.error("Failed to fetch GitHub stars:", error)
                setStars(0)
            } finally {
                setLoading(false)
            }
        }

        fetchStars()
    }, [username, repo])

    const formatStars = (count: number) => {
        if (!formatted) return count.toString()

        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    const handleClick = () => {
        window.open(`https://github.com/${username}/${repo}`, "_blank", "noopener,noreferrer")
    }

    const handleDismiss = () => {
        setIsVisible(false)
    }

    const handleAnimationComplete = () => {
        if (!isVisible && onDismiss) {
            onDismiss()
        }
    }

    return (
        <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className={cn("relative", className)}
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={transition}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClick}
                        className={cn(
                            "flex items-center gap-2 h-8 px-3 font-medium",
                            "hover:bg-accent hover:text-accent-foreground",
                            "border border-border bg-background",
                        )}
                        disabled={loading}
                    >
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">Star</span>
                        {stars !== null && (
                            <>
                                <div className="w-px h-4 bg-border" />
                                <span className="text-xs font-mono tabular-nums">
                                    {loading ? "..." : formatStars(stars)}
                                </span>
                            </>
                        )}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                    </Button>

                    {showDismiss && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDismiss}
                            className={cn(
                                "absolute -top-2 -right-2 z-10",
                                "inline-flex items-center justify-center cursor-pointer rounded-md transition-colors",
                                "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0",
                                "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                                "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                                "h-4 w-4 rounded-sm"
                            )}
                        >
                            <X className="h-2.5 w-2.5" />
                            <span className="sr-only">Dismiss</span>
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
