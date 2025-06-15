"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Github } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomSignInProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CustomSignIn({ open, onOpenChange }: CustomSignInProps) {
    const { signIn } = useSignIn()
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [error, setError] = useState("")

    const handleOAuthSignIn = async (provider: "oauth_github" | "oauth_google") => {
        setIsLoading(provider)
        setError("")

        try {
            await signIn?.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/",
                redirectUrlComplete: "/",
            })
        } catch (err: unknown) {
            const errorMessage = err && typeof err === 'object' && 'errors' in err && Array.isArray(err.errors) && err.errors[0] && typeof err.errors[0] === 'object' && 'message' in err.errors[0]
                ? err.errors[0].message as string
                : `${provider === "oauth_github" ? "GitHub" : "Google"} sign-in failed`
            setError(errorMessage)
            setIsLoading(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Welcome to Playground</DialogTitle>
                    <DialogDescription>
                        Sign in with your preferred account to get started.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full h-11"
                            onClick={() => handleOAuthSignIn("oauth_github")}
                            disabled={isLoading !== null}
                        >
                            {isLoading === "oauth_github" ? (
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Connecting to GitHub...
                                </div>
                            ) : (
                                <>
                                    <Github className="mr-2 h-5 w-5" />
                                    Continue with GitHub
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full h-11"
                            onClick={() => handleOAuthSignIn("oauth_google")}
                            disabled={isLoading !== null}
                        >
                            {isLoading === "oauth_google" ? (
                                <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Connecting to Google...
                                </div>
                            ) : (
                                <>
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <button className="underline hover:text-foreground">
                                Terms of Service
                            </button>{" "}
                            and{" "}
                            <button className="underline hover:text-foreground">
                                Privacy Policy
                            </button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
