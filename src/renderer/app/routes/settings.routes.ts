/**
 * Settings route group — Settings page
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { ROUTES } from '@shared/constants';

export function createSettingsRoutes(appLayoutRoute: AnyRoute) {
  const settingsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.SETTINGS,
    component: lazyRouteComponent(
      () => import('@features/settings'),
      'SettingsPage',
    ),
  });

  return [settingsRoute] as const;
}
