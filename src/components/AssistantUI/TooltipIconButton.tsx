"use client";

import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@components/ui/Tooltip";
import { Button } from "@components/ui/Button";
import { cn } from "@assets/lib/utils";

export type TooltipIconButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
};

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
  tooltip = ''
  // 如果没有 tooltip 内容，直接返回按钮而不包装 Tooltip
  if (!tooltip) {
    return (
      <Button
        variant="ghost"
        size="icon"
        {...rest}
        className={cn("aui-button-icon", className)}
        ref={ref}
      >
        {children}
      </Button>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            {...rest}
            className={cn("aui-button-icon", className)}
            ref={ref}
          >
            {children}
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

TooltipIconButton.displayName = "TooltipIconButton";
