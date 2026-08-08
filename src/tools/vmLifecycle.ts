import { flag, repeatedFlag } from "../lib/args.js";
import { runAsToolResult, type VmmTool } from "./types.js";
import { topoIdField, vmNamesField } from "./schemas.js";

/**
 * bind / start / stop / unbind all share the same shape:
 *   vmm-api <subcommand> [-r vm_name ...] [-tid <topo_id>]
 * so they're generated from one factory instead of four near-duplicate files.
 */
const inputSchema = {
  vmNames: vmNamesField,
  topoId: topoIdField,
};

function makeVmLifecycleTool(opts: {
  subcommand: string;
  name: string;
  title: string;
  description: string;
  emptyOutputMessage: string;
}): VmmTool<typeof inputSchema> {
  return {
    name: opts.name,
    title: opts.title,
    description: opts.description,
    inputSchema,
    handler: async (args) =>
      runAsToolResult(
        [
          opts.subcommand,
          ...repeatedFlag("-r", args.vmNames),
          ...flag("-tid", args.topoId),
        ],
        opts.emptyOutputMessage,
      ),
  };
}

/** Maps to: vmm-api bind [-r vm_name ...] */
export const bindVmsTool = makeVmLifecycleTool({
  subcommand: "bind",
  name: "vmm_bind_vms",
  title: "Bind VMs",
  description:
    "Bind VMs in a topology -- launches their QEMU processes, paused (vmm-api bind). " +
    "Omit vmNames to bind all VMs, or pass specific names for a subset.",
  emptyOutputMessage: "Bind completed with no output.",
});

/** Maps to: vmm-api start [-r vm_name ...] */
export const startVmsTool = makeVmLifecycleTool({
  subcommand: "start",
  name: "vmm_start_vms",
  title: "Start VMs",
  description:
    "Start paused VMs (vmm-api start). Unbound VMs are bound first, then started. " +
    "Omit vmNames to start all VMs, or pass specific names for a subset.",
  emptyOutputMessage: "Start completed with no output.",
});

/** Maps to: vmm-api stop [-r vm_name ...] */
export const stopVmsTool = makeVmLifecycleTool({
  subcommand: "stop",
  name: "vmm_stop_vms",
  title: "Stop VMs",
  description:
    "Pause QEMU emulation for VMs without deleting the QEMU process (vmm-api stop). " +
    "Omit vmNames to stop all VMs, or pass specific names for a subset.",
  emptyOutputMessage: "Stop completed with no output.",
});

/** Maps to: vmm-api unbind [-r vm_name ...] (aliases: destroy, teardown) */
export const unbindVmsTool = makeVmLifecycleTool({
  subcommand: "unbind",
  name: "vmm_unbind_vms",
  title: "Unbind (tear down) VMs",
  description:
    "Release VMs (vmm-api unbind). Does NOT cleanly shut down the guest OS -- this is a " +
    "hard teardown of the QEMU process. Omit vmNames to unbind all VMs in the topology.",
  emptyOutputMessage: "Unbind completed with no output.",
});
