# vmm-mcp-server

An [MCP](https://modelcontextprotocol.io) server for **VMM**, a tool for creating and
managing network topologies. It wraps the `vmm-api` CLI and exposes its subcommands as
MCP tools so any MCP-compatible client (Claude Code, Claude Desktop, etc.) can drive VMM.

## Tools

| Tool | VMM CLI command | Description |
| --- | --- | --- |
| `vmm_list_topologies` | `vmm-api ls` | List all network topologies known to VMM. |
| `vmm_launch_topology` | `vmm-api launch` | Configure, bind, and start a topology in one step. |
| `vmm_upload_config` | `vmm-api config` | Upload a topology config without binding/starting it. |
| `vmm_show_active_config` | `vmm-api config-print` | Display the currently active topology config. |
| `vmm_validate_topology` | `vmm-api validate` | Dry-run capacity check for a config, no deployment. |
| `vmm_bind_vms` | `vmm-api bind` | Launch VMs' QEMU processes, paused. |
| `vmm_start_vms` | `vmm-api start` | Start paused VMs (binds first if needed). |
| `vmm_stop_vms` | `vmm-api stop` | Pause QEMU emulation without deleting the process. |
| `vmm_unbind_vms` | `vmm-api unbind` | Release VMs (hard teardown, no guest shutdown). |
| `vmm_export_topology` | `vmm-api export` | Print a topology's userdb as JSON. |
| `vmm_import_topology` | `vmm-api import` | Recreate a topology from exported JSON. |
| `vmm_clone_topology` | `vmm-api clone` | Copy a topology's config into a new topo_id. |
| `vmm_yaml_parse` | `vmm-api yaml parse` | Lab YAML -> normalized quickstart spec JSON. |
| `vmm_yaml_render` | `vmm-api yaml render` | Quickstart spec JSON -> clean lab YAML. |
| `vmm_yaml_convert` | `vmm-api yaml convert` | Existing VMM config -> lab YAML. |
| `vmm_list_saved_configs` | `vmm-api configs list` | List your saved-config library. |
| `vmm_get_saved_config` | `vmm-api configs get` | Print one saved config. |
| `vmm_save_config` | `vmm-api configs save` | Store a config file into the saved-config library. |
| `vmm_remove_saved_config` | `vmm-api configs rm` | Delete a saved config. |
| `vmm_lease_status` | `vmm-api lease` | Show lease expiry and extensions used/remaining. |
| `vmm_schedule_unbind` | `vmm-api lease schedule` | Move auto-unbind earlier than the lease expiry. |
| `vmm_extend_lease` | `vmm-api extend` | Extend a topology's lease by 30 days. |

More tools (e.g. `auth`) can be added as needed — see [Adding a new tool](#adding-a-new-tool).

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
  index.ts              MCP server entry point (stdio transport, tool registration)
  lib/
    vmmApi.ts            Wrapper around spawning the vmm-api CLI
    args.ts              Helpers for building argv from flags (-x, --require, repeated -r, ...)
  tools/
    types.ts             Shared VmmTool interface + runAsToolResult() helper
    schemas.ts            Shared zod field definitions (groupId, requires, topoId, vmNames)
    listTopologies.ts    vmm_list_topologies      -> vmm-api ls
    launchTopology.ts    vmm_launch_topology      -> vmm-api launch
    uploadConfig.ts       vmm_upload_config        -> vmm-api config
    configPrint.ts         vmm_show_active_config   -> vmm-api config-print
    validateTopology.ts    vmm_validate_topology    -> vmm-api validate
    vmLifecycle.ts         vmm_bind_vms/start_vms/stop_vms/unbind_vms -> bind/start/stop/unbind
    exportTopology.ts      vmm_export_topology      -> vmm-api export
    importTopology.ts      vmm_import_topology      -> vmm-api import
    cloneTopology.ts       vmm_clone_topology       -> vmm-api clone
    yaml.ts                vmm_yaml_parse/render/convert -> vmm-api yaml ...
    savedConfigs.ts        vmm_*_saved_config(s)    -> vmm-api configs ...
    lease.ts               vmm_lease_status/schedule_unbind/extend_lease -> lease/extend
    index.ts               Registry of all tools
```
