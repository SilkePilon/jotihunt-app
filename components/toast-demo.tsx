"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ToastDemo() {
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <Button
                variant="outline"
                onClick={() => toast("Basic toast message (bottom-right)")}
            >
                Test Position
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.success("Sign in test!", { description: "This simulates a sign-in success message" })}
            >
                Test Sign-in Toast
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.success("Success!", { description: "Your action was completed successfully." })}
            >
                Success Toast
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.error("Error!", { description: "Something went wrong. Please try again." })}
            >
                Error Toast
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.warning("Warning!", { description: "Please check your input and try again." })}
            >
                Warning Toast
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.info("Info", { description: "Here's some helpful information." })}
            >
                Info Toast
            </Button>

            <Button
                variant="outline"
                onClick={() => toast.loading("Processing...", { description: "Please wait while we process your request." })}
            >
                Loading Toast
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    toast("Action Required", {
                        description: "Do you want to continue with this action?",
                        action: {
                            label: "Confirm",
                            onClick: () => toast.success("Action confirmed!"),
                        },
                    })
                }
            >
                Toast with Action
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                        {
                            loading: "Saving...",
                            success: "Saved successfully!",
                            error: "Failed to save",
                        }
                    )
                }
            >
                Promise Toast
            </Button>
        </div>
    )
}
