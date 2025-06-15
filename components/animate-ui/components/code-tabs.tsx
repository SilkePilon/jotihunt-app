'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { WrapText } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
  type TabsProps,
} from '@/components/animate-ui/components/tabs';
import { CopyButton, buttonVariants } from '@/components/animate-ui/buttons/copy';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

type CodeTabsProps = {
  codes: Record<string, string>;
  lang?: string;
  themes?: {
    light: string;
    dark: string;
  };
  copyButton?: boolean;
  onCopy?: (content: string) => void;
} & Omit<TabsProps, 'children'>;

function CodeTabs({
  codes,
  lang = 'bash',
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  onCopy,
  ...props
}: CodeTabsProps) {
  const { resolvedTheme } = useTheme();

  const [highlightedCodes, setHighlightedCodes] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string>(
    value ?? defaultValue ?? Object.keys(codes)[0] ?? '',
  );
  const [wordWrap, setWordWrap] = React.useState<boolean>(false);

  // Check if the current code has long lines that would benefit from word wrapping
  const hasLongLines = React.useMemo(() => {
    const currentCode = codes[selectedCode];
    if (!currentCode) return false;
    
    // Check if any line is longer than 80 characters (common threshold)
    const lines = currentCode.split('\n');
    return lines.some(line => line.length > 80);
  }, [codes, selectedCode]);

  React.useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const newHighlightedCodes: Record<string, string> = {};

        for (const [command, val] of Object.entries(codes)) {
          const highlighted = await codeToHtml(val, {
            lang,
            themes: {
              light: themes.light,
              dark: themes.dark,
            },
            defaultColor: resolvedTheme === 'dark' ? 'dark' : 'light',
          });

          newHighlightedCodes[command] = highlighted;
        }

        setHighlightedCodes(newHighlightedCodes);
      } catch (error) {
        console.error('Error highlighting codes', error);
        setHighlightedCodes(codes);
      }
    }
    loadHighlightedCode();
  }, [resolvedTheme, lang, themes.light, themes.dark, codes]);

  return (
    <Tabs
      data-slot="install-tabs"
      className={cn(
        'w-full gap-0 bg-muted/50 rounded-xl border overflow-hidden flex flex-col h-full',
        className,
      )}
      {...props}
      value={selectedCode}
      onValueChange={(val) => {
        setSelectedCode(val);
        onValueChange?.(val);
      }}
    >
      <TabsList
        data-slot="install-tabs-list"
        className="w-full relative justify-between rounded-none h-10 bg-muted border-b border-border/75 dark:border-border/50 text-current py-0 px-4"
        activeClassName="rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full"
      >
        <div className="flex gap-x-3 h-full">
          {highlightedCodes &&
            Object.keys(highlightedCodes).map((code) => (
              <TabsTrigger
                key={code}
                value={code}
                className="text-muted-foreground data-[state=active]:text-current px-0"
              >
                {code}
              </TabsTrigger>
            ))}
        </div>

        {highlightedCodes && (
          <div className="flex items-center gap-1">
            {hasLongLines && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                    onClick={() => setWordWrap(!wordWrap)}
                  >
                    <WrapText className={cn("h-3 w-3", wordWrap && "text-blue-500")} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{wordWrap ? "Disable word wrap" : "Enable word wrap"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {copyButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CopyButton
                    content={codes[selectedCode]}
                    size="sm"
                    variant="ghost"
                    className="bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
                    onCopy={onCopy}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </TabsList>
      <TabsContents data-slot="install-tabs-contents" className="flex-1 min-h-0">
        {highlightedCodes &&
          Object.entries(highlightedCodes).map(([code, val]) => (
            <TabsContent
              data-slot="install-tabs-content"
              key={code}
              className="w-full text-sm flex items-start p-4 overflow-auto h-full max-h-[60vh]"
              value={code}
            >
              <div
                className={cn(
                  "[&>pre,_&_code]:!bg-transparent [&>pre,_&_code]:[background:transparent_!important] [&>pre,_&_code]:border-none [&_code]:!text-[13px] w-full",
                  wordWrap 
                    ? "[&>pre]:whitespace-pre-wrap [&>pre]:break-words" 
                    : "[&>pre]:whitespace-pre"
                )}
                dangerouslySetInnerHTML={{ __html: val }}
              />
            </TabsContent>
          ))}
      </TabsContents>
    </Tabs>
  );
}

export { CodeTabs, type CodeTabsProps };
