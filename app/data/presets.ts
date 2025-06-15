export interface Preset {
  id: string
  name: string
  description: string
  category: string
  icon?: string
}

export const presets: Preset[] = [
  {
    id: "mcp-filesystem-server",
    name: "Filesystem MCP Server",
    description: "Secure file operations with sandbox restrictions",
    category: "System",
    icon: "📁"
  },
  {
    id: "mcp-github-server", 
    name: "GitHub MCP Server",
    description: "Repository management, issues, and pull requests",
    category: "Development",
    icon: "🐙"
  },
  {
    id: "mcp-postgres-server",
    name: "PostgreSQL MCP Server", 
    description: "Database queries and schema management",
    category: "Database",
    icon: "🐘"
  },
  {
    id: "mcp-web-search-server",
    name: "Web Search MCP Server",
    description: "Real-time web search and content fetching",
    category: "Web",
    icon: "🔍"
  },
  {
    id: "mcp-slack-server",
    name: "Slack MCP Server",
    description: "Channel management and message operations",
    category: "Communication",
    icon: "💬"
  },
  {
    id: "mcp-git-server",
    name: "Git MCP Server",
    description: "Version control operations and branch management",
    category: "Development", 
    icon: "🌳"
  },
  {
    id: "mcp-aws-server",
    name: "AWS MCP Server",
    description: "Cloud resource management and deployments",
    category: "Cloud",
    icon: "☁️"
  },
  {
    id: "mcp-docker-server",
    name: "Docker MCP Server",
    description: "Container management and orchestration",
    category: "DevOps",
    icon: "🐳"
  },
  {
    id: "mcp-calendar-server",
    name: "Calendar MCP Server",
    description: "Event scheduling and calendar integration",
    category: "Productivity",
    icon: "📅"
  },
  {
    id: "mcp-email-server",
    name: "Email MCP Server",
    description: "Email sending and mailbox management",
    category: "Communication",
    icon: "📧"
  }
]
