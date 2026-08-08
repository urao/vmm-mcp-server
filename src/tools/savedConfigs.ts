import { z } from "zod";
import { flag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";

/**
 * The `configs` subcommand manages a saved-config library (what the VMM
 * editor's "Save config" writes to). Grouped in one file since they're
 * one CLI feature; each is still its own MCP tool for clean, targeted calls.
 */

/** Maps to: vmm-api configs list */
const listInputSchema = {};
export const listSavedConfigsTool: VmmTool<typeof listInputSchema> = {
  name: "vmm_list_saved_configs",
  title: "List saved configs",
  description: "List your saved-config library (vmm-api configs list).",
  inputSchema: listInputSchema,
  handler: async () => runAsToolResult(["configs", "list"], "No saved configs found."),
};

/** Maps to: vmm-api configs get <name> */
const getInputSchema = {
  name: z.string().min(1).describe("Name of the saved config to print."),
};
export const getSavedConfigTool: VmmTool<typeof getInputSchema> = {
  name: "vmm_get_saved_config",
  title: "Get a saved config",
  description: "Print the contents of one saved config (vmm-api configs get).",
  inputSchema: getInputSchema,
  handler: async (args) => runAsToolResult(["configs", "get", args.name]),
};

/** Maps to: vmm-api configs save <name> -f <file> */
const saveInputSchema = {
  name: z.string().min(1).describe("Name to save the config under."),
  file: z.string().min(1).describe("Path to the config file to store (vmm-api -f)."),
};
export const saveConfigTool: VmmTool<typeof saveInputSchema> = {
  name: "vmm_save_config",
  title: "Save a config",
  description: "Store a config file into your saved-config library (vmm-api configs save).",
  inputSchema: saveInputSchema,
  handler: async (args) =>
    runAsToolResult(["configs", "save", args.name, ...flag("-f", args.file)]),
};

/** Maps to: vmm-api configs rm <name> */
const rmInputSchema = {
  name: z.string().min(1).describe("Name of the saved config to delete."),
};
export const removeSavedConfigTool: VmmTool<typeof rmInputSchema> = {
  name: "vmm_remove_saved_config",
  title: "Remove a saved config",
  description: "Delete a config from your saved-config library (vmm-api configs rm).",
  inputSchema: rmInputSchema,
  handler: async (args) => runAsToolResult(["configs", "rm", args.name]),
};
