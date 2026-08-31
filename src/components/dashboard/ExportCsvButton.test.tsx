import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { ExportCsvButton } from "./ExportCsvButton";

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe("ExportCsvButton", () => {
    it("renders export button", () => {
        render(
            <ExportCsvButton
                transactions={[
                    {
                        id: "1",
                        description: "Teste",
                        amount: 100,
                        type: "income",
                        date: new Date(),
                        category: "Teste",
                    },
                ]}
            />,
        );

        expect(
            screen.getByRole("button", { name: /exportar csv/i }),
        ).toBeTruthy();
    });

    it("starts csv export on click", () => {
        const clickMock = vi.fn();

        vi.stubGlobal("URL", {
            createObjectURL: vi.fn(() => "blob:test"),
            revokeObjectURL: vi.fn(),
        });

        const originalCreateElement = document.createElement.bind(document);

        vi.spyOn(document, "createElement").mockImplementation((tagName) => {
            if (tagName === "a") {
                const anchor = originalCreateElement("a");
                anchor.click = clickMock;
                return anchor;
            }

            return originalCreateElement(tagName);
        });

        render(
            <ExportCsvButton
                transactions={[
                    {
                        id: "1",
                        description: "Teste",
                        amount: 100,
                        type: "income",
                        date: new Date(),
                        category: "Teste",
                    },
                ]}
            />,
        );

        fireEvent.click(
            screen.getByRole("button", { name: /exportar csv/i }),
        );

        expect(clickMock).toHaveBeenCalled();
    });
});