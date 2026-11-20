import type { Range } from "@/lib/budget";

// The no-break space keeps "RM" with its number; a range can still wrap after its dash on narrow screens.
export const rm = (n: number) => `RM ${n.toLocaleString("en-MY")}`;
export const range = (r: Range) => (r.low === r.high ? rm(r.low) : `${rm(r.low)}–${r.high.toLocaleString("en-MY")}`);
