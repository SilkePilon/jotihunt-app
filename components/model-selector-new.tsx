"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

import { Model, ModelType } from "@/app/data/models"

interface ModelSelectorProps {
  types: readonly ModelType[]
  models: Model[]
}

export function ModelSelector({ models, types }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = React.useState<Model>(models[0])
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter models based on search query
  const filteredModels = React.useMemo(() => {
    if (!searchQuery) return models
    return models.filter((model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [models, searchQuery])

  // Group filtered models by type
  const groupedModels = React.useMemo(() => {
    const groups: Record<ModelType, Model[]> = {} as Record<ModelType, Model[]>
    types.forEach(type => {
      groups[type] = filteredModels.filter(model => model.type === type)
    })
    return groups
  }, [filteredModels, types])

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="model">Model</Label>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The model which will generate the completion. Some models are suitable
          for natural language tasks, others specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedModel ? selectedModel.name : "Select a model..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <DropdownMenuSeparator />
          
          {types.map((type) => {
            const typeModels = groupedModels[type]
            if (typeModels.length === 0) return null
            
            return (
              <React.Fragment key={type}>
                <DropdownMenuLabel>{type}</DropdownMenuLabel>
                {typeModels.map((model) => (
                  <HoverCard key={model.id} openDelay={200}>
                    <HoverCardTrigger asChild>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedModel(model)
                          setSearchQuery("") // Clear search after selection
                        }}
                      >
                        <span className="flex-1">{model.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedModel?.id === model.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </DropdownMenuItem>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" className="w-[300px]">
                      <div className="grid gap-2">
                        <h4 className="font-medium leading-none">{model.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {model.description}
                        </div>
                        {model.strengths ? (
                          <div className="mt-4 grid gap-2">
                            <h5 className="text-sm font-medium leading-none">
                              Strengths
                            </h5>
                            <ul className="text-sm text-muted-foreground">
                              {model.strengths}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
                <DropdownMenuSeparator />
              </React.Fragment>
            )
          })}
          
          {filteredModels.length === 0 && (
            <div className="px-2 py-4 text-sm text-muted-foreground">
              No models found.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
