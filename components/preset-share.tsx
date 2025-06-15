"use client"

import * as React from "react"
import { Share } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/animate-ui/base/popover"
import { CopyButton } from "@/components/animate-ui/buttons/copy"
import { CodeTabs } from '@/components/animate-ui/components/code-tabs';
import { Cursor } from '@lobehub/icons';

export function PresetShare() {
  const CODES = {
    Cursor: `// Copy and paste the code into .cursor/mcp.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
    Windsurf: `// Copy and paste the code into .codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
    "VS Code": `// Copy and paste the code into .vscode/settings.json
{
  "mcp.servers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
    "VS Code Insiders": `// Copy and paste the code into .vscode-insiders/settings.json
{
  "mcp.servers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
    "Claude Desktop": `// Copy and paste the code into claude_desktop_config.json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "https://animate-ui.com/r/registry.json"
      }
    }
  }
}`,
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
            /></div>
          <p className="text-sm text-muted-foreground pt-4">
            Share these configuration snippets with others so they can easily add your MCP server to their editor.
          </p>
          <div className="pt-4">
            <CodeTabs lang="json" codes={CODES} />
          </div>
          {/* Cursor IDE Deeplink Section */}
          <div className="pt-6 border-t">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">Cursor Users</h4>
                <span className="text-xs bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 px-2 py-1 rounded-full">
                  One-Click Install
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
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
              </div>              <p className="text-xs text-muted-foreground">
                Click &quot;Add to Cursor&quot; to install directly, or copy the deeplink to share with others.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
