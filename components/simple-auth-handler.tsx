'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export function SimpleAuthHandler() {
  const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!authEnabled) return;
    if (!isLoaded) return; // Check if this is the first time loading after sign in
    const hasJustSignedIn = localStorage.getItem('clerk-sign-in-pending');

    if (hasJustSignedIn && isSignedIn && user) {
      // Clear the flag
      localStorage.removeItem('clerk-sign-in-pending');

      // Small delay to let the UI settle and animations show
      setTimeout(() => {
        // Show welcome toast
        toast.success('Welcome!', {
          description: `Successfully signed in as ${
            user.fullName ||
            user.username ||
            user.emailAddresses?.[0]?.emailAddress
          }`,
          action: {
            label: '✨ Features unlocked',
            onClick: () => {
              toast.info('New features available!', {
                description: 'You can now save and load MCP server presets',
              });
            },
          },
        });
      }, 600); // Wait for animations to complete
    }

    // Check if user just signed out
    const hasJustSignedOut = localStorage.getItem('clerk-sign-out-pending');

    if (hasJustSignedOut && !isSignedIn) {
      // Clear the flag
      localStorage.removeItem('clerk-sign-out-pending');

      // Show sign out toast
      toast.success('Signed out successfully', {
        description: 'You have been securely signed out of your account',
      });
    }
  }, [authEnabled, user, isSignedIn, isLoaded]);

  if (!authEnabled) return null;
  return null;
}
