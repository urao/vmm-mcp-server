import { flag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { topoIdField } from "./schemas.js";

/** Maps to: vmm-api export [-tid <topo_id>] */
const inputSchema = {
  topoId: topoIdField,
};

export const exportTopologyTool: VmmTool<typeof inputSchema> = {
  name: "vmm_export_topology",
  title: "Export a topology",
  description:
    "Print a topology's userdb as JSON (vmm-api export). Save the returned JSON to " +
    "reproduce the topology later with vmm_import_topology.",
  inputSchema,
  handler: async (args) =>
    runAsToolResult(["export", ...flag("-tid", args.topoId)], "Export produced no output."),
};
