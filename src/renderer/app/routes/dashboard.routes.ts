/**
 * Dashboard route group — Dashboard, my-work
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { ROUTES } from '@shared/constants';

export function createDashboardRoutes(appLayoutRoute: AnyRoute) {
  const dashboardRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.DASHBOARD,
    component: lazyRouteComponent(
      () => import('@features/dashboard'),
      'DashboardPage',
    ),
  });

  const myWorkRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.MY_WORK,
    component: lazyRouteComponent(
      () => import('@features/my-work'),
      'MyWorkPage',
    ),
  });

  return [dashboardRoute, myWorkRoute] as const;
}
