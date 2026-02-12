/**
 * PrDetailModal — Pull request detail overlay
 */

import { GitMerge, GitPullRequest, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useGitHubPrDetail } from '../api/useGitHub';

import type { GitHubPr } from '../api/useGitHub';

// ── Helpers ──────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPrStatusBadge(pr: GitHubPr): { label: string; className: string } {
  if (pr.merged) return { label: 'Merged', className: 'bg-purple-500/20 text-purple-300' };
  if (pr.draft) return { label: 'Draft', className: 'bg-muted text-muted-foreground' };
  if (pr.state === 'closed') {
    return { label: 'Closed', className: 'bg-destructive/20 text-destructive' };
  }
  return { label: 'Open', className: 'bg-success/20 text-success' };
}

// ── Sub-components ───────────────────────────────────────────

function PrDetailLoading() {
  return (
    <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
      Loading...
    </div>
  );
}

function PrDetailEmpty() {
  return (
    <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
      Pull request not found
    </div>
  );
}

function PrDetailContent({ pr }: { pr: GitHubPr }) {
  const badge = getPrStatusBadge(pr);

  return (
    <div>
      {/* Title and status */}
      <div className="mb-4 flex items-start gap-3">
        <h2 className="flex-1 text-lg font-semibold">{pr.title}</h2>
        <span
          className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium', badge.className)}
        >
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
        <span>
          <span className="font-medium">{pr.author}</span> wants to merge{' '}
          <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{pr.headBranch}</code>
          {' into '}
          <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{pr.baseBranch}</code>
        </span>
      </div>

      {/* Stats */}
      <div className="border-border mb-4 grid grid-cols-4 gap-3 rounded-lg border p-3">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Commits</p>
          <p className="font-semibold">-</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Changed</p>
          <p className="font-semibold">{String(pr.changedFiles)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Additions</p>
          <p className="text-success font-semibold">+{String(pr.additions)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Deletions</p>
          <p className="text-destructive font-semibold">-{String(pr.deletions)}</p>
        </div>
      </div>

      {/* Labels */}
      {pr.labels.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1">
          {pr.labels.map((label) => (
            <span
              key={label.name}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs"
            >
              {label.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* Reviewers */}
      {pr.reviewers.length > 0 ? (
        <div className="mb-4">
          <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">Reviewers</p>
          <div className="flex gap-2">
            {pr.reviewers.map((reviewer) => (
              <span key={reviewer} className="bg-muted rounded-md px-2 py-1 text-xs">
                {reviewer}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Body */}
      {pr.body ? (
        <div className="border-border border-t pt-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">Description</p>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{pr.body}</p>
        </div>
      ) : null}

      {/* Dates */}
      <div className="text-muted-foreground border-border mt-4 border-t pt-4 text-xs">
        <span>Created {formatDate(pr.createdAt)}</span>
        <span className="mx-2">&middot;</span>
        <span>Updated {formatDate(pr.updatedAt)}</span>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

interface PrDetailModalProps {
  prNumber: number;
  onClose: () => void;
}

function renderBody(isLoading: boolean, pr: GitHubPr | undefined): React.ReactNode {
  if (isLoading) return <PrDetailLoading />;
  if (pr) return <PrDetailContent pr={pr} />;
  return <PrDetailEmpty />;
}

export function PrDetailModal({ prNumber, onClose }: PrDetailModalProps) {
  const { data: pr, isLoading } = useGitHubPrDetail(prNumber);

  function handleBackdropKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- modal backdrop click-to-close pattern
    <div
      aria-label={`Pull request #${String(prNumber)} details`}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
    >
      <div className="bg-card border-border mx-4 w-full max-w-2xl rounded-xl border shadow-xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {pr?.merged ? (
              <GitMerge className="h-5 w-5 text-purple-400" />
            ) : (
              <GitPullRequest className="text-success h-5 w-5" />
            )}
            <span className="text-muted-foreground text-sm">#{String(prNumber)}</span>
          </div>
          <button
            aria-label="Close dialog"
            className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6">{renderBody(isLoading, pr)}</div>
      </div>
    </div>
  );
}
