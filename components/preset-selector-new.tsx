"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Search, ExternalLink, Grid3X3 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        className="w-[700px] p-0"
      >
        <div className="flex flex-col">
          {/* Header with search */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <Grid3X3 className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Choose an MCP Server</h3>
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
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {visiblePresets.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {visiblePresets.map((preset) => (
                  <Card
                    key={preset.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm",
                      selectedPreset?.id === preset.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl leading-none">{preset.icon}</span>
                          <div>
                            <CardTitle className="text-sm font-medium line-clamp-1">
                              {preset.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {preset.category}
                            </Badge>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            selectedPreset?.id === preset.id
                              ? "opacity-100 text-primary"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs line-clamp-2">
                        {preset.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
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
          <div className="p-4 border-t bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/examples")}
              className="w-full justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Browse more examples
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
