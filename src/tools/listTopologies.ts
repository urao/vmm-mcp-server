import { runAsToolResult, type VmmTool } from "./types.js";

/**
 * Maps to: vmm-api ls
 *
 * Lists the network topologies VMM currently knows about. This is the
 * starting point for topology-building workflows: a client typically
 * calls this first to see what already exists before creating,
 * inspecting, or modifying a topology.
 */
const inputSchema = {};

export const listTopologiesTool: VmmTool<typeof inputSchema> = {
  name: "vmm_list_topologies",
  title: "List VMM topologies",
  description:
    'List all network topologies known to VMM by running "vmm-api ls". ' +
    "Use this to discover existing topology names/IDs before creating, " +
    "inspecting, or modifying one.",
  inputSchema,
  handler: async () => runAsToolResult(["ls"], "No topologies found."),
};
