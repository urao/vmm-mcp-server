import { z } from "zod";
import { boolFlag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";

/** Maps to: vmm-api config-print [-p] */
const inputSchema = {
  showLocation: z
    .boolean()
    .optional()
    .describe(
      "Show the backing storage location (pod/db/table/user) instead of the config " +
        "contents (vmm-api -p).",
    ),
};

export const configPrintTool: VmmTool<typeof inputSchema> = {
  name: "vmm_show_active_config",
  title: "Show the active topology config",
  description: "Display the currently active topology config (vmm-api config-print).",
  inputSchema,
  handler: async (args) =>
    runAsToolResult(["config-print", ...boolFlag("-p", args.showLocation)]),
};
