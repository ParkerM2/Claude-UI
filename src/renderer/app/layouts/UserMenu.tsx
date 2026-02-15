/**
 * UserMenu -- Sidebar user menu with logout dropdown
 *
 * Shows the current user's avatar and display name in the sidebar footer.
 * Click opens a dropdown with user info and a logout button.
 * In collapsed mode, only the avatar is shown.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { ChevronUp, LogOut } from 'lucide-react';

import { ROUTES } from '@shared/constants';

import { cn } from '@renderer/shared/lib/utils';

import { useAuthStore, useLogout } from '@features/auth';

// -- Types --

interface UserMenuProps {
  collapsed: boolean;
}

// -- Helpers --

function getInitial(displayName: string, email: string): string {
  const source = displayName.length > 0 ? displayName : email;
  return source.charAt(0).toUpperCase();
}

// -- Component --

export function UserMenu({ collapsed }: UserMenuProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closeMenu]);

  if (!user) return null;

  const initial = getInitial(user.displayName, user.email);
  const displayLabel = user.displayName.length > 0 ? user.displayName : user.email;

  function handleToggle() {
    setOpen((previous) => !previous);
  }

  function handleToggleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }

  function handleLogout() {
    closeMenu();
    logout.mutate(undefined, {
      onSuccess: () => {
        void navigate({ to: ROUTES.LOGIN });
      },
    });
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <button
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={collapsed ? `User menu for ${displayLabel}` : undefined}
        title={collapsed ? displayLabel : undefined}
        type="button"
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
          'text-muted-foreground hover:bg-accent hover:text-foreground',
          collapsed && 'justify-center px-0',
        )}
        onClick={handleToggle}
        onKeyDown={handleToggleKeyDown}
      >
        {/* Avatar */}
        <span
          aria-hidden="true"
          className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium"
        >
          {initial}
        </span>
        {collapsed ? null : (
          <>
            <span className="text-foreground min-w-0 flex-1 truncate text-left text-sm font-medium">
              {displayLabel}
            </span>
            <ChevronUp
              className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                open ? 'rotate-0' : 'rotate-180',
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open ? (
        <div
          role="menu"
          className={cn(
            'bg-popover text-popover-foreground border-border absolute bottom-full z-50 mb-1 w-56 rounded-md border shadow-md',
            collapsed ? 'left-0' : 'right-0 left-0 w-auto min-w-[12rem]',
          )}
        >
          {/* User info header */}
          <div className="border-border border-b px-3 py-2.5">
            <p className="text-foreground truncate text-sm font-medium">{user.displayName}</p>
            <p className="text-muted-foreground truncate text-xs">{user.email}</p>
          </div>

          {/* Logout action */}
          <div className="p-1">
            <button
              className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors"
              role="menuitem"
              type="button"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
