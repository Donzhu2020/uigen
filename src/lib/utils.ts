import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getFileName(path: string): string {
  if (!path) return "file";

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 0) return "file";
  if (segments.length === 1) return segments[0];

  return segments.slice(-2).join("/");
}

function getEditorMessage(args: Record<string, any>): string {
  const command = args?.command;
  const path = args?.path;

  if (!command) {
    return path ? `Modifying ${getFileName(path)}` : "Performing editor operation";
  }

  const fileName = getFileName(path);

  switch (command) {
    case "create":
      return `Creating ${fileName}`;
    case "str_replace":
    case "insert":
      return `Editing ${fileName}`;
    case "view":
      return `Viewing ${fileName}`;
    case "undo_edit":
      return `Undoing changes to ${fileName}`;
    default:
      return `Modifying ${fileName}`;
  }
}

function getFileManagerMessage(args: Record<string, any>): string {
  const command = args?.command;
  const path = args?.path;

  if (!command) {
    return path ? `Managing ${getFileName(path)}` : "Performing file operation";
  }

  const fileName = getFileName(path);

  switch (command) {
    case "rename":
      const newPath = args?.new_path;
      if (newPath) {
        const newFileName = getFileName(newPath);
        return `Renaming ${fileName} to ${newFileName}`;
      }
      return `Renaming ${fileName}`;
    case "delete":
      return `Deleting ${fileName}`;
    default:
      return `Managing ${fileName}`;
  }
}

export function getToolInvocationMessage(
  toolName: string,
  args: Record<string, any>
): string {
  switch (toolName) {
    case "str_replace_editor":
      return getEditorMessage(args);
    case "file_manager":
      return getFileManagerMessage(args);
    default:
      return toolName.replace(/_/g, " ");
  }
}
