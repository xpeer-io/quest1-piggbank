import { expect } from "vitest";

expect.extend({
  toBeDisabled(received: unknown) {
    // received expected to be a DOM element
    // consider button disabled via "disabled" prop or "aria-disabled"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = received as any;
    const disabled = Boolean(
      el &&
        (el.disabled === true ||
          (typeof el.getAttribute === "function" && el.getAttribute("aria-disabled") === "true") ||
          (typeof el.getAttribute === "function" && el.getAttribute("disabled") !== null))
    );

    return {
      pass: disabled,
      message: () => `expected element ${disabled ? "not " : ""}to be disabled`,
    } as const;
  },
});
