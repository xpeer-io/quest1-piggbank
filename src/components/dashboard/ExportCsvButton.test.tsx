import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);

import { ExportCsvButton } from "./ExportCsvButton";

describe("ExportCsvButton", () => {
  it("renders export button", () => {
    render(<ExportCsvButton transactions={[]} />);
    expect(screen.getByText("Exportar CSV")).toBeTruthy();
  });

  it("renders the export button text", () => {
    render(<ExportCsvButton transactions={[]} />);
    expect(screen.getByRole("button")).toBeTruthy();
  });
});