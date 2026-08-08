import { z } from "zod";
import { flag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { groupIdField } from "./schemas.js";

/** Maps to: vmm-api import <file.json> -g <group_id> [-u <user>] [--ttl <duration>] */
const inputSchema = {
  file: z
    .string()
    .min(1)
    .describe("Path to a topology JSON file previously produced by vmm_export_topology."),
  groupId: groupIdField,
  user: z.string().optional().describe("Owning user for the recreated topology (vmm-api -u)."),
  ttl: z
    .string()
    .optional()
    .describe("Optional lease duration for the recreated topology, e.g. '30d' (vmm-api --ttl)."),
};

export const importTopologyTool: VmmTool<typeof inputSchema> = {
  name: "vmm_import_topology",
  title: "Import a topology",
  description: "Recreate a topology from an exported JSON file (vmm-api import).",
  inputSchema,
  handler: async (args) =>
    runAsToolResult([
      "import",
      args.file,
      ...flag("-g", args.groupId),
      ...flag("-u", args.user),
      ...flag("--ttl", args.ttl),
    ]),
};
