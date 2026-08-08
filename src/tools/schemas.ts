import { z } from "zod";
import { KEY_VAL_PATTERN } from "../lib/args.js";

/** Shared field definitions reused across multiple vmm-api tools. */

export const groupIdField = z
  .string()
  .min(1)
  .describe("Quota group for capacity allocation, e.g. 'quincy-eng' (vmm-api -g).");

export const requiresField = z
  .array(z.string().regex(KEY_VAL_PATTERN, "must be key=val, e.g. cpu=cascade_lake"))
  .optional()
  .describe(
    "Restrict pod selection by hardware attribute, repeatable key=val pairs " +
      "(vmm-api --require). Valid keys: location, building, cpu, manufacturer, " +
      "domain, power (1-5, selects that tier or newer).",
  );

export const topoIdField = z
  .string()
  .optional()
  .describe(
    "Topology ID to target (vmm-api -tid). Omit to use the CLI's current/active topology.",
  );

export const vmNamesField = z
  .array(z.string().min(1))
  .optional()
  .describe("Specific VM names to target (vmm-api -r, repeatable). Omit to target all VMs.");
