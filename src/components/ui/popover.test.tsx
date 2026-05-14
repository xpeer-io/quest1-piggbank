import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { Button } from "./button";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

afterEach(cleanup);

describe("Popover", () => {
  it("renders a single button when the trigger child is Button", () => {
    render(
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">Abrir</Button>
        </PopoverTrigger>
        <PopoverContent>Conteúdo</PopoverContent>
      </Popover>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toBe("Abrir");
  });
});
