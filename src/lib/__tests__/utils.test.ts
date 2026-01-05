import { test, expect } from "vitest";
import { getToolInvocationMessage } from "../utils";

test("getToolInvocationMessage handles str_replace_editor with create command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "/App.jsx",
  });
  expect(result).toBe("Creating App.jsx");
});

test("getToolInvocationMessage handles str_replace_editor with str_replace command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "str_replace",
    path: "/components/Button.jsx",
  });
  expect(result).toBe("Editing components/Button.jsx");
});

test("getToolInvocationMessage handles str_replace_editor with insert command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "insert",
    path: "/utils/helper.ts",
  });
  expect(result).toBe("Editing utils/helper.ts");
});

test("getToolInvocationMessage handles str_replace_editor with view command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "view",
    path: "/App.jsx",
  });
  expect(result).toBe("Viewing App.jsx");
});

test("getToolInvocationMessage handles str_replace_editor with undo_edit command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "undo_edit",
    path: "/App.jsx",
  });
  expect(result).toBe("Undoing changes to App.jsx");
});

test("getToolInvocationMessage handles str_replace_editor with unknown command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "unknown",
    path: "/App.jsx",
  });
  expect(result).toBe("Modifying App.jsx");
});

test("getToolInvocationMessage handles file_manager with rename command", () => {
  const result = getToolInvocationMessage("file_manager", {
    command: "rename",
    path: "/old.jsx",
    new_path: "/new.jsx",
  });
  expect(result).toBe("Renaming old.jsx to new.jsx");
});

test("getToolInvocationMessage handles file_manager with rename command without new_path", () => {
  const result = getToolInvocationMessage("file_manager", {
    command: "rename",
    path: "/old.jsx",
  });
  expect(result).toBe("Renaming old.jsx");
});

test("getToolInvocationMessage handles file_manager with delete command", () => {
  const result = getToolInvocationMessage("file_manager", {
    command: "delete",
    path: "/components/old.jsx",
  });
  expect(result).toBe("Deleting components/old.jsx");
});

test("getToolInvocationMessage handles file_manager with unknown command", () => {
  const result = getToolInvocationMessage("file_manager", {
    command: "unknown",
    path: "/App.jsx",
  });
  expect(result).toBe("Managing App.jsx");
});

test("getToolInvocationMessage handles unknown tool name", () => {
  const result = getToolInvocationMessage("unknown_tool", {});
  expect(result).toBe("unknown tool");
});

test("getToolInvocationMessage handles unknown tool with underscores", () => {
  const result = getToolInvocationMessage("some_custom_tool", {});
  expect(result).toBe("some custom tool");
});

test("getToolInvocationMessage handles missing args", () => {
  const result = getToolInvocationMessage("str_replace_editor", {});
  expect(result).toBe("Performing editor operation");
});

test("getToolInvocationMessage handles missing command", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    path: "/App.jsx",
  });
  expect(result).toBe("Modifying App.jsx");
});

test("getToolInvocationMessage handles missing path", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
  });
  expect(result).toBe("Creating file");
});

test("getToolInvocationMessage handles empty path", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "",
  });
  expect(result).toBe("Creating file");
});

test("getToolInvocationMessage handles file_manager with missing args", () => {
  const result = getToolInvocationMessage("file_manager", {});
  expect(result).toBe("Performing file operation");
});

test("getToolInvocationMessage handles file_manager with missing command", () => {
  const result = getToolInvocationMessage("file_manager", {
    path: "/App.jsx",
  });
  expect(result).toBe("Managing App.jsx");
});

test("getToolInvocationMessage handles simple path (basename only)", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "/App.jsx",
  });
  expect(result).toBe("Creating App.jsx");
});

test("getToolInvocationMessage handles nested path (shows parent folder)", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "/src/components/Button.jsx",
  });
  expect(result).toBe("Creating components/Button.jsx");
});

test("getToolInvocationMessage handles path without leading slash", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "components/Button.jsx",
  });
  expect(result).toBe("Creating components/Button.jsx");
});

test("getToolInvocationMessage handles deeply nested path", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "/src/components/ui/buttons/PrimaryButton.tsx",
  });
  expect(result).toBe("Creating buttons/PrimaryButton.tsx");
});

test("getToolInvocationMessage handles path with trailing slash", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "/components/Button.jsx/",
  });
  expect(result).toBe("Creating components/Button.jsx");
});

test("getToolInvocationMessage handles root file without slash", () => {
  const result = getToolInvocationMessage("str_replace_editor", {
    command: "create",
    path: "App.jsx",
  });
  expect(result).toBe("Creating App.jsx");
});
