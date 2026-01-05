import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("renders with completed state (green dot)", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/App.jsx" },
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("renders with pending state (spinner)", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "pending" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("renders with call state (spinner)", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "call" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("renders with partial-call state (spinner)", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "partial-call" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("applies custom className", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={toolInvocation}
      className="custom-class"
    />
  );
  expect(container.firstChild?.className).toContain("custom-class");
});

test("displays creating message for create command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("displays editing message for str_replace command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "str_replace", path: "/components/Button.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing components/Button.jsx")).toBeDefined();
});

test("displays editing message for insert command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "insert", path: "/utils/helper.ts" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing utils/helper.ts")).toBeDefined();
});

test("displays viewing message for view command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "view", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Viewing App.jsx")).toBeDefined();
});

test("displays undo message for undo_edit command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "undo_edit", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Undoing changes to App.jsx")).toBeDefined();
});

test("handles unknown editor command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "unknown", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Modifying App.jsx")).toBeDefined();
});

test("displays renaming message for rename command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result" as const,
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming old.jsx to new.jsx")).toBeDefined();
});

test("displays deleting message for delete command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result" as const,
    args: { command: "delete", path: "/components/old.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Deleting components/old.jsx")).toBeDefined();
});

test("handles unknown file manager command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result" as const,
    args: { command: "unknown", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Managing App.jsx")).toBeDefined();
});

test("shows basename for simple files", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows relative path for nested files", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/src/components/Button.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating components/Button.jsx")).toBeDefined();
});

test("handles paths without leading slash", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "components/Button.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating components/Button.jsx")).toBeDefined();
});

test("handles missing args object", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {},
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Performing editor operation")).toBeDefined();
});

test("handles missing command in args", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Modifying App.jsx")).toBeDefined();
});

test("handles missing path in args", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("handles empty path string", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("handles unknown tool name", () => {
  const toolInvocation = {
    toolName: "unknown_tool",
    state: "result" as const,
    args: {},
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("unknown tool")).toBeDefined();
});

test("handles rename without new_path", () => {
  const toolInvocation = {
    toolName: "file_manager",
    state: "result" as const,
    args: { command: "rename", path: "/old.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming old.jsx")).toBeDefined();
});

test("handles deeply nested paths", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: {
      command: "create",
      path: "/src/components/ui/buttons/PrimaryButton.tsx",
    },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating buttons/PrimaryButton.tsx")).toBeDefined();
});

test("handles path with trailing slash", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    state: "result" as const,
    args: { command: "create", path: "/components/Button.jsx/" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating components/Button.jsx")).toBeDefined();
});
