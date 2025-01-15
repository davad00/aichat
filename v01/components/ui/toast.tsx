'use client';

import * as React from 'react';
import { useToast } from './use-toast';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function Toast({ title, description, variant = 'default' }: ToastProps) {
  const { dismiss } = useToast();

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-4 ${
        variant === 'destructive'
          ? 'bg-red-500 text-white'
          : 'bg-white text-gray-900'
      }`}
      role="alert"
    >
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="mt-1 text-sm">{description}</div>}
      <button
        onClick={() => dismiss()}
        className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
      >
        ✕
      </button>
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
