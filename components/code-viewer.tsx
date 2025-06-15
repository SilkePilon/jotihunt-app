import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeftRight } from "@/components/animate-ui/icons/chevron-left-right"
import { CodeTabs } from "@/components/animate-ui/components/code-tabs"

interface MCPTool {
  name: string;
  description: string;
  code: string;
}

interface CodeViewerProps {
  tools?: MCPTool[];
  title?: string;
  description?: string;
}

// Default examples for when no tools are provided
const DEFAULT_CODE_EXAMPLES = {
  Weather: `server.tool(
  "get-alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = \`\${NWS_API_BASE}/alerts?area=\${stateCode}\`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve alerts data",
          },
        ],
      };
    }

    const features = alertsData.features || [];
    if (features.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: \`No active alerts for \${stateCode}\`,
          },
        ],
      };
    }

    const formattedAlerts = features.map(formatAlert);
    const alertsText = \`Active alerts for \${stateCode}:\\n\\n\${formattedAlerts.join("\\n")}\`;

    return {
      content: [
        {
          type: "text",
          text: alertsText,
        },
      ],
    };
  },
)`,
  Forecast: `server.tool(
  "get-forecast",
  "Get weather forecast for a location",
  {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitude of the location"),
  },
  async ({ latitude, longitude }) => {
    // Get grid point data
    const pointsUrl = \`\${NWS_API_BASE}/points/\${latitude.toFixed(4)},\${longitude.toFixed(4)}\`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: \`Failed to retrieve grid point data for coordinates: \${latitude}, \${longitude}. This location may not be supported by the NWS API (only US locations are supported).\`,
          },
        ],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to get forecast URL from grid point data",
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve forecast data",
          },
        ],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No forecast periods available",
          },
        ],
      };
    }

    // Format forecast periods
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        \`\${period.name || "Unknown"}:\`,
        \`Temperature: \${period.temperature || "Unknown"}°\${period.temperatureUnit || "F"}\`,
        \`Wind: \${period.windSpeed || "Unknown"} \${period.windDirection || ""}\`,
        \`\${period.shortForecast || "No forecast available"}\`,
        "---",
      ].join("\\n"),
    );

    const forecastText = \`Forecast for \${latitude}, \${longitude}:\\n\\n\${formattedForecast.join("\\n")}\`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  },
)`

}

export function CodeViewer({
  tools,
  title = "MCP Server Tools Reference",
  description = "Explore the code snippets for the tools available in your Model Context Protocol (MCP) server."
}: CodeViewerProps = {}) {
  // Convert tools array to code examples object, or use defaults
  const codeExamples = tools && tools.length > 0
    ? tools.reduce((acc, tool) => {
      acc[tool.name] = tool.code;
      return acc;
    }, {} as Record<string, string>)
    : DEFAULT_CODE_EXAMPLES;

  const defaultValue = Object.keys(codeExamples)[0];

  return (
    <Dialog>      <DialogTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="transition-transform hover:scale-105 active:scale-95"
      >
        <ChevronLeftRight animateOnHover className="h-4 w-4" />
        <span className="sr-only">View MCP Tools</span>
      </Button>
    </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader><div className="grid gap-4 flex-1 min-h-0">
          <CodeTabs
            codes={codeExamples}
            defaultValue={defaultValue}
            lang="typescript"
            className="max-w-full h-full"
          />
          <div className="bg-muted/50 p-3 rounded-lg text-muted-foreground">
            <p className="text-xs">
              <strong>Tip:</strong> These code snippets serve as templates for building your own MCP server tools.
              Modify the parameters, logic, and return values to match your specific use case.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
