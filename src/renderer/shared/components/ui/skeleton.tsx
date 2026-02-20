import { cn } from '@renderer/shared/lib/utils';

// ─── Component (React 19 — no forwardRef) ───────────────

interface SkeletonProps extends React.ComponentProps<'div'> {
  /** Shape variant for the skeleton */
  variant?: 'line' | 'circle' | 'card';
}

function Skeleton({ className, variant = 'line', ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      {...props}
      className={cn(
        'bg-muted animate-pulse',
        variant === 'line' && 'h-4 w-full rounded-md',
        variant === 'circle' && 'h-10 w-10 rounded-full',
        variant === 'card' && 'h-32 w-full rounded-lg',
        className,
      )}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
