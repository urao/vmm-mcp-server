import type { VmmTool } from "./types.js";
import { listTopologiesTool } from "./listTopologies.js";
import { launchTopologyTool } from "./launchTopology.js";
import { uploadConfigTool } from "./uploadConfig.js";
import { configPrintTool } from "./configPrint.js";
import { validateTopologyTool } from "./validateTopology.js";
import { bindVmsTool, startVmsTool, stopVmsTool, unbindVmsTool } from "./vmLifecycle.js";
import { exportTopologyTool } from "./exportTopology.js";
import { importTopologyTool } from "./importTopology.js";
import { cloneTopologyTool } from "./cloneTopology.js";
import { yamlParseTool, yamlRenderTool, yamlConvertTool } from "./yaml.js";
import {
  listSavedConfigsTool,
  getSavedConfigTool,
  saveConfigTool,
  removeSavedConfigTool,
} from "./savedConfigs.js";
import { leaseStatusTool, scheduleUnbindTool, extendLeaseTool } from "./lease.js";

/**
 * Every tool the server exposes. Add the next `vmm-api` subcommand as
 * its own file under src/tools/ and list it here.
 */
export const vmmTools: VmmTool<any>[] = [
  listTopologiesTool,
  launchTopologyTool,
  uploadConfigTool,
  configPrintTool,
  validateTopologyTool,
  bindVmsTool,
  startVmsTool,
  stopVmsTool,
  unbindVmsTool,
  exportTopologyTool,
  importTopologyTool,
  cloneTopologyTool,
  yamlParseTool,
  yamlRenderTool,
  yamlConvertTool,
  listSavedConfigsTool,
  getSavedConfigTool,
  saveConfigTool,
  removeSavedConfigTool,
  leaseStatusTool,
  scheduleUnbindTool,
  extendLeaseTool,
];
