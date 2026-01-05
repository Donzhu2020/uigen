import { Loader2 } from "lucide-react";
import { getToolInvocationMessage } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ToolInvocationBadgeProps {
  toolInvocation: {
    toolName: string;
    state: "result" | "pending" | "call" | "partial-call";
    args: Record<string, any>;
    result?: any;
  };
  className?: string;
}

export function ToolInvocationBadge({
  toolInvocation,
  className,
}: ToolInvocationBadgeProps) {
  const { toolName, state, args } = toolInvocation;
  const message = getToolInvocationMessage(toolName, args);
  const isCompleted = state === "result";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200",
        className
      )}
    >
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
