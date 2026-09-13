import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | undefined | false | ClassValue[];

function flatten(input: ClassValue, out: string[]): void {
  if (!input && input !== 0) return;
  if (Array.isArray(input)) {
    for (const item of input) flatten(item, out);
    return;
  }
  out.push(String(input));
}

/** Joins conditional class names and resolves Tailwind utility conflicts. */
export function cn(...inputs: ClassValue[]): string {
  const flat: string[] = [];
  for (const input of inputs) flatten(input, flat);
  return twMerge(flat.join(" "));
}
