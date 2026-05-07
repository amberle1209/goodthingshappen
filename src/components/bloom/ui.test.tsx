import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepDots, PrimaryBtn, GhostBtn } from "./ui";

/* ─── StepDots ──────────────────────────────────────── */

describe("StepDots", () => {
  it("renders 7 dots by default", () => {
    const { container } = render(<StepDots step={0} />);
    const dots = container.querySelectorAll("span");
    expect(dots).toHaveLength(7);
  });

  it("respects custom total", () => {
    const { container } = render(<StepDots step={0} total={5} />);
    const dots = container.querySelectorAll("span");
    expect(dots).toHaveLength(5);
  });

  it("active dot (current step) is wider than inactive dots", () => {
    const { container } = render(<StepDots step={2} />);
    const dots = container.querySelectorAll("span");
    // Active dot should be 18px wide, others 6px
    expect(dots[2].style.width).toBe("18px");
    expect(dots[0].style.width).toBe("6px");
    expect(dots[4].style.width).toBe("6px");
  });
});

/* ─── PrimaryBtn ────────────────────────────────────── */

describe("PrimaryBtn", () => {
  it("renders children text", () => {
    render(<PrimaryBtn>paint my day →</PrimaryBtn>);
    expect(screen.getByRole("button")).toHaveTextContent("paint my day →");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<PrimaryBtn onClick={handleClick}>go</PrimaryBtn>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <PrimaryBtn onClick={handleClick} disabled>
        go
      </PrimaryBtn>,
    );
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled styling", () => {
    render(<PrimaryBtn disabled>go</PrimaryBtn>);
    const btn = screen.getByRole("button");
    expect(btn.style.cursor).toBe("not-allowed");
  });

  it("merges custom style", () => {
    render(<PrimaryBtn style={{ marginTop: 20 }}>go</PrimaryBtn>);
    const btn = screen.getByRole("button");
    expect(btn.style.marginTop).toBe("20px");
  });
});

/* ─── GhostBtn ──────────────────────────────────────── */

describe("GhostBtn", () => {
  it("renders children text", () => {
    render(<GhostBtn>start over</GhostBtn>);
    expect(screen.getByRole("button")).toHaveTextContent("start over");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<GhostBtn onClick={handleClick}>back</GhostBtn>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("has transparent background", () => {
    render(<GhostBtn>back</GhostBtn>);
    const btn = screen.getByRole("button");
    expect(btn.style.background).toBe("transparent");
  });
});
