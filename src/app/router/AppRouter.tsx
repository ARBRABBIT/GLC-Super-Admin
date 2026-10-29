import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import GuestGuard from './GuestGuard';
import { guestRoutes, authRoutes, publicRoutes } from './routes.definitions';
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary';

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

const wrapWithSuspense = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    const wrappedElement = <Suspense fallback={<PageLoader />}>{route.element}</Suspense>;

    if (route.index) {
      return {
        ...route,
        element: wrappedElement,
      } as RouteObject;
    }

    return {
      ...route,
      element: wrappedElement,
      children: route.children ? wrapWithSuspense(route.children) : undefined,
    } as RouteObject;
  });
};

const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    errorElement: <RouteErrorBoundary />,
    children: wrapWithSuspense(guestRoutes),
  },
  {
    element: <AuthGuard />,
    errorElement: <RouteErrorBoundary />,
    children: wrapWithSuspense(authRoutes),
  },
  ...wrapWithSuspense(publicRoutes).map((route) => ({
    ...route,
    errorElement: <RouteErrorBoundary />,
  })),
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
