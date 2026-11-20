// Maps "@/x" to the repo's x.ts so lib/ files load under plain node (type stripping), as tsconfig paths do.
const ROOT = new URL("../../", import.meta.url).href;
export async function resolve(spec, ctx, next) {
  if (spec.startsWith("@/")) return next(ROOT + spec.slice(2) + ".ts", ctx);
  return next(spec, ctx);
}
