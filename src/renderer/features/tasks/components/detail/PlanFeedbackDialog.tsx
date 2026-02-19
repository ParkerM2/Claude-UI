/**
 * PlanFeedbackDialog — Dialog with textarea for providing feedback when requesting
 * changes to an agent plan. Used by PlanViewer for the "Request Changes" action.
 */

import { useEffect, useRef, useState } from 'react';

import { Loader2, MessageSquare } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

interface PlanFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: string) => void;
  loading?: boolean;
}

export function PlanFeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: PlanFeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Escape key closes the dialog
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  // Focus textarea when dialog opens and reset feedback
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (open) {
      setFeedback('');
      // Delay focus to ensure the DOM has rendered
      timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit() {
    const trimmed = feedback.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClose();
        }}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-lg rounded-lg border shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/10">
            <MessageSquare className="text-warning h-5 w-5" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-semibold">Request Changes</h2>
            <p className="text-muted-foreground text-sm">
              Describe what changes you&apos;d like to see in the plan.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-4 pb-6">
          <textarea
            ref={textareaRef}
            disabled={loading}
            placeholder="e.g., Add error handling for the API calls, use a different approach for..."
            rows={5}
            value={feedback}
            className={cn(
              'border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm',
              'focus:ring-ring focus:border-ring focus:outline-none focus:ring-1',
              'resize-none',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <p className="text-muted-foreground mt-1.5 text-xs">
            Press Ctrl+Enter to submit
          </p>
        </div>

        {/* Footer */}
        <div className="border-border flex justify-end gap-2 border-t px-6 py-4">
          <button
            disabled={loading}
            className={cn(
              'text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm',
              'transition-colors',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            disabled={loading || feedback.trim().length === 0}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
              'transition-opacity hover:opacity-90',
              'disabled:pointer-events-none disabled:opacity-50',
              'bg-primary text-primary-foreground',
            )}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
