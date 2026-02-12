/**
 * React Query hooks for the assistant feature
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

import { useAssistantStore } from '../store';

import { assistantKeys } from './queryKeys';

/** Fetch command history */
export function useHistory(limit?: number) {
  return useQuery({
    queryKey: assistantKeys.history(limit),
    queryFn: () => ipc('assistant.getHistory', { limit }),
    staleTime: 30_000,
  });
}

/** Send a command to the assistant */
export function useSendCommand() {
  const queryClient = useQueryClient();
  const { setIsThinking, setCurrentResponse, clearCurrentResponse, addResponseEntry } =
    useAssistantStore();

  return useMutation({
    mutationFn: (data: { input: string; context?: string }) => ipc('assistant.sendCommand', data),
    onMutate: () => {
      setIsThinking(true);
      clearCurrentResponse();
    },
    onSuccess: (data, variables) => {
      setCurrentResponse(data.content);
      addResponseEntry({
        input: variables.input,
        response: data.content,
        type: data.type,
        intent: data.intent,
      });
      void queryClient.invalidateQueries({ queryKey: assistantKeys.history() });
    },
    onSettled: () => {
      setIsThinking(false);
    },
  });
}
