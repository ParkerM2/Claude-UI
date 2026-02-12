/**
 * React Query hooks for changelog
 */

import { useQuery } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

import { changelogKeys } from './queryKeys';

/** Fetch all changelog entries */
export function useChangelog() {
  return useQuery({
    queryKey: changelogKeys.list(),
    queryFn: () => ipc('changelog.list', {}),
  });
}
