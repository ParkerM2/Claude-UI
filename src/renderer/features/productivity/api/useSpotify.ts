/**
 * React Query hooks for Spotify integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

import { spotifyKeys } from './queryKeys';

/** Fetch current Spotify playback state. */
export function useSpotifyPlayback() {
  return useQuery({
    queryKey: spotifyKeys.playback(),
    queryFn: () => ipc('spotify.getPlayback', {}),
    refetchInterval: 5000,
  });
}

/** Search for Spotify tracks. */
export function useSpotifySearch(query: string) {
  return useQuery({
    queryKey: spotifyKeys.search(query),
    queryFn: () => ipc('spotify.search', { query }),
    enabled: query.length > 0,
  });
}

/** Play or resume Spotify playback. */
export function useSpotifyPlay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: { uri?: string }) => ipc('spotify.play', { uri: params?.uri }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotifyKeys.playback() });
    },
  });
}

/** Pause Spotify playback. */
export function useSpotifyPause() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('spotify.pause', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotifyKeys.playback() });
    },
  });
}

/** Skip to next track. */
export function useSpotifyNext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('spotify.next', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotifyKeys.playback() });
    },
  });
}

/** Skip to previous track. */
export function useSpotifyPrevious() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('spotify.previous', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotifyKeys.playback() });
    },
  });
}

/** Set playback volume. */
export function useSpotifyVolume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (volumePercent: number) => ipc('spotify.setVolume', { volumePercent }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotifyKeys.playback() });
    },
  });
}

/** Add a track to the queue. */
export function useSpotifyAddToQueue() {
  return useMutation({
    mutationFn: (uri: string) => ipc('spotify.addToQueue', { uri }),
  });
}
