"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface SwitchProps extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    thumbIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    leftIcon?: React.ReactNode
}

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, thumbIcon, rightIcon, leftIcon, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input relative",
            className
        )}
        {...props}
        ref={ref}
    >
        {leftIcon && (
            <motion.div
                className="absolute left-1 z-10 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: props.checked ? 0 : 1,
                    scale: props.checked ? 0.8 : 1,
                    x: props.checked ? 2 : 0
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                <div className="w-4 h-4 text-muted-foreground">
                    {leftIcon}
                </div>
            </motion.div>
        )}

        {rightIcon && (
            <motion.div
                className="absolute right-1 z-10 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: props.checked ? 1 : 0,
                    scale: props.checked ? 1 : 0.8,
                    x: props.checked ? 0 : -2
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                <div className="w-4 h-4 text-primary-foreground">
                    {rightIcon}
                </div>
            </motion.div>
        )}    <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 flex items-center justify-center"
            )}
            asChild
        >
            <motion.div
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
            >
                {thumbIcon && (
                    <motion.div
                        className="w-3 h-3 text-muted-foreground"
                        animate={{
                            rotate: props.checked ? 180 : 0,
                            scale: thumbIcon ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {thumbIcon}
                    </motion.div>
                )}
            </motion.div>
        </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
