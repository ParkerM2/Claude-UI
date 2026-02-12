/**
 * Hotkey Manager — Global keyboard shortcuts
 *
 * Registers system-wide hotkeys via Electron's globalShortcut.
 * Must unregister all on app quit to avoid orphaned registrations.
 */

import { globalShortcut } from 'electron';
import type { BrowserWindow } from 'electron';

import type { QuickInputWindow } from './quick-input';

// ── Types ────────────────────────────────────────────────────

interface RegisteredHotkey {
  accelerator: string;
  label: string;
}

export interface HotkeyManager {
  /** Register default hotkeys (Quick Command, Quick Note, Quick Task) */
  registerDefaults: () => void;
  /** Register a custom hotkey with an accelerator string */
  registerCustom: (accelerator: string, label: string, callback: () => void) => boolean;
  /** Unregister all global shortcuts */
  unregisterAll: () => void;
  /** Get list of currently registered hotkeys */
  getRegistered: () => RegisteredHotkey[];
}

interface HotkeyManagerDeps {
  quickInput: QuickInputWindow;
  mainWindow: BrowserWindow;
}

// ── Constants ────────────────────────────────────────────────

const DEFAULT_HOTKEYS = {
  quickCommand: 'CmdOrCtrl+Shift+Space',
  quickNote: 'CmdOrCtrl+Shift+N',
  quickTask: 'CmdOrCtrl+Shift+T',
} as const;

// ── Factory ──────────────────────────────────────────────────

export function createHotkeyManager(deps: HotkeyManagerDeps): HotkeyManager {
  const registered: RegisteredHotkey[] = [];

  function tryRegister(accelerator: string, label: string, callback: () => void): boolean {
    if (globalShortcut.isRegistered(accelerator)) {
      console.warn(`[HotkeyManager] Hotkey already registered: ${accelerator}`);
      return false;
    }

    const success = globalShortcut.register(accelerator, callback);
    if (success) {
      registered.push({ accelerator, label });
      console.log(`[HotkeyManager] Registered: ${accelerator} (${label})`);
    } else {
      console.warn(`[HotkeyManager] Failed to register: ${accelerator}`);
    }

    return success;
  }

  function showMainWindow(): void {
    if (deps.mainWindow.isMinimized()) {
      deps.mainWindow.restore();
    }
    deps.mainWindow.show();
    deps.mainWindow.focus();
  }

  return {
    registerDefaults() {
      // Quick Command — opens the quick input popup
      tryRegister(DEFAULT_HOTKEYS.quickCommand, 'Quick Command', () => {
        if (deps.quickInput.isVisible()) {
          deps.quickInput.hide();
        } else {
          deps.quickInput.show();
        }
      });

      // Quick Note — focuses main window for note taking
      tryRegister(DEFAULT_HOTKEYS.quickNote, 'Quick Note', () => {
        showMainWindow();
        console.log('[HotkeyManager] Quick Note triggered');
      });

      // Quick Task — focuses main window for task creation
      tryRegister(DEFAULT_HOTKEYS.quickTask, 'Quick Task', () => {
        showMainWindow();
        console.log('[HotkeyManager] Quick Task triggered');
      });
    },

    registerCustom(accelerator, label, callback) {
      return tryRegister(accelerator, label, callback);
    },

    unregisterAll() {
      globalShortcut.unregisterAll();
      const count = registered.length;
      registered.length = 0;
      console.log(`[HotkeyManager] Unregistered ${String(count)} hotkeys`);
    },

    getRegistered() {
      return [...registered];
    },
  };
}
