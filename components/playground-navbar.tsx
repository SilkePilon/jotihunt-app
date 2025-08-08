'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { PresetSave } from '@/components/preset-save';
import { PresetSelector } from '@/components/preset-selector';
import { PresetShare } from '@/components/preset-share';
import { CodeViewer } from '@/components/code-viewer';
import { GitHubStarsButton } from '@/components/animate-ui/buttons/github-stars';
import { AccountButton } from '@/components/account-button';
import { AuthPrompt } from '@/components/auth-prompt';
import { SidebarTrigger } from '@/components/animate-ui/radix/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Preset } from '@/app/data/presets';

interface PlaygroundNavbarProps {
  presets: Preset[];
}

export function PlaygroundNavbar({ presets }: PlaygroundNavbarProps) {
  const [showGitHubStars, setShowGitHubStars] = useState(true);
  const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <TooltipProvider>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-card border rounded-2xl shadow-sm">
          {' '}
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center space-x-2">
              <SidebarTrigger className="h-7 w-7" />
              <Separator
                orientation="vertical"
                className="h-4"
              />
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
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              {' '}
              {showGitHubStars && (
                <GitHubStarsButton
                  username="SilkePilon"
                  repo="mcp.silkepilon.dev"
                  formatted={true}
                  showDismiss={true}
                  onDismiss={() => setShowGitHubStars(false)}
                  className="mr-4"
                />
              )}
              {authEnabled && <NavbarAuthArea presets={presets} />}
              <div className="hidden space-x-1.5 md:flex flex-shrink-0">
                <CodeViewer />
                <PresetShare />
              </div>
              <ModeToggle />
              {authEnabled && (
                <>
                  <div className="flex items-center px-3">
                    <div className="w-1 h-1 bg-border rounded-full"></div>
                  </div>
                  <AccountButton />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function NavbarAuthArea({ presets }: { presets: Preset[] }) {
  const { isSignedIn, isLoaded } = useUser();
  return (
    <AnimatePresence mode="wait">
      {isLoaded && isSignedIn && (
        <motion.div
          key="auth-components"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 }}
          className="flex items-center space-x-1.5"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PresetSelector presets={presets} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PresetSave />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => {}}
                >
                  <Key className="h-4 w-4 mr-2" />
                  API
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>API Settings & Keys</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </motion.div>
      )}
      {isLoaded && !isSignedIn && (
        <motion.div
          key="auth-prompt"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <AuthPrompt />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
