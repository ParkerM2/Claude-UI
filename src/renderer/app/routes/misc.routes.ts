/**
 * Misc route group — Fitness, briefing
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { ROUTES } from '@shared/constants';

export function createMiscRoutes(appLayoutRoute: AnyRoute) {
  const briefingRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.BRIEFING,
    component: lazyRouteComponent(
      () => import('@features/briefing'),
      'BriefingPage',
    ),
  });

  const fitnessRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.FITNESS,
    component: lazyRouteComponent(
      () => import('@features/fitness'),
      'FitnessPage',
    ),
  });

  return [briefingRoute, fitnessRoute] as const;
}
