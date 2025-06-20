"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import {
  Zap,
  Globe,
  Download,
  Share2,
  Code,
  Plus,
  X,
  Link,
  Sparkles,
  Server,
  Rocket,
  Clock,
  CheckCircle,
  Edit,
  Key,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  Users,
  Shield,
  Database,
  ChevronRight,
  LogOut,
  CreditCard,
  Bell
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/animate-ui/base/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CopyButton } from "@/components/animate-ui/buttons/copy"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PlaygroundNavbar } from "@/components/playground-navbar"
import { CodeTabs } from "@/components/animate-ui/components/code-tabs"
import { presets } from "./data/presets"

import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/animate-ui/radix/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/radix/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu"

import { useIsMobile } from "@/hooks/use-mobile"

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
  const [apiKeys, setApiKeys] = useState<Array<{ id: string, name: string, key: string, createdAt: Date }>>([])
  const [showApiKeyPopover, setShowApiKeyPopover] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const isMobile = useIsMobile()
  const { user, isSignedIn } = useUser()

  // Sidebar data structure with dynamic user data
  const sidebarData = {
    user: {
      name: isSignedIn && user ? (user.fullName || user.firstName || "User") : "Guest",
      email: isSignedIn && user ? (user.primaryEmailAddress?.emailAddress || "guest@local") : "guest@local",
      avatar: isSignedIn && user ? user.imageUrl : "/api/placeholder/32/32",
    },
    navMain: [
      {
        title: "Generator",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "New Server",
            url: "#",
          },
          {
            title: "Templates",
            url: "#",
          },
          {
            title: "History",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Getting Started",
            url: "#",
          },
          {
            title: "API Reference",
            url: "#",
          },
          {
            title: "Examples",
            url: "#",
          },
          {
            title: "Best Practices",
            url: "#",
          },
        ],
      },
      {
        title: "Testing",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Local Testing",
            url: "#",
          },
          {
            title: "Unit Tests",
            url: "#",
          },
          {
            title: "Integration",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "API Keys",
            url: "#",
          },
          {
            title: "Preferences",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Weather Server",
        url: "#",
        icon: Globe,
      },
      {
        name: "Database Tools",
        url: "#",
        icon: Database,
      },
      {
        name: "Auth Handler",
        url: "#",
        icon: Shield,
      },
    ],
  }

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

  const getIdeConfig = () => {
    return {
      "VS Code": `{
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
}`
    };
  };  // API Key Management Functions
  const generateApiKey = () => {
    const keyId = Math.random().toString(36).substring(2, 15)
    const keyValue = 'mcp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const name = newApiKeyName || `API Key ${apiKeys.length + 1}`

    const newKey = {
      id: keyId,
      name: name,
      key: keyValue,
      createdAt: new Date(),
    }

    setApiKeys(prev => [...prev, newKey])
    setNewApiKeyName("")
  }
  const deleteApiKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId))
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      newSet.delete(keyId)
      return newSet
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const handleRemoveTag = (toolName: string) => {
    const tagRegex = new RegExp(`@${toolName}\\b`, 'g')
    setPromptText(prev => prev.replace(tagRegex, '').replace(/\s+/g, ' ').trim())
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader>
            {/* Logo/Brand */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Server className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">MCP Generator</span>
                    <span className="truncate text-xs">Server Builder</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {sidebarData.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {/* Projects */}
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
              <SidebarMenu>
                {sidebarData.projects.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-sidebar-foreground/70">
                    <Plus className="text-sidebar-foreground/70" />
                    <span>New Project</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>          <SidebarFooter>
            {/* User Menu */}
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={sidebarData.user.avatar} alt={sidebarData.user.name} />
                        <AvatarFallback className="rounded-lg">
                          {isSignedIn && user
                            ? (user.firstName?.[0] || user.fullName?.[0] || "U").toUpperCase()
                            : "G"
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{sidebarData.user.name}</span>
                        <span className="truncate text-xs">{sidebarData.user.email}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={sidebarData.user.avatar} alt={sidebarData.user.name} />
                          <AvatarFallback className="rounded-lg">
                            {isSignedIn && user
                              ? (user.firstName?.[0] || user.fullName?.[0] || "U").toUpperCase()
                              : "G"
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{sidebarData.user.name}</span>
                          <span className="truncate text-xs">{sidebarData.user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isSignedIn ? (
                      <>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Users />
                            Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key />
                            API Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell />
                            Notifications
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard />
                            Billing
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LogOut />
                          Log out
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Users />
                          Sign In
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Sparkles />
                          Sign Up
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>        {/* Main Content */}
        <SidebarInset>
          <TooltipProvider>
            <div className="min-h-screen bg-background">              <div className="hidden min-h-screen flex-col md:flex">
              {/* Navbar with matching card styling */}
              <PlaygroundNavbar presets={presets} />

              {/* Main content with card-based layout matching navbar style */}
              <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
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
                            </div>                        <CardDescription>
                              Describe what your MCP server should do, and we&apos;ll generate it for you.
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
                                    >                                        <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                          <h4 className="text-sm font-medium text-foreground">Generated Tools</h4>
                                        </div>
                                        <span className="text-xs text-muted-foreground">3 tools</span>
                                      </div>

                                      {/* Tool Cards */}
                                      <div className="space-y-3">                                <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="border rounded-lg p-3 bg-background/50 hover:bg-background/80 transition-colors"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">                                              <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-muted-foreground" />
                                          </div>
                                            <div>
                                              <h5 className="text-sm font-medium">get_weather</h5>
                                              <p className="text-xs text-muted-foreground">Get current weather conditions</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">                                              <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2"
                                            onClick={() => handleToolTag('get_weather')}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                            <span className="text-xs text-muted-foreground">Tool</span>
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
                                            <div className="flex items-center space-x-3">                                                <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center">
                                              <Zap className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                              <div>
                                                <h5 className="text-sm font-medium">get_forecast</h5>
                                                <p className="text-xs text-muted-foreground">Get 5-day weather forecast</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-2">                                                <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 px-2"
                                              onClick={() => handleToolTag('get_forecast')}
                                            >
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                              <span className="text-xs text-muted-foreground">Tool</span>
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
                                            <div className="flex items-center space-x-3">                                                <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center">
                                              <Server className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                              <div>
                                                <h5 className="text-sm font-medium">list_locations</h5>
                                                <p className="text-xs text-muted-foreground">Search for weather locations</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-2">                                                <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 px-2"
                                              onClick={() => handleToolTag('list_locations')}
                                            >
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                              <span className="text-xs text-muted-foreground">Tool</span>
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
                                          </div>                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="text-center p-2 bg-muted/20 rounded">
                                              <div className="font-medium text-foreground">95%</div>
                                              <div className="text-muted-foreground">Coverage</div>
                                            </div>
                                            <div className="text-center p-2 bg-muted/20 rounded">
                                              <div className="font-medium text-foreground">12</div>
                                              <div className="text-muted-foreground">Tests</div>
                                            </div>
                                            <div className="text-center p-2 bg-muted/20 rounded">
                                              <div className="font-medium text-foreground">0</div>
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
                    <div className="space-y-6">                  {/* Quick Actions */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Card className="border rounded-2xl shadow-sm">
                          <CardHeader className="pb-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                <Zap className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                                <CardDescription className="text-sm">
                                  Deploy, install, or share your MCP server
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>                      <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group"
                              >                                  <Button
                                variant="outline"
                                className="h-20 w-full flex-col gap-2 hover:bg-muted/50 transition-all duration-200"
                                onClick={() => {/* Install locally functionality */ }}
                              >
                                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                                    <Download className="w-4 h-4" />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-medium">Install</div>
                                    <div className="text-xs text-muted-foreground">Local setup</div>
                                  </div>
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group"
                              >                                  <Button
                                variant="outline"
                                className="h-20 w-full flex-col gap-2 hover:bg-muted/50 transition-all duration-200"
                                onClick={() => {/* Deploy to cloud functionality */ }}
                              >
                                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                                    <Globe className="w-4 h-4" />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-medium">Deploy</div>
                                    <div className="text-xs text-muted-foreground">To cloud</div>
                                  </div>
                                </Button>
                              </motion.div>                          <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group col-span-2"
                              >                                  <Popover open={showApiKeyPopover} onOpenChange={setShowApiKeyPopover}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="h-20 w-full flex-col gap-2 hover:bg-muted/50 transition-all duration-200"
                                    >
                                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                                        <Key className="w-4 h-4" />
                                      </div>
                                      <div className="text-center">
                                        <div className="text-sm font-medium">API Key Management</div>
                                        <div className="text-xs text-muted-foreground">Create and manage keys</div>
                                      </div>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 p-4" align="center">
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none flex items-center gap-2">
                                          <Key className="w-4 h-4" />
                                          API Key Management
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          Create and manage your API keys
                                        </p>
                                      </div>

                                      {/* Create New Key */}
                                      <div className="space-y-3 border-t pt-3">
                                        <div className="space-y-2">
                                          <Label htmlFor="new-api-key-name" className="text-sm">Key Name</Label>
                                          <Input
                                            id="new-api-key-name"
                                            placeholder="Enter key name"
                                            value={newApiKeyName}
                                            onChange={(e) => setNewApiKeyName(e.target.value)}
                                            className="h-8"
                                          />
                                        </div>
                                        <Button onClick={generateApiKey} className="w-full h-8">
                                          <Plus className="w-3 h-3 mr-2" />
                                          Generate Key
                                        </Button>
                                      </div>

                                      {/* API Keys List */}
                                      {apiKeys.length > 0 && (
                                        <div className="space-y-3 border-t pt-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">API Keys ({apiKeys.length})</span>
                                          </div>
                                          <div className="space-y-2 max-h-60 overflow-y-auto">
                                            <AnimatePresence mode="popLayout">
                                              {apiKeys.map((key) => (
                                                <motion.div
                                                  key={key.id}
                                                  initial={{ opacity: 0, y: 10 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  exit={{ opacity: 0, y: -10 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="border rounded-lg p-3 space-y-2 bg-muted/30"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{key.name}</span>
                                                    <div className="flex gap-1">
                                                      <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                      >
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => toggleKeyVisibility(key.id)}
                                                          className="h-6 w-6 p-0"
                                                        >
                                                          {visibleKeys.has(key.id) ? (
                                                            <EyeOff className="w-3 h-3" />
                                                          ) : (
                                                            <Eye className="w-3 h-3" />
                                                          )}
                                                        </Button>
                                                      </motion.div>
                                                      <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                      >
                                                        <CopyButton
                                                          content={key.key}
                                                          variant="outline"
                                                          size="sm"
                                                          className="h-6 w-6 p-0"
                                                        />
                                                      </motion.div>
                                                      <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                      >
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => deleteApiKey(key.id)}
                                                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                        >
                                                          <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                      </motion.div>
                                                    </div>
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    Created {key.createdAt.toLocaleDateString()}
                                                  </div>                                              <div className="font-mono text-xs bg-background rounded p-2 break-all border">
                                                    <AnimatePresence mode="wait">
                                                      {visibleKeys.has(key.id) ? (
                                                        <motion.span
                                                          key="visible"
                                                          initial={{ opacity: 0, scale: 0.9 }}
                                                          animate={{ opacity: 1, scale: 1 }}
                                                          exit={{ opacity: 0, scale: 0.9 }}
                                                          transition={{ duration: 0.2 }}
                                                        >
                                                          {key.key}
                                                        </motion.span>
                                                      ) : (
                                                        <motion.span
                                                          key="hidden"
                                                          initial={{ opacity: 0, scale: 0.9 }}
                                                          animate={{ opacity: 1, scale: 1 }}
                                                          exit={{ opacity: 0, scale: 0.9 }}
                                                          transition={{ duration: 0.2 }}
                                                        >
                                                          {'•'.repeat(key.key.length)}
                                                        </motion.span>
                                                      )}
                                                    </AnimatePresence>
                                                  </div>
                                                </motion.div>
                                              ))}
                                            </AnimatePresence>
                                          </div>
                                        </div>
                                      )}

                                      {apiKeys.length === 0 && (
                                        <div className="text-center py-4 text-muted-foreground border-t">
                                          <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                          <p className="text-sm">No API keys yet</p>
                                          <p className="text-xs">Create your first key above</p>
                                        </div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </motion.div>                          <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group col-span-2"
                              >                                  <Button
                                variant="outline"
                                className="h-20 w-full flex-col gap-2 hover:bg-muted/50 transition-all duration-200"
                                onClick={() => {/* Share with community functionality */ }}
                              >
                                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-medium">Share with Community</div>
                                    <div className="text-xs text-muted-foreground">Publish to marketplace</div>
                                  </div>
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>                  {/* Server Info */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Card className="border rounded-2xl shadow-sm">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                  <Server className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">Server Details</CardTitle>
                                  <CardDescription className="text-sm">
                                    Configuration and runtime information
                                  </CardDescription>
                                </div>
                              </div>
                              <AnimatePresence>
                                {isGenerated && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                  >                                      <Badge variant="secondary" className="text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Ready
                                    </Badge>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              {/* Status Row */}
                              <motion.div
                                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded">
                                    <Sparkles className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Status</span>
                                    <p className="text-xs text-muted-foreground">Current generation state</p>
                                  </div>
                                </div>                                  <Badge
                                  variant={isGenerating ? "default" : isGenerated ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {isGenerating && (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-3 h-3 mr-1"
                                    >
                                      <Clock className="w-3 h-3" />
                                    </motion.div>
                                  )}
                                  {isGenerated && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {isGenerating ? "Generating" : isGenerated ? "Generated" : "Not Generated"}
                                </Badge>
                              </motion.div>

                              <Separator />

                              {/* Runtime Row */}
                              <motion.div
                                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                whileHover={{ scale: 1.01 }}
                              >                                  <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded">
                                    <Code className="w-3 h-3" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Runtime</span>
                                    <p className="text-xs text-muted-foreground">JavaScript execution environment</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs font-mono">
                                  Node.js
                                </Badge>
                              </motion.div>

                              {/* Protocol Row */}
                              <motion.div
                                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                whileHover={{ scale: 1.01 }}
                              >                                  <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded">
                                    <Globe className="w-3 h-3" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Protocol</span>
                                    <p className="text-xs text-muted-foreground">Communication protocol</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs font-mono">
                                  HTTP
                                </Badge>
                              </motion.div>

                              {/* Version Row */}
                              <motion.div
                                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                whileHover={{ scale: 1.01 }}
                              >                                  <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded">
                                    <Zap className="w-3 h-3" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Version</span>
                                    <p className="text-xs text-muted-foreground">MCP protocol version</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs font-mono">
                                  1.0.0
                                </Badge>
                              </motion.div>
                            </div>

                            {/* Additional Info Section */}
                            {isGenerated && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ delay: 0.2 }}
                                className="pt-4 border-t"
                              >                                  <div className="flex items-center gap-2 mb-3">
                                  <span className="text-xs font-medium text-muted-foreground">Performance</span>
                                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="text-center p-2 rounded-lg bg-muted/50">
                                    <div className="text-lg font-semibold">99.9%</div>
                                    <div className="text-xs text-muted-foreground">Uptime</div>
                                  </div>
                                  <div className="text-center p-2 rounded-lg bg-muted/50">
                                    <div className="text-lg font-semibold">&lt;50ms</div>
                                    <div className="text-xs text-muted-foreground">Response</div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>                {/* Local Testing Environment */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <Card className="border rounded-2xl shadow-sm">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                  <Rocket className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">Local Testing</CardTitle>
                                  <CardDescription className="text-sm">
                                    Test and modify your MCP server live
                                  </CardDescription>
                                </div>
                              </div>
                              <AnimatePresence>
                                {serverStarted && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                  >                                      <Badge variant="secondary" className="text-xs">
                                      <div className="w-2 h-2 rounded-full bg-foreground mr-1"></div>
                                      Running
                                    </Badge>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>                        {/* Start/Stop Server Button directly under header */}
                            <div className="mt-4">
                              {serverStarted ? (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group"
                                >
                                  <Button
                                    variant="outline"
                                    onClick={handleTestServer}
                                    className="w-full h-16 justify-start gap-3 hover:bg-muted/50 transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center w-10 h-10 bg-muted/30 rounded-lg group-hover:bg-muted/50 transition-colors">
                                      <X className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium text-foreground">Stop Server</div>
                                      <div className="text-sm text-muted-foreground">Terminate local development instance</div>
                                    </div>
                                  </Button>
                                </motion.div>
                              ) : (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group"
                                >
                                  <Button
                                    variant="outline"
                                    onClick={handleTestServer}
                                    disabled={isTestingServer}
                                    className="w-full h-16 justify-start gap-3 hover:bg-muted/50 transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center w-10 h-10 bg-muted/30 rounded-lg group-hover:bg-muted/50 transition-colors">
                                      <Rocket className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium text-foreground">
                                        {isTestingServer ? "Starting Server..." : "Start Server"}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {isTestingServer ? "Initializing development environment" : "Launch local development server"}
                                      </div>
                                    </div>
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
                                  defaultValue="VS Code"
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
                                  <div className={`w-2 h-2 rounded-full ${serverStarted ? "bg-foreground" : "bg-muted-foreground animate-pulse"}`}></div>
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
                              </div>)}{/* Quick Actions */}
                            <div className="pt-4 border-t">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-md">
                                  <Zap className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Quick Actions</span>
                                <div className={`w-2 h-2 rounded-full ${serverStarted ? "bg-foreground" : "bg-muted-foreground"}`}></div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group"
                                >                                    <Button
                                  variant="outline"
                                  className="h-16 w-full flex-col gap-1 hover:bg-muted/50 transition-all duration-200"
                                  onClick={() => {/* Download functionality */ }}
                                >
                                    <div className="flex items-center justify-center w-6 h-6 bg-muted/20 rounded group-hover:bg-muted/40 transition-colors">
                                      <Download className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs font-medium">Download</div>
                                      <div className="text-xs text-muted-foreground">Get files</div>
                                    </div>
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group"
                                >                                    <Button
                                  variant="outline"
                                  className="h-16 w-full flex-col gap-1 hover:bg-muted/50 transition-all duration-200"
                                  onClick={() => {/* Share functionality */ }}
                                >
                                    <div className="flex items-center justify-center w-6 h-6 bg-muted/20 rounded group-hover:bg-muted/40 transition-colors">
                                      <Share2 className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs font-medium">Share</div>
                                      <div className="text-xs text-muted-foreground">Export config</div>
                                    </div>
                                  </Button>
                                </motion.div>
                              </div>                        </div>
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
                    The MCP Server Generator is optimized for desktop. Mobile support coming soon!
                  </p>
                </motion.div>
              </div>
            </div>
          </TooltipProvider>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
