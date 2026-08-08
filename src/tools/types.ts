import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";
import { runVmmApi, VmmApiError } from "../lib/vmmApi.js";

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

/**
 * Run a `vmm-api` argv and turn the outcome into a CallToolResult,
 * normalizing both success and failure the same way every tool needs:
 *  - stdout (falling back to stderr, then a default) on success
 *  - the VmmApiError's message, marked isError, on failure
 *
 * This is what every tool handler should return from, so individual
 * tool files only need to build their argv and pick an empty-output message.
 */
export async function runAsToolResult(
  argv: string[],
  emptyOutputMessage = "Command completed with no output.",
): Promise<CallToolResult> {
  try {
    const { stdout, stderr } = await runVmmApi(argv);
    return textResult(stdout.trim() || stderr.trim() || emptyOutputMessage);
  } catch (err) {
    if (err instanceof VmmApiError) return textResult(err.message, true);
    const command = `vmm-api ${argv.join(" ")}`;
    return textResult(`Unexpected error running ${command}: ${(err as Error).message}`, true);
  }
}
