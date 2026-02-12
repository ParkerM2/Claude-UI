/**
 * GitHub API type definitions
 *
 * Types for GitHub REST API v3 responses used by the MCP server.
 * Only the fields we actually consume are typed — GitHub returns
 * much more data per resource.
 */

// ── User ─────────────────────────────────────────────────────

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

// ── Pull Request ─────────────────────────────────────────────

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  merged: boolean;
  draft: boolean;
  user: GitHubUser;
  html_url: string;
  diff_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  head: { ref: string; sha: string };
  base: { ref: string; sha: string };
  labels: Array<{ name: string; color: string }>;
  requested_reviewers: GitHubUser[];
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

// ── Issue ────────────────────────────────────────────────────

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  user: GitHubUser;
  html_url: string;
  labels: Array<{ name: string; color: string }>;
  assignees: GitHubUser[];
  milestone: { title: string; number: number } | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

// ── Notification ─────────────────────────────────────────────

export interface Notification {
  id: string;
  unread: boolean;
  reason: string;
  subject: {
    title: string;
    url: string | null;
    type: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  updated_at: string;
}

// ── Review ───────────────────────────────────────────────────

export interface PullRequestReview {
  id: number;
  user: GitHubUser;
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
  html_url: string;
  submitted_at: string;
}
