import { z } from "zod";
import { runAsToolResult, type VmmTool } from "./types.js";

/**
 * The `yaml` subcommand has three actions (parse/render/convert), each
 * taking a single file path. Grouped in one file since they're one
 * CLI feature; each is still its own MCP tool for clean, targeted calls.
 */

function fileInputSchema(description: string) {
  return { file: z.string().min(1).describe(description) };
}

/** Maps to: vmm-api yaml parse <lab.yml> */
export const yamlParseTool: VmmTool<ReturnType<typeof fileInputSchema>> = {
  name: "vmm_yaml_parse",
  title: "Parse a lab YAML file",
  description:
    "Convert a lab YAML (topology-as-code) file into a normalized quickstart spec JSON, " +
    "with warnings on stderr (vmm-api yaml parse). Nothing launches.",
  inputSchema: fileInputSchema("Path to the lab .yml/.yaml file to parse."),
  handler: async (args) => runAsToolResult(["yaml", "parse", args.file]),
};

/** Maps to: vmm-api yaml render <spec.json> */
export const yamlRenderTool: VmmTool<ReturnType<typeof fileInputSchema>> = {
  name: "vmm_yaml_render",
  title: "Render a quickstart spec to lab YAML",
  description: "Convert a quickstart spec JSON file into clean lab YAML (vmm-api yaml render).",
  inputSchema: fileInputSchema("Path to the quickstart spec .json file to render."),
  handler: async (args) => runAsToolResult(["yaml", "render", args.file]),
};

/** Maps to: vmm-api yaml convert <topology.conf> */
export const yamlConvertTool: VmmTool<ReturnType<typeof fileInputSchema>> = {
  name: "vmm_yaml_convert",
  title: "Convert a VMM config to lab YAML",
  description:
    "Convert an existing VMM config file into lab YAML via the server-side parser " +
    "(vmm-api yaml convert). Unparseable pieces are warned about, never dropped silently.",
  inputSchema: fileInputSchema("Path to the existing VMM topology.conf file to convert."),
  handler: async (args) => runAsToolResult(["yaml", "convert", args.file]),
};
