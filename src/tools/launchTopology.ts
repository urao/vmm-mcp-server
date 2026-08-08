import { z } from "zod";
import { boolFlag, flag, repeatedFlag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { groupIdField, requiresField } from "./schemas.js";

/** Maps to: vmm-api launch -c <file> -g <group_id> [--wait] [--json] ... */
const inputSchema = {
  configFile: z
    .string()
    .min(1)
    .describe(
      "Path to a VMM topology config file, or a .yml/.yaml lab definition " +
        "(YAML topology-as-code). Resolved relative to the MCP server's working directory.",
    ),
  groupId: groupIdField,
  wait: z
    .boolean()
    .optional()
    .describe(
      "After start, block until every VM is reachable (vmm-api --wait). " +
        "On timeout the topology is left in place for debugging.",
    ),
  waitTimeoutSecs: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Max seconds to wait for reachability, default 300 (vmm-api --wait-timeout)."),
  waitIntervalSecs: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Seconds between reachability polls, default 10 (vmm-api --wait-interval)."),
  timeoutSecs: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      "Abort if launch exceeds this many seconds (vmm-api --timeout). The topology is " +
        "left in place for debugging -- use vmm_unbind_vms to clean it up.",
    ),
  json: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Emit machine-readable JSON (topo_id, status, vms, ips) instead of prose (vmm-api --json).",
    ),
  requires: requiresField,
};

export const launchTopologyTool: VmmTool<typeof inputSchema> = {
  name: "vmm_launch_topology",
  title: "Launch a VMM topology",
  description:
    "Configure, bind, and start a network topology in one step (vmm-api launch). " +
    "This is the normal way to stand up a new topology from a config file.",
  inputSchema,
  handler: async (args) =>
    runAsToolResult(
      [
        "launch",
        ...flag("-c", args.configFile),
        ...flag("-g", args.groupId),
        ...boolFlag("--wait", args.wait),
        ...flag("--wait-timeout", args.waitTimeoutSecs),
        ...flag("--wait-interval", args.waitIntervalSecs),
        ...flag("--timeout", args.timeoutSecs),
        ...boolFlag("--json", args.json),
        ...repeatedFlag("--require", args.requires),
      ],
      "Launch completed with no output.",
    ),
};
