import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "./Thread";

const AssistantPopover: React.FC = () => {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-full bg-transparent">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default AssistantPopover; 