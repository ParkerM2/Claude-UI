/**
 * GitHub domain types
 *
 * Used across main (service/handlers) and renderer (hooks/components).
 */

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  merged: boolean;
  draft: boolean;
  author: string;
  authorAvatar: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  headBranch: string;
  baseBranch: string;
  labels: GitHubLabel[];
  reviewers: string[];
  comments: number;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: string;
  authorAvatar: string;
  url: string;
  labels: GitHubLabel[];
  assignees: string[];
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubLabel {
  name: string;
  color: string;
}

export interface GitHubNotification {
  id: string;
  unread: boolean;
  reason: string;
  title: string;
  type: string;
  repoName: string;
  updatedAt: string;
}
