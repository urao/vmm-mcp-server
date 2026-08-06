import type { VmmTool } from "./types.js";
import { listTopologiesTool } from "./listTopologies.js";

/**
 * Every tool the server exposes. Add the next `vmm-api` subcommand
 * (e.g. create, delete, connect) as its own file under src/tools/
 * and list it here.
 */
export const vmmTools: VmmTool<any>[] = [listTopologiesTool];
