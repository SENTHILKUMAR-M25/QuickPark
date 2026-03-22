import React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(function ToastViewport(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={`fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ${className}`}
      {...rest}
    />
  );
});

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(function Toast(props, ref) {
  const { className = "", variant, ...rest } = props;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={`${toastVariants({ variant })} ${className}`}
      {...rest}
    />
  );
});

const ToastAction = React.forwardRef(function ToastAction(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary ${className}`}
      {...rest}
    />
  );
});

const ToastClose = React.forwardRef(function ToastClose(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <ToastPrimitives.Close
      ref={ref}
      className={`absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground ${className}`}
      {...rest}
    >
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  );
});

const ToastTitle = React.forwardRef(function ToastTitle(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <ToastPrimitives.Title
      ref={ref}
      className={`text-sm font-semibold ${className}`}
      {...rest}
    />
  );
});

const ToastDescription = React.forwardRef(function ToastDescription(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <ToastPrimitives.Description
      ref={ref}
      className={`text-sm opacity-90 ${className}`}
      {...rest}
    />
  );
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};