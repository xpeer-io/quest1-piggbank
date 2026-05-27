import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("combines class names into a single string", () => {
    expect(cn("btn", "btn-primary", "rounded")).toBe("btn btn-primary rounded");
  });

  it("ignores falsy values", () => {
    expect(cn("btn", undefined, false, "active")).toBe("btn active");
  });

  it("resolves conflicting tailwind classes with twMerge", () => {
    expect(cn("p-2 p-4 text-center", "p-6")).toBe("p-6 text-center");
  });

  it("returns an empty string when given no classes", () => {
    expect(cn()).toBe("");
  });
});
