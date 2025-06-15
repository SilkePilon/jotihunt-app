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
        } catch (err: any) {
            setError(err.errors?.[0]?.message || `${provider === "oauth_github" ? "GitHub" : "Google"} sign-in failed`)
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Eye, EyeOff, Github } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomSignInProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CustomSignIn({ open, onOpenChange }: CustomSignInProps) {
    const { signIn, setActive } = useSignIn()
    const { signUp, setActive: setActiveSignUp } = useSignUp()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Form states
    const [signInData, setSignInData] = useState({
        emailAddress: "",
        password: "",
    })

    const [signUpData, setSignUpData] = useState({
        emailAddress: "",
        password: "",
        firstName: "",
        lastName: "",
    })
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn?.create({
                identifier: signInData.emailAddress,
                password: signInData.password,
            })

            if (result?.status === "complete") {
                await setActive?.({ session: result.createdSessionId })
                onOpenChange(false)
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signUp?.create({
                emailAddress: signUpData.emailAddress,
                password: signUpData.password,
                firstName: signUpData.firstName,
                lastName: signUpData.lastName,
            })

            if (result?.status === "complete") {
                await setActiveSignUp?.({ session: result.createdSessionId })
                onOpenChange(false)
            } else {
                // Handle email verification if needed
                setError("Please check your email for verification")
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGitHubSignIn = async () => {
        try {
            await signIn?.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/",
                redirectUrlComplete: "/",
            })
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "GitHub sign-in failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Welcome back</DialogTitle>
                    <DialogDescription>
                        Sign in to your account or create a new one to get started.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <TabsContent value="signin" className="space-y-4">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input
                                    id="signin-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={signInData.emailAddress}
                                    onChange={(e) =>
                                        setSignInData({ ...signInData, emailAddress: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="signin-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={signInData.password}
                                        onChange={(e) =>
                                            setSignInData({ ...signInData, password: e.target.value })
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={handleGitHubSignIn}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-firstname">First name</Label>
                                    <Input
                                        id="signup-firstname"
                                        type="text"
                                        placeholder="John"
                                        value={signUpData.firstName}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, firstName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-lastname">Last name</Label>
                                    <Input
                                        id="signup-lastname"
                                        type="text"
                                        placeholder="Doe"
                                        value={signUpData.lastName}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, lastName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={signUpData.emailAddress}
                                    onChange={(e) =>
                                        setSignUpData({ ...signUpData, emailAddress: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={signUpData.password}
                                        onChange={(e) =>
                                            setSignUpData({ ...signUpData, password: e.target.value })
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={handleGitHubSignIn}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
