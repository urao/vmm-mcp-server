# vmm-mcp-server

An [MCP](https://modelcontextprotocol.io) server for **VMM**, a tool for creating and
managing network topologies. It wraps the `vmm-api` CLI and exposes its subcommands as
MCP tools so any MCP-compatible client (Claude Code, Claude Desktop, etc.) can drive VMM.

## Tools

| Tool | VMM CLI command | Description |
| --- | --- | --- |
| `vmm_list_topologies` | `vmm-api ls` | List all network topologies known to VMM. |

More tools (create, delete, connect, inspect, ...) can be added as VMM's CLI grows —
see [Adding a new tool](#adding-a-new-tool).

## Requirements

- Node.js >= 18
- The `vmm-api` CLI installed and available on `PATH` (or point `VMM_API_BIN` at it)

## Install & build

```bash
npm install
npm run build
```

## Configuration

The server reads two optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VMM_API_BIN` | `vmm-api` | Path to the VMM CLI executable. |
| `VMM_API_TIMEOUT_MS` | `30000` | Timeout for each `vmm-api` invocation, in milliseconds. |

## Running

```bash
npm start
```

The server speaks MCP over stdio, so it's meant to be launched by an MCP client rather
than run standalone. For example, in Claude Code's `mcp` config:

```json
{
  "mcpServers": {
    "vmm": {
      "command": "node",
      "args": ["/absolute/path/to/vmm-mcp-server/dist/index.js"],
      "env": {
        "VMM_API_BIN": "/usr/local/bin/vmm-api"
      }
    }
  }
}
```

During development you can run it directly from TypeScript without building first:

```bash
npm run dev
```

## Adding a new tool

Each tool is a small, self-contained module:

1. Create `src/tools/<name>.ts` exporting a `VmmTool` (see `src/tools/types.ts`) that
   calls `runVmmApi([...])` from `src/lib/vmmApi.ts` with the right `vmm-api` args.
2. Register it by adding it to the array in `src/tools/index.ts`.

No changes to `src/index.ts` are needed — it registers whatever tools are listed there.

## Project layout

```
src/
  index.ts            MCP server entry point (stdio transport, tool registration)
  lib/
    vmmApi.ts          Wrapper around spawning the vmm-api CLI
  tools/
    types.ts           Shared VmmTool interface + result helper
    listTopologies.ts   vmm_list_topologies -> `vmm-api ls`
    index.ts            Registry of all tools
```
