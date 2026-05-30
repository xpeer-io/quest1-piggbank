import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateRangeFilter } from "./DateRangeFilter";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("DateRangeFilter", () => {
  it("chama router.push ao alterar data", () => {
    const { container } = render(
      <DateRangeFilter
        from={new Date("2026-01-01")}
        to={new Date("2026-01-31")}
      />
    );

    const inputs =
      container.querySelectorAll('input[type="date"]');

    fireEvent.change(inputs[0], {
      target: {
        value: "2026-01-10",
      },
    });

    expect(pushMock).toHaveBeenCalled();
  });
});
it("altera data final", () => {
  const { container } = render(
    <DateRangeFilter
      from={new Date("2026-01-01")}
      to={new Date("2026-01-31")}
    />
  );

  const inputs =
    container.querySelectorAll('input[type="date"]');

  fireEvent.change(inputs[1], {
    target: {
      value: "2026-01-20",
    },
  });

  expect(pushMock).toHaveBeenCalled();
});