#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { vmmTools } from "./tools/index.js";

const server = new McpServer({
  name: "vmm-mcp-server",
  version: "0.1.0",
  title: "VMM",
  description: "Create and manage VMM network topologies via the vmm-api CLI.",
});

for (const tool of vmmTools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    tool.handler,
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("vmm-mcp-server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting vmm-mcp-server:", err);
  process.exit(1);
});
