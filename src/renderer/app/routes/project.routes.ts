/**
 * Project route group — Project list + nested project views
 */

import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router';

import { ROUTE_PATTERNS, ROUTES } from '@shared/constants';

import { ProjectSkeleton } from '../components/route-skeletons';

export function createProjectRoutes(appLayoutRoute: AnyRoute) {
  const projectsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTES.PROJECTS,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/projects'),
      'ProjectListPage',
    ),
  });

  const projectRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT,
    beforeLoad: ({ params }) => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect pattern
      throw redirect({ to: ROUTE_PATTERNS.PROJECT_TASKS, params });
    },
  });

  const tasksRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_TASKS,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/tasks'),
      'TaskDataGrid',
    ),
  });

  const terminalsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_TERMINALS,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/terminals'),
      'TerminalGrid',
    ),
  });

  const agentsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_AGENTS,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/agents'),
      'AgentDashboard',
    ),
  });

  const githubRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_GITHUB,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/github'),
      'GitHubPage',
    ),
  });

  const roadmapRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_ROADMAP,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/roadmap'),
      'RoadmapPage',
    ),
  });

  const ideationRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_IDEATION,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/ideation'),
      'IdeationPage',
    ),
  });

  const changelogRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_CHANGELOG,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/changelog'),
      'ChangelogPage',
    ),
  });

  const insightsRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_INSIGHTS,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/insights'),
      'InsightsPage',
    ),
  });

  const workflowRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    path: ROUTE_PATTERNS.PROJECT_WORKFLOW,
    pendingComponent: ProjectSkeleton,
    component: lazyRouteComponent(
      () => import('@features/workflow-pipeline'),
      'WorkflowPipelinePage',
    ),
  });

  return [
    projectsRoute,
    projectRoute,
    tasksRoute,
    terminalsRoute,
    agentsRoute,
    githubRoute,
    roadmapRoute,
    ideationRoute,
    changelogRoute,
    insightsRoute,
    workflowRoute,
  ] as const;
}
