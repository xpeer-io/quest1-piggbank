import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CsvExportButton", () => {
  it("deve renderizar botão exportar csv", () => {
    render(<button>Exportar CSV</button>);

    expect(
      screen.getByRole("button", {
        name: /exportar csv/i,
      }),
    ).toBeTruthy();

    cleanup();
  });

  it("deve permitir clique no botão", async () => {
    const user = userEvent.setup();

    const onClick = vi.fn();

    render(
      <button onClick={onClick}>
        Exportar CSV
      </button>,
    );

    const button = screen.getByRole("button", {
      name: /exportar csv/i,
    });

    await user.click(button);

    expect(onClick).toHaveBeenCalled();

    cleanup();
  });
});