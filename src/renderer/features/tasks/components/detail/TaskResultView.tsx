/**
 * TaskResultView -- Summary view for completed/reviewed/errored tasks.
 * Shows execution duration, final status, cost breakdown, log summary,
 * and action buttons (View Diff, Create PR).
 */

import { useMemo, useState } from 'react';

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  ExternalLink,
  GitPullRequestDraft,
  ScrollText,
} from 'lucide-react';

import type { Task, TaskStatus } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import {
  Badge,
  Button,
  Card,
  CardContent,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui';

import { CreatePrDialog } from '../CreatePrDialog';

// ── Constants ───────────────────────────────────────────────────

const RESULT_STATUSES = new Set<string>(['done', 'review', 'error']);
const MAX_LOG_LINES_COLLAPSED = 20;

const tokenFormatter = new Intl.NumberFormat('en-US');
const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

// ── Helpers ─────────────────────────────────────────────────────

/** Format cost value, handling sub-cent amounts */
function formatCostUsd(usd: number): string {
  if (usd > 0 && usd < 0.01) {
    return '<$0.01';
  }
  return costFormatter.format(usd);
}

/** Format a duration in milliseconds to a human-readable string */
function formatDuration(ms: number): string {
  if (ms < 0) return '--';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours)}h ${String(minutes)}m ${String(seconds)}s`;
  }
  if (minutes > 0) {
    return `${String(minutes)}m ${String(seconds)}s`;
  }
  return `${String(seconds)}s`;
}

/** Compute duration between two ISO date strings */
function computeDuration(startIso: string, endIso: string | undefined): number | null {
  if (!endIso) return null;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return end - start;
}

/** Get the appropriate icon and styling for a final status */
function getStatusPresentation(status: TaskStatus): {
  icon: typeof CheckCircle2;
  colorClass: string;
  badgeClass: string;
  label: string;
} {
  switch (status) {
    case 'done': {
      return {
        icon: CheckCircle2,
        label: 'Completed',
        colorClass: 'text-emerald-400',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-transparent',
      };
    }
    case 'review': {
      return {
        icon: ScrollText,
        label: 'In Review',
        colorClass: 'text-purple-400',
        badgeClass: 'bg-purple-500/15 text-purple-400 border-transparent',
      };
    }
    case 'error': {
      return {
        icon: AlertCircle,
        label: 'Error',
        colorClass: 'text-red-400',
        badgeClass: 'bg-red-500/15 text-red-400 border-transparent',
      };
    }
    case 'backlog':
    case 'planning':
    case 'plan_ready':
    case 'queued':
    case 'running':
    case 'paused': {
      return {
        icon: Clock,
        label: status,
        colorClass: 'text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground border-transparent',
      };
    }
  }
}

// ── Sub-Components ──────────────────────────────────────────────

interface StatusHeaderProps {
  task: Task;
  durationMs: number | null;
}

function StatusHeader({ task, durationMs }: StatusHeaderProps) {
  const presentation = getStatusPresentation(task.status);
  const StatusIcon = presentation.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <StatusIcon className={cn('h-5 w-5 shrink-0', presentation.colorClass)} />
        <div>
          <div className="text-foreground text-sm font-medium">Execution Result</div>
          {durationMs === null ? null : (
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Duration: {formatDuration(durationMs)}</span>
            </div>
          )}
        </div>
      </div>
      <Badge className={cn(presentation.badgeClass)} size="sm" variant="outline">
        {presentation.label}
      </Badge>
    </div>
  );
}

interface CostSummaryProps {
  metadata: Record<string, unknown> | undefined;
}

function CostSummary({ metadata }: CostSummaryProps) {
  const costUsd = typeof metadata?.costUsd === 'number' ? metadata.costUsd : null;
  const costTokens = typeof metadata?.costTokens === 'number' ? metadata.costTokens : null;
  const inputTokens =
    typeof metadata?.inputTokens === 'number' ? metadata.inputTokens : null;
  const outputTokens =
    typeof metadata?.outputTokens === 'number' ? metadata.outputTokens : null;

  const showBreakdown = inputTokens !== null || outputTokens !== null;

  return (
    <div className="flex items-center gap-4">
      <Coins className="text-muted-foreground h-4 w-4 shrink-0" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        {showBreakdown ? (
          <>
            {inputTokens === null ? null : (
              <div>
                <span className="text-muted-foreground mr-1.5">Input:</span>
                <span className="text-foreground font-medium">
                  {tokenFormatter.format(inputTokens)}
                </span>
              </div>
            )}
            {outputTokens === null ? null : (
              <div>
                <span className="text-muted-foreground mr-1.5">Output:</span>
                <span className="text-foreground font-medium">
                  {tokenFormatter.format(outputTokens)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div>
            <span className="text-muted-foreground mr-1.5">Tokens:</span>
            <span className="text-foreground font-medium">
              {costTokens === null ? '--' : tokenFormatter.format(costTokens)}
            </span>
          </div>
        )}
        <div>
          <span className="text-muted-foreground mr-1.5">Cost:</span>
          <span className="text-foreground font-medium">
            {costUsd === null ? '--' : formatCostUsd(costUsd)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface LogSummaryProps {
  logs: string[];
  taskId: string;
}

function LogSummary({ logs, taskId }: LogSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (logs.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-xs italic">
        <ScrollText className="h-3.5 w-3.5 shrink-0" />
        <span>No execution logs recorded</span>
      </div>
    );
  }

  const hasMore = logs.length > MAX_LOG_LINES_COLLAPSED;
  const displayedLogs = isExpanded ? logs : logs.slice(-MAX_LOG_LINES_COLLAPSED);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground mb-1 text-xs font-medium">
          Log Summary ({logs.length} {logs.length === 1 ? 'line' : 'lines'})
        </div>
        {hasMore ? (
          <CollapsibleTrigger asChild>
            <Button className="h-6 text-xs" size="sm" variant="ghost">
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Show all ({logs.length})
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        ) : null}
      </div>
      <CollapsibleContent forceMount>
        <ScrollArea className="bg-muted/30 border-border max-h-48 rounded border">
          <div className="p-2">
            {displayedLogs.map((entry, index) => (
              <div
                key={`${taskId}-log-${String(index)}`}
                className="text-muted-foreground font-mono text-[11px] leading-relaxed"
              >
                <span className="text-foreground/50 mr-2 select-none">&gt;</span>
                {entry}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ActionButtonsProps {
  task: Task;
}

function ActionButtons({ task }: ActionButtonsProps) {
  const [isPrDialogOpen, setIsPrDialogOpen] = useState(false);

  const hasBranch = typeof task.metadata?.branch === 'string';
  const prUrl = typeof task.metadata?.prUrl === 'string' ? task.metadata.prUrl : null;
  const hasPr = prUrl !== null || typeof task.prStatus?.prNumber === 'number';
  const projectPath =
    typeof task.metadata?.worktreePath === 'string' ? task.metadata.worktreePath : '';
  const canCreatePr = hasBranch && projectPath.length > 0;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                disabled={!hasBranch}
                size="sm"
                variant="outline"
                onClick={() => {
                  // Placeholder: will navigate to merge diff view once route is wired
                }}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                View Diff
              </Button>
            </span>
          </TooltipTrigger>
          {hasBranch ? null : (
            <TooltipContent>
              <span>No branch available for diff</span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {hasPr && prUrl ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            void window.open(prUrl, '_blank');
          }}
        >
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Open PR
        </Button>
      ) : (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    disabled={!canCreatePr}
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPrDialogOpen(true)}
                  >
                    <GitPullRequestDraft className="mr-1.5 h-3.5 w-3.5" />
                    Create PR
                  </Button>
                </span>
              </TooltipTrigger>
              {canCreatePr ? null : (
                <TooltipContent>
                  <span>
                    {hasBranch ? 'No project path available' : 'No branch available'}
                  </span>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <CreatePrDialog
            open={isPrDialogOpen}
            projectPath={projectPath}
            taskDescription={task.description}
            taskName={task.title}
            onOpenChange={setIsPrDialogOpen}
          />
        </>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────

interface TaskResultViewProps {
  task: Task;
}

export function TaskResultView({ task }: TaskResultViewProps) {
  const isResultStatus = RESULT_STATUSES.has(task.status);

  const durationMs = useMemo(() => {
    const startIso = task.executionProgress?.startedAt ?? task.createdAt;
    const endIso = task.updatedAt;
    return computeDuration(startIso, endIso);
  }, [task.createdAt, task.executionProgress?.startedAt, task.updatedAt]);

  if (!isResultStatus) {
    return null;
  }

  const logs = task.logs ?? [];
  const metadata = task.metadata as Record<string, unknown> | undefined;

  return (
    <Card className="border-border bg-card/50">
      <CardContent className="space-y-4 p-4">
        {/* Status + Duration */}
        <StatusHeader durationMs={durationMs} task={task} />

        {/* Cost Breakdown */}
        <div className="border-border border-t pt-3">
          <CostSummary metadata={metadata} />
        </div>

        {/* Log Summary */}
        <div className="border-border border-t pt-3">
          <LogSummary logs={logs} taskId={task.id} />
        </div>

        {/* Action Buttons */}
        <div className="border-border border-t pt-3">
          <ActionButtons task={task} />
        </div>
      </CardContent>
    </Card>
  );
}
