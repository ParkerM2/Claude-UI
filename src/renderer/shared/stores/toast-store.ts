/**
 * Toast Store — Global toast notification state
 *
 * Minimal Zustand store for mutation error toasts.
 * Auto-dismisses after 5 seconds. Max 3 visible toasts.
 */

import { create } from 'zustand';

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 5000;

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success';
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: 'error' | 'success') => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  addToast: (message, type) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => {
      const updated = [...state.toasts, { id, message, type, createdAt: Date.now() }];
      // Keep only the most recent MAX_TOASTS
      if (updated.length > MAX_TOASTS) {
        return { toasts: updated.slice(updated.length - MAX_TOASTS) };
      }
      return { toasts: updated };
    });

    // Auto-dismiss after timeout
    window.setTimeout(() => {
      const current = get().toasts;
      if (current.some((t) => t.id === id)) {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }
    }, AUTO_DISMISS_MS);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
