/**
 * AssistantPage — Main page with chat-like interface optimized for commands
 */

import { useSendCommand } from '../api/useAssistant';
import { useAssistantEvents } from '../hooks/useAssistantEvents';

import { CommandInput } from './CommandInput';
import { QuickActions } from './QuickActions';
import { ResponseStream } from './ResponseStream';

export function AssistantPage() {
  useAssistantEvents();

  const sendCommand = useSendCommand();

  function handleSendCommand(input: string) {
    sendCommand.mutate({ input });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Quick action buttons */}
      <QuickActions disabled={sendCommand.isPending} onAction={handleSendCommand} />

      {/* Response area */}
      <ResponseStream />

      {/* Command input — fixed at bottom */}
      <CommandInput disabled={sendCommand.isPending} onSubmit={handleSendCommand} />
    </div>
  );
}
