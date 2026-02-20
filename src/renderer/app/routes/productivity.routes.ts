/**
 * Productivity route group — Planner, notes, alerts, productivity
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { ROUTES } from '@shared/constants';

import { GenericPageSkeleton } from '../components/route-skeletons';

export function createProductivityRoutes(appLayoutRoute: AnyRoute) {
  const alertsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.ALERTS,
    pendingComponent: GenericPageSkeleton,
    component: lazyRouteComponent(
      () => import('@features/alerts'),
      'AlertsPage',
    ),
  });

  const notesRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.NOTES,
    pendingComponent: GenericPageSkeleton,
    component: lazyRouteComponent(
      () => import('@features/notes'),
      'NotesPage',
    ),
  });

  const plannerRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.PLANNER,
    pendingComponent: GenericPageSkeleton,
    component: lazyRouteComponent(
      () => import('@features/planner'),
      'PlannerPage',
    ),
  });

  const plannerWeeklyRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.PLANNER_WEEKLY,
    pendingComponent: GenericPageSkeleton,
    component: lazyRouteComponent(
      () => import('@features/planner'),
      'WeeklyReviewPage',
    ),
  });

  const productivityRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.PRODUCTIVITY,
    pendingComponent: GenericPageSkeleton,
    component: lazyRouteComponent(
      () => import('@features/productivity'),
      'ProductivityPage',
    ),
  });

  return [
    alertsRoute,
    notesRoute,
    plannerRoute,
    plannerWeeklyRoute,
    productivityRoute,
  ] as const;
}
