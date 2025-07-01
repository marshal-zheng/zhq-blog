import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStop,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  WifiIcon,
  LockIcon,
  ClockIcon,
  ServerIcon,
  BrainIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
  XIcon,
} from "lucide-react";
import { AssistantUiChatError, errorConfigPresets } from "../ChatError";
import { cn } from "@assets/lib/utils";

import { Button } from "@/components/ui/Button";
import { MarkdownText } from "./MarkdownText";
import { TooltipIconButton } from "./TooltipIconButton";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="bg-transparent box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "36rem",
      }}
    >
      <ThreadPrimitive.Viewport className="flex flex-1 h-full w-full flex-col items-center overflow-y-auto scroll-smooth bg-inherit px-3 py-2">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-4 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-xl bg-inherit pb-3">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="滚动到底部"
        variant="outline"
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl disabled:invisible transition-all duration-200 hover:scale-105"
      >
        <ArrowDownIcon size={16} />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center px-6 py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Hello！👋
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            我可以帮您快速答疑、提供建议或辅助浏览内容
          </p>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/20 flex w-full flex-wrap items-end rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 shadow-sm transition-all duration-200 ease-out">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="输入您的问题..."
        className="placeholder:text-gray-500 dark:placeholder:text-gray-400 max-h-24 flex-grow resize-none border-none bg-transparent px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-0 disabled:cursor-not-allowed font-medium leading-relaxed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="发送消息"
            variant="default"
            className="my-1 size-7 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 shadow-sm"
          >
            <SendHorizontalIcon size={20} />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="停止生成"
            variant="default"
            className="my-1 size-7 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 ease-out hover:scale-105 shadow-sm"
          >
            <CircleStop size={14} />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
      <UserActionBar />

      <div className="bg-blue-500 hover:bg-blue-600 text-white max-w-[calc(var(--thread-max-width)*0.7)] break-words rounded-2xl rounded-br-sm px-4 py-3 col-start-2 row-start-2 shadow-sm font-normal leading-relaxed transition-colors duration-150">
        <MessagePrimitive.Content />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end col-start-1 row-start-2 mr-2 mt-1"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton 
          tooltip="编辑消息"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-150"
        >
          <PencilIcon size={14} />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 my-3 flex w-full max-w-[var(--thread-max-width)] flex-col gap-3 rounded-xl p-4 shadow-sm">
      <ComposerPrimitive.Input className="text-gray-900 dark:text-gray-100 flex min-h-[80px] w-full resize-none bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium leading-relaxed" />

      <div className="flex items-center justify-end gap-2">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            取消
          </Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
            发送
          </Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative w-full max-w-[var(--thread-max-width)] py-4">
      {/* 消息内容 - 去掉头像，直接展示内容 */}
      <div className="text-gray-900 dark:text-gray-100 w-full break-words leading-7 font-normal">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
        <MessageError />
      </div>

      <AssistantActionBar />

      <BranchPicker className="mt-2" />
    </MessagePrimitive.Root>
  );
};

const MessageError: FC = () => {
  const [isBubbleMode, setIsBubbleMode] = useState(false);
  
  // 检测是否在气泡模式下显示
  useEffect(() => {
    // 根据父元素宽度或特定class判断是否为气泡模式
    const threadElement = document.querySelector('.bg-transparent.box-border.flex.h-full');
    if (threadElement) {
      const width = threadElement.clientWidth;
      // 假设宽度小于500px时为气泡模式
      setIsBubbleMode(width < 500);
    }
  }, []);
  
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="hidden">
        <ErrorPrimitive.Message />
      </ErrorPrimitive.Root>
      
      <ErrorPrimitive.Root className="mt-2">
        <AssistantUiChatError 
          message={(document.querySelector('[data-error-message]')?.textContent || "系统错误")}
          config={{
            compact: isBubbleMode,
            showTechnicalDetails: false,
            enableReporting: false,
            theme: 'auto'
          }}
        />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 mt-1 data-[floating]:bg-white dark:data-[floating]:bg-gray-800 data-[floating]:absolute data-[floating]:rounded-lg data-[floating]:border data-[floating]:border-gray-200/50 dark:data-[floating]:border-gray-700/50 data-[floating]:p-1 data-[floating]:shadow-lg data-[floating]:backdrop-blur-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton 
          tooltip="复制内容"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150"
        >
          <MessagePrimitive.If copied>
            <CheckIcon size={14} />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon size={14} />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton 
          tooltip="重新生成"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-150"
        >
          <RefreshCwIcon size={14} />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn("text-gray-500 dark:text-gray-400 inline-flex items-center text-xs font-medium bg-gray-100/50 dark:bg-gray-800/50 rounded-full px-2 py-1", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton 
          tooltip="上一个版本"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-all duration-150"
        >
          <ChevronLeftIcon size={12} />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium px-2">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton 
          tooltip="下一个版本"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-all duration-150"
        >
          <ChevronRightIcon size={12} />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};


