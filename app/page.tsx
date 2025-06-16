"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Globe, Download, Share2, Code, Plus, X, Link, Sparkles, Server, Rocket, Clock, CheckCircle, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/animate-ui/base/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { PlaygroundNavbar } from "@/components/playground-navbar"
import { CodeTabs } from "@/components/animate-ui/components/code-tabs"
import { presets } from "./data/presets"

export default function MCPServerGeneratorPage() {
  const [urls, setUrls] = useState<string[]>([""])
  const [includeTests, setIncludeTests] = useState(false)
  const [errorHandling, setErrorHandling] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 })
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isTestingServer, setIsTestingServer] = useState(false)
  const [testOutput, setTestOutput] = useState("")
  const [serverStarted, setServerStarted] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showIdeConfig, setShowIdeConfig] = useState(false)
  // Available tools for autocomplete
  const availableTools = [
    { name: 'get_weather', icon: Globe, description: 'Get current weather conditions' },
    { name: 'get_forecast', icon: Zap, description: 'Get 5-day weather forecast' },
    { name: 'list_locations', icon: Server, description: 'List available weather locations' }
  ]

  const autocompleteRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false)
      }
    }

    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAutocomplete])

  const addUrl = () => {
    setUrls([...urls, ""])
  }

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setIsGenerated(false)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 3000)
  }
  const handleToolTag = (toolName: string) => {
    const tag = `@${toolName}`    // Check if tag already exists
    if (promptText.includes(tag)) {
      return // Don&apos;t add duplicate tags
    }
    setPromptText(prev => tag + ' ' + prev)
    // Focus the textarea
    setTimeout(() => {
      const textarea = document.getElementById('prompt') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(tag.length + 1, tag.length + 1)
      }
    }, 100)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setPromptText(value)
    setCursorPosition(cursorPos)

    // Check for @ symbol to show autocomplete
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      // Show autocomplete if @ is at start of word and no space after @
      if (textAfterAt.match(/^\w*$/) && (lastAtIndex === 0 || textBeforeCursor[lastAtIndex - 1].match(/\s/))) {
        const textarea = e.target
        const rect = textarea.getBoundingClientRect()

        // Calculate approximate position of cursor
        const textMetrics = getTextMetrics(textBeforeCursor, textarea)
        setAutocompletePosition({
          top: rect.top + textMetrics.height + 25,
          left: rect.left + textMetrics.width + 10
        })
        setShowAutocomplete(true)
      } else {
        setShowAutocomplete(false)
      }
    } else {
      setShowAutocomplete(false)
    }
  }

  const getTextMetrics = (text: string, textarea: HTMLTextAreaElement) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    const style = window.getComputedStyle(textarea)
    context.font = `${style.fontSize} ${style.fontFamily}`

    const lines = text.split('\n')
    const lastLine = lines[lines.length - 1]
    const width = context.measureText(lastLine).width
    const height = (lines.length - 1) * 24 // approximate line height

    return { width, height }
  }

  const insertToolTag = (toolName: string) => {
    const textBeforeCursor = promptText.slice(0, cursorPosition)
    const textAfterCursor = promptText.slice(cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${toolName} ` + textAfterCursor
      setPromptText(newText)
      setShowAutocomplete(false)

      // Focus and position cursor after the inserted tag
      setTimeout(() => {
        const textarea = document.getElementById('prompt') as HTMLTextAreaElement
        if (textarea) {
          const newCursorPos = lastAtIndex + toolName.length + 2
          textarea.focus()
          textarea.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 10)
    }
  }

  // Generated server code examples for testing
  const getGeneratedCode = () => {
    return {
      "server.ts": `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'weather-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_weather',
        description: 'Get current weather conditions for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'The city name' },
          },
          required: ['city'],
        },
      },
      {
        name: 'get_forecast',
        description: 'Get 5-day weather forecast for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'The city name' },
            days: { type: 'number', description: 'Number of days (1-5)', default: 5 },
          },
          required: ['city'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'get_weather':
      const { city } = request.params.arguments as { city: string };
      return {
        content: [{ type: 'text', text: \`Weather in \${city}: 72°F, sunny\` }],
      };
    case 'get_forecast':
      const { city: forecastCity } = request.params.arguments as { city: string };
      return {
        content: [{ type: 'text', text: \`5-day forecast for \${forecastCity}: Mostly sunny\` }],
      };
    default:
      throw new Error(\`Unknown tool: \${request.params.name}\`);
  }
});

const transport = new StdioServerTransport();
server.connect(transport);`,
      "package.json": `{
  "name": "weather-mcp-server",
  "version": "0.1.0",
  "description": "Weather MCP Server",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx src/server.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.1.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}`,
      "README.md": `# Weather MCP Server

A Model Context Protocol server that provides weather information tools.

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Tools

- **get_weather**: Get current weather conditions
- **get_forecast**: Get 5-day weather forecast

## Testing

\`\`\`bash
echo &apos;{"jsonrpc":"2.0","id":1,"method":"tools/list"}&apos; | npm start
\`\`\`
`
    };
  };
  const handleTestServer = async () => {
    if (!serverStarted) {
      // Start server and generate API key
      setIsTestingServer(true);
      setTestOutput("Starting development server...\n");

      // Generate API key
      const newApiKey = 'mcp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newApiKey);

      setTimeout(() => setTestOutput(prev => prev + "✓ Development server started\n"), 500);
      setTimeout(() => setTestOutput(prev => prev + `✓ API key generated: ${newApiKey}\n`), 1000);
      setTimeout(() => setTestOutput(prev => prev + "✓ Server ready for IDE integration\n"), 1500);
      setTimeout(() => {
        setTestOutput(prev => prev + "✓ Copy the configuration below to your IDE\n");
        setIsTestingServer(false);
        setServerStarted(true);
        setShowIdeConfig(true);
      }, 2000);
    } else {
      // Stop server
      setServerStarted(false);
      setShowIdeConfig(false);
      setTestOutput("Development server stopped.\n");
      setApiKey("");
    }
  };

  const generateApiKey = () => {
    const newApiKey = 'mcp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newApiKey);
  };

  const getIdeConfig = () => {
    return {
      "VS Code (.cursor/mcp.json)": `{
  "mcpServers": {
    "weather-server": {
      "command": "node",
      "args": ["path/to/your/weather-server/dist/server.js"],
      "env": {
        "API_KEY": "${apiKey}",
        "SERVER_URL": "http://localhost:3001"
      }
    }
  }
}`,
      "Claude Desktop": `{
  "mcpServers": {
    "weather-server": {
      "command": "node", 
      "args": ["path/to/your/weather-server/dist/server.js"],
      "env": {
        "API_KEY": "${apiKey}"
      }
    }
  }
}`,
      "Installation": `# 1. Save the server code to a new directory
mkdir weather-server && cd weather-server

# 2. Copy the generated files (server.ts, package.json)
# 3. Install dependencies
npm install

# 4. Build the server
npm run build

# 5. Add the configuration to your IDE
# VS Code: .cursor/mcp.json
# Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json`
    };
  };
  const handleRemoveTag = (toolName: string) => {
    const tagRegex = new RegExp(`@${toolName}\\b`, 'g')
    setPromptText(prev => prev.replace(tagRegex, '').replace(/\s+/g, ' ').trim())
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="hidden min-h-screen flex-col md:flex">
          {/* Navbar with matching card styling */}
          <PlaygroundNavbar presets={presets} />

          {/* Main content with card-based layout matching navbar style */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6">
            <div className="w-full space-y-6">

              {/* Hero Section
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border rounded-2xl shadow-sm p-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">MCP Server Generator</h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  Transform your ideas into powerful MCP servers. Generate from prompts, convert websites,
                  and deploy with beautiful animations and seamless workflows.
                </motion.p>
              </div>
            </motion.div> */}

              {/* Main Generator Section */}
              <div className="grid gap-6 lg:grid-cols-[1fr_400px]">

                {/* Left Column - Generator */}
                <div className="space-y-6">

                  {/* Prompt Input Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="border rounded-2xl shadow-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Create Your MCP Server</CardTitle>
                        </div>
                        <CardDescription>
                          Describe what your MCP server should do, and we'll generate it for you.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">                      <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-sm font-medium">
                          Server Description
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="prompt"
                            value={promptText}
                            onChange={handleTextareaChange}
                            onKeyDown={(e) => {
                              if (showAutocomplete && (e.key === 'Escape')) {
                                setShowAutocomplete(false)
                                e.preventDefault()
                              }
                            }}
                            placeholder="e.g., Create an MCP server that can fetch weather data from OpenWeatherMap API and provide current conditions and forecasts for any city... (Type @ to tag tools)"
                            className="min-h-[120px] resize-none text-base pr-2"
                            spellCheck={true}
                          />                          {/* Autocomplete dropdown */}
                          {showAutocomplete && (
                            <motion.div
                              ref={autocompleteRef}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="fixed bg-card border rounded-2xl shadow-lg p-3 z-50 min-w-[220px]"
                              style={{
                                top: autocompletePosition.top,
                                left: autocompletePosition.left
                              }}
                            >
                              <div className="text-xs text-muted-foreground mb-3 px-1 font-medium">Select a tool:</div>
                              <div className="space-y-1">
                                {availableTools.map((tool) => {
                                  const Icon = tool.icon
                                  return (
                                    <div
                                      key={tool.name}
                                      className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
                                      onClick={() => insertToolTag(tool.name)}
                                    >
                                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-4 h-4 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-foreground">{tool.name}</div>
                                        <div className="text-xs text-muted-foreground">{tool.description}</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}{/* Show badges for existing tags */}
                          {promptText.match(/@(\w+)/g) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground mr-2">Tagged tools:</span>
                              {promptText.match(/@(\w+)/g)?.map((match, index) => {
                                const toolName = match.replace(/@(\w+)/, '$1')
                                const tool = availableTools.find(t => t.name === toolName)
                                const Icon = tool?.icon || Code
                                return (
                                  <motion.div
                                    key={`${toolName}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                  >
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-primary/10 text-primary border-primary/20 flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors group"
                                          onClick={() => handleRemoveTag(toolName)}
                                        >
                                          <Icon className="w-3 h-3" />
                                          {toolName}
                                          <X className="w-2.5 h-2.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-xs">
                                        <div className="space-y-1">
                                          <div className="font-medium flex items-center gap-1">
                                            <Icon className="w-3 h-3" />
                                            {toolName}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {tool?.description || 'Custom tool'}
                                          </div>
                                          <div className="text-xs text-muted-foreground border-t pt-1">
                                            Click to remove from prompt
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                        {/* Website URLs Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>Website Sources (Optional)</span>
                            </Label>
                            <Button variant="outline" size="sm" className="h-8 px-3" onClick={addUrl}>
                              <Plus className="w-3 h-3 mr-1" />
                              Add URL
                            </Button>
                          </div>

                          {/* URL Inputs */}
                          <div className="space-y-3">
                            <AnimatePresence>
                              {urls.map((url, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex items-center space-x-2 group"
                                >
                                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded">
                                    <Link className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <Input
                                    placeholder={index === 0 ? "https://api.example.com/docs" : "https://example.com/integration-guide"}
                                    className="flex-1"
                                    value={url}
                                    onChange={(e) => updateUrl(index, e.target.value)}
                                  />
                                  {urls.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => removeUrl(index)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Add documentation URLs or API references to enhance your MCP server generation.
                          </p>
                        </div>                      {/* Generation Options */}
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Generation Options</Label>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Include Tests</Label>
                                <p className="text-xs text-muted-foreground">Generate unit tests</p>
                              </div>
                              <Switch
                                checked={includeTests}
                                onCheckedChange={setIncludeTests}
                                leftIcon={<X className="w-3 h-3" />}
                                rightIcon={<Code className="w-3 h-3" />}
                              />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Error Handling</Label>
                                <p className="text-xs text-muted-foreground">Robust error management</p>
                              </div>
                              <Switch
                                checked={errorHandling}
                                onCheckedChange={setErrorHandling}
                                leftIcon={<X className="w-3 h-3" />}
                                rightIcon={<Zap className="w-3 h-3" />}
                              />
                            </div>
                          </div>
                        </div>                      {/* Action Buttons Row */}
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                size="lg"
                                className="w-full"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-4 h-4 mr-2"
                                    >
                                      <Clock className="w-4 h-4" />
                                    </motion.div>
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Generate
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="lg" className="px-4">
                              <Code className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="lg" className="px-4">
                              <Download className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Generated Code Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Card className="border rounded-2xl shadow-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                              <Code className="w-4 h-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Generated Server</CardTitle>
                          </div>
                          <AnimatePresence>
                            {!isGenerating && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                              >
                                <Badge variant="secondary" className="text-xs">
                                  Ready to Deploy
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardHeader>                    <CardContent>
                        <div className="rounded-lg border bg-muted/30 p-4 min-h-[200px]">
                          <AnimatePresence mode="wait">
                            {isGenerating ? (
                              <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-2"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Server className="w-8 h-8 text-primary mx-auto" />
                                </motion.div>
                                <p className="text-sm text-muted-foreground">
                                  Generating your MCP server...
                                </p>
                              </motion.div>) : isGenerated ? (
                                <motion.div
                                  key="generated"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="space-y-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <h4 className="text-sm font-medium text-foreground">Generated Tools</h4>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">3 tools</Badge>
                                  </div>

                                  {/* Tool Cards */}
                                  <div className="space-y-3">                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="border rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                          <Globe className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium">get_weather</h5>
                                          <p className="text-xs text-muted-foreground">Get current weather conditions</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 px-2"
                                          onClick={() => handleToolTag('get_weather')}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Badge variant="outline" className="text-xs">Tool</Badge>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                      <span>• city: string</span>
                                      <span>• Returns: object</span>
                                    </div>
                                  </motion.div>                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="border rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors"
                                  >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-green-500" />
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium">get_forecast</h5>
                                            <p className="text-xs text-muted-foreground">Get 5-day weather forecast</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2"
                                            onClick={() => handleToolTag('get_forecast')}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Badge variant="outline" className="text-xs">Tool</Badge>
                                        </div>
                                      </div>
                                      <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                        <span>• city: string</span>
                                        <span>• days: number</span>
                                      </div>
                                    </motion.div>                                <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.3 }}
                                      className="border rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                            <Server className="w-4 h-4 text-purple-500" />
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium">list_locations</h5>
                                            <p className="text-xs text-muted-foreground">Search for weather locations</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2"
                                            onClick={() => handleToolTag('list_locations')}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <Badge variant="outline" className="text-xs">Tool</Badge>
                                        </div>
                                      </div>
                                      <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                        <span>• query: string</span>
                                        <span>• Returns: array</span>
                                      </div>
                                    </motion.div>
                                  </div>

                                  {includeTests && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.4 }}
                                      className="pt-3 border-t"
                                    >
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Code className="w-3 h-3 text-muted-foreground" />
                                        <h5 className="text-xs font-medium text-muted-foreground">Test Coverage</h5>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="text-center p-2 bg-green-500/10 rounded">
                                          <div className="font-medium text-green-600">95%</div>
                                          <div className="text-muted-foreground">Coverage</div>
                                        </div>
                                        <div className="text-center p-2 bg-blue-500/10 rounded">
                                          <div className="font-medium text-blue-600">12</div>
                                          <div className="text-muted-foreground">Tests</div>
                                        </div>
                                        <div className="text-center p-2 bg-purple-500/10 rounded">
                                          <div className="font-medium text-purple-600">0</div>
                                          <div className="text-muted-foreground">Failures</div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}

                                  <div className="pt-2">
                                    <p className="text-xs text-muted-foreground text-center">
                                      Use the <Code className="w-3 h-3 inline mx-1" /> Code Viewer in the navbar to see the implementation
                                    </p>
                                  </div>
                                </motion.div>
                              ) : (
                              <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center h-full"
                              >
                                <div className="text-center space-y-2">
                                  <Server className="w-8 h-8 text-muted-foreground mx-auto" />
                                  <p className="text-sm text-muted-foreground">
                                    Your generated MCP server code will appear here
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Right Column - Actions & Info */}
                <div className="space-y-6">

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="border rounded-2xl shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>
                          Deploy, install, or share your MCP server
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Install Locally
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Globe className="w-4 h-4 mr-2" />
                            Deploy to Cloud
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share with Community
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Server Info */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Card className="border rounded-2xl shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Server Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={isGenerating ? "default" : "outline"} className="text-xs">
                              {isGenerating ? "Generating" : "Not Generated"}
                            </Badge>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Runtime</span>
                            <span>Node.js</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Protocol</span>
                            <span>HTTP</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Version</span>
                            <span>1.0.0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>                {/* Local Testing Environment */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Card className="border rounded-2xl shadow-sm">                    <CardHeader className="pb-4">
                      <div>
                        <CardTitle className="text-lg">Local Testing</CardTitle>
                        <CardDescription>
                          Test and modify your MCP server live
                        </CardDescription>
                      </div>                      {/* Start/Stop Server Button directly under header */}
                      <div className="mt-4">
                        {serverStarted ? (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outline"
                              onClick={handleTestServer}
                              className="w-full justify-start"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Stop Server
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outline"
                              onClick={handleTestServer}
                              disabled={isTestingServer}
                              className="w-full justify-start"
                            >
                              <Rocket className="w-4 h-4 mr-2" />
                              {isTestingServer ? "Starting..." : "Start Server"}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardHeader><CardContent className="space-y-4">
                        {/* IDE Configuration */}
                        {showIdeConfig && serverStarted && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}

                          >
                            <CodeTabs
                              codes={getIdeConfig()}
                              lang="json"
                              copyButton={true}
                              defaultValue="VS Code (.cursor/mcp.json)"
                            />
                          </motion.div>
                        )}

                        {/* Server Output */}
                        {(testOutput || isTestingServer) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-muted/50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${serverStarted ? "bg-green-500" : "bg-blue-500 animate-pulse"}`}></div>
                              <span className="text-xs font-medium text-muted-foreground">
                                {isTestingServer ? "Starting..." : serverStarted ? "Server Running" : "Server Output"}
                              </span>
                            </div>
                            <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                              {testOutput}
                            </pre>
                          </motion.div>
                        )}
                        {/* Empty state when server is not started */}
                        {!serverStarted && !isTestingServer && !testOutput && (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center mb-3">
                              <Rocket className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-medium text-foreground mb-1">Ready to Test</h3>
                            <p className="text-xs text-muted-foreground max-w-xs">
                              Click &quot;Start Server&quot; above to generate IDE configuration and begin testing your tools locally.
                            </p>
                          </div>
                        )}{/* Quick Actions */}
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-medium text-muted-foreground">Quick Actions</span>
                            <div className={`w-2 h-2 rounded-full ${serverStarted ? "bg-green-500" : "bg-blue-500"}`}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="outline"
                                className="h-16 w-full flex-col gap-1 hover:bg-muted/50"
                                onClick={() => {/* Download functionality */ }}
                              >
                                <Download className="w-4 h-4" />
                                <span className="text-xs">Download</span>
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="outline"
                                className="h-16 w-full flex-col gap-1 hover:bg-muted/50"
                                onClick={() => {/* Share functionality */ }}
                              >
                                <Share2 className="w-4 h-4" />
                                <span className="text-xs">Share</span>
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile responsive message */}
        <div className="md:hidden p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-2xl shadow-sm p-8 text-center"
          >
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Mobile Coming Soon</h2>
            <p className="text-muted-foreground">
              The MCP Server Generator is optimized for desktop. Mobile support coming soon!          </p>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
