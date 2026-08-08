import { z } from "zod";
import { flag, repeatedFlag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { groupIdField, requiresField } from "./schemas.js";

/** Maps to: vmm-api config <file> -g <group_id> [--require key=val]... */
const inputSchema = {
  file: z
    .string()
    .min(1)
    .describe("Path to a VMM topology config file to upload, resolved on the MCP server host."),
  groupId: groupIdField,
  requires: requiresField,
};

export const uploadConfigTool: VmmTool<typeof inputSchema> = {
  name: "vmm_upload_config",
  title: "Upload a topology config",
  description:
    "Upload a topology config without binding/starting it (vmm-api config). " +
    "Returns a topo_id you can pass to vmm_bind_vms / vmm_start_vms afterwards, " +
    "or use vmm_launch_topology to do config+bind+start in one step.",
  inputSchema,
  handler: async (args) =>
    runAsToolResult([
      "config",
      args.file,
      ...flag("-g", args.groupId),
      ...repeatedFlag("--require", args.requires),
    ]),
};
