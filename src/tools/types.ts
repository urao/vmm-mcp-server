import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";

/**
 * Common shape every VMM tool implements. Keeping tools as small,
 * self-contained modules that export one of these makes it easy to
 * add the next `vmm-api` subcommand (create, delete, connect, ...)
 * without touching the server wiring in src/index.ts.
 */
export interface VmmTool<Shape extends ZodRawShape = ZodRawShape> {
  name: string;
  title: string;
  description: string;
  inputSchema: Shape;
  handler: (args: { [K in keyof Shape]: Shape[K]["_output"] }) => Promise<CallToolResult>;
}

export function textResult(text: string, isError = false): CallToolResult {
  return {
    content: [{ type: "text", text }],
    isError,
  };
}
