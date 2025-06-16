"use client"

import * as React from "react"
import { Share } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/radix/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/animate-ui/base/popover"
import { CopyButton } from "@/components/animate-ui/buttons/copy"
import { CodeTabs } from '@/components/animate-ui/components/code-tabs';
import { Switch } from "@/components/animate-ui/base/switch"
import { Cursor } from '@lobehub/icons';
import { ChevronDown } from "lucide-react"

export function PresetShare() {
  const [hasExistingServers, setHasExistingServers] = React.useState(false)
  const [openSection, setOpenSection] = React.useState<'config' | 'cursor' | null>('config')

  const getConfigContent = (hasWrapper: boolean) => {
    const serverConfig = {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }

    if (hasWrapper) {
      return `"shadcn": ${JSON.stringify(serverConfig, null, 6)}`
    } else {
      return JSON.stringify({
        "mcpServers": { "shadcn": serverConfig }
      }, null, 2)
    }
  }

  const getVSCodeConfigContent = (hasWrapper: boolean) => {
    const serverConfig = {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }

    if (hasWrapper) {
      return `"shadcn": ${JSON.stringify(serverConfig, null, 6)}`
    } else {
      return JSON.stringify({
        "mcp.servers": { "shadcn": serverConfig }
      }, null, 2)
    }
  }

  const CODES = {
    Cursor: hasExistingServers 
      ? `// Add this to your existing mcpServers object in .cursor/mcp.json
${getConfigContent(true)}`
      : `// Copy and paste the code into .cursor/mcp.json
${getConfigContent(false)}`,
    
    Windsurf: hasExistingServers
      ? `// Add this to your existing mcpServers object in .codeium/windsurf/mcp_config.json
${getConfigContent(true)}`
      : `// Copy and paste the code into .codeium/windsurf/mcp_config.json
${getConfigContent(false)}`,
    
    "VS Code": hasExistingServers
      ? `// Add this to your existing mcp.servers object in .vscode/settings.json
${getVSCodeConfigContent(true)}`
      : `// Copy and paste the code into .vscode/settings.json
${getVSCodeConfigContent(false)}`,
    
    "VS Code Insiders": hasExistingServers
      ? `// Add this to your existing mcp.servers object in .vscode-insiders/settings.json
${getVSCodeConfigContent(true)}`
      : `// Copy and paste the code into .vscode-insiders/settings.json
${getVSCodeConfigContent(false)}`,
    
    "Claude Desktop": hasExistingServers
      ? `// Add this to your existing mcpServers object in claude_desktop_config.json
${getConfigContent(true)}`
      : `// Copy and paste the code into claude_desktop_config.json
${getConfigContent(false)}`,
  };
  return (
    <div className="flex-shrink-0">
      <Popover><PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Share className="h-4 w-4" />
            <span className="sr-only">Share your MCP server</span>
          </Button>
        }
      />
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-[520px]"
        >
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Share your MCP server</h3>
            <p className="text-sm text-muted-foreground">
              Anyone who has this link and an UNKNOWN account will be able install and use this MCP server.
            </p>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue="https://mcp.silkepilon.dev/server/7bbKYQvsVkNmVb8NGcdUOLae"
                readOnly
                className="h-9"
              />
            </div>            <CopyButton
              content="https://mcp.silkepilon.dev/server/7bbKYQvsVkNmVb8NGcdUOLae"
              variant="outline"
              size="sm"
              delay={2500}
              className="h-9 w-9 flex-shrink-0"
            /></div>          <p className="text-sm text-muted-foreground pt-4">
            Choose how you want to share your MCP server configuration.
          </p>
          
          <Collapsible 
            className="mt-4" 
            open={openSection === 'config'}
            onOpenChange={(isOpen) => setOpenSection(isOpen ? 'config' : null)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-3 h-auto bg-muted/50 rounded-lg border border-border group mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-500/20">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">Configuration Snippets</h4>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                        Copy & Paste
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ready-to-use configuration files
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent 
              className="space-y-4"
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <p className="text-sm text-muted-foreground">
                Share these configuration snippets with others so they can easily add your MCP server to their editor.
              </p>
              
              <Card className="p-4 bg-muted/50 border-dashed">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="existing-servers-switch" className="text-sm font-medium">
                      I already have other MCP servers installed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Toggle this to show only the server configuration without wrapper objects
                    </p>
                  </div>
                  <Switch
                    id="existing-servers-switch"
                    checked={hasExistingServers}
                    onCheckedChange={setHasExistingServers}
                  />
                </div>
              </Card>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasExistingServers ? 'existing' : 'new'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CodeTabs lang="json" codes={CODES} />
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent></Collapsible>
          
          {/* Cursor IDE Deeplink Section */}
          <Collapsible 
            className="mt-2" 
            open={openSection === 'cursor'}
            onOpenChange={(isOpen) => setOpenSection(isOpen ? 'cursor' : null)}
          ><CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-3 h-auto bg-muted/50 rounded-lg border border-border group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/20">
                    <Cursor size={16} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">Cursor Users</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                        One-Click Install
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Install directly with deeplinks
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent 
              className="space-y-4 pt-4"
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >              <p className="text-sm text-muted-foreground">
                Install this MCP server directly in Cursor with a single click using deeplinks.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const config = {
                      "command": "npx",
                      "args": ["-y", "shadcn@canary", "registry:mcp"],
                      "env": {
                        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
                      }
                    };
                    const encodedConfig = btoa(JSON.stringify(config));
                    const deeplink = `cursor://anysphere.cursor-deeplink/mcp/install?name=shadcn&config=${encodedConfig}`;
                    window.open(deeplink, '_self');
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer"
                >
                  <Cursor size={16} className="w-4 h-4 mr-2" />
                  Add to Cursor
                </Button>

                <CopyButton
                  content={(() => {
                    const config = {
                      "command": "npx",
                      "args": ["-y", "shadcn@canary", "registry:mcp"],
                      "env": {
                        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
                      }
                    };
                    const encodedConfig = btoa(JSON.stringify(config));
                    return `cursor://anysphere.cursor-deeplink/mcp/install?name=shadcn&config=${encodedConfig}`;
                  })()}
                  variant="outline"
                  size="sm"
                  delay={2500}
                  className="h-8 w-8 flex-shrink-0"
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Click &quot;Add to Cursor&quot; to install directly, or copy the deeplink to share with others.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </PopoverContent>
      </Popover>
    </div>
  )
}
