/**
 * Small helpers for turning tool inputs into `vmm-api` argv fragments.
 * Every helper returns a fresh array (possibly empty) that callers
 * spread into their final argv, e.g.:
 *
 *   [...positional, ...flag("-g", groupId), ...repeatedFlag("--require", requires)]
 */

/** `flag("-g", "quincy-eng")` -> `["-g", "quincy-eng"]`; omitted value -> `[]`. */
export function flag(name: string, value: string | number | undefined): string[] {
  return value === undefined ? [] : [name, String(value)];
}

/** `boolFlag("--wait", true)` -> `["--wait"]`; false/undefined -> `[]`. */
export function boolFlag(name: string, value: boolean | undefined): string[] {
  return value ? [name] : [];
}

/**
 * `repeatedFlag("--require", ["cpu=cascade_lake", "power=3"])` ->
 * `["--require", "cpu=cascade_lake", "--require", "power=3"]`.
 */
export function repeatedFlag(name: string, values: string[] | undefined): string[] {
  return (values ?? []).flatMap((v) => [name, v]);
}

/** Matches the CLI's `key=val` shape used by `--require`. */
export const KEY_VAL_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*=.+$/;
