import { z } from "zod";
import { flag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { topoIdField } from "./schemas.js";

/** Maps to: vmm-api clone [-g <group_id>] */
const inputSchema = {
  groupId: z
    .string()
    .optional()
    .describe("Quota group for the new copy (vmm-api -g). Defaults to the source's group."),
  topoId: topoIdField,
};

export const cloneTopologyTool: VmmTool<typeof inputSchema> = {
  name: "vmm_clone_topology",
  title: "Clone a topology",
  description:
    "One-shot export+import: copy a topology's config into a NEW topo_id (vmm-api clone). " +
    "Only the config stage is copied -- bind and start the copy yourself afterwards.",
  inputSchema,
  handler: async (args) =>
    runAsToolResult(["clone", ...flag("-g", args.groupId), ...flag("-tid", args.topoId)]),
};
