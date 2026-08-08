import { z } from "zod";
import { flag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { topoIdField } from "./schemas.js";

/**
 * A bound topology gets a 30-day lease and is auto-unbound when it lapses
 * (up to 3 extensions of 30 days each). These three tools cover that
 * lifecycle; grouped in one file since they're one CLI feature.
 */

/** Maps to: vmm-api lease [-tid <topo_id>] */
const statusInputSchema = { topoId: topoIdField };
export const leaseStatusTool: VmmTool<typeof statusInputSchema> = {
  name: "vmm_lease_status",
  title: "Show lease status",
  description:
    "Show a topology's lease status: expiry date, extensions used, and extensions " +
    "remaining (vmm-api lease).",
  inputSchema: statusInputSchema,
  handler: async (args) => runAsToolResult(["lease", ...flag("-tid", args.topoId)]),
};

/** Maps to: vmm-api lease schedule <when> [-tid <topo_id>] */
const scheduleInputSchema = {
  when: z
    .string()
    .min(1)
    .describe(
      "When to auto-unbind: an ISO datetime, or a relative offset like +30m, +4h, +2d. " +
        "This can only move the unbind EARLIER than the current lease expiry -- use " +
        "vmm_extend_lease to push it later.",
    ),
  topoId: topoIdField,
};
export const scheduleUnbindTool: VmmTool<typeof scheduleInputSchema> = {
  name: "vmm_schedule_unbind",
  title: "Schedule an earlier auto-unbind",
  description:
    "Schedule the topology's auto-unbind earlier than its current lease expiry " +
    "(vmm-api lease schedule). To extend the lease instead, use vmm_extend_lease.",
  inputSchema: scheduleInputSchema,
  handler: async (args) =>
    runAsToolResult(["lease", "schedule", args.when, ...flag("-tid", args.topoId)]),
};

/** Maps to: vmm-api extend [-tid <topo_id>] */
const extendInputSchema = { topoId: topoIdField };
export const extendLeaseTool: VmmTool<typeof extendInputSchema> = {
  name: "vmm_extend_lease",
  title: "Extend a topology's lease",
  description:
    "Extend a topology's lease by 30 days, up to the 3-extension limit (vmm-api extend).",
  inputSchema: extendInputSchema,
  handler: async (args) => runAsToolResult(["extend", ...flag("-tid", args.topoId)]),
};
