/**
 * Changelog-related types
 */

export type ChangeType = 'added' | 'changed' | 'fixed' | 'removed';

export interface ChangeCategory {
  type: ChangeType;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  categories: ChangeCategory[];
}
