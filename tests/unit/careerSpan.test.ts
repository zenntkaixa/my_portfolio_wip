import { describe, expect, it } from "vitest";
import { barPosition, parsePeriod } from "@/lib/careerSpan";

describe("parsePeriod", () => {
  it("parses ranges, now and single years", () => {
    expect(parsePeriod("2024 to 2025", 2026)).toEqual({ start: 2024, end: 2025 });
    expect(parsePeriod("2025 to now", 2026)).toEqual({ start: 2025, end: 2026 });
    expect(parsePeriod("2019", 2026)).toEqual({ start: 2019, end: 2019 });
  });
  it("rejects junk and reversed ranges", () => {
    expect(parsePeriod("Career break", 2026)).toBeNull();
    expect(parsePeriod("2025 to 2023", 2026)).toBeNull();
  });
});

describe("barPosition", () => {
  it("scales to the axis", () => {
    expect(barPosition("2017 to 2020", 2017, 2027, 2027)).toEqual({ left: 0, width: 30 });
    expect(barPosition("2025 to now", 2017, 2027, 2027)).toEqual({ left: 80, width: 20 });
  });
  it("gives a single year one year of width and null for junk", () => {
    expect(barPosition("2022", 2017, 2027, 2027)?.width).toBe(10);
    expect(barPosition("x", 2017, 2027, 2027)).toBeNull();
  });
});
