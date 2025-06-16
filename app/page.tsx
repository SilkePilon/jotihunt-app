"use client"

import { useState } from "react"
import { Metadata } from "next"
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

import { PlaygroundNavbar } from "@/components/playground-navbar"
import { presets } from "./data/presets"

export default function MCPServerGeneratorPage() {
  const [urls, setUrls] = useState<string[]>([""])
  const [includeTests, setIncludeTests] = useState(false)
  const [errorHandling, setErrorHandling] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [promptText, setPromptText] = useState("")

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
    const tag = `[MODIFY:${toolName}] `
    setPromptText(prev => tag + prev)
    // Focus the textarea
    setTimeout(() => {
      const textarea = document.getElementById('prompt') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(tag.length, tag.length)
      }
    }, 100)
  }
  return (
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
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-sm font-medium">
                          Server Description
                        </Label>                        <Textarea
                          id="prompt"
                          value={promptText}
                          onChange={(e) => setPromptText(e.target.value)}
                          placeholder="e.g., Create an MCP server that can fetch weather data from OpenWeatherMap API and provide current conditions and forecasts for any city..."
                          className="min-h-[120px] resize-none text-base"
                        />
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
                            </motion.div>                          ) : isGenerated ? (
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
                </motion.div>

                {/* Recent Servers */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Card className="border rounded-2xl shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Recent Servers</CardTitle>
                      <CardDescription>
                        Your recently created MCP servers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {[
                          { name: "Weather API Server", time: "2 hours ago", status: "online" },
                          { name: "Database Connector", time: "1 day ago", status: "deploying" },
                          { name: "File Manager", time: "3 days ago", status: "online" }
                        ].map((server, index) => (
                          <motion.div
                            key={server.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className={`w-2 h-2 rounded-full ${server.status === "online" ? "bg-green-500" :
                              server.status === "deploying" ? "bg-yellow-500" : "bg-blue-500"
                              }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{server.name}</p>
                              <p className="text-xs text-muted-foreground">{server.time}</p>
                            </div>
                            {server.status === "online" && (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                          </motion.div>
                        ))}
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
            The MCP Server Generator is optimized for desktop. Mobile support coming soon!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
