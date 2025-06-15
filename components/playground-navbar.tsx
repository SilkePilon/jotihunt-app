"use client"

import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { PresetActions } from "@/components/preset-actions"
import { PresetSave } from "@/components/preset-save"
import { PresetSelector } from "@/components/preset-selector"
import { PresetShare } from "@/components/preset-share"
import { CodeViewer } from "@/components/code-viewer"
import { GitHubStarsButton } from "@/components/animate-ui/buttons/github-stars"
import { Preset } from "@/app/data/presets"

interface PlaygroundNavbarProps {
    presets: Preset[]
}

export function PlaygroundNavbar({ presets }: PlaygroundNavbarProps) {
    const [showGitHubStars, setShowGitHubStars] = useState(true)

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
            <div className="bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-7 h-7 bg-primary rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3.5 h-3.5 text-primary-foreground"
                            >
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h1 className="text-base font-semibold">Playground</h1>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">                        {showGitHubStars && (
                        <GitHubStarsButton
                            username="animate-ui"
                            repo="animate-ui"
                            formatted={true}
                            showDismiss={true}
                            onDismiss={() => setShowGitHubStars(false)}
                            className="mr-4"
                        />
                    )}
                        <PresetSelector presets={presets} />
                        <PresetSave />
                        <div className="hidden space-x-1.5 md:flex flex-shrink-0">
                            <CodeViewer />
                            <PresetShare />
                        </div>
                        <PresetActions />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </div>
    )
}
