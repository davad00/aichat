'use client';

import * as React from 'react';
import { useToast } from './use-toast';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ToastActionElement;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type ToastActionElement = React.ReactElement;

export function Toast({ 
  title, 
  description, 
  variant = 'default', 
  children,
  open,
  onOpenChange 
}: ToastProps) {
  const { dismiss } = useToast();

  React.useEffect(() => {
    if (open === false) {
      onOpenChange?.(false);
    }
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-4 ${
        variant === 'destructive'
          ? 'bg-red-500 text-white'
          : 'bg-white text-gray-900'
      }`}
      role="alert"
    >
      {children || (
        <>
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="mt-1 text-sm">{description}</div>}
          <button
            onClick={() => {
              dismiss();
              onOpenChange?.(false);
            }}
            className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ToastTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold">{children}</div>;
}

export function ToastDescription({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-sm">{children}</div>;
}

export function ToastClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
    >
      ✕
    </button>
  );
}

export function ToastViewport() {
  return <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />;
}
