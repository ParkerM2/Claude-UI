/**
 * Communication route group — Communications
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { ROUTES } from '@shared/constants';

export function createCommunicationRoutes(appLayoutRoute: AnyRoute) {
  const communicationsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.COMMUNICATIONS,
    component: lazyRouteComponent(
      () => import('@features/communications'),
      'CommunicationsPage',
    ),
  });

  return [communicationsRoute] as const;
}
