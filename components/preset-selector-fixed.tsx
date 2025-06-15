"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Search, ExternalLink, Grid3X3, BookOpen, Github } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/animate-ui/base/popover"

import { Preset } from "@/app/data/presets"

interface PresetSelectorProps {
  presets: Preset[]
  className?: string
}

export function PresetSelector({ presets }: PresetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<Preset>()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [visibleCount, setVisibleCount] = React.useState(6)
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  // Filter presets based on search query
  const filteredPresets = React.useMemo(() => {
    if (!searchQuery) return presets
    return presets.filter((preset) =>
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [presets, searchQuery])

  // Get visible presets
  const visiblePresets = filteredPresets.slice(0, visibleCount)
  const hasMore = filteredPresets.length > visibleCount

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset)
    setIsOpen(false)
    setSearchQuery("")
    setVisibleCount(6)
  }

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
          >
            {selectedPreset ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base leading-none">{selectedPreset.icon}</span>
                <span className="truncate">{selectedPreset.name}</span>
              </div>
            ) : (
              <span>Load an MCP server...</span>
            )}
            <ChevronsUpDown className="opacity-50 flex-shrink-0 ml-2" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[600px] p-0"
      >
        <div className="flex flex-col">
          {/* Header with search */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold">Choose an MCP Server</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search MCP servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Cards grid */}
          <div className="p-3 max-h-[400px] overflow-y-auto">
            {visiblePresets.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {visiblePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={cn(
                      "group relative rounded-lg border bg-card p-3 cursor-pointer transition-all duration-200",
                      "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
                      selectedPreset?.id === preset.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:bg-accent/5"
                    )}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {/* Selection indicator */}
                    {selectedPreset?.id === preset.id && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-2 w-2 text-primary-foreground" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-2">
                      {/* Header row */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center text-lg">
                          {preset.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight line-clamp-1">
                            {preset.name}
                          </h4>
                        </div>
                      </div>

                      {/* Category and description */}
                      <div className="space-y-1.5">
                        <div className="inline-flex">
                          <span className="inline-flex items-center rounded-full bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {preset.category}
                          </span>
                        </div>
                        <div className="flex items-end justify-between gap-2">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                            {preset.description}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 flex-shrink-0 bg-background border shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`https://github.com/search?q=${encodeURIComponent(preset.name + " MCP server")}&type=repositories`, '_blank')
                            }}
                          >
                            <Github className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Grid3X3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No MCP servers found.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search terms.
                </p>
              </div>
            )}

            {/* Load more button */}
            {hasMore && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  className="w-full"
                >
                  Load {Math.min(6, filteredPresets.length - visibleCount)} more servers
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://modelcontextprotocol.io/docs', '_blank')}
                className="flex-1 justify-center gap-1.5 h-8 text-xs"
              >
                <BookOpen className="h-3 w-3" />
                Protocol Docs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/examples")}
                className="flex-1 justify-center gap-1.5 h-8 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                Browse Examples
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
