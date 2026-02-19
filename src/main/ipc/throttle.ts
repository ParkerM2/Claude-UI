/**
 * Simple IPC throttle utility for rate-limiting expensive operations.
 * Returns a guard function that tracks the last invocation time.
 */

export function createThrottle(windowMs: number): () => boolean {
  let lastCall = 0;
  return () => {
    const now = Date.now();
    if (now - lastCall < windowMs) {
      return false; // throttled
    }
    lastCall = now;
    return true; // allowed
  };
}
