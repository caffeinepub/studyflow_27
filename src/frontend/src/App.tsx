import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AssignmentsPage from "./routes/assignments";
import CalendarPage from "./routes/calendar";
import Dashboard from "./routes/index";
import SubjectsPage from "./routes/subjects";
import TimerPage from "./routes/timer";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects",
  component: SubjectsPage,
});

const assignmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assignments",
  component: AssignmentsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

const timerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timer",
  component: TimerPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  subjectsRoute,
  assignmentsRoute,
  calendarRoute,
  timerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
