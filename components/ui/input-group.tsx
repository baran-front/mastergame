"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full items-center gap-1 rounded-full has-[>textarea]:rounded-xl has border shadow-xs transition-[color,box-shadow] outline-none",
        "h-9 min-w-0 has-[>textarea]:h-auto px-1",

        // Variants based on alignment - using logical properties for RTL/LTR support
        "has-[>[data-align=inline-start]]:[&>input]:ps-2 has-[>[data-align=inline-start]]:[&>textarea]:ps-2 has-[>[data-align=inline-start]]:ps-3 has-[>[data-align=inline-start]]:pe-1 has-[>[data-align=inline-start]]:gap-1",
        "has-[>[data-align=inline-end]]:[&>input]:pe-2 has-[>[data-align=inline-end]]:[&>textarea]:pe-2 has-[>[data-align=inline-end]]:pe-3 has-[>[data-align=inline-end]]:ps-1 has-[>[data-align=inline-end]]:gap-1",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-2 has-[>[data-align=block-start]]:[&>textarea]:pb-2 has-[>[data-align=block-start]]:px-3 has-[>[data-align=block-start]]:pt-3 has-[>[data-align=block-start]]:pb-2.5",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-2 has-[>[data-align=block-end]]:[&>textarea]:pt-2 has-[>[data-align=block-end]]:px-3 has-[>[data-align=block-end]]:pt-2.5 has-[>[data-align=block-end]]:pb-3",

        // Hover and Focus state - matching input.tsx pattern
        "ring-[3px] ring-transparent",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20 hover:ring-primary/20 has-[[data-slot=input-group-control]:focus-visible]:border-primary hover:border-primary",
        "has-[[data-slot=input-group-control]:focus-visible]:**:data-[slot=input-group-control]:placeholder:text-foreground",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-2 pe-0 has-[>button]:ms-[-0.25rem] has-[>kbd]:ms-[-0.15rem]",
        "inline-end":
          "order-last pe-2 ps-0 has-[>button]:me-[-0.25rem] has-[>kbd]:me-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-0 pt-2.5 pb-2 [&.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-0 pt-2 pb-2.5 [&.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "text-sm shadow-none flex gap-1.5 items-center shrink-0",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-1.5",
        sm: "h-7 px-2.5 gap-1.5 rounded-md [&>svg:not([class*='size-'])]:size-4 has-[>svg]:px-2",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-7 rounded-md p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-1.5 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent px-2 shadow-none dark:bg-transparent",
        "focus-visible:ring-0 hover:ring-0 focus-visible:border-0 hover:border-0",
        "placeholder:text-foreground/50 focus-visible:placeholder:text-foreground",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent px-2 py-2.5 shadow-none dark:bg-transparent",
        "focus-visible:ring-0 hover:ring-0 focus-visible:border-0 hover:border-0",
        "placeholder:text-foreground/50 focus-visible:placeholder:text-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
