import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ExportButton from "./ExportButton";
import { mockTransactions } from "@/data/mock";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ExportButton", () => {
  it("triggers download when clicked", () => {
    const fakeUrl = "blob:fake";
    const createMock = vi.fn().mockReturnValue(fakeUrl as any);
    const revokeMock = vi.fn();
    (global as any).URL = Object.assign((global as any).URL || {}, {
      createObjectURL: createMock,
      revokeObjectURL: revokeMock,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined as any);

    render(<ExportButton transactions={mockTransactions.slice(0, 2)} />);

    fireEvent.click(screen.getByText("Exportar CSV"));

    expect(createMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeMock).toHaveBeenCalledWith(fakeUrl as any);
  });

  it("still triggers download when there are no transactions", () => {
    const createMock = vi.fn().mockReturnValue("blob:empty" as any);
    (global as any).URL = Object.assign((global as any).URL || {}, {
      createObjectURL: createMock,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined as any);

    render(<ExportButton transactions={[]} />);
    fireEvent.click(screen.getByText("Exportar CSV"));

    expect(createMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});
