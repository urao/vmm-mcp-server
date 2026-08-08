import { z } from "zod";
import { flag, repeatedFlag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { groupIdField, requiresField } from "./schemas.js";

/** Maps to: vmm-api validate -c <file> -g <group_id> [--require key=val]... */
const inputSchema = {
  configFile: z
    .string()
    .min(1)
    .describe("Path to the VMM topology config file to validate."),
  groupId: groupIdField,
  requires: requiresField,
};

export const validateTopologyTool: VmmTool<typeof inputSchema> = {
  name: "vmm_validate_topology",
  title: "Validate a topology config",
  description:
    "Dry-run capacity check for a topology config without deploying anything " +
    "(vmm-api validate). Reports VM count, token count, and which pods have capacity. " +
    "Use this before vmm_launch_topology to catch capacity problems early.",
  inputSchema,
  handler: async (args) =>
    runAsToolResult([
      "validate",
      ...flag("-c", args.configFile),
      ...flag("-g", args.groupId),
      ...repeatedFlag("--require", args.requires),
    ]),
};
