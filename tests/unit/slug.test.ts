import { describe, expect, it } from "vitest";
import { slug } from "@/lib/slug";

describe("slug", () => {
  it("lower-cases and joins words with hyphens", () => {
    expect(slug("Data and cloud")).toBe("data-and-cloud");
  });

  it("collapses punctuation runs and trims leading and trailing hyphens", () => {
    expect(slug("  AI & quality! ")).toBe("ai-quality");
    expect(slug("Featured project: radiozk")).toBe("featured-project-radiozk");
  });
});
