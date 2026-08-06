import { execFile } from "node:child_process";

/**
 * Thin wrapper around the `vmm-api` CLI.
 *
 * All VMM tools go through `runVmmApi` so that:
 *  - the binary path/timeout can be overridden once via env vars
 *  - args are always passed as an argv array (never through a shell),
 *    which avoids shell-injection issues entirely
 *  - errors are normalized into a single shape tools can rely on
 */

export const VMM_API_BIN = process.env.VMM_API_BIN ?? "vmm-api";
const DEFAULT_TIMEOUT_MS = 30_000;
const TIMEOUT_MS = Number(process.env.VMM_API_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

export interface VmmApiResult {
  command: string;
  stdout: string;
  stderr: string;
}

export class VmmApiError extends Error {
  readonly command: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly code: number | string | null;

  constructor(opts: {
    command: string;
    stdout: string;
    stderr: string;
    code: number | string | null;
    message: string;
  }) {
    super(opts.message);
    this.name = "VmmApiError";
    this.command = opts.command;
    this.stdout = opts.stdout;
    this.stderr = opts.stderr;
    this.code = opts.code;
  }
}

/**
 * Run `vmm-api <args...>` and resolve with its stdout/stderr.
 * Rejects with a VmmApiError on a non-zero exit, a spawn failure
 * (e.g. binary not found), or timeout.
 */
export function runVmmApi(args: string[]): Promise<VmmApiResult> {
  const command = [VMM_API_BIN, ...args].join(" ");

  return new Promise((resolve, reject) => {
    execFile(
      VMM_API_BIN,
      args,
      { timeout: TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const code =
            "code" in error && (typeof error.code === "number" || typeof error.code === "string")
              ? error.code
              : null;

          const notFound = (error as NodeJS.ErrnoException).code === "ENOENT";
          const timedOut = (error as { killed?: boolean; signal?: string }).signal === "SIGTERM";

          let message = `\`${command}\` failed: ${error.message}`;
          if (notFound) {
            message = `Could not find the "${VMM_API_BIN}" executable. Make sure the VMM CLI is installed and on PATH, or set VMM_API_BIN to its full path.`;
          } else if (timedOut) {
            message = `\`${command}\` timed out after ${TIMEOUT_MS}ms.`;
          } else if (stderr?.trim()) {
            message = `\`${command}\` failed: ${stderr.trim()}`;
          }

          reject(
            new VmmApiError({
              command,
              stdout: stdout ?? "",
              stderr: stderr ?? "",
              code,
              message,
            }),
          );
          return;
        }

        resolve({ command, stdout: stdout ?? "", stderr: stderr ?? "" });
      },
    );
  });
}
