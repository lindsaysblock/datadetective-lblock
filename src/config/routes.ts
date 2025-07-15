
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  QUERY_HISTORY: '/query-history',
  NEW_PROJECT: '/new-project',
  SETTINGS: '/settings',
  HELP: '/help'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.AUTH
];

export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.DASHBOARD,
  ROUTES.QUERY_HISTORY,
  ROUTES.NEW_PROJECT,
  ROUTES.SETTINGS
];
