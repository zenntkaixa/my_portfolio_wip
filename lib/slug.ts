/** Lower-case, hyphen-separated id fragment from a label, e.g. "Data and cloud" → "data-and-cloud". */
export function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
